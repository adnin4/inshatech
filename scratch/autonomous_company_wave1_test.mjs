import assert from 'node:assert/strict';
import test from 'node:test';
import { LeadAcquisitionEngine } from '../ai_brain/lead_acquisition_engine.js';
import { LeadOutreachPolicy } from '../ai_brain/lead_outreach_policy.js';
import { MarginGuardian } from '../ai_brain/margin_guardian.js';

test('synthetic prospects can never become outreach eligible', () => {
  const engine = new LeadAcquisitionEngine();
  const prospect = engine.scoreProspect(
    engine.normalizeProspect({
      source_type: 'SYNTHETIC_DEMO',
      company_name: 'Demo Company',
      contact_email: 'demo@example.com'
    }),
    { icp_score: 100, intent_score: 100, pain_score: 100, budget_score: 100, timing_score: 100, service_fit_score: 100 }
  );

  const result = engine.qualifyForOutreach(prospect);
  assert.equal(result.eligible, false);
  assert.equal(result.reason, 'SYNTHETIC_DEMO_CANNOT_OUTREACH');
});

test('owner approval is required before autonomous outreach', () => {
  const policy = new LeadOutreachPolicy({ enabled: true });
  const result = policy.evaluate({
    prospect: { source_type: 'REAL', verification: { provider_verified: true } },
    channel: 'EMAIL',
    campaignApproved: false
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'OWNER_APPROVAL_REQUIRED');
});

test('unconfigured providers are truthful', async () => {
  const engine = new LeadAcquisitionEngine();
  const result = await engine.discover({ provider: 'missing-provider', query: 'test' });
  assert.equal(result.status, 'NOT_CONFIGURED');
  assert.deepEqual(result.prospects, []);
});

test('margin guardian accepts real server-side cost inputs', () => {
  const guardian = new MarginGuardian({ minimumMarginPercent: 50 });
  const result = guardian.auditDealProfitability({
    proposedPriceUSD: 1000,
    costs: {
      deliveryCostUSD: 200,
      aiComputeCostUSD: 50,
      affiliateCommissionUSD: 100,
      supportReserveUSD: 50,
      riskReserveUSD: 25
    }
  });

  assert.equal(result.financial_breakdown.totalCostOfDeliveryUSD, 425);
  assert.equal(result.financial_breakdown.grossProfitUSD, 575);
  assert.equal(result.policy_check.is_margin_safe, true);
});

console.log('IINSHA Autonomous Company Wave 1 tests passed.');
