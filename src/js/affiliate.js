/**
 * InshaTech Affiliate Attribution Client (30-Day TTL Cookie)
 */
export function initAffiliateTracking() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref') || urlParams.get('affiliate');
  if (ref) {
    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = `ibos_referrer=${encodeURIComponent(ref)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    sessionStorage.setItem('ibos_affiliate_id', ref);
    console.log('[InshaTech] Affiliate referral attributed:', ref);
  }
}

if (typeof window !== 'undefined') {
  initAffiliateTracking();
}
