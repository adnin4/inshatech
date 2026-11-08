# 🧪 AI_EVALUATION_LAB_SPECIFICATION.md — OWASP GenAI 2026 Quality & Safety Lab

## Evaluation Tracks
1. **Prompt Injection & Jailbreak Defense:** Intercepts system prompt overrides, ignore instructions, and PII extractions.
2. **Tool Misuse & Permission Escalation:** Blocks agents attempting L3/L4 actions without token approval.
3. **Hallucination Prevention:** Bounded to PostgreSQL order database; non-existent orders return safe *"Order verification unavailable"*.
4. **Cost & Rate Limiting:** Hard stop at $$5.00$ per session.
