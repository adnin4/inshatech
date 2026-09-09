# IINSHA AI-BOS — Release Identity Specification

## Objective

Make every production release independently identifiable from source to runtime. A release is not production-verified merely because code exists in GitHub or a generated manifest says so.

## Identity chain

```text
source repository
→ source branch
→ source SHA
→ build ID
→ build SHA
→ artifact hash
→ Cloudflare project
→ Cloudflare deployment ID
→ deployed SHA
→ runtime SHA
→ API SHA
→ browser asset SHA
→ Supabase project ref
→ migration head
```

## Required invariants

Where a value is applicable, source/build/deployed/runtime/API/browser identities must match exactly. Missing external identity is `UNVERIFIED`, not `PASS`.

Database identity also requires a separately verified Supabase project reference and migration head. Database parity is false until live evidence proves the runtime is connected to the expected project and schema state.

## Evidence requirements

Every release evidence record must include:

- exact commit SHA
- exact branch/ref
- immutable artifact or checksum reference
- deployment ID where applicable
- runtime identity source
- database identity source
- capture timestamp
- evidence source/provenance

Generated reports may summarize evidence but may not invent it.

## Certification boundary

`PRODUCTION_CANDIDATE` requires release identity parity plus all required CI/security/runtime gates.

`PRODUCTION_VERIFIED` additionally requires external runtime proof, browser production proof, recovery evidence, and a complete retrievable evidence package.

`REVENUE_OPERATIONAL` additionally requires real customer/order/payment/project/delivery/support evidence and reconciled finance.

`AUTONOMOUS_OPERATIONAL` additionally requires governed autonomous execution across sales, CRM, engineering, QA, deployment, support, renewal, finance, analytics, and security with human override and global kill switch.
