/**
 * IINSHA AI-BOS â€” PHASE 8 & 9: 5-LAYER MEMORY SYSTEM & COMPRESSION ENGINE
 * Layer 1: Conversation Memory (Short-Term Turns)
 * Layer 2: User Memory (Profile, preferences, language)
 * Layer 3: Business Memory (IINSHA services, SOPs, pricing, SLA rules)
 * Layer 4: Episodic Memory (Approved proposals, past mission outcomes)
 * Layer 5: Semantic / RAG Memory (Documents, playbooks, API specs)
 */

class MemorySystem {
    constructor() {
        this.userProfiles = new Map();
        this.businessContext = {
            company_name: "IINSHA AI-BOS & Automation Agency",
            founder: "Adnin Sadat Mahin (n8n Certified Automation Engineer)",
            contact_whatsapp: "+8801629286887",
            contact_email: "adnansadatmahin5@gmail.com",
            usd_to_bdt_rate: 122.50,
            sla_delivery_hours: 48,
            warranty_days: 14,
            infrastructure: "Hostinger VPS Ubuntu 24.04 Docker Swarm & Traefik SSL",
            affiliate_commission_rate: 0.20, // 20% recurring
            master_services: [
                { id: "SDR-SWARM", name: "Autonomous Multi-Agent SDR Swarm", price_usd: 3000, price_bdt: 367500, category: "Outbound & Lead Gen", target_icp: "B2B SaaS & High-Ticket Agencies" },
                { id: "RE-LEAD-BOT", name: "Real Estate Speed-to-Lead <45s WhatsApp Qualifier", price_usd: 750, price_bdt: 91875, category: "Speed-to-Lead", target_icp: "Real Estate Agencies & Brokerages" },
                { id: "N8N-PACK", name: "n8n Self-Hosted Workflow Engine on Hostinger VPS", price_usd: 65, price_bdt: 7962, category: "Workflow Automation", target_icp: "Startups & Micro-SaaS" },
                { id: "CLINIC-VOICE", name: "Healthcare & Clinic 24/7 Voice AI Receptionist", price_usd: 95, price_bdt: 11637, category: "Voice AI", target_icp: "Clinics & Dental Practices" },
                { id: "LOGISTICS-OCR", name: "Logistics & Freight Gemini 3.0 Vision Invoice OCR", price_usd: 55, price_bdt: 6737, category: "Vision OCR", target_icp: "Freight & 3PL Operators" },
                { id: "FULL-AIBOS", name: "Full IINSHA Autonomous Business Operating System (AI-BOS)", price_usd: 500, price_bdt: 61250, category: "Flagship OS", target_icp: "Enterprises & Scaling Agencies" }
            ],
            sops: [
                "Always verify ICP company size and industry before executing lead discovery.",
                "Never trigger external outbound messaging or email send without Level 2 HITL approval.",
                "Always present dual currency ($ USD and à§³ BDT @ 122.50) for all pricing inquiries.",
                "Never hallucinate lead numbers or mock search data â€” execute real tools and report exact counts."
            ]
        };

        this.episodicMemories = [];
        this.semanticDocuments = [
            { id: "DOC-001", title: "B2B SaaS Lead Generation Playbook", tags: ["lead_gen", "b2b", "saas", "hunter"], content: "B2B SaaS ICP specifies companies with 50-200 employees, verified domain MX records, key decision makers (VP Sales, CMO, Founder), and automated multi-channel enrichment." },
            { id: "DOC-002", title: "n8n Webhook & Hostinger VPS SLA", tags: ["n8n", "docker", "vps", "telemetry"], content: "Self-hosted n8n workflows deploy in isolated Docker containers with automated crash-recovery, healthcheck pings every 60s, and instant Telegram/Slack error alerts." },
            { id: "DOC-003", title: "Real Estate Speed-to-Lead Blueprint", tags: ["realestate", "whatsapp", "gemini"], content: "Inbound property inquiries from Facebook/Google Ads receive automated Gemini 3.0 Flash qualification via WhatsApp within 45 seconds, booking directly to Google Calendar." }
        ];
    }

