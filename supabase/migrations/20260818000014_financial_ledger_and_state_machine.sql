-- ==============================================================================
-- IINSHA AI-BOS 2.0 — DOUBLE-ENTRY FINANCIAL LEDGER, STATE MACHINE & DLQ
-- Migration: 20260818000014_financial_ledger_and_state_machine.sql
-- ==============================================================================

-- 1. Double-Entry Immutable Financial Ledger
CREATE TABLE IF NOT EXISTS ibos_double_entry_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id),
    transaction_id VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- revenue, accounts_receivable, affiliate_payable, ai_compute_expense, infra_expense, refund_expense, net_margin
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    amount_usd DECIMAL(12, 4) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    reference_order_id UUID REFERENCES ibos_orders(id),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_tx ON ibos_double_entry_ledger(transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_account ON ibos_double_entry_ledger(account_type);

-- 2. Strict Order State Machine Transitions
CREATE TABLE IF NOT EXISTS ibos_order_state_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES ibos_orders(id) ON DELETE CASCADE,
    from_state VARCHAR(50) NOT NULL,
    to_state VARCHAR(50) NOT NULL,
    transitioned_by VARCHAR(100) NOT NULL, -- 'SYSTEM_WEBHOOK', 'OWNER_COMMAND', 'FULFILLMENT_ENGINE'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_transitions ON ibos_order_state_transitions(order_id, created_at);

-- 3. Webhook Idempotency Lock
CREATE TABLE IF NOT EXISTS ibos_processed_webhook_events (
    event_id VARCHAR(255) PRIMARY KEY,
    provider VARCHAR(50) NOT NULL, -- stripe, bkash, nagad, custom
    event_type VARCHAR(100) NOT NULL,
    payload_hash VARCHAR(64) NOT NULL,
    status VARCHAR(50) DEFAULT 'PROCESSED',
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cryptographically Chained Append-Only Audit Log
CREATE TABLE IF NOT EXISTS ibos_immutable_audit_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id),
    sequence_number BIGSERIAL UNIQUE,
    actor_id VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_seq ON ibos_immutable_audit_chain(sequence_number);

-- 5. Agent Versioning & Prompt Version Control
CREATE TABLE IF NOT EXISTS ibos_agent_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL, -- e.g. 'v1.0.0', 'v2.1.0'
    department VARCHAR(50) NOT NULL,
    system_prompt_template TEXT NOT NULL,
    prompt_hash VARCHAR(64) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    autonomy_level VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    change_reason TEXT,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agent_id, version)
);

-- 6. AI Evaluation Lab & Golden Benchmarks
CREATE TABLE IF NOT EXISTS ibos_ai_evaluations_golden (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eval_suite_name VARCHAR(100) NOT NULL,
    agent_id VARCHAR(50) NOT NULL,
    agent_version VARCHAR(20) NOT NULL,
    benchmark_dataset_id VARCHAR(100) NOT NULL,
    accuracy_score DECIMAL(5, 2) NOT NULL,
    hallucination_rate DECIMAL(5, 2) NOT NULL,
    policy_violations INT DEFAULT 0,
    avg_latency_ms INT DEFAULT 0,
    cost_per_task_usd DECIMAL(8, 5) DEFAULT 0.00000,
    passed_regression_gate BOOLEAN DEFAULT TRUE,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Dead Letter Queue (DLQ)
CREATE TABLE IF NOT EXISTS ibos_dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id),
    task_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    error_message TEXT NOT NULL,
    retry_count INT DEFAULT 3,
    status VARCHAR(50) DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, RETRIED, CANCELLED, RESOLVED
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);
