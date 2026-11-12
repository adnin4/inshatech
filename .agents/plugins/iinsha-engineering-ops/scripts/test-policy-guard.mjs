import assert from "node:assert/strict";
import { evaluateCommand } from "./policy-engine.mjs";

const safe = ["npm test", "node --check app.js", "git status --short", "npm run build"];
for (const command of safe) {
  assert.equal(evaluateCommand(command).decision, "allow", `Expected safe command to pass: ${command}`);
}

const gated = [
  "git push origin feature/qa",
  "gh pr merge 71 --squash",
  "wrangler deploy --env production",
  "wrangler pages deploy dist --project-name inshatech",
  "supabase db push --linked",
  "supabase db reset --linked",
  "supabase migration repair --status applied 20261113000100",
  "DROP DATABASE customer_data;",
  "TRUNCATE TABLE public.orders;",
  "DELETE FROM public.customers;",
  "git reset --hard HEAD~1",
  "git clean -fd",
  "npm publish"
];
for (const command of gated) {
  assert.equal(evaluateCommand(command).decision, "force_ask", `Expected explicit approval for: ${command}`);
}

console.log(`PASS: ${safe.length} safe command cases; ${gated.length} high-impact command cases require approval.`);
