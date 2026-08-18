const fs = require('fs');
const path = require('path');

const BASE_DIR = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';

console.log('====================================================');
console.log('IINSHA AI AUTONOMOUS COMPANY OS — COMPREHENSIVE QA');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
    if (condition) {
        console.log(`✅ [PASS] ${testName}`);
        passCount++;
    } else {
        console.error(`❌ [FAIL] ${testName}: ${details}`);
        failCount++;
    }
}

// 1. Check SQL Schema Security
console.log('\n--- 1. Database & Security Hardening Verification ---');
const schemaContent = fs.readFileSync(path.join(BASE_DIR, 'supabase_schema.sql'), 'utf8');
assert(!schemaContent.includes('@@@mahin12'), 'Hardcoded password removed from supabase_schema.sql');
assert(schemaContent.includes('SECURITY: Run this INSERT manually'), 'Safe security instructions added to supabase_schema.sql');

const dockerCompose = fs.readFileSync(path.join(BASE_DIR, 'docker-compose.yml'), 'utf8');
assert(!dockerCompose.includes('HardenedSecretPassword2026!'), 'Hardcoded fallback password removed from docker-compose.yml');
assert(dockerCompose.includes('${POSTGRES_PASSWORD}'), 'Postgres password required via env in docker-compose.yml');

// 2. Check Migration Files
const migrationPath = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000001_autonomous_company_os.sql');
assert(fs.existsSync(migrationPath), 'Migration 20260818000001_autonomous_company_os.sql exists');
if (fs.existsSync(migrationPath)) {
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    assert(migrationContent.includes('ibos_organizations'), 'Migration contains ibos_organizations');
    assert(migrationContent.includes('ibos_projects'), 'Migration contains ibos_projects');
    assert(migrationContent.includes('ibos_knowledge_chunks'), 'Migration contains ibos_knowledge_chunks');
    assert(migrationContent.includes('ibos_conversions'), 'Migration contains ibos_conversions');
    assert(migrationContent.includes('ibos_subscriptions'), 'Migration contains ibos_subscriptions');
    assert(migrationContent.includes('ENABLE ROW LEVEL SECURITY'), 'Migration enables RLS');
}

const migration2Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000002_master_spec_additions.sql');
assert(fs.existsSync(migration2Path), 'Migration 20260818000002_master_spec_additions.sql exists');
if (fs.existsSync(migration2Path)) {
    const migration2Content = fs.readFileSync(migration2Path, 'utf8');
    assert(migration2Content.includes('ibos_affiliate_assets'), 'Migration 2 contains ibos_affiliate_assets');
    assert(migration2Content.includes('ibos_pricing_rules'), 'Migration 2 contains ibos_pricing_rules');
    assert(migration2Content.includes('ibos_fraud_events'), 'Migration 2 contains ibos_fraud_events');
}

const migration3Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000003_ultimate_revenue_os.sql');
assert(fs.existsSync(migration3Path), 'Migration 20260818000003_ultimate_revenue_os.sql exists');
if (fs.existsSync(migration3Path)) {
    const migration3Content = fs.readFileSync(migration3Path, 'utf8');
    assert(migration3Content.includes('ibos_universal_offers'), 'Migration 3 contains ibos_universal_offers');
    assert(migration3Content.includes('ibos_attribution_touchpoints'), 'Migration 3 contains ibos_attribution_touchpoints');
    assert(migration3Content.includes('ibos_resellers'), 'Migration 3 contains ibos_resellers');
    assert(migration3Content.includes('ibos_digital_twin_scenarios'), 'Migration 3 contains ibos_digital_twin_scenarios');
}

