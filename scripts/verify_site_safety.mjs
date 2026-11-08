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
 const ux=read('src/js/ux_interactions.js');
 const affiliate=read('affiliate.html'),killswitch=read('functions/api/admin/killswitch.js');
 const integrations=read('functions/api/admin/integrations.js'),orders=read('functions/api/orders/state_machine.js');
 const invoice=read('functions/api/finance/invoice.js');
 const adminSession=read('functions/_shared/admin_session.js');
 const wrangler=read('wrangler.toml'),version=read('functions/api/version.js');
 const routes=['portal','stats','track','convert','attribution','payout','fraud_radar'].map(n=>read('functions/api/affiliate/'+n+'.js'));
 need(index,'togglePrimaryNavigation(this)','mobile navigation control');
 need(index,'hero-network-visual','homepage hero visual');
 need(index,'sticky-mobile-cta-close','dismissible mobile contact bar');
 need(ux,'iinsha-toast-close','dismissible notification');
 need(ux,'initStickyCtaDismissal','mobile CTA dismissal handler');
 forbid(ux,'Starter Kit Sent!','fake lead magnet delivery success');
 forbid(ux,'AI Automation Starter Kit sent to your inbox!','fake email success');
 forbid(ux,'Copied: ${textToCopy}','false clipboard success fallback');
 need(app,'verifyAdminEdgeSession','server-side admin token verification');
 need(app,'mfa_token','homepage admin TOTP');
 need(app,'lockAdminPanel();','admin lock button clears the local session and returns to sign-in');
 forbid(app,"sessionStorage.removeItem('iinsha_admin_authenticated'); renderAdminModalContent();",'obsolete admin lock handler');
 forbid(app,"sessionStorage.setItem('iinsha_admin_authenticated', 'true')",'client-only admin authentication');
 need(admin,'/api/admin/gate','dedicated page token verification');
 need(adminSession,'verifyAdminSession','shared server-side admin session verifier');
 need(adminSession,'FORGERY_REJECTED','tampered session rejection');
 need(killswitch,'verifyAdminSession','kill-switch authentication');
 forbid(killswitch,'let SYSTEM_LOCKDOWN = false','isolate-local kill-switch state');
 need(killswitch,'KILLSWITCH_ENFORCEMENT_NOT_READY','honest kill-switch status');
 need(integrations,'CONFIGURED_UNVERIFIED','secret presence does not prove provider health');
 need(integrations,'PROVIDER_HEALTH_CHECK_NOT_IMPLEMENTED','no fake provider connection success');
 forbid(integrations,'CONNECTION_TESTED','synthetic provider connection success');
 need(orders,'PERSISTENT_ORDER_STORE_NOT_CONFIGURED','no fake order transition success');
 need(invoice,'INVOICE_STORAGE_AND_RENDERER_NOT_CONFIGURED','no fake invoice PDF success');
 need(affiliate,'No verified partner leaderboard is available','no seeded affiliate leaderboard');
 forbid(affiliate,'Payouts are processed within 24 hours','no unsupported payout SLA');
 forbid(affiliate,'secure 120-day cookie','no unsupported attribution promise');
 need(admin,'mfa_token','dedicated page TOTP payload');
 forbid(admin,'ibos_offline_','offline admin token fallback');
 forbid(admin,'iinsha_admin_2026','hard-coded admin password');
 need(login,'PARTNER ACCESS TEMPORARILY PAUSED','affiliate registration status');
 forbid(login,'REGISTRY_KEY','browser-local affiliate credentials');
 forbid(portal,'DEFAULT_PARTNERS','seed partners shown as live');
 need(portal,'LIVE PARTNER DATA NOT CONFIGURED','honest dashboard status');
 forbid(wrangler,'SUPABASE_RUNTIME_HEALTH','static DB health assertion');
 forbid(version,'healthVerified','environment-string health verification');
 for(const route of routes) {
   need(route,'affiliateUnavailable','affiliate API fail-closed response');
   if (/export const onRequest(?:GET|POST|OPTIONS)\\b/.test(route)) throw new Error('Invalid Cloudflare Pages handler naming in affiliate API');
   need(route,'onRequestOptions','affiliate route OPTIONS handler');
 }
 return 'Site safety guard: PASS (source assertions only; deployed runtime remains separately unverified).';
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 try{console.log(verifySiteSafety());}catch(err){console.error(err.message);process.exit(1);}
}
