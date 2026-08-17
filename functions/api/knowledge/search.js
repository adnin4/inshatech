/**
 * Cloudflare Pages Function: /api/knowledge/search
 * Canonical RAG search across services, faqs, and company knowledge base
 */

const services = [
  {
    "id": "b2b-lead-swarm",
    "name": "B2B SaaS 5-Agent Hunter Swarm",
    "category": "Lead Generation",
    "priceUSD": 850,
    "priceBDT": 104125,
    "deliveryDays": 3,
    "description": "5-Agent residential stealth scraper extracting 100+ verified decision-makers with corporate MX validation.",
    "features": [
      "5 Stealth Scraping Agents",
      "LinkedIn & Apollo Extraction",
      "Corporate MX Email Validation",
      "Auto-Sync to CRM & Google Sheets"
    ],
    "idealFor": [
      "B2B Companies",
      "Agencies",
      "SaaS Founders"
    ],
    "technologies": [
      "n8n",
      "Playwright",
      "Python",
      "Gemini Pro",
      "PostgreSQL"
    ]
  },
  {
    "id": "ecommerce-ai-whatsapp",
    "name": "24/7 E-Commerce WhatsApp & Messenger Sales Agent",
    "category": "E-Commerce Bot",
    "priceUSD": 750,
    "priceBDT": 91875,
    "deliveryDays": 2,
    "description": "Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.",
    "features": [
      "20-Min Website Catalog Ingestion",
      "WhatsApp Cloud API & Messenger",
      "Order Confirmation & COD Handling",
      "Bangla, Banglish & English Voice/Text"
    ],
    "idealFor": [
      "Shopify",
      "WooCommerce",
      "F-Commerce"
    ],
    "technologies": [
      "Gemini 1.5 Flash",
      "n8n",
      "Meta WhatsApp API",
      "Pinecone",
      "Node.js"
    ]
  },
  {
    "id": "voice-ai-receptionist",
    "name": "AI Voice Receptionist (Twilio + Gemini WebRTC)",
    "category": "Voice AI",
    "priceUSD": 1800,
    "priceBDT": 220500,
    "deliveryDays": 5,
    "description": "Conversational voice bot answering 100+ inbound calls, booking appointments, and qualifying buyers.",
    "features": [
      "Gemini WebRTC Voice Engine",
      "Twilio & Local SIP Integration",
      "Inbound Screening & Qualification",
      "Real-time SMS & CRM Booking"
    ],
    "idealFor": [
      "Clinics",
      "Law Firms",
      "Real Estate Agencies"
    ],
    "technologies": [
      "Gemini WebRTC",
      "Twilio API",
      "n8n",
      "Python FastAPI",
      "Deepgram STT"
    ]
  },
  {
    "id": "n8n-docker-cluster",
    "name": "Self-Hosted n8n Enterprise Cluster Deployment",
    "category": "Infrastructure",
    "priceUSD": 497,
    "priceBDT": 60882,
    "deliveryDays": 1,
    "description": "Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.",
    "features": [
      "Dockerized n8n Setup",
      "PostgreSQL DB & Auto-Backups",
      "Unlimited Workflows & Tasks",
      "15+ Pre-installed Blueprints"
    ],
    "idealFor": [
      "Businesses spending $100-$1000/mo on Zapier"
    ],
    "technologies": [
      "n8n",
      "Docker",
      "Nginx",
      "PostgreSQL",
      "Ubuntu"
    ]
  },
  {
    "id": "invoice-ocr-pipeline",
    "name": "Autonomous Invoice & Document OCR Pipeline",
    "category": "Document Automation",
    "priceUSD": 249,
    "priceBDT": 30502,
    "deliveryDays": 1,
    "description": "Gemini Vision + Google Sheets pipeline extracting tabular financial data in under 3 seconds.",
    "features": [
      "PDF & Image Invoice Parsing",
      "Gemini Vision Extraction",
      "Google Sheets & QuickBooks Sync",
      "Email Attachment Auto Poller"
    ],
    "idealFor": [
      "Accounting Teams",
      "Distributors",
      "Finance Managers"
    ],
    "technologies": [
      "Gemini Vision",
      "n8n",
      "Google Sheets API",
      "Python"
    ]
  }
];
const faqs = [
  {
    "question": "What is the typical pricing for a custom AI Agent?",
    "answer": "Our pricing ranges from $249 for simple document extraction to $1800 for a full Voice AI Receptionist. For specific quotes, use the 'Get Quote' feature."
  },
  {
    "question": "How long does delivery take?",
    "answer": "Delivery times vary by project complexity. Quick automated pipelines take 1-2 days, while custom AI web apps or Voice AI agents take 3-5 days."
  },
  {
    "question": "What payment methods are accepted?",
    "answer": "We accept Bank Transfer, Wise, Payoneer, and local BD payment gateways like bKash/Nagad for domestic clients."
  },
  {
    "question": "What is your refund policy?",
    "answer": "We offer a 100% money-back guarantee if the delivered product does not meet the agreed-upon requirements within the first 7 days."
  },
  {
    "question": "What tech stack do you use?",
    "answer": "We specialize in n8n, Gemini Pro/Flash, OpenAI, Python, Node.js, and PostgreSQL, deployed mostly via Docker."
  },
  {
    "question": "Why n8n over Zapier?",
    "answer": "n8n can be self-hosted, removing per-task execution costs. This saves most businesses up to 90% compared to Zapier's monthly plans."
  },
  {
    "question": "Do you provide post-delivery support?",
    "answer": "Yes, we provide 30 days of free technical support and bug fixes after deployment."
  },
  {
    "question": "Can the AI understand Bangla and Banglish?",
    "answer": "Absolutely. Our Gemini-powered agents are fine-tuned to understand and respond natively in Bangla, Banglish, and English."
  },
  {
    "question": "Do I need technical knowledge to manage this?",
    "answer": "No, we build everything to be turnkey and manageable via simple dashboards or Google Sheets."
  },
  {
    "question": "Can you integrate with my existing CRM?",
    "answer": "Yes, using n8n and REST APIs, we can connect to Salesforce, HubSpot, Zoho, and 200+ other platforms."
  },
  {
    "question": "Is my data secure?",
    "answer": "Yes. If you opt for our self-hosted n8n infrastructure, all data stays on your own servers with no third-party data retention."
  },
  {
    "question": "Do you offer white-label solutions?",
    "answer": "Yes, agencies can purchase white-label licenses to resell our AI automation services to their clients."
  },
  {
    "question": "What happens if the AI makes a mistake?",
    "answer": "We use RAG (Retrieval-Augmented Generation) and strict guardrails to minimize hallucinations. You also have full logs."
  },
  {
    "question": "Can I test a demo before buying?",
    "answer": "Yes, we have live sandboxes for our WhatsApp e-commerce bots and Lead Swarm systems."
  },
  {
    "question": "How do I communicate with the team during the project?",
    "answer": "We set up a dedicated WhatsApp or Slack channel for real-time updates and feedback."
  }
];
const company = {
  "company_name": "IINSHA AI-BOS",
  "founder": "Adnin Sadat Mahin",
  "contact": {
    "whatsapp": "+8801629286887",
    "email": "contact@iinsha.com",
    "website": "https://iinsha.com"
  },
  "mission": "Empowering businesses with autonomous AI solutions, cutting operational costs, and boosting sales efficiency with zero manual effort.",
  "tech_stack": [
    "Gemini",
    "n8n",
    "Python",
    "Node.js",
    "Docker",
    "PostgreSQL",
    "Cloudflare Pages",
    "Twilio",
    "Meta API"
  ],
  "exchange_rate": {
    "USD_to_BDT": 122.5
  },
  "location": "Dhaka, Bangladesh",
  "established": 2023,
  "core_competencies": [
    "Autonomous Agents",
    "RAG Systems",
    "Voice AI",
    "Workflow Automation"
  ]
};