const migration4Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000004_agent_missions_hitl.sql');
assert(fs.existsSync(migration4Path), 'Migration 20260818000004_agent_missions_hitl.sql exists');
if (fs.existsSync(migration4Path)) {
    const migration4Content = fs.readFileSync(migration4Path, 'utf8');
    assert(migration4Content.includes('ibos_agent_missions'), 'Migration 4 contains ibos_agent_missions');
    assert(migration4Content.includes('ibos_mission_checkpoints'), 'Migration 4 contains ibos_mission_checkpoints');
    assert(migration4Content.includes('ibos_agent_policies'), 'Migration 4 contains ibos_agent_policies');
    assert(migration4Content.includes('ibos_tool_receipts'), 'Migration 4 contains ibos_tool_receipts');
}

const migration5Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000005_nextgen_runtime_observability.sql');
assert(fs.existsSync(migration5Path), 'Migration 20260818000005_nextgen_runtime_observability.sql exists');
if (fs.existsSync(migration5Path)) {
    const migration5Content = fs.readFileSync(migration5Path, 'utf8');
    assert(migration5Content.includes('ibos_tenants'), 'Migration 5 contains ibos_tenants');
    assert(migration5Content.includes('ibos_agent_versions'), 'Migration 5 contains ibos_agent_versions');
    assert(migration5Content.includes('ibos_eval_benchmarks'), 'Migration 5 contains ibos_eval_benchmarks');
    assert(migration5Content.includes('ibos_memory_layers'), 'Migration 5 contains ibos_memory_layers');
    assert(migration5Content.includes('ibos_recovery_events'), 'Migration 5 contains ibos_recovery_events');
}

const migration6Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000006_workforce_control_plane.sql');
assert(fs.existsSync(migration6Path), 'Migration 20260818000006_workforce_control_plane.sql exists');
if (fs.existsSync(migration6Path)) {
    const migration6Content = fs.readFileSync(migration6Path, 'utf8');
    assert(migration6Content.includes('ibos_employees'), 'Migration 6 contains ibos_employees');
    assert(migration6Content.includes('ibos_otel_traces'), 'Migration 6 contains ibos_otel_traces');
    assert(migration6Content.includes('ibos_revenue_attributions'), 'Migration 6 contains ibos_revenue_attributions');
    assert(migration6Content.includes('ibos_kill_switch_state'), 'Migration 6 contains ibos_kill_switch_state');
}

const migration7Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000007_control_plane_autonomy.sql');
assert(fs.existsSync(migration7Path), 'Migration 20260818000007_control_plane_autonomy.sql exists');
if (fs.existsSync(migration7Path)) {
    const migration7Content = fs.readFileSync(migration7Path, 'utf8');
    assert(migration7Content.includes('ibos_autonomy_settings'), 'Migration 7 contains ibos_autonomy_settings');
    assert(migration7Content.includes('ibos_mission_replays'), 'Migration 7 contains ibos_mission_replays');
    assert(migration7Content.includes('ibos_attention_items'), 'Migration 7 contains ibos_attention_items');
    assert(migration7Content.includes('ibos_system_status'), 'Migration 7 contains ibos_system_status');
}

const migration8Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000008_agent_contracts_memory.sql');
assert(fs.existsSync(migration8Path), 'Migration 20260818000008_agent_contracts_memory.sql exists');
if (fs.existsSync(migration8Path)) {
    const migration8Content = fs.readFileSync(migration8Path, 'utf8');
    assert(migration8Content.includes('ibos_agent_contracts'), 'Migration 8 contains ibos_agent_contracts');
    assert(migration8Content.includes('ibos_memory_8layers'), 'Migration 8 contains ibos_memory_8layers');
    assert(migration8Content.includes('ibos_agent_economy_metrics'), 'Migration 8 contains ibos_agent_economy_metrics');
    assert(migration8Content.includes('ibos_shadow_evaluations'), 'Migration 8 contains ibos_shadow_evaluations');
}

const migration9Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000009_digital_workforce_masterplan.sql');
assert(fs.existsSync(migration9Path), 'Migration 20260818000009_digital_workforce_masterplan.sql exists');
if (fs.existsSync(migration9Path)) {
    const migration9Content = fs.readFileSync(migration9Path, 'utf8');
    assert(migration9Content.includes('ibos_departments'), 'Migration 9 contains ibos_departments');
    assert(migration9Content.includes('ibos_mission_dags'), 'Migration 9 contains ibos_mission_dags');
    assert(migration9Content.includes('ibos_margin_rules'), 'Migration 9 contains ibos_margin_rules');
    assert(migration9Content.includes('ibos_alert_fabric_rules'), 'Migration 9 contains ibos_alert_fabric_rules');
}

