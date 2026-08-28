# Canonical Deployment Source

## Production source of truth

The canonical application repository is:

`adnin4/inshatech`

Production branch:

`master`

Production URL:

`https://inshatech.pages.dev`

Canonical Supabase project:

`uulqaslcfjrvkvyegmvo`

## Repository separation rule

`adnin4/inshatech-live` is a separate historical/live-oriented repository and must not be treated as the authoritative source for the Cloudflare Pages production project unless it is explicitly re-canonicalized by an owner-reviewed migration.

Do not maintain two independently deployable production sources.

## Release rule

GitHub `master` is the source artifact. Cloudflare Pages production must deploy that artifact through the configured Git integration or an owner-controlled release workflow. A production release is not verified until the live runtime exposes the exact expected release SHA and passes browser/surface smoke.

## No silent source switching

Any change to the Cloudflare Pages Git repository, production branch, build command, build output directory, or deployment mode is a P0 release-control change and requires owner review plus a parity check.
