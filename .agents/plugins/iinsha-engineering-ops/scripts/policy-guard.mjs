import { evaluateCommand, extractCommand } from "./policy-engine.mjs";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

try {
  const event = JSON.parse(raw);
  const toolName = event?.toolCall?.name ?? "";
  if (toolName !== "run_command") {
    process.stdout.write(JSON.stringify({ decision: "allow" }));
  } else {
    const command = extractCommand(event);
    process.stdout.write(JSON.stringify(evaluateCommand(command)));
  }
} catch {
  // Fail closed to a human approval request if hook input cannot be parsed.
  process.stdout.write(JSON.stringify({
    decision: "force_ask",
    reason: "Safety hook could not parse the proposed command. Review it manually before execution."
  }));
}
