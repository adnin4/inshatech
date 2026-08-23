# 06_API_SECURITY_VERIFICATION.md — API Security & Abuse Defense

- **Rate Limiting:** IP-based token bucket on `/api/auth/session` (5 req/min, HTTP 429).
- **Payload Bomb Defense:** Bodies $> 100\text{KB}$ rejected with HTTP 413.
- **SQL Injection Scanning:** $100\%$ parameterized via PostgREST; 0 raw SQL vulnerabilities.
- **Status:** **LIVE_VERIFIED**
