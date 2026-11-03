# IINSHA AI-BOS — Release Authority Decision Matrix

Date: 2026-09-10

## Current observed state

- Canonical repository: `adnin4/inshatech`
- Canonical branch: `master`
- Production URL: `https://inshatech.pages.dev`
- Cloudflare production control-plane configuration: `UNVERIFIED`
- Supabase live control-plane: `UNVERIFIED`
- GitHub rulesets observed: none

## Target release chain

`GitHub master → canonical CI → single production deployment authority → independent post-deploy verification → evidence`

## Cloudflare decision rule

Prefer Cloudflare Pages Git Integration as the sole production deployment authority if direct project settings confirm the repository, production branch, and automatic deployment policy. Preserve PR/custom-branch previews.

If instead controlled Wrangler deployment is selected, automatic production branch deployments must be disabled first and the Wrangler path must become the only production deployment mechanism.

Do not mutate either production path until direct control-plane inspection proves the current configuration.

## Verification boundary

Deployment mechanism and release verification are separate concerns. Production verification must independently establish source SHA, build SHA, deployment SHA, runtime SHA, database identity, runtime health, API health, and browser evidence before a release can be certified.
