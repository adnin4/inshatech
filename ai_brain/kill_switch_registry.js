/**
 * IINSHA AI-BOS: Emergency Circuit Breaker & Kill Switch Registry
 *
 * Provides granular, fail-closed operational kill switches across all subsystems:
 * - SYSTEM_KILL
 * - AGENT_KILL
 * - PAYMENT_KILL
 * - PAYOUT_KILL
 * - DEPLOYMENT_KILL
 * - EXTERNAL_TOOL_KILL
 * - PIPELINE_KILL
 */

export const KILL_SWITCH_FLAGS = {
    SYSTEM_KILL: 'SYSTEM_KILL',
    AGENT_KILL: 'AGENT_KILL',
    PAYMENT_KILL: 'PAYOUT_KILL',
    PAYOUT_KILL: 'PAYOUT_KILL',
    DEPLOYMENT_KILL: 'DEPLOYMENT_KILL',
    EXTERNAL_TOOL_KILL: 'EXTERNAL_TOOL_KILL',
    PIPELINE_KILL: 'PIPELINE_KILL'
};

export class KillSwitchRegistry {
    constructor(initialState = {}) {
        this.switches = {
            SYSTEM_KILL: Boolean(initialState.SYSTEM_KILL),
            AGENT_KILL: Boolean(initialState.AGENT_KILL),
            PAYMENT_KILL: Boolean(initialState.PAYMENT_KILL),
            PAYOUT_KILL: Boolean(initialState.PAYOUT_KILL),
            DEPLOYMENT_KILL: Boolean(initialState.DEPLOYMENT_KILL),
            EXTERNAL_TOOL_KILL: Boolean(initialState.EXTERNAL_TOOL_KILL),
            PIPELINE_KILL: Boolean(initialState.PIPELINE_KILL)
        };
        this.auditLog = [];
    }

    activate(flag, actor = 'OWNER', reason = 'Emergency manual trigger') {
        if (this.switches.hasOwnProperty(flag)) {
            this.switches[flag] = true;
            const entry = {
                flag,
                state: 'ACTIVE',
                actor,
                reason,
                timestamp: new Date().toISOString()
            };
            this.auditLog.push(entry);
            console.warn(`🚨 EMERGENCY KILL SWITCH ENGAGED: [${flag}] by ${actor}. Reason: ${reason}`);
            return entry;
        }
        throw new Error(`Unknown kill switch flag: ${flag}`);
    }

    deactivate(flag, actor = 'OWNER', reason = 'Manual resumption authorization') {
        if (this.switches.hasOwnProperty(flag)) {
            this.switches[flag] = false;
            const entry = {
                flag,
                state: 'INACTIVE',
                actor,
                reason,
                timestamp: new Date().toISOString()
            };
            this.auditLog.push(entry);
            console.log(`✅ Kill switch disengaged: [${flag}] by ${actor}. Reason: ${reason}`);
            return entry;
        }
        throw new Error(`Unknown kill switch flag: ${flag}`);
    }

    isBlocked(flag) {
        if (this.switches.SYSTEM_KILL) return true;
        return Boolean(this.switches[flag]);
    }

    assertNotBlocked(flag, actionDescription = 'Operation') {
        if (this.isBlocked(flag)) {
            const err = new Error(`DENIED: [${flag}] kill switch is active. ${actionDescription} aborted.`);
            err.code = 'KILL_SWITCH_BLOCKED';
            throw err;
        }
    }

    getStatus() {
        return {
            ...this.switches,
            system_wide_healthy: !Object.values(this.switches).some(v => v === true)
        };
    }
}

export const defaultKillSwitch = new KillSwitchRegistry();
