/**
 * InshaTech GDPR Cookie Consent Banner
 */
export function initCookieConsent() {
  if (typeof window === 'undefined') return;
  const consented = localStorage.getItem('iinsha_cookie_consent');
  if (!consented) {
    const banner = document.createElement('div');
    banner.id = 'iinsha-cookie-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.left = '20px';
    banner.style.right = '20px';
    banner.style.maxWidth = '450px';
    banner.style.backgroundColor = '#0f172a';
    banner.style.border = '1px solid rgba(255,255,255,0.1)';
    banner.style.color = '#fff';
    banner.style.padding = '16px';
    banner.style.borderRadius = '12px';
    banner.style.zIndex = '99999';
    banner.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5)';
    banner.innerHTML = `
      <div style="font-weight:600; font-size:14px; margin-bottom:8px;">🍪 Privacy & Cookie Policy</div>
      <div style="font-size:12px; color:#94a3b8; margin-bottom:12px;">We use essential cookies to maintain enterprise session telemetry and ensure payment processing.</div>
      <div style="display:flex; gap:8px;">
        <button id="accept-cookies-btn" style="background:#6366f1; color:#fff; border:none; padding:6px 14px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">Accept</button>
        <button id="decline-cookies-btn" style="background:transparent; color:#94a3b8; border:1px solid rgba(255,255,255,0.1); padding:6px 14px; border-radius:6px; font-size:12px; cursor:pointer;">Decline</button>
      </div>
    `;
    document.body.appendChild(banner);
    document.getElementById('accept-cookies-btn')?.addEventListener('click', () => {
      localStorage.setItem('iinsha_cookie_consent', 'ACCEPTED');
      banner.remove();
    });
    document.getElementById('decline-cookies-btn')?.addEventListener('click', () => {
      localStorage.setItem('iinsha_cookie_consent', 'DECLINED');
      banner.remove();
    });
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
  } else {
    initCookieConsent();
  }
}
