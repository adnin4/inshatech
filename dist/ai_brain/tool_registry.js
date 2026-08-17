/**
 * IINSHA AI-BOS — PHASE 6 & 13: FORMAL TYPED TOOL REGISTRY & HITL SPECIFICATION
 * Contains 15 formal typed tool definitions with strict parameter schemas,
 * risk tiers (Level 0 - Level 3), timeouts, and approval policies.
 */

const TOOL_REGISTRY = [
    {
        name: 'web_search',
        description: 'Searches the web or enterprise knowledge index for grounded information with citation sources.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 10000,
        retry_policy: { max_retries: 2, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['query'],
            properties: {
                query: { type: 'string', description: 'Search term or query' },
                domain_filter: { type: 'string', description: 'Optional specific domain' }
            }
        },
        output_schema: {
            type: 'object',
            properties: {
                results: { type: 'array', items: { type: 'object' } },
                total_found: { type: 'number' }
            }
        }
    },
    {
        name: 'page_reader',
        description: 'Reads and extracts structured markdown text from a specific target URL.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 12000,
        retry_policy: { max_retries: 2, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['url'],
            properties: {
                url: { type: 'string', description: 'URL to read' }
            }
        }
    },
    {
        name: 'company_search',
        description: 'Queries verified company database by industry, employee count, and technology stack.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 8000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            required: ['industry'],
            properties: {
                industry: { type: 'string', description: 'Target industry e.g. B2B SaaS, Real Estate, Healthcare' },
                employee_range: { type: 'string', description: 'Headcount range e.g. 50-200, 10-50, 200+' },
                location: { type: 'string', description: 'Geographic location e.g. US, UK, Global' },
                limit: { type: 'number', description: 'Maximum companies to return' }
            }
        }
    },
    {
        name: 'lead_discovery',
        description: 'Discovers verified ICP decision-maker contacts with email, title, company, and confidence score.',
        risk_level: 'LEVEL_1',
        requires_approval: false,
        timeout: 15000,
        retry_policy: { max_retries: 2, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['industry', 'quantity'],
            properties: {
                industry: { type: 'string', description: 'Target niche or sector' },
                employee_range: { type: 'string', description: 'Target company size e.g. 50-200' },
                target_titles: { type: 'array', items: { type: 'string' }, description: 'e.g. VP Sales, Founder, CTO' },
                quantity: { type: 'number', description: 'Exact number of leads required' }
            }
        }
    },
    {
        name: 'lead_enrichment',
        description: 'Enriches lead records with MX domain verification, corporate revenue estimates, and tech stack.',
        risk_level: 'LEVEL_1',
        requires_approval: false,
        timeout: 10000,
        retry_policy: { max_retries: 2, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['leads'],
            properties: {
                leads: { type: 'array', items: { type: 'object' } }
            }
        }
    },
    {
        name: 'database_query',
        description: 'Executes a safe read-only SQL query against the Supabase PostgreSQL database.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 8000,
        retry_policy: { max_retries: 1, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            required: ['table'],
            properties: {
                table: { type: 'string', description: 'Target table name' },
                filter: { type: 'object', description: 'Query filter parameters' },
                limit: { type: 'number', description: 'Row limit' }
            }
        }
    },
    {
        name: 'crm_lookup',
        description: 'Looks up client missions, active deals, and order statuses in the CRM pipeline.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 6000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search term or Order ID' },
                stage: { type: 'string', description: 'Pipeline stage filter' }
            }
        }
    },
    {
        name: 'crm_update',
        description: 'Updates deal stage, notes, or assigned agent in the 12-Stage Mission Control CRM.',
        risk_level: 'LEVEL_2',
        requires_approval: true, // Level 2: Business-changing action
        timeout: 8000,
        retry_policy: { max_retries: 1, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['deal_id', 'stage_number'],
            properties: {
                deal_id: { type: 'string' },
                stage_number: { type: 'number' },
                notes: { type: 'string' }
            }
        }
    },
    {
        name: 'proposal_generator',
        description: 'Generates a formal turnkey SOW proposal with dual USD/BDT pricing, deliverables, and SLA.',
        risk_level: 'LEVEL_1',
        requires_approval: false,
        timeout: 6000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            required: ['package_name', 'client_name'],
            properties: {
                package_name: { type: 'string' },
                client_name: { type: 'string' },
                custom_requirements: { type: 'string' }
            }
        }
    },
    {
        name: 'email_draft',
        description: 'Drafts personalized outbound outreach emails with tailored value propositions.',
        risk_level: 'LEVEL_1',
        requires_approval: false,
        timeout: 6000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            required: ['lead_name', 'company', 'pain_point'],
            properties: {
                lead_name: { type: 'string' },
                company: { type: 'string' },
                pain_point: { type: 'string' },
                solution_offer: { type: 'string' }
            }
        }
    },
    {
        name: 'email_send',
        description: 'Transmits live outbound emails to external recipients via SMTP/SendGrid.',
        risk_level: 'LEVEL_2',
        requires_approval: true, // Level 2: External communication requires human approval
        timeout: 10000,
        retry_policy: { max_retries: 1, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['to', 'subject', 'body'],
            properties: {
                to: { type: 'string' },
                subject: { type: 'string' },
                body: { type: 'string' }
            }
        }
    },
    {
        name: 'n8n_trigger',
        description: 'Executes an automated n8n webhook workflow on the Hostinger VPS Docker cluster.',
        risk_level: 'LEVEL_2',
        requires_approval: false,
        timeout: 15000,
        retry_policy: { max_retries: 2, backoff_ms: 1000 },
        input_schema: {
            type: 'object',
            required: ['workflow_id', 'payload'],
            properties: {
                workflow_id: { type: 'string' },
                payload: { type: 'object' }
            }
        }
    },
    {
        name: 'workflow_status',
        description: 'Queries runtime telemetry and error states of self-hosted n8n workflows.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 6000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            properties: {
                workflow_id: { type: 'string' }
            }
        }
    },
    {
        name: 'analytics_query',
        description: 'Computes conversion rates, ROI metrics, affiliate commissions, and pipeline velocity.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 5000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            required: ['metric_type'],
            properties: {
                metric_type: { type: 'string', description: 'e.g. ROI, CONVERSIONS, AFFILIATE_LEDGER' }
            }
        }
    },
    {
        name: 'health_check',
        description: 'Performs diagnostics on Hostinger VPS Docker nodes, memory, disk, and API latency.',
        risk_level: 'LEVEL_0',
        requires_approval: false,
        timeout: 5000,
        retry_policy: { max_retries: 2, backoff_ms: 500 },
        input_schema: {
            type: 'object',
            properties: {
                node: { type: 'string', description: 'Node name or all' }
            }
        }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TOOL_REGISTRY };
} else {
    window.TOOL_REGISTRY = TOOL_REGISTRY;
}
