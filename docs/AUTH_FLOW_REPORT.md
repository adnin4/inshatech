# 🔐 IINSHA AI-BOS — AUTHENTICATION FLOW REPORT

- **Session Gateway:** `/api/auth/session` issues HMAC SHA-256 JWT tokens.
- **Rate Limiting:** Max 5 attempts per IP per minute.
- **Zero Bypass:** 0 hardcoded credentials; 0 auto-unlock buttons.
