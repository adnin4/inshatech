# Enterprise ERP: Production Deployment & Staging Governance Audit

**Deployment Paradigm:** Multi-Stage Docker Containers + PostgreSQL 16 + Redis 7  
**Config Files:** `Dockerfile`, `client/Dockerfile`, `docker-compose.prod.yml`, `.github/workflows/erp-ci.yml`, `scripts/backup_restore.sh`

---

## 1. Container Infrastructure Specification

1. **Backend Fastify API Container (`Dockerfile`)**:
   - Base: Node.js 22/26 Alpine Linux.
   - Non-root user: `erpuser` (UID 10001) for container security.
   - Multi-stage build separates TypeScript compilation artifacts from runtime container.
   - Built-in health check: `wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1`.
2. **Frontend React Vite Client Container (`client/Dockerfile`)**:
   - Stage 1: Node 22 Alpine runs `npm run build` producing static SPA assets.
   - Stage 2: Nginx 1.27 Alpine serves static files with SPA fallback (`try_files $uri $uri/ /index.html`).
   - Security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
3. **Orchestration (`docker-compose.prod.yml`)**:
   - Services: `erp-postgres` (PostgreSQL 16), `erp-redis` (Redis 7 Alpine), `erp-api` (Port 4000), `erp-client` (Port 80).
   - Network isolation: Internal bridge network `erp-internal-network`.
   - Volumes: Named persistent volumes `erp_pg_data` and `erp_redis_data`.

---

## 2. Staging Deployment Gate & Rules of Engagement

As strictly commanded:
- **Prohibition**: Never run `docker compose -f docker-compose.prod.yml up -d` directly against a live production host without completed staging verification.
- **Pre-Activation Checklist**:
  1. Image build verification (`docker compose build` exit code 0).
  2. Isolated staging database deployment and migration drill.
  3. Database backup and restore verification drill (`scripts/backup_restore.sh`).
  4. Staging health check (`/health` returns HTTP 200).
  5. Dedicated GitHub repository creation and CI execution.
