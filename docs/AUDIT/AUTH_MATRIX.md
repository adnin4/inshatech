# 07_AUTH_MATRIX.md — Authentication & Session Verification Matrix

- **Session Token Algorithm:** HMAC-SHA256 with cryptographically random salt.
- **Verification Method:** `crypto.timingSafeEqual` to prevent side-channel timing attacks.
- **Brute Force Defense:** Token bucket rate limiting (5 requests per IP per minute).
- **Session Expiry:** Absolute expiration enforced at 24 hours; instant server-side revocation on logout.
