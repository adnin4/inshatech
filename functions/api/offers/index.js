/**
 * Cloudflare Pages Function: /api/offers/index
 * Universal Offer Engine API Gateway
 * Serves unified offers across Website, Marketplace, Partner OS, and CRM
 */

export const UNIVERSAL_OFFERS = [
    {
        id: 'b2b-lead-swarm',
        slug: 'b2b-saas-5-agent-hunter-swarm',
        title: 'B2B SaaS 5-Agent Hunter Swarm',
        type: 'turnkey_service',
        category: 'AI Automation',
        short_description: '5-Agent residential stealth scraper extracting 100+ verified decision-makers with corporate MX validation.',
        pricing_config: {
            model: 'fixed_with_recurring',
            base_usd: 850.00,
            base_bdt: 104125.00,
            recurring_usd: 150.00,
            currency: 'USD'
        },
        affiliate_config: {
            eligible: true,
            upfront_percent: 20.0,
            recurring_percent: 15.0,
            cookie_days: 60,
            min_tier: 'Bronze',
            epc: 8.40
        },
        deliverables: [
            '5 Stealth Scraping Agents with Residential IP Rotation',
            'Corporate MX & SMTP Email Verification Pipeline',
            'Auto-sync to CRM, Google Sheets & n8n'
        ],
        marketing_assets: [
            { type: 'linkedin_swipe', title: 'B2B Outbound Hook', id: 'asset-linkedin-01' },
            { type: 'email_swipe', title: 'CEO Cold Pitch', id: 'asset-email-01' }
        ],
        status: 'published',
        is_featured: true,
        sort_order: 1
    },
    {
        id: 'ecommerce-ai-whatsapp',
        slug: 'ecommerce-whatsapp-messenger-sales-agent',
        title: '24/7 E-Commerce WhatsApp & Messenger Sales Agent',
        type: 'turnkey_service',
        category: 'Conversational AI',
        short_description: 'Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.',
        pricing_config: {
            model: 'fixed_with_recurring',
            base_usd: 750.00,
            base_bdt: 91875.00,
            recurring_usd: 100.00,
            currency: 'USD'
        },
        affiliate_config: {
            eligible: true,
            upfront_percent: 20.0,
            recurring_percent: 15.0,
            cookie_days: 60,
            min_tier: 'Bronze',
            epc: 7.80
        },
        deliverables: [
            '20-Min Auto Catalog Ingestion & Vector Search',
            'WhatsApp Cloud API & Meta Messenger Handlers',
            'Cash on Delivery & Automated Payment Links'
        ],
        marketing_assets: [
            { type: 'social_video_script', title: 'E-com WhatsApp Teardown', id: 'asset-vid-01' }
        ],
        status: 'published',
        is_featured: true,
        sort_order: 2
    },
    {
        id: 'n8n-docker-cluster',
        slug: 'self-hosted-n8n-enterprise-cluster',
        title: 'Self-Hosted n8n Enterprise Cluster Deployment',
        type: 'infrastructure_saas',
        category: 'Workflow Automation',
        short_description: 'Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.',
        pricing_config: {
            model: 'fixed',
            base_usd: 497.00,
            base_bdt: 60882.50,
            recurring_usd: 0.00,
            currency: 'USD'
        },
        affiliate_config: {
            eligible: true,
            upfront_percent: 20.0,
            recurring_percent: 0.0,
            cookie_days: 60,
            min_tier: 'Bronze',
            epc: 6.50
        },
        deliverables: [
            'Dockerized n8n Instance on Ubuntu VPS',
            'PostgreSQL DB & Automated Daily Backups',
            'Pre-installed 15+ Master Blueprints'
        ],
        marketing_assets: [],
        status: 'published',
        is_featured: true,
        sort_order: 3
    }
];

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const url = new URL(context.request.url);
    const category = url.searchParams.get("category");
    const type = url.searchParams.get("type");

    let results = UNIVERSAL_OFFERS;
    if (category) {
        results = results.filter(o => o.category.toLowerCase() === category.toLowerCase());
    }
    if (type) {
        results = results.filter(o => o.type.toLowerCase() === type.toLowerCase());
    }

    return new Response(JSON.stringify({
        status: "SUCCESS",
        total: results.length,
        data: results
    }), { headers, status: 200 });
}

