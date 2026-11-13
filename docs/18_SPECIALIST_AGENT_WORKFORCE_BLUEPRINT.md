# 🏛️ IINSHA AI-BOS: 18-Specialist Agent Autonomous Business Workforce Blueprint
**System Authority:** `adnin4/inshatech`  
**Lead Engineer & Founder:** Adnin Sadat Mahin  
**Framework Version:** `v2.0.0-governed`  
**Certification Status:** `READY_FOR_STAGING` (Immutable Green Baseline: 26/26 Suites Passed)

---

## ১. ভূমিকা ও মূল দৃষ্টিভঙ্গি (Vision & Mandate)

IINSHA AI-BOS কেবল চ্যাটবট বা আলগা কিছু AI Prompt-এর সমষ্টি নয়; এটি একটি **Closed-Loop Governed Autonomous Business Operating System**। এখানে গ্রাহক পাওয়া (Lead Acquisition) থেকে শুরু করে বিক্রয় (Sales Proposal), মূল্য পরিশোধ (Payment Verification), সফটওয়্যার নির্মাণ (Software Factory), গুণগত মান যাচাই (Independent QA), রিলিজ ও ডেলিভারি (Gated Deployment), এবং বিক্রয়োত্তর সেবা (Customer Success & Renewal) পর্যন্ত সম্পূর্ণ চক্রটি একটি সমন্বিত মাল্টি-এজেন্ট মেকার্কিট হিসেবে কাজ করে।

```
                                  +------------------------------------+
                                  |     Website & Marketplace UI      |
                                  | (Turnkey Packages, Lead Intake)    |
                                  +-----------------+------------------+
                                                    |
                                                    v
+-----------------------+         +-----------------+------------------+         +-----------------------+
|  1. BI & Sales Mesh   |         | 2. Order & Payment Gate            |         | 3. Project Factory    |
| - Research Agent      | ------> | - Payment Verifier (Server-Auth)   | ------> | - Requirements Agent  |
| - Lead Hunter Agent   |         | - Double-Entry Finance CFO         |         | - Solution Architect  |
| - CRM Outreach Agent  |         | - Fraud & Idempotency Sentinel     |         | - Developer Swarm     |
| - Sales Proposal Agent|         +-----------------+------------------+         | - Independent Reviewer|
+-----------------------+                           |                            | - QA Automation Lead  |
                                                    v                            +-----------+-----------+
                                  +-----------------+------------------+                     |
                                  | 4. Security & Evidence Attestation | <-------------------+
                                  | - Security Guardian (Zero Trust)   |
                                  | - Evidence Attester (SHA-256 Chain)|
                                  +-----------------+------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  | 5. Release, SRE & Renewal Loop     |
                                  | - Deployment & Release Director    |
                                  | - DevOps & SRE Health Sentinel     |
                                  | - Support & Success Concierge      |
                                  | - Analytics & Renewal Specialist   |
                                  +------------------------------------+
```

---

## ২. ১৮টি বিশেষজ্ঞ এজেন্টের পূর্ণাঙ্গ বিবরণ (The 18 Specialist Agents)

প্রতিটি এজেন্ট একটি কঠোর **6-Layer Architecture** (Identity, Goal, Memory, Tools, Permissions, Evaluation) দ্বারা চালিত:

