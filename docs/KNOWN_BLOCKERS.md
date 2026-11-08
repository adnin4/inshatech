# 📋 IINSHA AI-BOS: KNOWN BLOCKERS & ACTIVATION REQUIREMENTS

```text
================================================================================
          🌐 IINSHA AI-BOS: CURRENT BLOCKERS & NEXT ACTIVATION STEPS
================================================================================
  1. Cloudflare Live Edge Parity:
     - Blocker: Edge `/api/version` cryptographic hash parity requires manual pull/deploy.
     - Action: Deploy latest master distribution zip to dash.cloudflare.com.

  2. Supabase DB Environment Alignment:
     - Blocker: Canonical repo references `uulqaslcfjrvkvyegmvo` while connector accesses `kitwadizsvjmuxkfewxj`.
     - Action: Reconcile project reference once production migration is authorized.

  3. Live Payment Gateways:
     - Blocker: Stripe and bKash merchant API credentials pending founder activation.
     - Action: Input valid webhook signing secrets into Cloudflare environment variables.
================================================================================
```
