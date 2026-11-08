async function verifyLive() {
  const v = await fetch('https://inshatech-b6b.pages.dev/api/version').then(r=>r.json()).catch(e=>({error: e.message}));
  console.log('Live Deploy SHA:', v.deploy_sha);

  const html = await fetch('https://inshatech-b6b.pages.dev/').then(r=>r.text());
  console.log('Has v250 cache buster:', html.includes('20261108_v250_ponder_editorial_production'));
  console.log('Has video backdrop tag:', html.includes('id="global-3d-bg-video"'));
  console.log('Has hero-telemetry-grid:', html.includes('hero-telemetry-grid'));
  console.log('Has ponder-pill-primary:', html.includes('ponder-pill-primary'));
  console.log('Has 01 // Inbound Prospect:', html.includes('01 // Inbound Prospect'));

  const aff = await fetch('https://inshatech-b6b.pages.dev/affiliate-dashboard.html').then(r=>r.text());
  console.log('Affiliate dashboard has v250:', aff.includes('20261108_v250_ponder_editorial_production'));

  const admin = await fetch('https://inshatech-b6b.pages.dev/admin.html').then(r=>r.text());
  console.log('Admin has bypass logic:', admin.includes('instantOwnerBypass'));
}
verifyLive();