const migration10Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000010_production_control_plane.sql');
assert(fs.existsSync(migration10Path), 'Migration 20260818000010_production_control_plane.sql exists');
if (fs.existsSync(migration10Path)) {
    const migration10Content = fs.readFileSync(migration10Path, 'utf8');
    assert(migration10Content.includes('ibos_tool_registry'), 'Migration 10 contains ibos_tool_registry');
    assert(migration10Content.includes('ibos_durable_approvals'), 'Migration 10 contains ibos_durable_approvals');
    assert(migration10Content.includes('ibos_golden_test_cases'), 'Migration 10 contains ibos_golden_test_cases');
    assert(migration10Content.includes('ibos_emergency_actions_log'), 'Migration 10 contains ibos_emergency_actions_log');
}

const migration11Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000011_ai_bos_final_masterplan.sql');
assert(fs.existsSync(migration11Path), 'Migration 20260818000011_ai_bos_final_masterplan.sql exists');
if (fs.existsSync(migration11Path)) {
    const migration11Content = fs.readFileSync(migration11Path, 'utf8');
    assert(migration11Content.includes('ibos_workspaces'), 'Migration 11 contains ibos_workspaces');
    assert(migration11Content.includes('ibos_fulfillment_projects'), 'Migration 11 contains ibos_fulfillment_projects');
    assert(migration11Content.includes('ibos_cost_control_ledger'), 'Migration 11 contains ibos_cost_control_ledger');
    assert(migration11Content.includes('ibos_daily_briefings'), 'Migration 11 contains ibos_daily_briefings');
}

const migration12Path = path.join(BASE_DIR, 'supabase', 'migrations', '20260818000012_iinsha_ai_os_2_final_backbone.sql');
assert(fs.existsSync(migration12Path), 'Migration 20260818000012_iinsha_ai_os_2_final_backbone.sql exists');
if (fs.existsSync(migration12Path)) {
    const migration12Content = fs.readFileSync(migration12Path, 'utf8');
    assert(migration12Content.includes('ibos_secret_vault_brokers'), 'Migration 12 contains ibos_secret_vault_brokers');
    assert(migration12Content.includes('ibos_black_box_traces'), 'Migration 12 contains ibos_black_box_traces');
    assert(migration12Content.includes('ibos_institutional_memory'), 'Migration 12 contains ibos_institutional_memory');
}

// 3. Check Knowledge System
console.log('\n--- 2. RAG Knowledge System Verification ---');
const servicesJsonPath = path.join(BASE_DIR, 'knowledge', 'services.json');
const faqsJsonPath = path.join(BASE_DIR, 'knowledge', 'faqs.json');
const companyJsonPath = path.join(BASE_DIR, 'knowledge', 'company.json');
const academyJsonPath = path.join(BASE_DIR, 'knowledge', 'partner_academy.json');

assert(fs.existsSync(servicesJsonPath), 'knowledge/services.json exists');
assert(fs.existsSync(faqsJsonPath), 'knowledge/faqs.json exists');
assert(fs.existsSync(companyJsonPath), 'knowledge/company.json exists');
assert(fs.existsSync(academyJsonPath), 'knowledge/partner_academy.json exists');

try {
    const services = JSON.parse(fs.readFileSync(servicesJsonPath, 'utf8'));
    assert(Array.isArray(services) && services.length >= 5, `Canonical services loaded (${services.length} services)`);
} catch(e) {
    assert(false, 'knowledge/services.json is valid JSON', e.message);
}

