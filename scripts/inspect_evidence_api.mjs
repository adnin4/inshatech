async function checkEvidence() {
  const [prodRes, prevRes] = await Promise.all([
    fetch('https://inshatech-b6b.pages.dev/api/agents/evidence'),
    fetch('https://4b185508.inshatech-b6b.pages.dev/api/agents/evidence')
  ]);

  const prodJson = await prodRes.json();
  const prevJson = await prevRes.json();

  console.log('PROD keys:', Object.keys(prodJson));
  console.log('PREV keys:', Object.keys(prevJson));
  console.log('PROD tamper_evident:', prodJson.tamper_evident);
  console.log('PREV tamper_evident:', prevJson.tamper_evident);
  console.log('PROD rootDigest:', prodJson.attestation?.rootDigest);
  console.log('PREV rootDigest:', prevJson.attestation?.rootDigest);
  console.log('Keys match:', JSON.stringify(Object.keys(prodJson).sort()) === JSON.stringify(Object.keys(prevJson).sort()));
}

checkEvidence().catch(console.error);
