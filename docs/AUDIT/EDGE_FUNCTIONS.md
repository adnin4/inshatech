# 06_EDGE_FUNCTIONS.md — Cloudflare Pages Functions Architecture

- **Runtime:** V8 Isolate Serverless Edge (`functions/api/*`).
- **Global Error Interception:** Structured JSON catch blocks with correlation IDs (`x-correlation-id`).
- **Cold Start Latency:** $< 10\text{ms}$ global edge cold starts.
- **CORS Whitelist:** Explicit origin restriction (`https://inshatech.pages.dev`, `https://inshatech.com`).
