/** Production generic signed payment webhook boundary. */
async function hmac(raw, secret) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(raw)))].map(b=>b.toString(16).padStart(2,'0')).join('');
}
const headers=()=>({'Content-Type':'application/json','Cache-Control':'no-store'});
const timingSafe=(a,b)=>{if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0};
async function db(env,path,init={}){const key=env.SUPABASE_SERVICE_ROLE_KEY;return fetch(`${env.SUPABASE_URL}/rest/v1/${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(init.headers||{})}})}

export async function onRequestPost({request,env={}}){
  const H=headers();
  try{
    for(const k of ['WEBHOOK_SECRET','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY']) if(!env[k]) return new Response(JSON.stringify({status:'CONFIGURATION_ERROR',missing:k}),{status:503,headers:H});
    const raw=await request.text();
    const sig=request.headers.get('X-Webhook-Signature')||'';
    const expected=await hmac(raw,env.WEBHOOK_SECRET);
    if(!timingSafe(sig.toLowerCase(),expected.toLowerCase())) return new Response(JSON.stringify({status:'UNAUTHORIZED'}),{status:401,headers:H});
    const event=JSON.parse(raw);
    const eventId=String(event.id||'').trim();
    const type=String(event.type||event.event_type||'unknown');
    if(!eventId)return new Response(JSON.stringify({status:'INVALID_EVENT_ID'}),{status:400,headers:H});

    const existingRes=await db(env,`ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}&select=id,status&limit=1`);
    if(!existingRes.ok)return new Response(JSON.stringify({status:'EVENT_LOOKUP_FAILED'}),{status:502,headers:H});
    const existing=await existingRes.json();
    if(existing.length && existing[0].status==='processed')return new Response(JSON.stringify({status:'DUPLICATE_IGNORED',event_id:eventId}),{status:200,headers:H});

    const orderCode=String(event.order_code||event.order_id||event.data?.object?.metadata?.order_code||event.data?.object?.metadata?.order_id||'').trim();
    if(!orderCode)return new Response(JSON.stringify({status:'INVALID_ORDER_REFERENCE'}),{status:400,headers:H});
    const receivedAmount=Number(event.amount??event.data?.object?.amount_total??event.data?.object?.amount_received);
    const receivedCurrency=String(event.currency||event.data?.object?.currency||'USD').toUpperCase();

    const orderRes=await db(env,`ibos_orders?order_code=eq.${encodeURIComponent(orderCode)}&select=id,order_code,amount,currency,payment_status,affiliate_ref_code,affiliate_commission,metadata&limit=1`);
    if(!orderRes.ok)return new Response(JSON.stringify({status:'ORDER_LOOKUP_FAILED'}),{status:502,headers:H});
    const orders=await orderRes.json();
    if(!orders.length)return new Response(JSON.stringify({status:'ORDER_NOT_FOUND',order_code:orderCode}),{status:404,headers:H});
    const order=orders[0];
    if(order.payment_status==='paid')return new Response(JSON.stringify({status:'ALREADY_PAID',order_code:order.order_code}),{status:200,headers:H});
    if(!Number.isFinite(receivedAmount)||Math.abs(receivedAmount-Number(order.amount))>0.01||receivedCurrency!==String(order.currency||'USD').toUpperCase()){
      return new Response(JSON.stringify({status:'PAYMENT_INTEGRITY_MISMATCH',expected_amount:Number(order.amount),received_amount:receivedAmount,expected_currency:order.currency,received_currency:receivedCurrency}),{status:409,headers:H});
    }

    const eventRecord={event_id:eventId,provider:String(event.provider||'generic'),event_type:type,order_code:order.order_code,order_id:order.id,status:'processing',signature_verified:true,payload:event};
    const record=existing.length
      ? await db(env,`ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,{method:'PATCH',body:JSON.stringify(eventRecord)})
      : await db(env,'ibos_webhook_events',{method:'POST',body:JSON.stringify(eventRecord)});
    if(!record.ok&&record.status!==409)return new Response(JSON.stringify({status:'EVENT_RECORD_FAILED'}),{status:502,headers:H});

    const successTypes=new Set(['payment.success','payment_intent.succeeded','checkout.session.completed','charge.succeeded']);
    if(!successTypes.has(type)){
      await db(env,`ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,{method:'PATCH',body:JSON.stringify({status:'ignored',processed_at:new Date().toISOString()})});
      return new Response(JSON.stringify({status:'IGNORED_EVENT_TYPE',event_id:eventId,event_type:type}),{status:200,headers:H});
    }

    const patch=await db(env,`ibos_orders?id=eq.${encodeURIComponent(order.id)}&payment_status=neq.paid`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({payment_status:'paid',order_status:'confirmed',payment_provider:String(event.provider||'generic'),payment_reference:String(event.payment_reference||event.transaction_id||event.data?.object?.id||eventId),paid_at:new Date().toISOString()})});
    if(!patch.ok)return new Response(JSON.stringify({status:'ORDER_UPDATE_FAILED'}),{status:502,headers:H});
    const updated=await patch.json().catch(()=>[]);
    if(!updated.length)return new Response(JSON.stringify({status:'ORDER_STATE_CONFLICT'}),{status:409,headers:H});

    const revenue=await db(env,'ibos_revenue',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({order_id:order.id,amount:Number(order.amount),currency:order.currency||'USD',type:'one_time'})});
    if(!revenue.ok&&revenue.status!==409)return new Response(JSON.stringify({status:'REVENUE_RECORD_FAILED'}),{status:502,headers:H});

    const commissionAmount=Number(order.affiliate_commission||0);
    const affiliateId=order.metadata?.affiliate_id||null;
    if(affiliateId&&commissionAmount>0) await db(env,'ibos_commission_ledger',{method:'POST',body:JSON.stringify({affiliate_id:affiliateId,amount:commissionAmount,type:'commission',status:'pending'})});

    await db(env,`ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,{method:'PATCH',body:JSON.stringify({status:'processed',processed_at:new Date().toISOString(),error_message:null})});
    return new Response(JSON.stringify({status:'SUCCESS',action:'payment_confirmed',event_id:eventId,order_code:order.order_code,verified_amount:Number(order.amount),currency:order.currency||'USD',event_type:type}),{status:200,headers:H});
  }catch(e){return new Response(JSON.stringify({status:'ERROR'}),{status:500,headers:H});}
}
