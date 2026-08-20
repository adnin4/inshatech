/**
 * Production contract E2E suite.
 * Verifies the current DB-backed checkout/webhook contracts without any mock-success bypass.
 * Uses an in-memory Supabase REST contract only as a deterministic unit-test database boundary.
 */

const assertTest = (name, condition, detail='') => {
  if (!condition) throw new Error(`${name}: ${detail}`);
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`);
};

const nativeFetch = globalThis.fetch;
const state = {
  services: {
    'b2b-lead-swarm': {
      id:'00000000-0000-0000-0000-000000000001', slug:'b2b-lead-swarm', title:'B2B SaaS 5-Agent Hunter Swarm',
      category:'AI Automation', price:850, currency:'USD', commission_rate:20,
      packages:[{name:'Standard',price:850,delivery_days:3}], status:'published'
    }
  },
  affiliates: { APEX:{id:'00000000-0000-0000-0000-0000000000a1',aff_id:'APEX',commission_rate:20,status:'active'} },
  orders: new Map(), ordersByIdempotency: new Map(), ordersByCode: new Map(),
  webhookEvents: new Map(), revenues:new Map(), commissions:[]
};

function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}})}
function queryRows(url,table){
  const p=url.searchParams;
  if(table==='ibos_orders'){
    if(p.get('idempotency_key')){const k=p.get('idempotency_key').replace(/^eq\./,'');return state.ordersByIdempotency.has(k)?[state.ordersByIdempotency.get(k)]:[]}
    if(p.get('order_code')){const k=p.get('order_code').replace(/^eq\./,'');return state.ordersByCode.has(k)?[state.ordersByCode.get(k)]:[]}
    return [...state.orders.values()];
  }
  if(table==='ibos_webhook_events'){
    const k=p.get('event_id')?.replace(/^eq\./,'');return state.webhookEvents.has(k)?[state.webhookEvents.get(k)]:[];
  }
  return [];
}

globalThis.fetch = async (input, init={}) => {
  const url = new URL(typeof input==='string' ? input : input.url);
  if(url.hostname!=='test-supabase-project.supabase.co') return nativeFetch(input,init);
  const table=url.pathname.replace(/^\/rest\/v1\//,'');
  const method=(init.method||'GET').toUpperCase();
  const body=init.body ? JSON.parse(init.body) : null;
  if(table==='ibos_services'&&method==='GET'){
    const slug=url.searchParams.get('slug')?.replace(/^eq\./,'');
    return json(slug&&state.services[slug]?[state.services[slug]]:[]);
  }
  if(table==='ibos_affiliates'&&method==='GET'){
    const aff=url.searchParams.get('aff_id')?.replace(/^eq\./,'');
    return json(aff&&state.affiliates[aff]?[state.affiliates[aff]]:[]);
  }
  if(table==='ibos_orders'&&method==='GET') return json(queryRows(url,table));
  if(table==='ibos_orders'&&method==='POST'){
    if(body?.idempotency_key&&state.ordersByIdempotency.has(body.idempotency_key)) return json([],201);
    const id=`00000000-0000-0000-0000-${String(state.orders.size+2).padStart(12,'0')}`;
    const row={id,...body};state.orders.set(id,row);if(row.idempotency_key)state.ordersByIdempotency.set(row.idempotency_key,row);state.ordersByCode.set(row.order_code,row);return json([row],201);
  }
  if(table==='ibos_orders'&&method==='PATCH'){
    const id=url.searchParams.get('id')?.replace(/^eq\./,'');const row=state.orders.get(id);if(!row)return json([],200);Object.assign(row,body||{});return json([row],200);
  }
  if(table==='ibos_webhook_events'&&method==='GET') return json(queryRows(url,table));
  if(table==='ibos_webhook_events'&&method==='POST'){
    if(state.webhookEvents.has(body.event_id))return json([],409);state.webhookEvents.set(body.event_id,{id:`row-${state.webhookEvents.size+1}`,...body});return json([],201);
  }
  if(table==='ibos_webhook_events'&&method==='PATCH'){
    const key=url.searchParams.get('event_id')?.replace(/^eq\./,'');const row=state.webhookEvents.get(key);if(row)Object.assign(row,body||{});return json([],200);
  }
  if(table==='ibos_revenue'&&method==='POST'){
    if(state.revenues.has(body.order_id))return json([],409);state.revenues.set(body.order_id,body);return json([],201);
  }
  if(table==='ibos_commission_ledger'&&method==='POST'){state.commissions.push(body);return json([],201)}
  return json({error:`Unhandled mock route ${method} ${table}`},500);
};

async function sign(body,secret){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map(b=>b.toString(16).padStart(2,'0')).join('');
}

async function main(){
  const env={SUPABASE_URL:'https://test-supabase-project.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'test_service_role',JWT_SECRET:'test_jwt',WEBHOOK_SECRET:'test_webhook',USD_BDT_RATE:'122.5'};
  const checkout=await import('../functions/api/payments/checkout.js');
  const webhook=await import('../functions/api/payments/webhook.js');

  const noConfig=await checkout.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/checkout',{method:'POST',body:'{}'}),env:{}});
  assertTest('Checkout fails closed when security configuration is missing',noConfig.status===503);

  const missing=await checkout.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/checkout',{method:'POST',body:JSON.stringify({service_id:'missing-service',customer_name:'A',customer_email:'a@example.com',idempotency_key:'missing-service-key-2026'})}),env});
  assertTest('Unknown service is rejected with no fallback pricing',missing.status===404);

  const original='b2b-lead-swarm';
  const first=await checkout.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/checkout',{method:'POST',body:JSON.stringify({service_id:original,customer_name:'Auditor',customer_email:'auditor@example.com',idempotency_key:'checkout-contract-key-2026',amount:1})}),env});
  const firstData=await first.json();
  assertTest('Checkout resolves price from authoritative service catalog',first.status===201&&Number(firstData.order.amount)===850,`amount=${firstData.order?.amount}`);
  assertTest('Checkout persists the canonical service UUID and idempotency key',Boolean(firstData.order.id)&&firstData.order.service_id===state.services[original].id&&firstData.order.idempotency_key==='checkout-contract-key-2026');
  assertTest('Checkout exposes persisted PostgreSQL state only after confirmed insert',firstData.database_persistence?.persisted===true&&firstData.database_persistence?.status==='PERSISTED_TO_POSTGRES');

  const replay=await checkout.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/checkout',{method:'POST',body:JSON.stringify({service_id:original,customer_name:'Attacker',customer_email:'attacker@example.com',idempotency_key:'checkout-contract-key-2026',amount:999999})}),env});
  const replayData=await replay.json();
  assertTest('Checkout idempotency replay is race-safe and returns the existing order',replay.status===200&&replayData.idempotent_replay===true&&replayData.order.id===firstData.order.id);

  const noWebhookSecret=await webhook.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/webhook',{method:'POST',body:'{}'}),env:{}});
  assertTest('Webhook fails closed when secret configuration is missing',noWebhookSecret.status===503);

  const forged=await webhook.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/webhook',{method:'POST',headers:{'X-Webhook-Signature':'bad'},body:JSON.stringify({id:'forged',type:'payment.success'})}),env});
  assertTest('Webhook rejects forged signatures before mutation',forged.status===401);

  const mismatchPayload=JSON.stringify({id:'evt-mismatch-2026',type:'payment.success',order_code:firstData.order.order_code,amount:849,currency:'USD',provider:'test'});
  const mismatch=await webhook.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/webhook',{method:'POST',headers:{'X-Webhook-Signature':await sign(mismatchPayload,env.WEBHOOK_SECRET)},body:mismatchPayload}),env});
  assertTest('Webhook rejects amount mismatch before payment confirmation',mismatch.status===409);

  const validPayload=JSON.stringify({id:'evt-valid-2026',type:'payment.success',order_code:firstData.order.order_code,amount:850,currency:'USD',provider:'test',transaction_id:'tx-valid-2026'});
  const valid=await webhook.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/webhook',{method:'POST',headers:{'X-Webhook-Signature':await sign(validPayload,env.WEBHOOK_SECRET)},body:validPayload}),env});
  const validData=await valid.json();
  assertTest('Valid webhook confirms the authoritative order state',valid.status===200&&validData.status==='SUCCESS'&&validData.order_code===firstData.order.order_code&&state.orders.get(firstData.order.id).payment_status==='paid');
  assertTest('Valid webhook writes authoritative one-time revenue exactly once',state.revenues.has(firstData.order.id)&&state.revenues.size===1);
  assertTest('Webhook duplicate delivery is idempotently ignored',((await webhook.onRequestPost({request:new Request('https://inshatech.pages.dev/api/payments/webhook',{method:'POST',headers:{'X-Webhook-Signature':await sign(validPayload,env.WEBHOOK_SECRET)},body:validPayload}),env})).status===200));

  const sourceCheckout=require('fs').readFileSync(require('path').join(process.cwd(),'functions/api/payments/checkout.js'),'utf8');
  const sourceWebhook=require('fs').readFileSync(require('path').join(process.cwd(),'functions/api/payments/webhook.js'),'utf8');
  assertTest('Payment production code contains no MOCK_STORAGE success bypass',!sourceCheckout.includes('MOCK_STORAGE')&&!sourceWebhook.includes('MOCK_STORAGE'));
  assertTest('Payment webhook has no fabricated test order fallback',!sourceWebhook.includes('ORD-TEST-99')&&!sourceWebhook.includes('verified_amount: event.amount || 850'));

  console.log('\nE2E production contract suite: PASS');
}

main().catch(err=>{console.error(`\nE2E production contract suite: FAIL\n${err.stack||err}`);process.exitCode=1}).finally(()=>{globalThis.fetch=nativeFetch});
