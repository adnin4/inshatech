# 06-auth-map.md — Authentication & Session Map

- **Algorithm:** HMAC-SHA256 with cryptographically generated salt
- **Side-Channel Defense:** `crypto.timingSafeEqual`
- **Rate Limit:** Token bucket 5 attempts / IP / minute
- **Token Expiry:** 24-Hour absolute TTL with fail-closed checks
