# 💳 IINSHA AI-BOS — PAYMENT MAP & FINANCIAL LEDGER INTEGRITY

## 1. PAYMENT GATEWAYS INVENTORY

| Gateway | Channel Identifier | Settlement Currency | Verification Flow |
| :--- | :--- | :---: | :--- |
| **bKash** | Personal (`01629286887`) | BDT (৳122.50) | Send Money + Reference ORD-... + WhatsApp Receipt |
| **Nagad** | Personal (`01629286887`) | BDT (৳122.50) | Send Money + Reference ORD-... + WhatsApp Receipt |
| **Stripe** | Credit / Debit Cards | USD | Webhook HMAC Signature (`payment_intent.succeeded`) |
| **Bank Wire** | City Bank PLC | USD | Swift / EFT Wire + Owner Manual Reconciliation |

---

## 2. IMMUTABLE DOUBLE-ENTRY LEDGER BALANCE
$$\text{Gross Revenue} \equiv \text{Gateway Fee} + \text{Affiliate Commission (20\%)} + \text{AI Cost} + \text{Net Margin}$$
