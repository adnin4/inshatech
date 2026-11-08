# IINSHA AI-BOS — Release Evidence Schema

Date: 2026-09-10

## Purpose

Separate GitHub workflow identity from the source revision actually checked out for verification.

## Required identity fields

- `workflow_sha`: GitHub Actions `GITHUB_SHA`; on pull requests this may be the synthetic merge ref.
- `pr_head_sha`: `github.event.pull_request.head.sha` when available; otherwise null outside pull request context.
- `checked_out_sha`: `git rev-parse HEAD` after checkout.
- `base_sha`: pull request base SHA when available.
- `workflow_ref`: GitHub workflow ref/context.
- `pr_ref`: pull request head ref when available.

## Authority rule

`workflow_sha` is evidence about the workflow invocation. It is not automatically the source release SHA.

`checked_out_sha` must match the explicitly designated source SHA for the verification run. In pull request diagnostics, `pr_head_sha` is the intended source identity unless the workflow explicitly documents another source revision.

A release may only become authoritative when source, build, artifact, deployment, runtime, API, browser, and database identity are independently populated and match the declared release contract.

## Failure rules

- Missing required identity -> `UNVERIFIED`
- Source/check-out mismatch -> `FAILED` or `BLOCKED`
- Workflow merge SHA used as source without explicit designation -> `UNVERIFIED`
- Short SHA used for release authority -> `FAILED`
- Non-canonical production branch -> `BLOCKED`
- Complete independently verified parity -> eligible for the next certification gate

## Non-goals

This schema does not certify Cloudflare production, Supabase production, payments, revenue, customers, or autonomous operation by itself.
