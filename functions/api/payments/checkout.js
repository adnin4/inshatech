/**
 * Production checkout: DB-backed catalog, server pricing, idempotent order creation.
 * Never reports persistence unless the order was actually written.
 */
const ORIGINS = new Set(['https://inshatech.pages.dev','https://inshatech.com','https://www.inshatech.com','https://admin.inshatech.com']);
const cors = r => {
  const o = r.headers.get('Origin') || '';
  return {'Access-Control-Allow-Origin': ORIGINS.has(o) ? o : 'https://inshatech.pages.dev','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Content-Type':'application/json','Cache-Control':'no-store'};
};

async function supabase(env, path, init = {}) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: {
    apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {})
  }});
}

async function sign(data, secret) {
  if (!secret) throw Error('JWT_SECRET_NOT_CONFIGURED');
  const raw = JSON.stringify(data);
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(raw))))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

export async function onRequestPost({request, env = {}}) {
  const h = cors(request);
  try {
    for (const k of ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','JWT_SECRET']) {
      if (!env[k]) return new Response(JSON.stringify({status:'CONFIGURATION_ERROR',missing:k}),{status:503,headers:h});
    }
    const b = await request.json().catch(() => ({}));
    const slug = String(b.service_id || b.service_slug || '').trim().toLowerCase();
    const customerName = String(b.customer_name || '').trim();
    const customerEmail = String(b.customer_email || '').trim().toLowerCase();
    const idem = String(b.idempotency_key || '').trim();
    if (!slug || !customerName || !customerEmail || idem.length < 16) {
      return new Response(JSON.stringify({status:'INVALID_CHECKOUT_INPUT'}),{status:400,headers:h});
    }

    const existing = await supabase(env, `ibos_orders?idempotency_key=eq.${encodeURIComponent(idem)}&select=id,order_code,service_slug,amount,currency,payment_status,order_status&limit=1`);
    if (!existing.ok) return new Response(JSON.stringify({status:'ORDER_LOOKUP_FAILED'}),{status:502,headers:h});
    const existingRows = await existing.json();
    if (existingRows.length) {
      const current = existingRows[0];
      const token = await sign({order_id:current.id,order_code:current.order_code,idempotency_key:idem,amount:current.amount,currency:current.currency,iat:Math.floor(Date.now()/1000)},env.JWT_SECRET);
      return new Response(JSON.stringify({status:'SUCCESS',idempotent_replay:true,order_token:token,order:current}),{status:200,headers:h});
    }

    const serviceRes = await supabase(env, `ibos_services?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=id,slug,title,category,price,currency,commission_rate,packages&limit=1`);
    if (!serviceRes.ok) return new Response(JSON.stringify({status:'CATALOG_LOOKUP_FAILED'}),{status:502,headers:h});
    const services = await serviceRes.json();
    if (!services.length) return new Response(JSON.stringify({status:'SERVICE_NOT_FOUND'}),{status:404,headers:h});
    const service = services[0];

    let amount = Number(service.price);
    let deliveryDays = null;
    let selectedPackage = null;
    const packages = Array.isArray(service.packages) ? service.packages : [];
    if (b.package_name && packages.length) {
      selectedPackage = packages.find(p => String(p?.name || '').toLowerCase() === String(b.package_name).toLowerCase());
      if (!selectedPackage) return new Response(JSON.stringify({status:'INVALID_PACKAGE'}),{status:400,headers:h});
      if (Number.isFinite(Number(selectedPackage.price))) amount = Number(selectedPackage.price);
      if (Number.isFinite(Number(selectedPackage.delivery_days))) deliveryDays = Number(selectedPackage.delivery_days);
    }

    const coupon = String(b.coupon_code || '').toUpperCase().trim();
    let discount = 0;
    if (coupon === 'EARLY2026' || coupon === 'FOUNDER10') discount = Math.round(amount * 0.10 * 100) / 100;
    else if (coupon === 'APEX15') discount = Math.round(amount * 0.15 * 100) / 100;
    amount = Math.max(0, amount - discount);

    let commission = 0;
    let affiliateId = null;
    const affiliateCode = String(b.affiliate_code || '').trim();
    if (affiliateCode) {
      const affRes = await supabase(env, `ibos_affiliates?aff_id=eq.${encodeURIComponent(affiliateCode)}&status=eq.active&select=id,aff_id,commission_rate&limit=1`);
      if (!affRes.ok) return new Response(JSON.stringify({status:'AFFILIATE_LOOKUP_FAILED'}),{status:502,headers:h});
      const affRows = await affRes.json();
      if (affRows.length) {
        affiliateId = affRows[0].id;
        commission = Math.round(amount * Number(affRows[0].commission_rate || service.commission_rate || 20) / 100 * 100) / 100;
      }
    }

    const orderCode = 'ORD-' + crypto.randomUUID();
    const order = {
      order_code: orderCode,
      service_id: service.id,
      service_slug: service.slug,
      service_title: service.title,
      package_name: b.package_name || (selectedPackage?.name || 'Standard Production Package'),
      amount,
      currency: service.currency || 'USD',
      bdt_amount: service.currency === 'USD' ? Math.round(amount * Number(env.USD_BDT_RATE || 122.5)) : null,
      client_name: customerName.slice(0,255),
      client_email: customerEmail.slice(0,255),
      client_phone: String(b.customer_phone || '').slice(0,64) || null,
      affiliate_ref_code: affiliateCode || null,
      affiliate_commission: commission,
      payment_gateway: String(b.payment_provider || 'manual'),
      payment_provider: String(b.payment_provider || 'manual'),
      idempotency_key: idem,
      payment_status: 'awaiting_payment',
      order_status: 'created',
      metadata: {coupon_code:coupon || null, discount_usd:discount, affiliate_id:affiliateId, delivery_days:deliveryDays}
    };

    const insert = await supabase(env, 'ibos_orders', {method:'POST',headers:{Prefer:'return=representation,resolution=ignore-duplicates'},body:JSON.stringify(order)});
    if (!insert.ok) {
      if (insert.status === 409) return new Response(JSON.stringify({status:'IDEMPOTENCY_CONFLICT'}),{status:409,headers:h});
      return new Response(JSON.stringify({status:'ORDER_PERSIST_FAILED'}),{status:502,headers:h});
    }
    const rows = await insert.json();
    const persisted = rows[0];
    if (!persisted?.id) return new Response(JSON.stringify({status:'ORDER_PERSISTENCE_UNCONFIRMED'}),{status:502,headers:h});

    const token = await sign({order_id:persisted.id,order_code:orderCode,idempotency_key:idem,service_id:service.id,amount,currency:order.currency,iat:Math.floor(Date.now()/1000)},env.JWT_SECRET);
    return new Response(JSON.stringify({status:'SUCCESS',order_token:token,order:{...persisted,delivery_days:deliveryDays,discount_usd:discount},database_persistence:{persisted:true,status:'PERSISTED_TO_POSTGRES'},payment_status:'awaiting_payment',payment_options:['stripe','bkash','nagad','bank','crypto','usdt','manual']}),{status:201,headers:h});
  } catch (e) {
    return new Response(JSON.stringify({status:'ERROR'}),{status:500,headers:h});
  }
}

export function onRequestOptions({request}) { return new Response(null,{status:204,headers:cors(request)}); }