| # | Agent Name | ID | Department | Primary Role | Autonomy & Risk Class | Allowed Tools Inventory |
|---|---|---|---|---|---|---|
| **1** | **Chief Workforce Orchestrator** | `orchestrator` | Executive | সামগ্রিক Task DAG শিডিউলিং, ক্রস-এজেন্ট ডেলিগেশন ও SLA তদারকি | `L2_SAFE_EXECUTE` (Medium) | `create_task_dag`, `delegate_task`, `evaluate_sla`, `get_analytics` |
| **2** | **Requirements Specialist** | `requirements` | Engineering | অস্পষ্ট ক্লায়েন্ট সমস্যা ভেঙে সুনির্দিষ্ট PRD ও Acceptance Criteria তৈরি | `L1_DRAFT` (Low) | `extract_user_stories`, `validate_spec`, `generate_acceptance_criteria` |
| **3** | **Solution & Technical Architect** | `architect` | Engineering | সিস্টেম টপোলজি, স্কিমা চুক্তি ও n8n/Docker এক্সিকিউশন ব্লুপ্রিন্ট ডিজাইন | `L1_DRAFT` (Low) | `design_topology`, `validate_schema_contract`, `create_quote`, `draft_proposal` |
| **4** | **Full-Stack Engineering Lead** | `developer` | Engineering | প্রডাকশন-গ্রেড কোড, সার্ভারলেস ক্লাউডফ্লেয়ার ফাংশন ও n8n অটোমেশন কোড রচনা | `L3_APPROVAL` (High) | `synthesize_code`, `generate_n8n_workflow`, `run_tests`, `create_project` |
| **5** | **Independent Code Reviewer** | `reviewer` | Quality | AST-লেভেলে স্ট্যাটিক অডিট, জিরো-ওয়ার্নিং মান বজায় রাখা, কোনো `// TODO` না রাখা | `L0_OBSERVE` (Low) | `ast_analyze`, `lint_scan`, `complexity_profile`, `audit_dependencies` |
| **6** | **QA Automation Lead** | `qa` | Quality | ইউনিট, ইন্টিগ্রেশন, ও মাল্টি-পেজ ব্রাউজার E2E স্বয়ংক্রিয় টেস্ট রানার | `L0_OBSERVE` (Low) | `run_tests`, `run_browser_e2e`, `mutation_test`, `record_test_evidence` |
| **7** | **Cybersecurity Guardian** | `security` | Security | জিরো-ট্রাস্ট, OWASP Mitigations, RLS ডেটাবেজ আইসোলেশন ও 5-লেভেল HITL গেট এনফোর্সমেন্ট | `L0_OBSERVE` (Critical / Supervisor) | `scan_vulnerabilities`, `verify_rls_isolation`, `trip_killswitch` |
| **8** | **Cryptographic Evidence Attester** | `evidence` | Quality | ইনপুট/আউটপুট SHA-256 হ্যাশিং, অপরিবর্তনীয় অডিট লেজার ও ভেরিফিকেশন সার্টিফিকেট সিল করা | `L2_SAFE_EXECUTE` (Low) | `hash_artifacts`, `verify_sha_parity`, `sign_evidence_block`, `seal_certificate` |
| **9** | **Market Intelligence Specialist** | `research` | Strategy | গ্লোবাল ওয়ার্কফ্লো ট্রেন্ড, প্রতিযোগী প্রাইসিং ও টেকনিক্যাল ইকোসিস্টেম বিশ্লেষণ | `L0_OBSERVE` (Low) | `search_web`, `search_knowledge`, `extract_pricing_matrix`, `benchmark_workflow` |
| **10** | **Lead Generation Hunter** | `lead_hunter` | Commercial | বিটুইবি ডিসিশন-মেকার অনুসন্ধান, কর্পোরেট MX/SPF ভেরিফিকেশন ও লিড এনরিচমেন্ট | `L2_SAFE_EXECUTE` (Medium) | `search_web`, `get_leads`, `verify_corporate_mx`, `enrich_company_profile` |
| **11** | **CRM & Outreach Specialist** | `crm_outreach` | Commercial | সিআরএম প্রস্পেক্ট স্টেজ পরিচালনা ও কনটেক্সট-সচেতন ফলো-আপ তৈরি | `L2_SAFE_EXECUTE` (Low) | `update_crm_stage`, `schedule_touchpoint`, `draft_email`, `send_message` |
| **12** | **Sales & Proposal Closer** | `sales_proposal` | Commercial | কোয়ালিফিকেশন, ৩০ দিনের আরওআই হিসাব, মার্জিন ফ্লোর রক্ষা ও কমার্শিয়াল প্রপোজাল তৈরি | `L2_SAFE_EXECUTE` (Medium) | `calculate_roi`, `evaluate_margin_floor`, `generate_proposal`, `create_quote` |
| **13** | **Payment Verification Sentinel** | `payment_verifier` | Finance | সার্ভার-অথরিটেটিভ HMAC সিগনেচার যাচাই, আইডেমপোটেন্সি চেক ও পেমেন্ট অর্ডার নিশ্চিতকরণ | `L2_SAFE_EXECUTE` (High) | `verify_webhook_hmac`, `validate_idempotency`, `check_fx_peg`, `confirm_order` |
| **14** | **AI CFO & Finance Controller** | `finance_cfo` | Finance | ব্যালেন্সড ডাবল-এন্ট্রি লেজার অডিট, ৮০%+ মার্জিন নজরদারি ও পে-আউট রিকনসিলিয়েশন | `L0_OBSERVE` (High) | `get_revenue`, `get_expenses`, `record_ledger_entry`, `reconcile_payouts` |
| **15** | **DevOps & SRE Guardian** | `devops_sre` | Infrastructure | মাল্টি-রিজিয়ন টেলিমეტ্রি পর্যবেক্ষণ, কন্টেইনার হেলথ, অটো-হিলিং ও এসএলও ট্র্যাকিং | `L2_SAFE_EXECUTE` (Medium) | `get_system_health`, `create_incident`, `verify_backup_integrity`, `restart_container` |
| **16** | **Customer Support Concierge** | `support_success` | Operations | ২৪/৭ দ্বিভাষিক সাপোর্ট, ভেক্টর RAG নলেজ বেস থেকে উত্তর ও টিকিট ট্রায়াজ | `L2_SAFE_EXECUTE` (Low) | `search_knowledge`, `create_ticket`, `update_ticket`, `evaluate_nps` |
| **17** | **Analytics & Renewal Specialist**| `analytics_renewal` | Growth | চার্ন রিস্ক মডেলিং, ইউসেজ অ্যানালিটিক্স, কন্ট্রাক্ট রিনিউয়াল এলার্ট ও আপসেল সিকোয়েন্স | `L1_DRAFT` (Low) | `calculate_churn_risk`, `get_usage_metrics`, `schedule_renewal_review` |
| **18** | **Deployment & Release Director** | `deployment_release`| Infrastructure | স্টেজিং স্মোক টেস্ট, প্রডাকশন রিলিজ গেট, নো-ডাউনটাইম রোলব্যাক ও রিলিজ ম্যানিফেস্ট প্রকাশ | `L3_APPROVAL` (Critical) | `promote_to_staging`, `promote_to_production`, `trigger_smoke_test`, `rollback_release` |

