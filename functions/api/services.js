/**
 * Cloudflare Pages Function: /api/services
 * Canonical Serverless API for IINSHA AI Services & Package Registry
 */

export const CANONICAL_SERVICES = [
    {
        id: 'b2b-lead-swarm',
        slug: 'b2b-saas-5-agent-hunter-swarm',
        name: 'B2B SaaS 5-Agent Hunter Swarm',
        category: 'Lead Generation',
        priceUSD: 850,
        badge: '🔥 Top Seller',
        description: '5-Agent residential resilient extraction agent extracting 100+ verified decision-makers with corporate MX validation.',
        deliveryDays: 3,
        features: [
            '5-Agent Autonomous Lead Hunting Pipeline',
            'Playwright Resilient Extractor with IP Rotation',
            'Corporate Email MX & SMTP Verification',
            'LinkedIn Sales Navigator & Apollo Data Extractor',
            'Auto-sync with HubSpot, Salesforce & n8n'
        ],
        technologies: ['n8n', 'Playwright', 'Python', 'Gemini Pro', 'PostgreSQL'],
        idealFor: 'B2B Companies, Agencies, SaaS Founders needing high-quality lead pipelines',
        n8nReady: true,
        published: true
    },
    {
        id: 'ecommerce-ai-whatsapp',
        slug: 'ecommerce-whatsapp-messenger-sales-agent',
        name: '24/7 E-Commerce WhatsApp & Messenger Sales Agent',
        category: 'E-Commerce Bot',
        priceUSD: 750,
        badge: 'âš¡ 20-Min Setup',
        description: 'Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.',
        deliveryDays: 2,
        features: [
            'Auto-Catalog Ingestion & Vector Embedding Search',
            'WhatsApp Cloud API & Meta Messenger Integration',
            'Stock Check, Delivery Calculation & Order Confirmation',
            'Bangla, Banglish & English Multi-lingual Speech & Text',
            'Cash on Delivery & Automated BKash/Nagad Payment Links'
        ],
        technologies: ['Gemini 1.5 Flash', 'n8n', 'Meta WhatsApp API', 'Pinecone', 'Node.js'],
        idealFor: 'Shopify, WooCommerce, F-Commerce & E-Commerce Merchants in BD & Globally',
        n8nReady: true,
        published: true
    },
    {
        id: 'voice-ai-receptionist',
        slug: 'voice-ai-receptionist-twilio-webrtc',
        name: 'AI Voice Receptionist (Twilio + Gemini WebRTC)',
        category: 'Voice AI',
        priceUSD: 1800,
        badge: 'ðŸŽ™ï¸ Zero Latency',
        description: 'Conversational voice bot answering 100+ inbound calls, booking appointments, and qualifying buyers in <45s.',
        deliveryDays: 5,
        features: [
            'Ultra-low Latency WebRTC Conversational Voice Engine',
            'Twilio & Local Telecom SIP Trunking Integration',
            'Inbound Call Screening, Qualification & Calendar Booking',
            'CRM Sync & Real-time SMS Confirmation Dispatch',
            'Custom Voice Cloning & Accent Tuning (Bangla & English)'
        ],
        technologies: ['Gemini WebRTC', 'Twilio API', 'n8n', 'Python FastAPI', 'Deepgram STT'],
        idealFor: 'Clinics, Law Firms, Real Estate Agencies, Hotlines & High-Call Businesses',
        n8nReady: true,
        published: true
    },
    {
        id: 'n8n-docker-cluster',
        slug: 'self-hosted-n8n-enterprise-cluster',
        name: 'Self-Hosted n8n Enterprise Cluster Deployment',
        category: 'Infrastructure',
        priceUSD: 497,
        badge: 'ðŸ’° 90% Cost Saving',
        description: 'Dockerized n8n on Hostinger/Hetzner VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.',
        deliveryDays: 1,
        features: [
            'Dockerized n8n Enterprise Instance Setup',
            'PostgreSQL Database & Automated Daily Backups',
            'SSL Certificate & Nginx Reverse Proxy Security',
            'Unlimited Workflows, Tasks & Custom Webhooks',
            'Pre-installed 15+ IINSHA Master Workflow Blueprints'
        ],
        technologies: ['n8n', 'Docker', 'Nginx', 'PostgreSQL', 'Ubuntu Linux'],
        idealFor: 'Businesses spending $100-$1000/mo on Zapier, Make or Workato',
        n8nReady: true,
        published: true
    },
    {
        id: 'invoice-ocr-pipeline',
        slug: 'autonomous-invoice-document-ocr-pipeline',
        name: 'Autonomous Invoice & Document OCR Pipeline',
        category: 'Document Automation',
        priceUSD: 249,
        badge: 'âš¡ Turnkey',
        description: 'Gemini Vision + Google Sheets + QuickBooks pipeline extracting tabular financial data in under 3 seconds.',
        deliveryDays: 1,
        features: [
            'Multi-format PDF, Image & Scan Invoice Parsing',
            'Gemini 1.5 Vision Multimodal Data Extraction',
            'Automated Reconciliation with Google Sheets & Accounting Software',
            'Anomaly Detection & Duplicate Invoice Warning',
            'Email Attachment Auto-ingest Poller'
        ],
        technologies: ['Gemini Vision', 'n8n', 'Google Sheets API', 'Python'],
        idealFor: 'Accounting Teams, Distributors, Freight Forwarders & Finance Managers',
        n8nReady: true,
        published: true
    }
];

import { resolveAuthoritativeCatalog } from '../_shared/knowledge/services_catalog.js';

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");

    const catalogResolution = await resolveAuthoritativeCatalog(env);
    let results = catalogResolution.services;

    if (category) {
        results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
        const q = search.toLowerCase();
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
        usd_to_bdt_rate: Number(env.BDT_EXCHANGE_RATE) || 122.50,
        services: results
    }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}