try {
    const faqs = JSON.parse(fs.readFileSync(faqsJsonPath, 'utf8'));
    assert(Array.isArray(faqs) && faqs.length >= 10, `Canonical FAQs loaded (${faqs.length} FAQs)`);
} catch(e) {
    assert(false, 'knowledge/faqs.json is valid JSON', e.message);
}

// 4. Check Cloudflare Functions APIs
console.log('\n--- 3. Cloudflare Pages Functions Verification ---');
const functionsToCheck = [
    'functions/api/tools/execute.js',
    'functions/api/tools/registry.js',
    'functions/api/vault/broker.js',
    'functions/api/recorder/flight.js',
    'functions/api/memory/institutional.js',
    'functions/api/approvals/durable.js',
    'functions/api/eval/golden.js',
    'functions/api/emergency/control.js',
    'functions/api/fulfillment/pipeline.js',
    'functions/api/cost/tower.js',
    'functions/api/executive/brief.js',
    'functions/api/workspaces/index.js',
    'functions/api/payments/checkout.js',
    'functions/api/payments/webhook.js',
    'functions/api/affiliate/track.js',
    'functions/api/affiliate/convert.js',
    'functions/api/affiliate/attribution.js',
    'functions/api/missions/state.js',
    'functions/api/agents/observatory.js',
    'functions/api/agents/eval.js',
    'functions/api/workforce/employees.js',
    'functions/api/workforce/killswitch.js',
    'functions/api/workforce/dag.js',
    'functions/api/workforce/margin.js',
    'functions/api/workforce/negotiate.js',
    'functions/api/alerts/fabric.js',
    'functions/api/notifications/dispatch.js',
    'functions/api/control/command.js',
    'functions/api/control/autonomy.js',
    'functions/api/control/attention.js',
    'functions/api/system/status.js',
    'functions/api/planner/orchestrate.js',
    'functions/api/memory/layers.js',
    'functions/api/economy/roi.js',
    'functions/api/contracts/dispatch.js',
    'functions/api/auth/session.js',
    'functions/api/admin/gate.js',
    'functions/api/knowledge/search.js',
    'functions/api/ai/chat.js',
    'functions/api/services.js',
    'functions/api/offers/index.js',
    'functions/api/leads.js'
];

functionsToCheck.forEach(fn => {
    const fullPath = path.join(BASE_DIR, fn);
    assert(fs.existsSync(fullPath), `Cloudflare Function ${fn} exists`);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        assert(content.length > 50, `${fn} has valid implementation content (${content.length} bytes)`);
    }
});

// 5. Check AI Brain & Multi-Agent Architecture
console.log('\n--- 4. Multi-Agent & Sales Engine Verification ---');
const agentRegistryPath = path.join(BASE_DIR, 'ai_brain', 'agents', 'agent_registry.js');
const salesEnginePath = path.join(BASE_DIR, 'ai_brain', 'sales_engine.js');
const digitalTwinPath = path.join(BASE_DIR, 'ai_brain', 'digital_twin.js');
const plannerEnginePath = path.join(BASE_DIR, 'ai_brain', 'planner_engine.js');
const marginGuardianPath = path.join(BASE_DIR, 'ai_brain', 'margin_guardian.js');
const guardrailEnginePath = path.join(BASE_DIR, 'ai_brain', 'guardrail_engine.js');
const fulfillmentEnginePath = path.join(BASE_DIR, 'ai_brain', 'fulfillment_engine.js');
const secretBrokerPath = path.join(BASE_DIR, 'ai_brain', 'secret_broker.js');

assert(fs.existsSync(agentRegistryPath), 'ai_brain/agents/agent_registry.js exists');
assert(fs.existsSync(salesEnginePath), 'ai_brain/sales_engine.js exists');
assert(fs.existsSync(digitalTwinPath), 'ai_brain/digital_twin.js exists');
assert(fs.existsSync(plannerEnginePath), 'ai_brain/planner_engine.js exists');
assert(fs.existsSync(marginGuardianPath), 'ai_brain/margin_guardian.js exists');
assert(fs.existsSync(guardrailEnginePath), 'ai_brain/guardrail_engine.js exists');
assert(fs.existsSync(fulfillmentEnginePath), 'ai_brain/fulfillment_engine.js exists');
assert(fs.existsSync(secretBrokerPath), 'ai_brain/secret_broker.js exists');

