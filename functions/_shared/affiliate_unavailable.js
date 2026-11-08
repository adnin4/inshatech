/**
 * Shared fail-closed response for affiliate routes.
 * No click, conversion, balance or payout is recorded by this temporary guard.
 */
const ALLOWED_ORIGINS=new Set(['https://inshatech.pages.dev','https://inshatech.com','https://www.inshatech.com','https://admin.inshatech.com','http://localhost:8788','http://127.0.0.1:8788']);
export function affiliateUnavailable(request,feature){
  const origin=request?.headers?.get('Origin')||'';
  return new Response(JSON.stringify({status:'NOT_CONFIGURED',code:'AFFILIATE_BACKEND_NOT_READY',feature,message:'This affiliate operation is temporarily unavailable. No record, commission or payout was created.'}),{status:503,headers:{'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':ALLOWED_ORIGINS.has(origin)?origin:'https://inshatech.pages.dev','Vary':'Origin'}});
}
export function affiliateOptions(){return new Response(null,{status:204,headers:{'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization, X-Idempotency-Key','Access-Control-Allow-Origin':'https://inshatech.pages.dev','Cache-Control':'no-store'}});}
