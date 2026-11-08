import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'iuhtzahuszdkdarhxobx';
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error('❌ SUPABASE_ACCESS_TOKEN is missing from environment.');
  process.exit(1);
}

async function runQuery(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Query failed with HTTP ${res.status}: ${errText}`);
  }
  return await res.json();
}

async function syncLiveDatabase() {
  console.log('================================================================================');
  console.log(`📡 IINSHA AI-BOS: LIVE SUPABASE SYNC (Project Ref: ${PROJECT_REF})`);
  console.log('================================================================================');

  // 1. Verify connection
  const ping = await runQuery('SELECT current_database(), current_user, version();');
  console.log('✅ Connected to Postgres:', ping[0]?.current_database, '| User:', ping[0]?.current_user);

  // 2. Load authoritative catalog
  const { AUTHORITATIVE_SERVICES } = await import('../functions/_shared/knowledge/services_catalog.js');
  console.log(`📦 Loaded ${AUTHORITATIVE_SERVICES.length} authoritative services from local catalog.`);

  // 3. Upsert into ibos_services
  for (const s of AUTHORITATIVE_SERVICES) {
    const safeTitle = s.name.replace(/'/g, "''");
    const safeCat = s.category.replace(/'/g, "''");
    const safeDesc = (s.description || '').replace(/'/g, "''");
    const safeFeatures = JSON.stringify(s.features || []).replace(/'/g, "''");
    const safePackages = JSON.stringify({
      starter: { name: 'Starter', price: s.priceUSD, delivery_days: s.deliveryDays },
      enterprise: { name: 'Enterprise', price: s.priceUSD * 2.5, delivery_days: s.deliveryDays * 2 }
    }).replace(/'/g, "''");

    const upsertSql = `
      INSERT INTO ibos_services (slug, title, category, price, features, packages, seo_description, status, updated_at)
      VALUES ('${s.id}', '${safeTitle}', '${safeCat}', ${s.priceUSD}, '${safeFeatures}'::jsonb, '${safePackages}'::jsonb, '${safeDesc}', 'PUBLISHED', NOW())
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        price = EXCLUDED.price,
        features = EXCLUDED.features,
        packages = EXCLUDED.packages,
        seo_description = EXCLUDED.seo_description,
        status = EXCLUDED.status,
        updated_at = NOW();
    `;
    await runQuery(upsertSql);
    console.log(`  [UPSERT] ${s.id} -> $${s.priceUSD} (${s.name})`);
  }

  // 4. Verify updated count
  const countRes = await runQuery('SELECT count(*) as total_services FROM ibos_services WHERE status = \'PUBLISHED\';');
  console.log(`\n🎉 Success! Total published services in live Supabase: ${countRes[0]?.total_services}`);

  // 5. Ensure ibos_payment_gateways has active records
  const gwCheck = await runQuery('SELECT count(*) as total_gw FROM ibos_payment_gateways;');
  if (parseInt(gwCheck[0]?.total_gw || 0) === 0) {
    console.log('⚡ Initializing default payment gateway records...');
    await runQuery(`
      INSERT INTO ibos_payment_gateways (gateway_id, name, is_active, supports_bdt, supports_usd, mode, created_at, updated_at)
      VALUES 
        ('lemonsqueezy', 'Lemon Squeezy Global Card/Apple Pay', true, false, true, 'production', NOW(), NOW()),
        ('sslcommerz', 'SSLCommerz Bangladesh bKash/Nagad/Cards', true, true, false, 'production', NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Payment gateway records initialized.');
  }

  console.log('\n================================================================================');
  console.log('🟢 SUPABASE LIVE UPDATE COMPLETED SUCCESSFULLY!');
  console.log('================================================================================');
}

syncLiveDatabase().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
