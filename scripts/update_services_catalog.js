import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const servicesPath = path.join(root, 'knowledge', 'services.json');
const catalogPath = path.join(root, 'functions', '_shared', 'knowledge', 'services_catalog.js');
const apiServicesPath = path.join(root, 'functions', 'api', 'services.js');
const apiCatalogServicesPath = path.join(root, 'functions', 'api', 'catalog', 'services.js');

const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

// 1. Update functions/_shared/knowledge/services_catalog.js
const catalogContent = `/**
 * IINSHA AI-BOS — Authoritative Service Catalog Export
 * Single source of catalog truth for Pages Functions & Chat Agent Runtimes.
 */

export const AUTHORITATIVE_SERVICES = Object.freeze(${JSON.stringify(services, null, 2)});

/**
 * Resolves authoritative service catalog from live database (ibos_services)
 * with deterministic fallback to verified projection.
 *
 * Hierarchy: DB catalog -> canonical resolver -> pricing authority -> agent context -> proposal/order
 */
export async function resolveAuthoritativeCatalog(env = {}) {
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const base = \`\${env.SUPABASE_URL}/rest/v1\`;
            const key = env.SUPABASE_SERVICE_ROLE_KEY;
            const res = await fetch(\`\${base}/ibos_services?status=eq.published&select=*\`, {
                headers: {
                    apikey: key,
                    Authorization: \`Bearer \${key}\`,
                    'Content-Type': 'application/json'
                }
            }).catch(() => null);

            if (res && res.ok) {
                const rows = await res.json().catch(() => []);
                if (Array.isArray(rows) && rows.length > 0) {
                    const mapped = rows.map(r => ({
                        id: r.slug || r.id,
                        name: r.title || r.name,
                        category: r.category || 'Automation',
                        priceUSD: Number(r.price) || 0,
                        priceBDT: Math.round((Number(r.price) || 0) * (Number(env.BDT_EXCHANGE_RATE) || 122.50)),
                        deliveryDays: r.delivery_days || 3,
                        description: r.description || '',
                        features: Array.isArray(r.features) ? r.features : (Array.isArray(r.packages) ? r.packages.map(p => p.name) : []),
                        idealFor: r.ideal_for ? [r.ideal_for] : ['Enterprises', 'Agencies'],
                        technologies: Array.isArray(r.tech_stack) ? r.tech_stack : ['n8n', 'Python', 'Gemini Pro'],
                        source: 'DATABASE_AUTHORITATIVE'
                    }));
                    return {
                        services: mapped,
                        source: 'DATABASE_AUTHORITATIVE',
                        count: mapped.length
                    };
                }
            }
        } catch (dbErr) {
            console.warn('Catalog DB resolution notice:', dbErr.message);
        }
    }

    return {
        services: AUTHORITATIVE_SERVICES,
        source: 'STATIC_PROJECTION',
        count: AUTHORITATIVE_SERVICES.length
    };
}
`;

fs.writeFileSync(catalogPath, catalogContent, 'utf8');
console.log('Updated services_catalog.js');

// 2. Update functions/api/catalog/services.js
const apiCatalogContent = `/**
 * Cloudflare Pages Function: /api/catalog/services
 * Canonical Product Catalog & Ecosystem Vision Endpoint
 */

const SERVICES = ${JSON.stringify(services, null, 4)};

export async function onRequestGet(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        catalog_version: "v10.0.0",
        exchange_rate: 122.50,
        currency_base: "USD",
        currency_local: "BDT",
        total_products: SERVICES.length,
        products: SERVICES,
        value_proposition: "Self-hosted, zero vendor lock-in, bounded multi-agent AI operating systems.",
        timestamp: new Date().toISOString()
    }, null, 2), { status: 200, headers: corsHeaders });
}
`;
fs.writeFileSync(apiCatalogServicesPath, apiCatalogContent, 'utf8');
console.log('Updated functions/api/catalog/services.js');

// 3. Update functions/api/services.js
// Map services to canonical services format with slug, badge, published, n8nReady
const canonicalServices = services.map(s => {
    let badge = '🚀 Active';
    if (s.id === 'b2b-lead-swarm') badge = '🔥 Top Seller';
    else if (s.id === 'ecommerce-ai-whatsapp') badge = '⚡ 20-Min Setup';
    else if (s.id === 'voice-ai-receptionist') badge = '🎙️ Zero Latency';
    else if (s.id === 'n8n-docker-cluster') badge = '💰 90% Cost Saving';
    else if (s.id === 'invoice-ocr-pipeline') badge = '⚡ Turnkey';
    else if (s.id === 'api-backend-integration') badge = '⚡ Phase 1 Cash Flow';
    else if (s.id === 'managed-ai-maintenance') badge = '🛡️ Phase 2 Recurring Retainer';
    else if (s.id === 'vertical-saas-core') badge = '🏢 Phase 3 Vertical SaaS';
    else if (s.id === 'agency-white-label-partner') badge = '🤝 Wholesale Agency Partner';
    else if (s.id === 'saas-bug-fix-rapid-pilot') badge = '⏱️ 24-48hr Rapid Pilot';

    return {
        id: s.id,
        slug: s.id,
        name: s.name,
        category: s.category,
        priceUSD: s.priceUSD,
        badge,
        description: s.description,
        deliveryDays: s.deliveryDays,
        features: s.features,
        technologies: s.technologies,
        idealFor: Array.isArray(s.idealFor) ? s.idealFor.join(', ') : (s.idealFor || 'Enterprises & Agencies'),
        packages: s.packages || [
            { name: 'Standard', price: s.priceUSD, delivery_days: s.deliveryDays }
        ],
        n8nReady: true,
        published: true
    };
});

const apiServicesFileContent = `/**
 * Cloudflare Pages Function: /api/services
 * Canonical Serverless API for IINSHA AI Services & Package Registry
 */

export const CANONICAL_SERVICES = ${JSON.stringify(canonicalServices, null, 4)};

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q")?.toLowerCase();

    // Check if we can resolve from shared DB catalog resolver
    let catalogResolution = { services: CANONICAL_SERVICES, source: 'STATIC_PROJECTION' };
    try {
        const { resolveAuthoritativeCatalog } = await import('../_shared/knowledge/services_catalog.js');
        if (resolveAuthoritativeCatalog) {
            catalogResolution = await resolveAuthoritativeCatalog(env);
        }
    } catch (e) {
        // Fall back to CANONICAL_SERVICES
    }

    let results = catalogResolution.services || CANONICAL_SERVICES;

    if (category) {
        results = results.filter(s => s.category?.toLowerCase() === category.toLowerCase());
    }

    if (q) {
        results = results.filter(s => 
            s.name.toLowerCase().includes(q) || 
            s.description.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        );
    }

    return new Response(JSON.stringify({
        status: "SUCCESS",
        source: catalogResolution.source,
        count: results.length,
        usd_to_bdt_rate: Number(env?.BDT_EXCHANGE_RATE) || 122.50,
        services: results
    }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
`;
fs.writeFileSync(apiServicesPath, apiServicesFileContent, 'utf8');
console.log('Updated functions/api/services.js');
