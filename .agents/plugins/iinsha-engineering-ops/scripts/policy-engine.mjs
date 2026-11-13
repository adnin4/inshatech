const FORCE_ASK_PATTERNS = [
  { pattern: /\bgit\s+push\b/i, reason: "Git push changes a remote repository. Review the target remote and branch first." },
  { pattern: /\bgh\s+pr\s+merge\b/i, reason: "Merging a pull request changes the canonical source history. Verify required checks and approval first." },
  { pattern: /\bgh\s+release\s+create\b/i, reason: "Creating a release publishes a project artifact/tag. Verify exact SHA and release approval first." },
  { pattern: /\bwrangler\s+(?:deploy|pages\s+deploy|delete|secret\s+put|secret\s+delete)\b/i, reason: "Cloudflare deploy, resource deletion, or secret mutation requires explicit environment and owner approval." },
  { pattern: /\bsupabase\s+(?:db\s+(?:push|reset)|migration\s+repair|functions\s+deploy|secrets\s+set|projects\s+(?:pause|resume))\b/i, reason: "Supabase migration, reset, repair, deployment, secret, or project-state operation requires verified project identity, backup, and owner approval." },
  { pattern: /\b(?:drop\s+(?:database|schema|table)|truncate\s+(?:table\s+)?|delete\s+from)\b/i, reason: "Potentially destructive SQL requires an explicit review of target, transaction, backup, and blast radius." },
  { pattern: /\bgit\s+reset\s+--hard\b|\bgit\s+clean\s+-[^\n]*f/i, reason: "This command can permanently remove local work. Inspect and back up the worktree first." },
  { pattern: /(?:^|[;&|])\s*rm\s+-rf\b|\bRemove-Item\b(?=[^\n]*(?:-Recurse|-Force))/i, reason: "Recursive forced deletion can destroy project data. Inspect the exact path and obtain explicit approval." },
  { pattern: /\b(?:npm|pnpm|yarn)\s+publish\b/i, reason: "Publishing a package is externally visible. Verify package contents, version, registry, and approval." }
];

export function evaluateCommand(command) {
  if (typeof command !== "string" || command.trim() === "") {
    return { decision: "force_ask", reason: "Command could not be inspected safely; manual approval is required." };
  }
  for (const item of FORCE_ASK_PATTERNS) {
    if (item.pattern.test(command)) {
      return { decision: "force_ask", reason: item.reason };
    }
  }
  return { decision: "allow" };
}

export function extractCommand(input) {
  const args = input?.toolCall?.args ?? {};
  const candidates = [
    args.CommandLine, args.commandLine, args.command, args.cmd, args.script,
    args.code, args.query, args.sql, args.arguments
  ];
  const strings = candidates.filter(value => typeof value === "string");
  return strings.join("\n");
}