---

## ৩. স্বয়ংক্রিয় কাজের পরিধি বনাম বাধ্যতামূলক পলিসি গেট (Autonomy vs Policy Gates)

| সম্পূর্ণ স্বয়ংক্রিয় (Fully Autonomous - Level 0 to Level 2) | মালিকের বাধ্যতামূলক অনুমোদন সাপেক্ষ (HITL Gate - Level 3 & Level 4) |
|---|---|
| ✅ বিটুইবি লিড রিসার্চ, কর্পোরেট MX ভেরিফিকেশন ও লিড স্কোরিং | 🛑 ক্লায়েন্টের জন্য ১০০% বাধ্যতামূলক বাইন্ডিং প্রডাকশন কন্ট্রাক্ট স্বাক্ষর |
| ✅ সিআরএম পাইপলাইন আপডেট ও ড্রাফট ফলো-আপ ইমেইল তৈরি | 🛑 লাইভ পেমেন্ট গেটওয়েতে রিফান্ড (Refund) বা ব্যাংক পেআউট রিলিজ |
| ✅ রিকোয়ারমেন্টস ডকুমেন্ট (PRD) ও সিস্টেম টপোলজি ব্লুপ্রিন্ট ডিজাইন | 🛑 লাইভ ক্লাউডফ্লেয়ার বা প্রডাকশন সার্ভারে ফাইনাল রিলিজ পুশ (`deploy_to_production`) |
| ✅ স্যান্ডবক্সে কোড লেখা, বিল্ড ও এএসটি লেভেল অডিট সম্পন্ন করা | 🛑 প্রডাকশন ডেটাবেজ স্কিমা অল্টারেশন বা ড্রপ কোয়েরি এক্সিকিউশন |
| ✅ ইউনিট টেস্ট, ইন্টিগ্রেশন টেস্ট ও ব্রাউজার E2E টেস্ট ম্যাট্রিক্স রান করা | 🛑 মাস্টার সিক্রেট কি (JWT Secret, API Keys, DB Passwords) পরিবর্তন বা রিসেট |
| ✅ ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশিং ও এভিডেন্স লেজার অডিট ট্রেইল তৈরি | 🛑 সিকিউরিটি ইনসিডেন্ট বা কি-সুইচ ট্রিপের পর কোল্ড রিস্টোরেশন অনুমোদন |

