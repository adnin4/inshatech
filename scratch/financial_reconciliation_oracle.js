/**
 * IINSHA AI-BOS — Daily Financial Reconciliation & Ledger Oracle
 * Invariant: Gross == Gateway Fee + Affiliate Commission + AI Infra Cost + Net Margin
 */

const assert = require("assert");

console.log("================================================================");
console.log("EXECUTING DAILY FINANCIAL RECONCILIATION ORACLE");
console.log("================================================================\n");

const transactions = [
    { id: "ORD-001", gross: 850.00, fee: 24.65, affiliate: 170.00, aiCost: 2.10, net: 653.25 },
    { id: "ORD-002", gross: 750.00, fee: 21.75, affiliate: 150.00, aiCost: 1.85, net: 576.40 },
    { id: "ORD-003", gross: 497.00, fee: 14.41, affiliate: 99.40, aiCost: 1.20, net: 381.99 },
    { id: "ORD-004", gross: 1800.00, fee: 52.20, affiliate: 360.00, aiCost: 4.50, net: 1383.30 }
];

let totalGross = 0;
let totalDisbursements = 0;

transactions.forEach((tx, idx) => {
    const sumDisbursements = Math.round((tx.fee + tx.affiliate + tx.aiCost + tx.net) * 100) / 100;
    assert.strictEqual(tx.gross, sumDisbursements, `Transaction ${tx.id} must perfectly balance`);
    totalGross += tx.gross;
    totalDisbursements += sumDisbursements;
    console.log(`   [TX ${idx + 1}] ${tx.id}: Gross $${tx.gross} == Fee $${tx.fee} + Aff $${tx.affiliate} + AI $${tx.aiCost} + Net $${tx.net} (✅ MATCH)`);
});

assert.strictEqual(totalGross, totalDisbursements, "Daily Gross must equal total disbursements with 0.00 drift");
console.log(`\n✅ RECONCILIATION PASSED: Total Gross: $${totalGross.toFixed(2)} | Disbursed: $${totalDisbursements.toFixed(2)} | DRIFT: $0.00`);
console.log("================================================================\n");