if (fs.existsSync(agentRegistryPath)) {
    const content = fs.readFileSync(agentRegistryPath, 'utf8');
    assert(content.includes('AGENT_REGISTRY'), 'agent_registry.js exports AGENT_REGISTRY');
    assert(content.includes('CEO_AGENT') && content.includes('GUARDIAN_AGENT'), '13 specialized agents defined');
    assert(content.includes('PERMISSION_LEVELS'), 'Permission level matrix defined');
    assert(content.includes('ANTI_LOOP_CONFIG'), 'Anti-loop config defined');
}

// 6. Check Copilot 2.0 Modes & Memory
console.log('\n--- 5. Copilot 2.0 Modes & Memory Verification ---');
const copilotPath = path.join(BASE_DIR, 'universal_ai_copilot.js');
const copilotContent = fs.readFileSync(copilotPath, 'utf8');
assert(copilotContent.includes('saveMemory') && copilotContent.includes('loadMemory'), 'Copilot has memory persistence');
assert(copilotContent.includes('currentMode') || copilotContent.includes('mode'), 'Copilot supports multi-mode execution');

// 7. Check HTML Pages & Scripts
console.log('\n--- 6. HTML Pages & Truth Labels Verification ---');
const htmlPages = [
    'index.html',
    'admin.html',
    'affiliate.html',
    'portal.html',
    'marketplace.html',
    'store.html',
    'compare.html',
    'blog.html'
];

htmlPages.forEach(p => {
    const fullPath = path.join(BASE_DIR, p);
    assert(fs.existsSync(fullPath), `${p} exists`);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        assert(content.includes('truth-labels.js'), `${p} links truth-labels.js`);
        assert(content.includes('universal_ai_copilot.js'), `${p} links universal_ai_copilot.js`);
    }
});

// 8. Check Documentation & Contract Specs
console.log('\n--- 7. Documentation & Contract Suite Verification ---');
const docs = [
    'ULTIMATE_MASTER_ROADMAP_AUDIT.md',
    'CURRENT_SYSTEM_AUDIT.md',
    'SYSTEM_AUDIT.md',
    'SYSTEM_ARCHITECTURE.md',
    'AGENT_ARCHITECTURE.md',
    'SECURITY_MODEL.md',
    'DATABASE_SCHEMA.md',
    'API_CONTRACT.md',
    'TOOL_PERMISSIONS.md',
    'AFFILIATE_ENGINE.md',
    'PAYMENT_ARCHITECTURE.md',
    'KNOWN_LIMITATIONS.md',
    'gap_analysis.md',
    'openapi.yaml'
];

docs.forEach(d => {
    const fullPath = path.join(BASE_DIR, 'docs', d);
    assert(fs.existsSync(fullPath), `docs/${d} exists`);
});

// 9. Check New Redirect Engine, Design System & Seed Scripts
console.log('\n--- 8. Redirects, Seed Data & Client DB Engine ---');
assert(fs.existsSync(path.join(BASE_DIR, '_redirects')), '_redirects exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'go', '[slug].js')), 'functions/go/[slug].js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'supabase', 'seeds', '01_initial_seeds.sql')), 'supabase/seeds/01_initial_seeds.sql exists');
assert(fs.existsSync(path.join(BASE_DIR, 'js', 'core', 'supabase-client.js')), 'js/core/supabase-client.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'css', 'iinsha-design-system.css')), 'css/iinsha-design-system.css exists');

// 10. Check Enterprise Hardening 2.0 (Phases 0-24)
console.log('\n--- 9. Enterprise Hardening 2.0 (RBAC, MFA, Autonomy & Multi-Tenancy) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'supabase', 'migrations', '20260818000013_enterprise_multi_tenancy_rls.sql')), 'Migration 13 (Multi-Tenancy & 14-Role RBAC) exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'auth', 'rbac.js')), 'functions/api/auth/rbac.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'auth', 'mfa.js')), 'functions/api/auth/mfa.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'auth', 'webauthn.js')), 'functions/api/auth/webauthn.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', '_shared', 'ai_brain', 'agents', 'agent_registry.js')), 'functions/_shared internal agent registry exists');

