# IINSHA Known State — Historical Starting Evidence (Recheck Before Use)

Captured for plugin tailoring on 2026-11-13. This is NOT a live guarantee and must never override fresh workspace/API evidence.

- Repository: `https://github.com/adnin4/inshatech`.
- Last observed remote `master`: `b3de7650b65e388514ca82674654c92241ea8811`.
- Separate older `main`: `45ee4c1f90f699686c71912a7f22598cbe3b0a74`.
- V7 reported local candidate: `4081e12d81300fcd39e8b5357d2a8f9a0efe269b`; latest GitHub API check found no commit for this SHA.
- PR #67 was open/unmerged; PR #71 was draft/unmerged and stacked on #67 in the last observed public evidence. Re-query.
- Workflow run `42506647860` (IINSHA Site Refresh Validation) was successful for PR #71 SHA `cd760c39c6985d75eaf01d900d8e85b1705d9a00`, not the V7 candidate.
- Staging host `https://inshatech-b6b.pages.dev/`; reported runtime SHA `74d90b14143e936587153464557a7e6d0f35fb9c`.
- Staging version API and liveness returned HTTP 200; readiness and admin gate returned HTTP 503.
- Supabase project `kitwadizsvjmuxkfewxj` (`inshatech-db`) was INACTIVE; migration listing timed out.
- Historical references `iuhtzahuszdkdarhxobx` and `uulqaslcfjrvkvyegmvo` were mentioned but not confirmed canonical.
- `inshatech.com` and `www.inshatech.com` served the legacy Insha Technologies website.

The most important starting risks are source/branch drift, stacked PR dependency, workflow/deployment-authority ambiguity, inactive database, missing staging DB credentials, and no production cutover. Reverify everything.
