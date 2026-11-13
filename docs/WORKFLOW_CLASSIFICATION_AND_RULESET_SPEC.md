# IINSHA AI-BOS: WORKFLOW CLASSIFICATION & GITHUB RULESET SPECIFICATION

## 1. Executive Summary
This document establishes the official classification matrix for all GitHub Actions workflows in `adnin4/inshatech`.
Before enabling strict branch protection rulesets on `master`, check names must be uniquely and deterministically categorized to avoid blocking merges on auxiliary, redundant, or diagnostic jobs.

---

## 2. Workflow Classification Matrix

| Workflow File | Workflow Name (`name:`) | Category | Required for Master Merge? | Primary Responsibility |
|:---|:---|:---|:---:|:---|
| `.github/workflows/ci.yml` | `IINSHA AI-BOS Master Production CI` | **CANONICAL_PRIMARY** | **YES** | Master test matrix (syntax, security, E2E, browser, SLO) |
| `.github/workflows/ci-fast.yml` | `CI Fast (Syntax, Token Baselines & Static Contracts)` | **CANONICAL_GATE** | **YES** | Fast syntax check & Gate 0 visual baseline firewall |
| `.github/workflows/ci-security.yml` | `CI Security (Injection, Direct DB & Tenant Isolation)` | **CANONICAL_GATE** | **YES** | AST injection analysis, RLS policies, tenant boundaries |
| `.github/workflows/ci-commerce.yml` | `CI Commerce (Service Authority, Payment Security & Reconciliation)` | **CANONICAL_GATE** | **YES** | Server-side pricing, payment FSM, webhook signature & replay |
| `.github/workflows/ci-runtime.yml` | `CI Runtime (Browser Regression, SLO & Disaster Recovery)` | **CANONICAL_GATE** | **YES** | DOM assertions, browser contract, SLO availability verification |
| `.github/workflows/ci-agent.yml` | `CI Agent (Solution Finder, Copilot & Multi-Agent Matrix)` | **CANONICAL_GATE** | **YES** | Copilot intent classification, sales engine scoring, HITL guard |
| `.github/workflows/ci-evidence-diagnostics.yml` | `CI Evidence Diagnostics` | **DIAGNOSTIC_EVIDENCE** | **YES** | Cryptographic failure capture, lineage tracking & artifact upload |
| `.github/workflows/reality_boundary.yml` | `Production Reality Boundary` | **CANONICAL_GATE** | **YES** | Blocks simulated/synthetic claims from masquerading as production |
| `.github/workflows/payment-contract.yml` | `Payment Webhook Security Contract` | **CANONICAL_GATE** | **YES** | Strict HMAC webhook signature verification test |
| `.github/workflows/deploy.yml` | `Production Quality & Cloudflare Release Authority CI` | **POST_DEPLOY_VERIFIER** | **NO** (Triggers post-merge) | Polls `https://inshatech.pages.dev/api/version` for deploy parity |
| `.github/workflows/deploy-ci.yml` | `Enterprise Staging & Production Verification Pipeline` | **STAGING_PIPELINE** | **ADVISORY** | Multi-environment validation pipeline |
| `.github/workflows/quality_guard.yml` | `Zero-Regression Quality & Token Firewall` | **AUXILIARY_GUARD** | **ADVISORY** | Duplicate token scan |
| `.github/workflows/security-content-gate.yml` | `P0 Security Content Gate` | **AUXILIARY_GUARD** | **ADVISORY** | Secret pattern detection |
| `.github/workflows/solution_finder_e2e.yml` | `Step 8 - AI Solution Finder E2E Certification` | **AUXILIARY_GUARD** | **ADVISORY** | Specialized standalone Solution Finder E2E |

---

## 3. GitHub Ruleset Architecture for `master`

When creating the formal GitHub Ruleset for branch `master`, the following configuration will be enforced:

1. **Target Branches**: `refs/heads/master`
2. **Pull Request Rules**:
   - Require Pull Request before merging
   - Require linear history (no merge commits on direct push)
   - Block force pushes (`force_push: disabled`)
   - Block branch deletions (`deletion: disabled`)
3. **Required Status Checks**:
   - `IINSHA AI-BOS Master Production CI`
   - `CI Fast (Syntax, Token Baselines & Static Contracts)`
   - `CI Security (Injection, Direct DB & Tenant Isolation)`
   - `CI Commerce (Service Authority, Payment Security & Reconciliation)`
   - `CI Runtime (Browser Regression, SLO & Disaster Recovery)`
   - `CI Agent (Solution Finder, Copilot & Multi-Agent Matrix)`
   - `CI Evidence Diagnostics`
   - `Production Reality Boundary`
   - `Payment Webhook Security Contract`
4. **Enforcement Mode**: `active`
