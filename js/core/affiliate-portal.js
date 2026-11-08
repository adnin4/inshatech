/**
 * IINSHA partner dashboard safety gate.
 * Demo balances and browser-local partner records are not rendered as live data.
 */
(function () {
  'use strict';
  function renderPartnerUnavailable() {
    const root=document.getElementById('affiliate-app-root');
    if(!root)return;
    root.innerHTML=`
      <section class="partner-status-card" role="status" aria-labelledby="partner-dashboard-title">
        <span class="partner-status-pill">LIVE PARTNER DATA NOT CONFIGURED</span>
        <h1 id="partner-dashboard-title" style="margin:16px 0 12px;">Partner dashboard is temporarily paused.</h1>
        <p>Referral clicks, confirmed conversions, commission balances and payouts must come from the server and a verified ledger. This dashboard will not display browser-generated demo figures as real earnings.</p>
        <p>Once the database is active and account ownership, permissions and ledger reconciliation are verified, the live dashboard can be restored.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px;">
          <a class="btn btn-primary" href="affiliate.html">Programme overview</a>
          <a class="btn btn-glass" href="affiliate-login.html">Partner access status</a>
        </div>
      </section>`;
  }
  window.initAffiliatePortal=renderPartnerUnavailable;
  window.logoutPartner=function(){sessionStorage.removeItem('iinsha_active_partner_id');sessionStorage.removeItem('iinsha_aff_logged_out');window.location.href='affiliate-login.html';};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderPartnerUnavailable);else renderPartnerUnavailable();
})();
