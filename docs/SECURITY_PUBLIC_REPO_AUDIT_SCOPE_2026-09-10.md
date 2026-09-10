# IINSHA AI-BOS — Public Repository Security Audit Scope

Date: 2026-09-10

## Finding

GitHub currently reports `adnin4/inshatech` as public. This repository contains application code, deployment workflows, Supabase integration references, Cloudflare deployment logic, and payment/agent-related code.

## Required audit

1. Current tree secret scan.
2. Git history scan, including deleted files and old commits.
3. Workflow and artifact exposure review.
4. Search for Supabase service-role credentials, Cloudflare tokens, provider API keys, webhook secrets, OAuth credentials, private certificates, and test credentials.
5. Review generated evidence/artifacts for secrets.
6. If a live credential was ever committed, rotate it before treating removal as remediation.

## Scope boundary

This document records an audit requirement. A clean code search does not certify Git history as secret-free. No credential should be copied into documentation, logs, issues, or test fixtures.
