# IINSHA AI-BOS Release Governance Checklist

## Purpose

Canonical release governance for `master`. This document is a policy/checklist only; it does not certify production by itself.

## Canonical source

- Repository: `adnin4/inshatech`
- Canonical branch: `master`
- Production source must not come from `adnin4/inshatech-live`.

## Required release identity

A release candidate must bind and independently verify, where applicable:

- source repository
- source branch
- source commit SHA
- build identifier and SHA
- artifact hash
- Cloudflare project/deployment ID
- deployed commit SHA
- runtime SHA
- API SHA
- browser asset SHA
- Supabase project reference
- database migration head

No generated manifest may manufacture runtime or production verification.

## Required gates before PRODUCTION_CANDIDATE

1. CI required suites are green on the exact latest candidate SHA.
2. Security gate is green with no unresolved critical findings.
3. Payment contracts are green; live payment remains unverified until external provider evidence exists.
4. Database/RLS checks are verified against the live control plane or explicitly classified as unverified.
5. Cloudflare production branch/project/deployment identity is externally verified.
6. Source/build/deployment/runtime parity is proven.
7. Browser production evidence is independently captured.
8. Rollback and recovery evidence is captured.
9. Evidence artifacts are retrievable and bound to the exact candidate SHA.

## Branch policy target

`master` should be protected with:

- pull request required
- required status checks
- strict/up-to-date required checks
- no force-push
- no deletion
- review requirement appropriate to repository ownership
- deployment/release approval for production

Required checks must have unique names across workflows.

## Evidence taxonomy

- `VERIFIED`
- `TEST_VERIFIED`
- `SYNTHETIC_TEST_VERIFIED`
- `SANDBOX_VERIFIED`
- `LIVE_VERIFIED`
- `UNVERIFIED`
- `NOT_CONFIGURED`
- `BLOCKED`
- `FAILED`
- `PENDING_APPROVAL`

Tests and static reports must never be represented as live production evidence unless an external runtime proof exists.

## Safety rules

- No destructive production DB reset/rebuild.
- No browser-authoritative price or payment state.
- No unrestricted agent credentials.
- No CI bypass or weakened assertions.
- No fake customer/order/payment/revenue evidence.
- No competing production source.
