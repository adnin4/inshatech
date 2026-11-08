import assert from 'node:assert/strict';
import { ToolExecutionGateway } from '../ai_brain/tool_execution_gateway.js';
import { CrmAdapter } from '../ai_brain/adapters/crm_adapter.js';

const crm = new CrmAdapter({ supabaseUrl: '', supabaseServiceRoleKey: '' });
const notConfigured = await crm.syncLead({ name: 'Wave4 Test' });
assert.equal(notConfigured.status, 'NOT_CONFIGURED');
assert.equal(notConfigured.production_verified, false);

const gateway = new ToolExecutionGateway({ crmAdapter: crm });
const result = await gateway.execute({
    agent_id: 'SDR_AGENT',
    tool_id: 'create_crm_lead',
    arguments_payload: { name: 'Wave4 Test', email: 'test@example.invalid' },
    environment: 'TEST'
});
assert.equal(result.status, 'NOT_CONFIGURED');
assert.equal(result.production_verified, false);
assert.equal(result.blocked_from_success_claim, true);

const blocked = await gateway.execute({
    agent_id: 'CEO_AGENT',
    tool_id: 'drop_database_table',
    arguments_payload: {},
    environment: 'TEST'
});
assert.equal(blocked.status, 'BLOCKED');

console.log('Wave 4 adapter invariants: PASS');
