# 📋 FINAL_ACTIVATION_AND_EVIDENCE_CONTRACT.md — Activation & Evidence Contract

## 📌 1. Scope & Objective
This contract establishes the mandatory 6-step operational lifecycle and evidence requirements for PR #5 (`feat/final-activation-gates`) transitioning IINSHA AI-BOS to an evidence-backed autonomous digital company.

---

## 🔒 2. Mandatory 6-Step Capability Execution Contract
$$\mathbf{ADAPTER \longrightarrow POLICY \longrightarrow EXECUTION \longrightarrow RECEIPT \longrightarrow EVIDENCE \longrightarrow TEST \longrightarrow PRODUCTION\text{ }VERIFICATION}$$

1. **Adapter:** Provider-neutral interface. Returns `NOT_CONFIGURED` if live keys are missing.
2. **Policy Decision:** Evaluated by Policy Engine (Risk Tier L0–L4).
3. **Execution:** Sandboxed execution via Tool Execution Gateway.
4. **Receipt:** Cryptographically hashed execution receipt generated.
5. **Evidence:** Telemetry, logs, and database record persisted.
6. **Test & Production Verification:** Runtime assertion and owner sign-off.

---

## 🛡️ 3. Full Autonomous Business Regression Loop
$$\mathbf{REAL\text{ }LEAD \longrightarrow QUALIFY \longrightarrow PROPOSAL \longrightarrow PAYMENT \longrightarrow SETTLEMENT \longrightarrow PROJECT \longrightarrow PLANNING \longrightarrow EXECUTION \longrightarrow QA \longrightarrow CLIENT\text{ }REVIEW \longrightarrow APPROVAL \longrightarrow OWNER\text{ }DELIVERY\text{ }APPROVAL \longrightarrow DELIVERY \longrightarrow LEARNING \longrightarrow BENCHMARK \longrightarrow OWNER\text{ }SKILL\text{ }APPROVAL}$$

---

## 🛑 4. Non-Negotiable Invariants
- **Failed QA (< 0.95 confidence):** Strictly blocked from client review and production delivery.
- **Production Delivery:** Strictly blocked without explicit Owner L3 approval.
- **Learning Promotion:** Experience records cannot mutate production skills without Benchmark (>= 0.90) and Owner sign-off.
- **Synthetic Data:** Strictly quarantined under `SYNTHETIC_DEMO` flag; prohibited from outbound marketing.
