---
name: iinsha-cloudflare-ops
description: Use for IINSHA Cloudflare Pages, Workers, Durable Objects, DNS, environment variables, secrets, deployment authority, runtime health, and rollback tasks.
---
# IINSHA Cloudflare Operations

## Discovery first
Inspect `wrangler.toml`, build output, Pages Functions, Worker source, production and preview environments, Pages Git integration, production branch, latest deployment, bindings, secret names (never values), routes, and rollback target.

Historical observations: Pages project `inshatech`; staging host `inshatech-b6b.pages.dev`; last observed staging SHA `74d90b14143e936587153464557a7e6d0f35fb9c`; `/api/version` and liveness returned 200; readiness and admin gate returned 503. Custom domains `inshatech.com` and `www.inshatech.com` served the legacy website. Recheck all items.

## Authority
- Use official Cloudflare docs MCP for current syntax.
- Keep account-control MCP disabled until the owner reviews account scope.
- Determine exactly one production deployment authority; preserve preview deployment behavior.
- Confirm the actual production Pages project and configured production branch. Do not infer these from repository files alone.

## Durable Objects
Verify class export, SQLite migrations, namespace, binding name, script name, environment, compatibility date, persistence, error paths, and cross-request/cross-isolate behavior. A local unit test does not prove live persistence.

## Deploy boundary
Never deploy production, change DNS, mutate secrets/bindings, or delete a resource without explicit owner approval and a verified rollback target. Prefer staging. Recheck `/api/version`, liveness, readiness, SRE health, and authenticated admin health after deployment. Match source/build/deployment/runtime SHA independently.
