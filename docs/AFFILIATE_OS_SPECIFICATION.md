# 🤝 AFFILIATE_OS_SPECIFICATION.md — Enterprise Affiliate 2.0 Engine

- **First-Party Cookie Attribution:** 30-day TTL cookie stored on visitor browser.
- **Server-to-Server Click Tracking:** `/api/affiliate/track` registers click with IP/UA hash.
- **Double-Entry Commission Invariant:** $20\%$ affiliate commission logged upon verified order payment.
- **Refund Invariant:** If order is refunded, `COMMISSION_REVERSAL` entry automatically deducts unvested earnings.
