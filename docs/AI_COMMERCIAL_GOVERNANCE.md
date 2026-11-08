# 🤖 AI_COMMERCIAL_GOVERNANCE.md — Phase 23 AI Commercial Controls

## Cost, Safety & Reliability Guardrails
1. **Budget Enforcement:** Hard session cap of $$5.00$ USD and monthly organization quotas.
2. **Prompt Injection Defense:** OWASP GenAI 2026 regex interceptor in `universal_ai_copilot.js`.
3. **5-Tier Bounded Tool PDP:** Scoped capability tokens in `/api/ai/tool-broker`.
4. **Sovereign Kill-Switch:** Instant revocation of all tool execution tokens via `admin.html`.
5. **Model Fallback Chain:** Gemini 2.0 Flash $\rightarrow$ Gemini 1.5 Pro $\rightarrow$ Client-side Rule Engine.
