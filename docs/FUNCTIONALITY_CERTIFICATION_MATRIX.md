# 📊 IINSHA AI-BOS: FUNCTIONALITY CERTIFICATION MATRIX

| Page / Surface | Entry Point | UI Action | API / DB Target | Expected Result | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Home (index.html)** | Hero / CTA | Solution Finder | `POST /api/ai/chat` | Interactive preview rendered | 🟢 `PASS` | DOM & Asset check clean |
| **Marketplace** | Catalog Grid | Filter by Category | Local Services JSON | Dynamic filter rendered | 🟢 `PASS` | 80+ Services mapped |
| **Store** | Package Card | Select Package | `POST /api/payments/checkout` | Checkout intent initialized | 🟢 `PASS` | Dual USD/BDT calculated |
| **Compare** | Feature Matrix | Toggle Specs | Static Data Matrix | Comparison table synced | 🟢 `PASS` | Zero syntax error |
| **Portal** | Client Login | View Projects | Supabase Orders / Deliverables | Tenant dashboard displayed | 🟢 `PASS` | RLS Protected |
| **Admin** | Admin Gate | Manage Agents | Supabase IBOS Settings | Sovereign control panel | 🟢 `PASS` | Session Auth enforced |
| **Affiliate** | Partner Desk | Generate Link | SubID / Hash Engine | 60-day cookie link generated | 🟢 `PASS` | Fraud radar active |
| **Payment Node** | Lemon Squeezy | Card Checkout | Webhook HMAC-SHA256 | Live card transaction | 🟡 `NOT_CONFIGURED` | Awaiting live card swipe |
