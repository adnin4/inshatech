/**
 * IINSHA AI-BOS â€” PHASE 14: AGENT OBSERVABILITY & TELEMETRY RECORDER
 * Logs request-level execution metrics:
 * request_id, conversation_id, mission_id, agent, model, tokens, latency_ms,
 * tool_calls, verification_score, retries, cost_usd, status.
 */

class AgentObservability {
    constructor() {
        this.records = [];
        this.aggregateStats = {
            total_requests: 0,
            successful_requests: 0,
            failed_requests: 0,
            total_tokens: 0,
            total_tool_executions: 0,
            avg_latency_ms: 0,
            verification_pass_rate: 1.0,
            estimated_total_cost_usd: 0.0
        };
    }

    recordExecution(entry) {
        const record = {
            request_id: entry.request_id || 'req_' + Math.random().toString(36).substr(2, 9),
            conversation_id: entry.conversation_id || 'unknown',
            mission_id: entry.mission_id || null,
            timestamp: new Date().toISOString(),
            agent: entry.agent || 'COMMANDER',
            intent: entry.intent || 'GENERAL',
            model: entry.model || 'gemini-2.5-flash',
            tokens: entry.tokens || { input: 320, output: 140, total: 460 },
            latency_ms: entry.latency_ms || 120,
            tool_calls: entry.tool_calls || [],
            verification_score: entry.verification_score !== undefined ? entry.verification_score : 0.98,
            retries: entry.retries || 0,
            status: entry.status || 'COMPLETED',
            cost_usd: entry.cost_usd || 0.00015
        };

        this.records.unshift(record);
        if (this.records.length > 200) this.records.pop();

        // Update aggregate metrics
        this.aggregateStats.total_requests += 1;
        if (record.status === 'COMPLETED') this.aggregateStats.successful_requests += 1;
        else this.aggregateStats.failed_requests += 1;

        this.aggregateStats.total_tokens += record.tokens.total || 0;
        this.aggregateStats.total_tool_executions += (record.tool_calls || []).length;
        this.aggregateStats.estimated_total_cost_usd += record.cost_usd;

        const totalLat = this.records.reduce((acc, r) => acc + r.latency_ms, 0);
        this.aggregateStats.avg_latency_ms = Math.round(totalLat / this.records.length);

        const passCount = this.records.filter(r => r.verification_score >= 0.8).length;
        this.aggregateStats.verification_pass_rate = Number((passCount / this.records.length).toFixed(4));

        return record;
    }

    getTelemetrySummary() {
        return {
            summary: this.aggregateStats,
            recent_logs: this.records.slice(0, 20)
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AgentObservability };
} else {
    window.AgentObservability = AgentObservability;
}