---

## ৪. ৭-পর্যায়ের বাস্তবায়ন রোডম্যাপ (7-Phase Realization Roadmap)

```
[Phase 1] Core Swarm Sandbox (Orchestrator, Dev, Reviewer, QA, Security, Evidence)
   │
   ▼
[Phase 2] Project Factory (Requirements, Architect, Task DAG Orchestration)
   │
   ▼
[Phase 3] Commerce & Sales Engine (Research, Lead Gen, CRM, Sales & Proposal)
   │
   ▼
[Phase 4] Financial Sovereign Engine (Payment Verifier, Finance CFO, DevOps SRE)
   │
   ▼
[Phase 5] Client Lifecycle & Retention (Customer Support Concierge, Analytics & Renewal)
   │
   ▼
[Phase 6] Governed Release Gateway (Deployment & Release Director with Smoke & Rollback)
   │
   ▼
[Phase 7] Full End-to-End Orchestrated Autonomous Company Operating Loop
```

### পর্যায় ১: Core Swarm Sandbox (সম্পন্ন ও ভেরিফাইড ✅)
- **অন্তর্ভুক্ত এজেন্ট:** `CHIEF_ORCHESTRATOR_AGENT`, `DEVELOPER_AGENT`, `REVIEWER_AGENT`, `QA_AGENT`, `SECURITY_AGENT`, `EVIDENCE_AGENT`
- **বাস্তবায়িত মডিউল:** `ai_brain/sandboxed_core_swarm.js`, `ai_brain/evidence_system.js`
- **সম্পন্ন হওয়ার প্রমাণ:** `node scripts/test_18_agent_workforce.mjs` টেস্টে স্যান্ডবক্সে কোড জেনারেশন থেকে শুরু করে এএসটি অডিট, টেস্ট রান, সিকিউরিটি ভ্যালিডেশন এবং ক্রিপ্টোগ্রাফিক সার্টিফিকেট সিল সম্পন্ন (134/134 assertions pass)।

### পর্যায় ২: Project Factory (সম্পন্ন ও ভেরিফাইড ✅)
- **অন্তর্ভুক্ত এজেন্ট:** `REQUIREMENTS_AGENT`, `ARCHITECT_AGENT`, `TaskDagOrchestrator`
- **বাস্তবায়িত মডিউল:** `ai_brain/task_dag_orchestrator.js`
- **সম্পন্ন হওয়ার প্রমাণ:** টপোলজিক্যাল ডিপেনডেন্সি চেকিং, সাইকেল ডিটেকশন, HITL গেটে স্বয়ংক্রিয় পজ ও ওনার অনুমোদনের মাধ্যমে নির্বিঘ্ন সমাপ্তি।

### পর্যায় ৩: Commerce & Sales Engine (সম্পন্ন ও ভেরিফাইড ✅)
- **অন্তর্ভুক্ত এজেন্ট:** `RESEARCH_AGENT`, `LEAD_HUNTER_AGENT`, `CRM_OUTREACH_AGENT`, `SALES_PROPOSAL_AGENT`
- **বাস্তবায়িত মডিউল:** `ai_brain/sales_engine.js`, `ai_brain/lead_acquisition_engine.js`, `ai_brain/negotiation_margin_engine.js`
- **সম্পন্ন হওয়ার প্রমাণ:** ৩০ দিনের আরওআই হিসাব, ২০% ডিসকাউন্ট সিলিং এবং মার্জিন ফ্লোর ক্যালকুলেশন ভেরিফাইড।

### পর্যায় ৪: Financial Sovereign Engine (সম্পন্ন ও ভেরিফাইড ✅)
- **অন্তর্ভুক্ত এজেন্ট:** `PAYMENT_VERIFIER_AGENT`, `FINANCE_CFO_AGENT`, `DEVOPS_SRE_AGENT`
- **বাস্তবায়িত মডিউল:** `functions/api/payments/checkout.js`, `functions/api/payments/webhook.js`, `ai_brain/ai_cfo_engine.js`
- **সম্পন্ন হওয়ার প্রমাণ:** সার্ভার-অথরিটেটিভ HMAC যাচাই, আইডেমপোটেন্ট ইভেন্ট প্রসেসিং এবং ব্যালেন্সড ডাবল-এন্ট্রি লেজার।