export async function onRequestGet(context) {
    try {
        const url = new URL(context.request.url);
        const query = url.searchParams.get('q');
        const category = url.searchParams.get('category');

        if (!query) {
            return new Response(JSON.stringify({ error: 'Missing search query ?q=' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
            });
        }

        const q = query.toLowerCase();
        let results = [];

        // Search services
        if (!category || category === 'services') {
            for (const s of services) {
                const textToSearch = `${s.name} ${s.description} ${s.category} ${(s.features || []).join(' ')} ${(s.technologies || []).join(' ')}`.toLowerCase();
                if (textToSearch.includes(q)) {
                    results.push({
                        content: s,
                        source: 'services.json',
                        relevance: 0.9
                    });
                }
            }
        }

        // Search FAQs
        if (!category || category === 'faqs') {
            for (const f of faqs) {
                const textToSearch = `${f.question} ${f.answer}`.toLowerCase();
                if (textToSearch.includes(q)) {
                    results.push({
                        content: f,
                        source: 'faqs.json',
                        relevance: 0.8
                    });
                }
            }
        }

        // Search Company Info
        if (!category || category === 'company') {
            const companyStr = JSON.stringify(company).toLowerCase();
            if (companyStr.includes(q)) {
                results.push({
                    content: company,
                    source: 'company.json',
                    relevance: 1.0
                });
            }
        }

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            results,
            total: results.length,
            query: q
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
        });
    }
}
