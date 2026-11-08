/**
 * IINSHA AI-BOS — Autonomous WhatsApp AI Sales & Support Agent
 * Specializes in 24/7 Bilingual WhatsApp Customer Qualification, Product Demos,
 * Instant Pricing, ROI Modeling, and Order Handover to Founder Adnin Sadat Mahin.
 */

export class WhatsAppAgent {
    constructor() {
        this.identity = {
            id: 'whatsapp_agent',
            name: 'IINSHA WhatsApp AI Concierge',
            role: 'Conversational Sales & Support Specialist',
            ownerPhone: '8801629286887',
            languages: ['Bangla', 'English', 'Banglish']
        };

        this.catalog = [
            {
                id: 'b2b-lead-swarm',
                name: 'B2B SaaS 5-Agent Hunter Swarm',
                priceUSD: 850,
                priceBDT: 104125,
                delivery: '3 business days',
                description: '5-Agent residential scraper extracting 100+ verified decision-makers with corporate MX validation.',
                quickPitch_bn: '৫-এজেন্ট লিড হান্টার সোয়ার্ম: লিংকডইন ও অ্যাপোলো থেকে ভেরিফাইড ডিসিশন-মেকারদের ইমেইল ও ডাটা সিআরএমে অটোমেটিক সিঙ্ক করে।',
                quickPitch_en: '5-Agent residential scraper extracting 100+ verified decision-makers with corporate MX email validation.'
            },
            {
                id: 'ecommerce-ai-whatsapp',
                name: '24/7 E-Commerce WhatsApp & Messenger Sales Bot',
                priceUSD: 750,
                priceBDT: 91875,
                delivery: '2 business days',
                description: 'Auto-ingests website catalog, answers customer queries, calculates delivery, and confirms orders in chat.',
                quickPitch_bn: '২৪/৭ ই-কমার্স হোয়াটসঅ্যাপ বট: আপনার ওয়েবসাইটের ক্যাটালগ অটোমেটিক পড়ে কাস্টমারের সাথে বাংলায় চ্যাট করে অর্ডার কনফার্ম করে।',
                quickPitch_en: 'Auto-ingests website catalog, answers customer queries, calculates delivery, and confirms orders in chat.'
            },
            {
                id: 'voice-ai-receptionist',
                name: 'AI Voice Receptionist (Twilio + Gemini WebRTC)',
                priceUSD: 1800,
                priceBDT: 220500,
                delivery: '5 business days',
                description: 'Conversational voice bot answering inbound calls, booking appointments, and qualifying buyers in real-time.',
                quickPitch_bn: 'এআই ভয়েস রিসেপশনিস্ট: ফোনে মানুষের মতো কথা বলে বুকিং নেয় ও কাস্টমারকে কোয়ালিফাই করে।',
                quickPitch_en: 'Conversational voice bot answering inbound calls, booking appointments, and qualifying buyers in real-time.'
            },
            {
                id: 'n8n-docker-cluster',
                name: 'Self-Hosted n8n Enterprise Cluster Deployment',
                priceUSD: 497,
                priceBDT: 60882,
                delivery: '1 business day',
                description: 'Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.',
                quickPitch_bn: 'সেলফ-হোস্টেড n8n ক্লাস্টার: মাসে মাত্র $৫.৯৯ ভিপিএস-এ আনলিমিটেড ওয়ার্কফ্লো—কোনো জাপিয়ার ফি ছাড়াই।',
                quickPitch_en: 'Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.'
            },
            {
                id: 'invoice-ocr-pipeline',
                name: 'Autonomous Invoice & Document OCR Pipeline',
                priceUSD: 249,
                priceBDT: 30502,
                delivery: '1 business day',
                description: 'Gemini Vision + Google Sheets pipeline extracting tabular financial data in under 3 seconds.',
                quickPitch_bn: 'ইনভয়েস ও ডকুমেন্ট ওসিআর: পিডিএফ বা ছবির ইনভয়েস থেকে ৩ সেকেন্ডে ডাটা গুগল শিটে নিয়ে নেয়।',
                quickPitch_en: 'Gemini Vision + Google Sheets pipeline extracting tabular financial data in under 3 seconds.'
            }
        ];
    }

