# IINSHA AI-BOS — CI Diagnostics Design

## Purpose

This diagnostic path exists to make failures observable and reproducible when hosted workflow logs are unavailable. It is evidence collection, not production certification.

## Guarantees

- Each suite executes independently.
- Each suite produces JSON with status, exit code, duration, stdout and stderr.
- A run-level summary records repository, commit and workflow identity.
- Markdown evidence is generated for human review.
- The workflow always uploads the evidence directory.
- No production, payment, revenue or autonomous status is inferred from a passing diagnostic suite.

## Next evolution

After Gate 0 is green, the same evidence contract should be adopted by all mandatory certification workflows, and the release authority should consume only machine-readable evidence tied to an exact commit SHA.
