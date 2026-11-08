# 🔐 IINSHA AI-BOS — AUTHENTICATION & 14-ROLE RBAC MATRIX

**Standard:** OWASP ASVS 5.0 Level 2 Compliance  
**Token Format:** HMAC SHA-256 Timing-Safe Signed JWT Sessions  
**Zero-Bypass Policy:** Zero hardcoded passwords or 1-click auto unlock bypasses in code.

---

## 14-ROLE AUTHORIZATION MATRIX

| Role | Description | Payout Authorization | Production Deploy | Kill Switch |
| :--- | :--- | :---: | :---: | :---: |
| `owner` | Sovereign Business Owner | ✅ Full | ✅ Full | ✅ Full |
| `super_admin` | Technical Admin | ❌ Denied (L3 Req) | ✅ Allowed | ❌ Denied |
| `billing_admin` | Accounting & Invoicing | ❌ Denied (L3 Req) | ❌ Denied | ❌ Denied |
| `agent_supervisor`| AI Mission Auditor | ❌ Denied | ❌ Denied | ✅ Pause Only |
| `client` | Verified Customer | ❌ Denied | ❌ Denied | ❌ Denied |
| `partner` | Verified Affiliate | ❌ Request Only | ❌ Denied | ❌ Denied |