    /**
     * Generate structured, professional WhatsApp reply based on user message
     */
    respond(incomingText = '', clientName = 'Valued Partner') {
        const text = incomingText.toLowerCase();
        const isBengali = /[\u0980-\u09FF]/.test(incomingText) || text.includes('koto') || text.includes('dam') || text.includes('apnara') || text.includes('lagbe');

        // 1. Pricing Inquiry
        if (text.includes('price') || text.includes('cost') || text.includes('দাম') || text.includes('টাকা') || text.includes('কত') || text.includes('বাজেট')) {
            if (isBengali) {
                return `আসসালামু আলাইকুম ${clientName}! 🌟\n\nIINSHA AI Automation Lab-এ স্বাগতম। আমাদের প্রধান সল্যুশন ও ইনভেস্টমেন্ট তালিকা:\n\n1️⃣ *B2B Lead Hunter Swarm:* $850 (৳104,125) [৩ দিন]\n2️⃣ *E-Commerce WhatsApp Sales Bot:* $750 (৳91,875) [২ দিন]\n3️⃣ *AI Voice Receptionist:* $1,800 (৳220,500) [৫ দিন]\n4️⃣ *Self-Hosted n8n Cluster:* $497 (৳60,882) [১ দিন]\n5️⃣ *Invoice OCR Pipeline:* $249 (৳30,502) [১ দিন]\n\n💳 *পেমেন্ট:* বিকাশ (bKash) ও স্ট্রাইপ (Stripe/Card) সাপোর্টেড।\n\nকোন সল্যুশনটি আপনার ব্যবসার জন্য প্রয়োজন? আমাকে জানান! 🚀`;
            } else {
                return `Hello ${clientName}! 👋\n\nWelcome to IINSHA AI Automation Lab. Here is our official verified pricing catalog:\n\n1️⃣ *B2B SaaS Lead Hunter Swarm:* $850 USD [3 Days Delivery]\n2️⃣ *24/7 E-Commerce WhatsApp Sales Bot:* $750 USD [2 Days Delivery]\n3️⃣ *AI Voice Receptionist:* $1,800 USD [5 Days Delivery]\n4️⃣ *Self-Hosted n8n Enterprise Cluster:* $497 USD [1 Day Delivery]\n5️⃣ *Invoice OCR Pipeline:* $249 USD [1 Day Delivery]\n\n💳 *Payment Methods:* bKash & Stripe / International Cards Supported.\n\nWhich automation stack best fits your business goals? Let us know! 🚀`;
            }
        }

        // 2. n8n vs Zapier Inquiry
        if (text.includes('zapier') || text.includes('n8n') || text.includes('cluster') || text.includes('vps')) {
            if (isBengali) {
                return `চমৎকার প্রশ্ন! ⚡\n\n*Zapier vs Self-Hosted n8n পার্থক্য:*\n• Zapier-এ প্রতি মাসে $100-$500+ খরচ হয়।\n• আমাদের n8n ক্লাস্টারে $497 একবার সেটআপ ফি, এরপর মাসে মাত্র $5.99 VPS খরচ।\n• ডাটা সম্পূর্ণ আপনার নিজস্ব সার্ভারে সুরক্ষিত থাকে এবং আনলিমিটেড টাস্ক রান করা যায়।\n\nআপনি কি n8n ক্লাস্টার সেটআপ নিতে আগ্রহী?`;
            } else {
                return `Great question! ⚡\n\n*Why Self-Hosted n8n beats Zapier:*\n• Zapier costs $100–$500+/month with strict task limits.\n• Our n8n Cluster costs $497 one-time + only $5.99/mo Hostinger VPS with UNLIMITED tasks.\n• 100% data privacy on your own server.\n\nWould you like us to deploy your n8n Docker cluster today?`;
            }
        }

        // 3. Default Intelligent Sales Welcome & Qualification
        if (isBengali) {
            return `আসসালামু আলাইকুম ${clientName}! 👋\n\nআমি IINSHA AI-এর স্বয়ংক্রিয় অ্যাসিস্ট্যান্ট। ফাউন্ডার আদনান সাদাত মাহিন (+8801629286887) আপনার বার্তা পেয়েছেন।\n\nআপনার ব্যবসা অটোমেশনের জন্য আমরা প্রস্তুত:\n• 🤖 B2B লিড জেনারেশন এজেন্ট\n• 💬 হোয়াটসঅ্যাপ ও মেসেঞ্জার সেলস বট\n• 🎙️ ভয়েস এআই রিসেপশনিস্ট\n• ⚡ n8n ওয়ার্কফ্লো অটোমেশন\n\nআপনার কোন সমস্যাটি আমরা সমাধান করতে পারি? সংক্ষেপে জানান! 🌟`;
        } else {
            return `Hello ${clientName}! 👋\n\nI am the IINSHA AI Business Concierge. Lead Engineer Adnin Sadat Mahin (+8801629286887) has received your request.\n\nHow can we accelerate your business today?\n• 🤖 5-Agent B2B Lead Generation Swarms\n• 💬 24/7 WhatsApp & E-Commerce Conversational Bots\n• 🎙️ AI Voice Receptionists (Twilio/WebRTC)\n• ⚡ Self-Hosted n8n Enterprise Clusters\n\nPlease share your requirements and we will assist you right away! 🚀`;
        }
    }

    /**
     * Generate Direct WhatsApp Click-to-Chat Link for a specific service
     */
    generateWhatsAppLink(serviceId = 'b2b-lead-swarm', customNote = '') {
        const item = this.catalog.find(c => c.id === serviceId) || this.catalog[0];
        const msg = `Hi Adnin! I am interested in deploying the *${item.name}* ($${item.priceUSD} USD / ৳${item.priceBDT} BDT). ${customNote}`;
        return `https://wa.me/${this.identity.ownerPhone}?text=${encodeURIComponent(msg)}`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WhatsAppAgent };
}
