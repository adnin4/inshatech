# 🚀 IINSHA AI-BOS: 04_REFACTOR_PLAN

## Modular Monolith Migration Strategy
1. **Preserve Working Frontend:** Keep all 10 existing HTML pages, CSS styling, 3D Hero, and universal copilot widget.
2. **Standardize API Layer:** Ensure all mutations flow through `functions/api/*` with session token checks and rate limiting.
3. **Database Domain Isolation:** Maintain MakerKit multi-tenant accounts with PostgreSQL RLS policies (`((SELECT auth.uid()) = user_id)`).
4. **Commerce Invariant:** Uphold double-entry accounting where Gross = Fees + Affiliate + Net Margin ($0.00 drift).