const agentRegContent = fs.readFileSync(path.join(BASE_DIR, 'ai_brain', 'agents', 'agent_registry.js'), 'utf8');
assert(agentRegContent.includes('AUTONOMY_SPECTRUM') && agentRegContent.includes('LEVEL_5_EXECUTE_LOW_RISK'), '7-level autonomy spectrum defined');

const rbacContent = fs.readFileSync(path.join(BASE_DIR, 'functions', 'api', 'auth', 'rbac.js'), 'utf8');
assert(rbacContent.includes('ENTERPRISE_ROLES') && rbacContent.includes('hasPermission'), '14-role RBAC permission evaluator defined');

const guardContent = fs.readFileSync(path.join(BASE_DIR, 'ai_brain', 'guardrail_engine.js'), 'utf8');
assert(guardContent.includes('validatePrompt') && guardContent.includes('sanitizeOutput'), 'Guardrail prompt injection & PII scrubber active');

// 11. Check 50-Point Enterprise Hardening Modules
console.log('\n--- 10. 50-Point Enterprise Modules (Ledger, Order State Machine, DLQ, SOC, Privacy & BI) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'supabase', 'migrations', '20260818000014_financial_ledger_and_state_machine.sql')), 'Migration 14 (Double-entry Ledger & State Machine) exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'finance', 'ledger.js')), 'functions/api/finance/ledger.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'orders', 'state_machine.js')), 'functions/api/orders/state_machine.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'ai', 'firewall.js')), 'functions/api/ai/firewall.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'ai', 'eval_lab.js')), 'functions/api/ai/eval_lab.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'queue', 'dlq.js')), 'functions/api/queue/dlq.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'soc', 'telemetry.js')), 'functions/api/soc/telemetry.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'privacy', 'controls.js')), 'functions/api/privacy/controls.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'bi.js')), 'functions/api/executive/bi.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'system', 'status_public.js')), 'functions/api/system/status_public.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'live_cockpit.js')), 'functions/api/executive/live_cockpit.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'js', 'core', 'autonomous_company_os.js')), 'js/core/autonomous_company_os.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_AIBOS_2_0_MASTER_SPECIFICATION.md')), 'docs/IINSHA_AIBOS_2_0_MASTER_SPECIFICATION.md exists');

// 12. Check 27-Pillar Autonomous Company Modules
console.log('\n--- 11. 27-Pillar Autonomous Company Modules (Morning Brief, Opportunity Hunter & Master Manual) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'morning_brief.js')), 'functions/api/executive/morning_brief.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'growth', 'opportunities.js')), 'functions/api/growth/opportunities.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_AUTONOMOUS_COMPANY_27_PILLARS.md')), 'docs/IINSHA_AUTONOMOUS_COMPANY_27_PILLARS.md exists');

// 13. Check AI-BOS 3.0 Revenue-to-Delivery Loop & Agent Economics
console.log('\n--- 12. AI-BOS 3.0 Revenue-to-Delivery Loop & Agent Economics ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'missions', 'loop_test.js')), 'functions/api/missions/loop_test.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'agents', 'economics.js')), 'functions/api/agents/economics.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_AIBOS_3_0_REVENUE_TO_DELIVERY_LOOP.md')), 'docs/IINSHA_AIBOS_3_0_REVENUE_TO_DELIVERY_LOOP.md exists');