### পর্যায় ৫: Client Lifecycle & Retention (সম্পন্ন ও ভেরিফাইড ✅)
- **অন্তর্ভুক্ত এজেন্ট:** `SUPPORT_SUCCESS_AGENT`, `ANALYTICS_RENEWAL_AGENT`
- **বাস্তবায়িত মডিউল:** `ai_brain/customer_success_engine.js`, `knowledge/faqs.json`, `knowledge/services.json`
- **সম্পন্ন হওয়ার প্রমাণ:** ভেক্টর RAG নলেজ কোয়েরি, অনবোর্ডিং এনপিএস হেলথ স্কোরিং ও রিনিউয়াল শিডিউলিং।

### পর্যায় ৬: Governed Release Gateway (সম্পন্ন ও ভেরিফাইড ✅)
- **অন্তর্ভুক্ত এজেন্ট:** `DEPLOYMENT_RELEASE_AGENT`, `functions/_shared/release_identity.js`
- **সম্পন্ন হওয়ার প্রমাণ:** মাল্টি-SHA প্যারিটি ভেরিফিকেশন (`commit_sha === deployment_sha === runtime_sha`) এবং রোলব্যাক গার্ডরেইল।

### পর্যায় ৭: Full End-to-End Orchestrated Autonomous Company Operating Loop (সম্পন্ন ও ভেরিফাইড ✅)
- **বাস্তবায়িত মডিউল:** `ai_brain/autonomous_company_orchestrator.js`
- **সম্পন্ন হওয়ার প্রমাণ:** সম্পূর্ণ ক্লোজড-লুপ এক্সিকিউশন: প্রস্পেক্ট ইনজেস্ট -> কোয়ালিফিকেশন -> মার্জিন নেগোশিয়েশন -> পেমেন্ট সেটেলমেন্ট -> প্রজেক্ট DAG -> ইঞ্জিনিয়ারিং সোয়ার্ম -> ইন্ডিপেনডেন্ট কিউএ -> কাস্টমার সাকসেস -> এক্সপেরিয়েন্স নলেজ গ্রাফ -> সিইও ব্রিফিং।

---

## ৫. টাস্ক ডিএজি অর্কেস্ট্রেটর স্টেট মেশিন (Task DAG State Machine)

```
                 [PENDING]
                     │
      (Dependencies Satisfied)
                     │
                     v
               [IN_PROGRESS]
                /          \
   (Requires HITL)      (Standard Execution)
              /              \
             v                v
   [AWAITING_APPROVAL]   [COMPLETED]
             │                │
      (Owner Approved)   (Seals Evidence)
             │                │
             v                v
        [COMPLETED]     [DAG_FINISHED]
```

- **টাস্ক স্ট্যাটাস তালিকা:**
  - `PENDING`: ডিপেনডেন্ট টাস্ক সম্পন্ন হওয়ার অপেক্ষায়।
  - `IN_PROGRESS`: নির্দিষ্ট বিশেষজ্ঞ এজেন্ট কাজ করছে।
  - `AWAITING_APPROVAL`: লেভেল ৩/৪ পলিসি গেট—মালিকের ম্যানুয়াল অনুমোদনের জন্য অপেক্ষমাণ।
  - `COMPLETED`: কাজ শতভাগ সফল ও এভিডেন্স লেজারে নথিভুক্ত।
  - `FAILED`: সর্বোচ্চ ৩ বার রিট্রাই করার পরেও ত্রুটি ধরা পড়লে ফেইলড হিসেবে চিহ্নিত।
  - `CANCELLED`: ডিপেনডেন্সি ফেইল করলে স্বয়ংক্রিয়ভাবে বাতিল।

---

## ৬. ক্রিপ্টোগ্রাফিক এভিডেন্স সিস্টেম ও ডেলিভারি সার্টিফিকেট (Evidence Engine)

প্রতিটি টাস্কের কার্যকারিতা স্বাধীনভাবে প্রমাণ করতে প্রতিটি ধাপে নিচের মেটাডেটা সংগ্রহ ও চেইন করা হয়:

