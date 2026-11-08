import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { onRequestPost as killPost } from '../functions/api/admin/killswitch.js';
import { onRequestGet as integrationsGet, onRequestPost as integrationsPost } from '../functions/api/admin/integrations.js';
import { onRequestPost as orderTransition } from '../functions/api/orders/state_machine.js';
import { onRequestPost as createInvoice } from '../functions/api/finance/invoice.js';
import { onRequestPost as affiliateConvert } from '../functions/api/affiliate/convert.js';

globalThis.crypto = webcrypto;
const SECRET = "unit-test-owner-secret-for-hmac-session";
function b64url(s) { return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,''); }
async function ownerToken() {
  const now = Math.floor(Date.now()/1000);
  const payload=b64url(JSON.stringify({sub:'owner@inshatech.test',role:'owner',hierarchy_level:1,mfa_verified:true,iat:now,exp:now+3600,jti:'test-id'}));
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(payload)));
  return payload+'.'+b64url(String.fromCharCode(...sig));
}
function request(url,token,body,method='POST') {
  return new Request('https://inshatech.pages.dev'+url,{
    method,
    headers:{'Origin':'https://inshatech.pages.dev','Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},
    ...(body===undefined?{}:{body:JSON.stringify(body)})
  });
}
const token=await ownerToken();
const env={JWT_SECRET:SECRET,STRIPE_SECRET_KEY:'test-secret-presence-only'};

const kill=await killPost({request:request('/api/admin/killswitch',token,{action:'ENGAGE_KILL_SWITCH'}),env});
assert.equal(kill.status,503);
assert.equal((await kill.json()).code,'KILLSWITCH_ENFORCEMENT_NOT_READY');

const inventory=await integrationsGet({request:request('/api/admin/integrations',token,undefined,'GET'),env});
assert.equal(inventory.status,200);
const inventoryBody=await inventory.json();
assert.equal(inventoryBody.status,'INVENTORY_ONLY');
assert.equal(inventoryBody.integrations.find(x=>x.id==='stripe').status,'CONFIGURED_UNVERIFIED');
assert.equal(inventoryBody.integrations.some(x=>x.status==='LIVE_VERIFIED'),false);

const connection=await integrationsPost({request:request('/api/admin/integrations',token,{provider_id:'stripe',action:'test_connection'}),env});
assert.equal(connection.status,503);
assert.equal((await connection.json()).code,'PROVIDER_HEALTH_CHECK_NOT_IMPLEMENTED');

const order=await orderTransition({request:request('/api/orders/state_machine',null,{order_id:'test-order',current_state:'DRAFT',target_state:'PENDING_PAYMENT'})});
assert.equal(order.status,503);
assert.equal((await order.json()).status,'NOT_CONFIGURED');

const invoice=await createInvoice({request:request('/api/finance/invoice',null,{order_id:'test-order',customer_name:'Test',amount_usd:100})});
assert.equal(invoice.status,503);
const invoiceBody=await invoice.json();
assert.equal(invoiceBody.status,'NOT_CONFIGURED');
assert.equal('pdf_url' in invoiceBody,false);

const conversion=await affiliateConvert({request:request('/api/affiliate/convert',null,{order_id:'test-order',amount:100})});
assert.equal(conversion.status,503);
assert.equal((await conversion.json()).status,'NOT_CONFIGURED');

console.log('API fail-closed tests: PASS (kill-switch, provider test, order transition, invoice, affiliate conversion).');
