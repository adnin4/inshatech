# IINSHATECH SYSTEM CHANGELOG

## [v1000.1] - 2026-08-09

### Added
- Created complete database-driven single source of truth architecture (`supabase_schema.sql` and `/supabase/migrations/`).
- Added Admin Auth Gateway Login Card with `🔓 Authenticate & Open Studio` and `⚡ 1-Click Master Super Admin Unlock`.
- Created automated GitHub Actions CI/CD deployment workflow (`.github/workflows/deploy.yml`).
- Added complete documentation suite in `/docs/` (`SYSTEM_AUDIT.md`, `ARCHITECTURE.md`, `DATABASE.md`, `SECURITY.md`, `PERFORMANCE.md`, `TESTING.md`, `DISASTER_RECOVERY.md`, `ADMIN_GUIDE.md`, `API.md`, `DEPLOYMENT.md`, `CHANGELOG.md`, `FINAL_VERIFICATION.md`).

### Fixed
- Fixed JS crash `ReferenceError: getServiceRegistry is not defined` in `app.js`.
- Fixed Cloudflare build failure caused by 47 MB zip file exceeding Workers 25 MB limit.
- Reduced deploy bundle size from 47 MB down to 4.65 KiB.
- Fixed browser and CDN caching by adding HTTP `no-cache` headers and asset version tags (`?v=1000.1`).
