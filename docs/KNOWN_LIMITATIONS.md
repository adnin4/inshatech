# 📋 IINSHA AI-BOS: KNOWN_LIMITATIONS & TRUTH-IN-ADVERTISING REGISTER

## Unconfigured Integrations Policy
In strict compliance with the **Zero-Fake-Success Rule**, any external provider lacking live production API credentials will transparently output:
```json
{
  "status": "NOT_CONFIGURED",
  "message": "Production credentials required for live execution. Connect API keys in sovereign admin vault."
}
```

## Data Source Transparency Matrix
- `● REAL CLIENT VERIFIED`: Production client telemetry.
- `● INTERNAL BENCHMARK`: Measured under simulated staging load.
- `● LAB TEST / SANDBOX`: Architectural prototypes.
- `● SIMULATED EXAMPLE`: Synthetic demo data.
