# 🔐 IINSHA AI-BOS — AUTHENTICATION & RBAC PERMISSION MATRIX

**Standard:** OWASP ASVS 5.0 Level 2 + Timing-Safe HMAC SHA-256 Tokens  
**Zero-Bypass Policy:** Zero hardcoded passwords, zero auto-unlock buttons in UI.

---

## 14-ROLE HIERARCHY MATRIX

| Role Identifier | Base Permissions | Financial Payouts | Deployment Prod | System Kill Switch |
| :--- | :--- | :---: | :---: | :---: |
| `owner` | **ALL_PERMISSIONS** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| `super_admin` | Manage leads, services, CMS, agents | ❌ Approval Req | ✅ Allowed | ❌ Denied |
| `billing_admin` | View invoices, prepare payouts | ❌ Approval Req | ❌ Denied | ❌ Denied |
| `agent_supervisor` | Audit agent missions, inspect tools | ❌ Denied | ❌ Denied | ✅ Pause Only |
| `client` | View own portal, download deliverables | ❌ Denied | ❌ Denied | ❌ Denied |
| `partner` | View affiliate stats, request payout | ❌ Request Only | ❌ Denied | ❌ Denied |