    /**
     * Layer 2: Get or Initialize User Profile
     */
    getUserProfile(userId) {
        if (!this.userProfiles.has(userId)) {
            this.userProfiles.set(userId, {
                user_id: userId,
                preferred_language: 'Bangla / English bilingual',
                communication_style: 'Direct, actionable, technical & commercial excellence',
                business_focus: 'Enterprise AI & Automation',
                known_preferences: [],
                lifetime_requests: 0
            });
        }
        return this.userProfiles.get(userId);
    }

    /**
     * Layer 2: Update User Profile
     */
    updateUserProfile(userId, updates) {
        const profile = this.getUserProfile(userId);
        Object.assign(profile, updates);
        profile.lifetime_requests += 1;
        this.userProfiles.set(userId, profile);
        return profile;
    }

    /**
     * Layer 3: Get Business Memory
     */
    getBusinessMemory() {
        return this.businessContext;
    }

    /**
     * Layer 4: Write Episodic Memory
     */
    recordEpisodicMemory(userId, memoryObj) {
        const record = {
            id: 'ep_' + Math.random().toString(36).substr(2, 9),
            user_id: userId,
            type: memoryObj.type || 'MISSION_OUTCOME',
            title: memoryObj.title || 'Action Record',
            content: memoryObj.content || '',
            importance: memoryObj.importance || 0.8,
            timestamp: new Date().toISOString()
        };
        this.episodicMemories.unshift(record);
        if (this.episodicMemories.length > 50) this.episodicMemories.pop();
        return record;
    }

    /**
     * Layer 5: Semantic / RAG Ranked Retrieval
     */
    retrieveRelevantMemories(query, userId = 'user_default', topK = 3) {
        if (!query) return [];
        const lowerQ = query.toLowerCase();
        const words = lowerQ.split(/\s+/).filter(w => w.length > 2);

        // Score semantic documents
        const scoredDocs = this.semanticDocuments.map(doc => {
            let score = 0;
            const text = (doc.title + " " + doc.content + " " + doc.tags.join(" ")).toLowerCase();
            words.forEach(w => {
                if (text.includes(w)) score += 1;
            });
            return { ...doc, score, type: 'SEMANTIC_DOC' };
        }).filter(d => d.score > 0);

        // Score episodic memories
        const userEpisodes = this.episodicMemories.filter(m => m.user_id === userId);
        const scoredEpisodes = userEpisodes.map(ep => {
            let score = 0;
            const text = (ep.title + " " + ep.content).toLowerCase();
            words.forEach(w => {
                if (text.includes(w)) score += 1.5;
            });
            return { ...ep, score, type: 'EPISODIC_MEMORY' };
        }).filter(e => e.score > 0);

        const combined = [...scoredDocs, ...scoredEpisodes].sort((a, b) => b.score - a.score);
        return combined.slice(0, topK);
    }

    /**
     * Phase 9: Context Compression & Conversation Summarizer
     */
    compressConversation(contract) {
        if (!contract || !contract.messages || contract.messages.length < 4) {
            return contract?.conversation_summary || 'Conversation initiated.';
        }

        const state = contract.conversation_state || {};
        const goal = contract.active_goal || 'Clarifying user objective';
        const facts = (state.known_facts || []).map(f => typeof f === 'string' ? f : f.fact).join('; ');
        const constraints = (state.constraints || []).map(c => typeof c === 'string' ? c : c.constraint).join('; ');
        const decisions = (state.decisions || []).map(d => typeof d === 'string' ? d : d.decision).join('; ');
        const answered = (state.answered_questions || []).map(a => a.question).join('; ');

        return `USER GOAL: ${goal} | IMPORTANT FACTS: ${facts || 'None established yet'} | CONSTRAINTS: ${constraints || 'Standard enterprise'} | DECISIONS: ${decisions || 'None pending'} | ANSWERED QUESTIONS (DO NOT ASK AGAIN): ${answered || 'None'} | CURRENT STATE: Active execution.`;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MemorySystem };
} else {
    window.MemorySystem = MemorySystem;
}

