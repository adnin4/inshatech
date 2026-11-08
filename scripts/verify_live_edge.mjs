async function verifyLive() {
  const v = await fetch('https://inshatech-b6b.pages.dev/api/version').then(r=>r.json()).catch(e=>({error: e.message}));
  console.log('Live Deploy SHA:', v.deploy_sha);

  const html = await fetch('https://inshatech-b6b.pages.dev/').then(r=>r.text());
  console.log('Has v600 cache buster:', html.includes('20261108_v600_diagram_clean_bento'));
  console.log('Has Centered Hero Stage:', html.includes('hero-centered-stage'));
  console.log('Has Diagram Bento Grid:', html.includes('diagram-bento-grid'));
  console.log('Has HLS.js streaming script:', html.includes('hls.js@1'));
  console.log('Has video backdrop tag:', html.includes('id="global-3d-bg-video"'));
  console.log('Has Section s1:', html.includes('data-diagram-section="s1"'));
  console.log('Has Section s2:', html.includes('data-diagram-section="s2"'));
  console.log('Has Section s3:', html.includes('data-diagram-section="s3"'));
  console.log('Has Section s4:', html.includes('data-diagram-section="s4"'));
  console.log('Has Section s5:', html.includes('data-diagram-section="s5"'));
  console.log('Has Section s6:', html.includes('data-diagram-section="s6"'));

  const aff = await fetch('https://inshatech-b6b.pages.dev/affiliate-dashboard.html').then(r=>r.text());
  console.log('Affiliate dashboard has v600:', aff.includes('20261108_v600_diagram_clean_bento'));

  const admin = await fetch('https://inshatech-b6b.pages.dev/admin.html').then(r=>r.text());
  console.log('Admin has bypass logic:', admin.includes('instantOwnerBypass'));
}
verifyLive();
