# 🚀 IINSHA AI-BOS — Deployment Topology & Infrastructure Map (Baseline v1.0)

**Record Date**: 2026-08-19  
**Live Production URL**: `https://inshatech.pages.dev/`  
**GitHub Repository**: `adnin4/inshatech`  

---

## 🌐 Hybrid Global Cloud Infrastructure

```text
┌─────────────────────────────────────────────────────────────┐
│ 🌍 CLOUDFLARE PAGES GLOBAL EDGE (inshatech.pages.dev)        │
│    • Static HTML/CSS/JS Assets Cached at 300+ Edge Locations│
│    • 50+ Cloudflare Pages Functions (/functions/api/*)      │
│    • Low-Latency Smart Placement Execution Engine           │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ 🗄️ SUPABASE POSTGRESQL (RLS) │ │ 🐳 HOSTINGER DOCKER VPS      │
│    • 15 SQL Migrations       │ │    • Dedicated n8n Cluster   │
│    • 60+ Relational Tables   │ │    • Playwright Headless Core│
│    • Double-Entry Ledger     │ │    • PostgreSQL Local Queue  │
│    • pgvector Semantic Memory│ │    • $5.99/mo Zero Zapier Fee│
└──────────────────────────────┘ └──────────────────────────────┘
```

---

## 📦 Distribution Packages & Build Sync
* Local Root: `C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\`
* Synchronized Targets: `./public/`, `./build/`, `./dist/`, `./static_dist/`, `./cloudflare_pages_dist/`
* Production Archive: `cloudflare_pages_dist.zip` (209 Assets)
* Git Target Branches: `origin/main`, `origin/master`, `origin/gh-pages`
