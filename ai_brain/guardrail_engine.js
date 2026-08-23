/**
 * IINSHA Guardrail & Security Engine
 * Performs Pre-Execution Prompt Injection Defense and Post-Execution PII / Credential Redaction.
 */

export class GuardrailEngine {
    constructor() {
        this.injectionPatterns = [
            /ignore\s+(all\s+)?previous\s+instructions/i,
            /reveal\s+(system\s+)?prompt/i,
            /give\s+me\s+(admin\s+)?password/i,
            /bypass\s+security\s+policy/i,
            /drop\s+table/i,
            /rm\s+-rf/i,
            /service_role_key/i,
            /supabase_secret/i
        ];

        this.piiPatterns = [
            { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, label: '[REDACTED_EMAIL]' },
            { regex: /(?:\+?88)?01[3-9]\d{8}/g, label: '[REDACTED_PHONE]' },
            { regex: /sk_live_[a-zA-Z0-9]{24,}/g, label: '[REDACTED_STRIPE_KEY]' },
            { regex: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, label: '[REDACTED_JWT_TOKEN]' }
        ];
    }

    /**
     * Pre-execution prompt safety analysis
     * @param {string} promptInput
     */
    validatePrompt(promptInput) {
        if (!promptInput || typeof promptInput !== 'string') {
            return { isSafe: true, riskScore: 0 };
        }

        for (const pattern of this.injectionPatterns) {
            if (pattern.test(promptInput)) {
                return {
                    isSafe: false,
                    riskScore: 95,
                    reason: "Potential Prompt Injection or Unauthorized Access Pattern Detected",
                    action: "BLOCK"
                };
            }
        }

        return {
            isSafe: true,
            riskScore: 5,
            action: "ALLOW"
        };
    }

    /**
     * Post-execution output sanitization & PII redaction
     * @param {string} rawOutput
     */
    sanitizeOutput(rawOutput) {
        if (!rawOutput || typeof rawOutput !== 'string') {
            return rawOutput;
        }

        let sanitized = rawOutput;
        for (const { regex, label } of this.piiPatterns) {
            sanitized = sanitized.replace(regex, label);
        }

        return sanitized;
    }
}

