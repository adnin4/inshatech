-- Security hardening: durable webhook idempotency and audit invariants.
CREATE TABLE IF NOT EXISTS ibos_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(64) NOT NULL,
  event_type VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'processed',
  payload_hash VARCHAR(128),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ibos_webhook_events_provider_event ON ibos_webhook_events(provider,event_id);
ALTER TABLE ibos_webhook_events ENABLE ROW LEVEL SECURITY;