```json
{
  "index": 1,
  "taskId": "PROJ_APEX_DEV",
  "stage": "ENGINEERING",
  "actorAgent": "DEVELOPER_AGENT",
  "sourceRevision": "0b16b3d1f97708e0aeedaa8cb6cdc399c786f5aa",
  "inputHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "outputHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "previousHash": "0000000000000000000000000000000000000000000000000000000000000000",
  "recordHash": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
  "timestamp": "2026-10-25T06:23:09.124Z"
}
```

প্রজেক্টের সব টাস্ক সম্পন্ন হলে `sealVerificationCertificate` একটি রুট ডাইজেস্ট এবং ক্রিপ্টোগ্রাফিক সিগনেচার তৈরি করে, যা কোনো তৃতীয় পক্ষ পরিবর্তন করতে পারবে না।

---

## ৭. সিস্টেম সার্টিফিকেশন ল্যাডার (Certification Ladder)

| ধাপ | স্ট্যাটাস | মানদণ্ড ও বর্তমান অবস্থা |
|---|---|---|
| **১** | **`READY_FOR_STAGING`** | **[বর্তমান অর্জিত স্ট্যাটাস]** ২৬/২৬টি সিআই টেস্ট পাস, জিরো P0/P1 সিকিউরিটি ডিফেক্ট, গেট ০ ভিজ্যুয়াল বেসলাইন সুরক্ষিত। |
| **২** | **`STAGING_VERIFIED`** | স্টেজিং ডোমেইনে (`inshatech.pages.dev`) ব্রাউজার স্মোক টেস্ট ও এন্ডপয়েন্ট রেসপন্স ভেরিফাইড। |
| **৩** | **`PRODUCTION_CANDIDATE`** | সিকিউরিটি, কিউএ, ডাটাবেজ ব্যাকআপ ও রিলিজ গেটের সব রিকোয়ারমেন্ট পাস। |
| **৪** | **`PRODUCTION_VERIFIED`** | লাইভ ক্লাউডফ্লেয়ার এজ SHA ও রিপোজিটরি মাস্টার SHA ১০০% হুবহু এক এবং লাইভ ডেটাবেজ এক্টিভ। |
| **৫** | **`REVENUE_OPERATIONAL`** | প্রথম বাস্তব কাস্টমারের কাছ থেকে ভেরিফাইড পেমেন্ট গ্রহণ ও ডেলিভারি সম্পন্ন। |
| **৬** | **`AUTONOMOUS_OPERATIONAL`**| সম্পূর্ণ ১৮-এজেন্ট ক্লোজড-লুপ পুনরাবৃত্তিমূলকভাবে ত্রুটিহীনভাবে স্বয়ংক্রিয়ভাবে চালিত। |

---

## ৮. এক্সটার্নাল ওনার বাউন্ডারি (External Owner Boundaries: G1–G16)

সফটওয়্যার কোড এবং ১৮-এজেন্ট সোয়ার্ম নিজে নিজে ১০০% কার্যকর হলেও নিচের বিষয়গুলো মালিকের বাহ্যিক কর্তৃত্বাধীনে সংরক্ষিত:
- **G1:** ক্লাউডফ্লেয়ার পেজেস প্রডাকশন ডেপ্লয়মেন্ট টোকেন ও লাইভ কাস্টম ডোমেন ডিএনএস কাট-ওভার।
- **G2:** সুপাবেজ ক্লাউড ড্যাশবোর্ড থেকে ইনঅ্যাক্টিভ ডেটাবেজ (`kitwadizsvjmuxkfewxj`) রেজ্যুম করা।
- **G3:** প্রডাকশন সার্ভার এনভায়রনমেন্ট সিক্রেট (`JWT_SECRET`, `ADMIN_PASSWORD_HASH`, `MFA_SECRET`) ইনজেকশন।
- **G4:** লাইভ কমার্শিয়াল পেমেন্ট গেটওয়ে ক্রেডেনশিয়াল (bKash Merchant, SSLCommerz Live, Stripe Live API Keys)।
- **G5:** লিড ইঞ্জিনিয়ার ও ফাউন্ডার আদনিন সাদাত মাহিনের চূড়ান্ত বিজনেস সাইন-অফ।
