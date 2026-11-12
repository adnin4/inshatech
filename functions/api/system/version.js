/** Live build identity endpoint. Never invents deployment metadata. */
const ORIGINS=new Set(['https://inshatech-b6b.pages.dev','https://inshatech.pages.dev','https://inshatech.com','https://www.inshatech.com','https://admin.inshatech.com']);
const isOriginAllowed=o=>ORIGINS.has(o)||o.endsWith('.pages.dev');
const cors=r=>{const o=r.headers.get('Origin')||'';return {'Access-Control-Allow-Origin':isOriginAllowed(o)?o:'https://inshatech-b6b.pages.dev','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Content-Type':'application/json','Cache-Control':'no-store'};};
export function onRequestGet({request,env={}}){const h=cors(request);const sha=env.CF_PAGES_COMMIT_SHA||env.GIT_COMMIT_SHA;const ts=env.BUILD_TIMESTAMP;if(!sha||!/^[0-9a-f]{40}$/i.test(sha))return new Response(JSON.stringify({status:'DEPLOYMENT_METADATA_MISSING'}),{status:503,headers:h});return new Response(JSON.stringify({status:'HEALTHY',platform:'IINSHA AI-BOS',version:env.APP_VERSION||'unknown',git_commit_sha:sha,short_sha:sha.slice(0,7),branch:env.CF_PAGES_BRANCH||'unknown',build_timestamp:ts||null,timestamp:new Date().toISOString()}),{status:200,headers:h});}
export function onRequestOptions({request}){return new Response(null,{status:204,headers:cors(request)});}

