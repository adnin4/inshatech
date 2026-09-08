/**
 * IINSHA AI-BOS — Authoritative Service Catalog Export
 * Single source of catalog truth for Pages Functions & Chat Agent Runtimes.
 */

export const AUTHORITATIVE_SERVICES = Object.freeze([
  {
    id: "b2b-lead-swarm",
    name: "B2B SaaS 5-Agent Hunter Swarm",
    category: "Lead Generation",
    priceUSD: 850,
    priceBDT: 104125,
    deliveryDays: 3,
    description: "5-Agent residential resilient extraction agent extracting 100+ verified decision-makers with corporate MX validation.",
    features: ["5 resilient web extraction Agents", "LinkedIn & Apollo Extraction", "Corporate MX Email Validation", "Auto-Sync to CRM & Google Sheets"],
    idealFor: ["B2B Companies", "Agencies", "SaaS Founders"],
    technologies: ["n8n", "Playwright", "Python", "Gemini Pro", "PostgreSQL"]
  },
  {
    id: "ecommerce-ai-whatsapp",
    name: "24/7 E-Commerce WhatsApp & Messenger Sales Agent",
    category: "E-Commerce Bot",
    priceUSD: 750,
    priceBDT: 91875,
    deliveryDays: 2,
    description: "Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.",
    features: ["20-Min Website Catalog Ingestion", "WhatsApp Cloud API & Messenger", "Order Confirmation & COD Handling", "Bangla, Banglish & English Voice/Text"],
    idealFor: ["Shopify", "WooCommerce", "F-Commerce"],
    technologies: ["Gemini 1.5 Flash", "n8n", "Meta WhatsApp API", "Pinecone", "Node.js"]
  },
  {
    id: "voice-ai-receptionist",
    name: "AI Voice Receptionist (Twilio + Gemini WebRTC)",
    category: "Voice AI",
    priceUSD: 1800,
    priceBDT: 220500,
    deliveryDays: 5,
    description: "Conversational voice bot answering 100+ inbound calls, booking appointments, and qualifying buyers.",
    features: ["Gemini WebRTC Voice Engine", "Twilio & Local SIP Integration", "Inbound Screening & Qualification", "Real-time SMS & CRM Booking"],
    idealFor: ["Clinics", "Law Firms", "Real Estate Agencies"],
    technologies: ["Gemini WebRTC", "Twilio API", "n8n", "Python FastAPI", "Deepgram STT"]
  },
  {
    id: "n8n-docker-cluster",
    name: "Self-Hosted n8n Enterprise Cluster Deployment",
    category: "Infrastructure",
    priceUSD: 497,
    priceBDT: 60882,
    deliveryDays: 1,
    description: "Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.",
    features: ["Dockerized n8n Setup", "PostgreSQL DB & Auto-Backups", "Unlimited Workflows & Tasks", "15+ Pre-installed Blueprints"],
    idealFor: ["Businesses spending $100-$1000/mo on Zapier"],
    technologies: ["n8n", "Docker", "Nginx", "PostgreSQL", "Ubuntu"]
  },
  {
    id: "invoice-ocr-pipeline",
    name: "Autonomous Invoice & Document OCR Pipeline",
    category: "Document Automation",
    priceUSD: 249,
    priceBDT: 30502,
    deliveryDays: 1,
    description: "Gemini Vision + Google Sheets pipeline extracting tabular financial data in under 3 seconds.",
    features: ["PDF & Image Invoice Parsing", "Gemini Vision Extraction", "Google Sheets & QuickBooks Sync", "Email Attachment Auto Poller"],
    idealFor: ["Accounting Teams", "Distributors", "Finance Managers"],
    technologies: ["Gemini Vision", "n8n", "Google Sheets API", "Python"]
  }
]);
