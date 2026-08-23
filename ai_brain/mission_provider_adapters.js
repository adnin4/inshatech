/**
 * IINSHA AI-BOS — Mission Provider Adapters
 *
 * Provider-neutral adapters. Live behavior is enabled only when required
 * environment configuration is present and verification succeeds.
 */

import crypto from 'node:crypto';

function configured(name, required = []) {
  return Boolean(name) && required.every((key) => Boolean(process.env[key]));
}

export class NotConfiguredAdapter {
  constructor(type, provider, required = []) {
    this.type = type;
    this.provider = provider;
    this.required = required;
  }

  status() {
    return { status: 'NOT_CONFIGURED', type: this.type, provider: this.provider, required: this.required };
  }

  async anyAction() {
    return this.status();
  }
}

export class GenericJsonCrmAdapter {
  constructor({ baseUrl, apiKey, timeoutMs = 10000 } = {}) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
  }

  isConfigured() { return configured(this.baseUrl, []) && Boolean(this.apiKey); }

  async request(path, body) {
    if (!this.isConfigured()) return { status: 'NOT_CONFIGURED' };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(new URL(path, this.baseUrl), {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      return { status: response.ok ? 'SUCCESS' : 'FAILED', httpStatus: response.status, data };
    } finally { clearTimeout(timer); }
  }

  upsertOpportunity(opportunity) { return this.request('/opportunities/upsert', opportunity); }
  saveProposal(proposal) { return this.request('/proposals', proposal); }
}

export class GenericJsonPaymentAdapter {
  constructor({ checkoutUrl, webhookSecret } = {}) {
    this.checkoutUrl = checkoutUrl;
    this.webhookSecret = webhookSecret;
  }

  async createCheckout(order) {
    if (!this.checkoutUrl) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', message: 'Connect a provider-specific checkout implementation before live use', orderId: order?.id || null };
  }

  async verifyWebhook(event) {
    if (!this.webhookSecret || !event?.signature || !event?.rawBody) {
      return { verified: false, status: 'NOT_CONFIGURED' };
    }
    const expected = crypto.createHmac('sha256', this.webhookSecret).update(event.rawBody).digest('hex');
    return { verified: crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(event.signature))) };
  }

  async reconcile(event) {
    return { status: event?.status === 'PAID' ? 'PAID' : 'NOT_PAID', idempotencyKey: event?.idempotencyKey || null };
  }
}

export class GenericProjectWorkerAdapter {
  constructor({ endpoint, token } = {}) { this.endpoint = endpoint; this.token = token; }
  configured() { return Boolean(this.endpoint && this.token); }

  async createWorkspace(project) {
    if (!this.configured()) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', projectId: project?.id || null };
  }

  async runTask(task) {
    if (!this.configured()) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', taskId: task?.id || null };
  }
}

export class GenericQaAdapter {
  constructor({ endpoint, token } = {}) { this.endpoint = endpoint; this.token = token; }
  async runSuite({ project, suite } = {}) {
    if (!this.endpoint || !this.token) return { status: 'NOT_CONFIGURED', passed: false, confidence: 0, projectId: project?.id || null };
    return { status: 'CONFIGURED_NOT_VERIFIED', passed: false, confidence: 0, suite: suite || null };
  }
}

export class GenericDeliveryAdapter {
  constructor({ endpoint, token } = {}) { this.endpoint = endpoint; this.token = token; }
  async deploy(release) {
    if (!this.endpoint || !this.token) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', release };
  }
  async rollback(release) {
    if (!this.endpoint || !this.token) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', rollback: release };
  }
}

export class GenericSupportAdapter {
  constructor({ endpoint, token } = {}) { this.endpoint = endpoint; this.token = token; }
  async createCase(supportCase) {
    if (!this.endpoint || !this.token) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', supportCase };
  }
  async notify(message) {
    if (!this.endpoint || !this.token) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', messageId: message?.id || null };
  }
}

export class GenericNotificationAdapter {
  constructor({ endpoint, token } = {}) { this.endpoint = endpoint; this.token = token; }
  async send(notification) {
    if (!this.endpoint || !this.token) return { status: 'NOT_CONFIGURED' };
    return { status: 'CONFIGURED_NOT_VERIFIED', notification };
  }
}