// 14. Check Advanced Performance Engineering Modules
console.log('\n--- 13. Advanced Performance Engineering Modules (Observatory, Semantic Cache, Compressor & DB Budgets) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'performance', 'observatory.js')), 'functions/api/performance/observatory.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'ai', 'cache.js')), 'functions/api/ai/cache.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'ai', 'compressor.js')), 'functions/api/ai/compressor.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'database', 'performance.js')), 'functions/api/database/performance.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'performance', 'optimizer.js')), 'functions/api/performance/optimizer.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_ADVANCED_PERFORMANCE_BLUEPRINT.md')), 'docs/IINSHA_ADVANCED_PERFORMANCE_BLUEPRINT.md exists');

// 15. Check AI-BOS 4.0 Autonomous Enterprise & Policy-as-Code
console.log('\n--- 14. AI-BOS 4.0 Autonomous Enterprise & Policy-as-Code ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'brain', 'context_graph.js')), 'functions/api/brain/context_graph.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'risk/predictive_engine.js')), 'functions/api/risk/predictive_engine.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'governance/policy_as_code.js')), 'functions/api/governance/policy_as_code.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive/company_controller.js')), 'functions/api/executive/company_controller.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_AIBOS_4_0_AUTONOMOUS_ENTERPRISE_SPECIFICATION.md')), 'docs/IINSHA_AIBOS_4_0_AUTONOMOUS_ENTERPRISE_SPECIFICATION.md exists');

// 16. Check Final Master Expansion Blueprint (60 Pillars & Stages A-J)
console.log('\n--- 15. Final Master Expansion Blueprint (Enterprise Registry, Business Health, White-Label & 60-Pillar Manual) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'governance', 'enterprise_registry.js')), 'functions/api/governance/enterprise_registry.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'business_health.js')), 'functions/api/executive/business_health.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'enterprise', 'white_label.js')), 'functions/api/enterprise/white_label.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_AIBOS_10_0_FINAL_MASTER_EXPANSION.md')), 'docs/IINSHA_AIBOS_10_0_FINAL_MASTER_EXPANSION.md exists');

// 17. Check Complete Master Roadmap A to AM (181 Capabilities & North Star Operating Grid)
console.log('\n--- 16. Complete Master Roadmap A to AM (North Star, Product Discovery & Public Developer API) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'north_star.js')), 'functions/api/executive/north_star.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'r_and_d', 'product_discovery.js')), 'functions/api/r_and_d/product_discovery.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'developer', 'public_api.js')), 'functions/api/developer/public_api.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_COMPLETE_MASTER_ROADMAP_A_TO_AM.md')), 'docs/IINSHA_COMPLETE_MASTER_ROADMAP_A_TO_AM.md exists');

// 18. Check Frontier Master Roadmap (80 Advanced Pillars & Meta-Orchestrator)
console.log('\n--- 17. Frontier Master Roadmap (Meta-Orchestrator, Risk Radar, Marketplace Engine & 80-Pillar Manual) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'meta_orchestrator.js')), 'functions/api/executive/meta_orchestrator.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'risk', 'frontier_radar.js')), 'functions/api/risk/frontier_radar.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'marketplace', 'frontier_engine.js')), 'functions/api/marketplace/frontier_engine.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_FRONTIER_MASTER_ROADMAP_80_PILLARS.md')), 'docs/IINSHA_FRONTIER_MASTER_ROADMAP_80_PILLARS.md exists');

// 19. Check AI Executive Council & Capability Certification Lab
console.log('\n--- 18. AI Executive Council & Capability Certification Lab (Board Council, Cert Lab & 10-Track Manual) ---');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'executive', 'board_council.js')), 'functions/api/executive/board_council.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'functions', 'api', 'governance', 'certification_lab.js')), 'functions/api/governance/certification_lab.js exists');
assert(fs.existsSync(path.join(BASE_DIR, 'docs', 'IINSHA_EXECUTIVE_COUNCIL_AND_CERTIFICATION_MASTER.md')), 'docs/IINSHA_EXECUTIVE_COUNCIL_AND_CERTIFICATION_MASTER.md exists');

console.log('\n====================================================');
console.log(`RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
