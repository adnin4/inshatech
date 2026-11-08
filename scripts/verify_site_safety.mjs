import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const need=(s,n,label)=>{if(!s.includes(n))throw new Error('Missing safety invariant: '+label);};
const forbid=(s,n,label)=>{if(s.includes(n))throw new Error('Unsafe pattern detected: '+label);};
export function verifySiteSafety(){
 const index=read('index.html'),app=read('app.js'),admin=read('admin.html');
 const login=read('affiliate-login.html'),portal=read('js/core/affiliate-portal.js');
 const wrangler=read('wrangler.toml'),version=read('functions/api/version.js');
 const routes=['portal','stats','track','convert','attribution','payout','fraud_radar'].map(n=>read('functions/api/affiliate/'+n+'.js'));
 need(index,'togglePrimaryNavigation(this)','mobile navigation control');
 need(index,'hero-network-visual','homepage hero visual');
 need(app,'verifyAdminEdgeSession','server-side admin token verification');
 need(app,'mfa_token','homepage admin TOTP');
 need(app,'lockAdminPanel();','admin lock button clears the local session and returns to sign-in');
 forbid(app,"sessionStorage.removeItem('iinsha_admin_authenticated'); renderAdminModalContent();",'obsolete admin lock handler');
 forbid(app,"sessionStorage.setItem('iinsha_admin_authenticated', 'true')",'client-only admin authentication');
 need(admin,'/api/admin/gate','dedicated page token verification');
 need(admin,'mfa_token','dedicated page TOTP payload');
 forbid(admin,'ibos_offline_','offline admin token fallback');
 forbid(admin,'iinsha_admin_2026','hard-coded admin password');
 need(login,'PARTNER ACCESS TEMPORARILY PAUSED','affiliate registration status');
 forbid(login,'REGISTRY_KEY','browser-local affiliate credentials');
 forbid(portal,'DEFAULT_PARTNERS','seed partners shown as live');
 need(portal,'LIVE PARTNER DATA NOT CONFIGURED','honest dashboard status');
 forbid(wrangler,'SUPABASE_RUNTIME_HEALTH','static DB health assertion');
 forbid(version,'healthVerified','environment-string health verification');
 for(const route of routes)need(route,'affiliateUnavailable','affiliate API fail-closed response');
 return 'Site safety guard: PASS (source assertions only; deployed runtime remains separately unverified).';
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{console.log(verifySiteSafety());}catch(err){console.error(err.message);process.exit(1);}
}
