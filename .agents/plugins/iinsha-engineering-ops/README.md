# IINSHA Engineering Ops — Antigravity IDE Plugin

A project-specific engineering operations plugin for `adnin4/inshatech`. It adds reusable release/recovery skills, read-only specialist subagents, persistent safety rules, GitHub/Supabase/Cloudflare context, and an approval gate for high-impact terminal commands.

## Important: this plugin does not magically fix infrastructure

It gives Antigravity stronger project context and verified workflows. It cannot authenticate without your approval, resume an inactive Supabase project, invent missing credentials, certify a production deployment, or safely perform owner-only actions without permission.

## Supported target

Built for the **standalone Google Antigravity IDE** plugin loader. Google documents workspace plugins under:

`.agents/plugins/<plugin-name>/`

Global plugins are supported under:

`~/.gemini/config/plugins/<plugin-name>/`

This package is intended for **workspace scope first** so it only affects IINSHA.

## Install on Windows (recommended)

1. Extract the downloaded ZIP.
2. Open PowerShell in the extracted folder.
3. Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\install-workspace.ps1 -WorkspacePath "C:\PATH\TO\YOUR\inshatech\WORKSPACE"
```

The script refuses to overwrite an existing plugin folder. It does not change your Git branch, source files, global MCP configuration, Cloudflare settings, or database.

4. Open/reload the IINSHA workspace in Antigravity IDE.
5. Open the Agent side panel `...` → `Customizations` and inspect the plugin's Skills, Agents, Rules, and MCP entries.
6. Configure the required GitHub and Supabase variables only when prompted.

## MCP setup and permissions

### GitHub (Docker required)

The plugin uses GitHub's official MCP server with:
- `GITHUB_TOOLSETS=repos,issues,pull_requests,actions,code_security`
- `GITHUB_READ_ONLY=1`
- `GITHUB_LOCKDOWN_MODE=1`

The exact string `1` is intentional. Do not replace it with `yes`, `on`, or `enabled`; upstream issue reports show unrecognized values can leave read-only mode off in affected versions.

Create a **fine-grained personal access token** limited to `adnin4/inshatech` with the minimum read permissions needed:
- Metadata: Read
- Contents: Read
- Issues: Read
- Pull requests: Read
- Actions: Read
- Security events: Read (only if repository security data is needed)

Never paste tokens into chat, source files, `.env` committed to Git, or reports. The plugin's variable prompt stores the value through Antigravity's plugin configuration flow.

If Docker Desktop is unavailable, do not weaken this config. Use Antigravity IDE's MCP Store GitHub integration or the authenticated `gh` CLI as a separately approved alternative.

### Supabase (scoped read-only)

The plugin asks for `SUPABASE_PROJECT_REF`. Enter only the **active canonical project ref explicitly confirmed by the owner**. The previously observed `kitwadizsvjmuxkfewxj` project was `INACTIVE`; do not assume it is ready or choose another historical project by guess.

The remote MCP URL is project-scoped, read-only, and exposes only these feature groups: `docs,database,debugging`. This is for diagnosis and schema/migration inspection—not remote mutation. When a write/migration is eventually authorized, use a separate reviewed process and backup.

Do not install a second Supabase MCP server at the same time. Duplicate MCP servers create duplicate tools and confusing authorization paths. The official Supabase agent plugin is available at <https://github.com/supabase-community/supabase-plugin>; choose it instead of this bundled Supabase MCP entry if you prefer its unmodified official bundle, and disable one of the duplicate Supabase servers.

### Cloudflare

- `cloudflare-docs` is enabled for current official documentation.
- `cloudflare-account-control` points to Cloudflare's official API MCP server but is **disabled by default**. Enable it only after reviewing the connected account and granting the minimum necessary permissions. It can expose account-level API capabilities; it is not a read-only guarantee by itself.

Never use production deployment, DNS cutover, secret mutation, Worker deployment, or resource deletion to turn a health report green.

## Playwright browser QA

The plugin includes a browser-QA skill built around Microsoft's Playwright CLI, which Microsoft recommends for coding-agent workflows because CLI + skills is more token-efficient than loading a large browser MCP tool schema.

Optional local setup (from the IINSHA repository root):

```powershell
npm install -D @playwright/cli@latest
npx playwright-cli --help
npx playwright-cli install --skills=agents
```

Follow the installed CLI's help for browser installation and session commands. Do not add or upgrade dependencies without checking the existing package manager and lockfile first.

Antigravity's built-in `/browser` or browser subagent can also be used when available.

## Built-in safety guard

`hooks.json` runs `scripts/policy-guard.mjs` before Antigravity's `run_command` tool. High-impact commands (Git push/merge, Cloudflare deploy/secret changes, Supabase push/reset/migration repair, destructive SQL, and package publishing) require a fresh explicit approval. The hook does not automatically execute or approve these operations.

MCP tools must also remain in Ask/approval mode in Antigravity. The command hook does not intercept MCP actions.

## Validation

From the plugin directory:

```powershell
node .\scriptsalidate-plugin.mjs
node .\scripts	est-policy-guard.mjs
```

If the Antigravity CLI is installed, additionally run:

```powershell
agy plugin validate --strict .\iinsha-engineering-ops
agy plugin list
```

The Antigravity IDE standalone plugin loader can discover workspace plugins without requiring CLI installation. Restart/reload Antigravity IDE after adding the plugin if it does not appear immediately.

## Included capabilities

- Main release coordinator + read-only repository, database, Cloudflare, and security subagents.
- Skills for source reconciliation, safe repairs, database recovery, infrastructure evidence, browser QA, and release reporting.
- Persistent IINSHA architecture and release-boundary rules.
- Exact-SHA CI and production parity guidance.
- Approval hook for sensitive terminal operations.

## Starting prompt

After installation, ask:

> Activate IINSHA Engineering Ops. First perform a read-only discovery pass: inspect workspace Git state, compare candidate/main/master/PR heads, inspect current CI for exact SHAs, inspect Supabase project/migration status, inspect Cloudflare staging and production version/health endpoints, then produce a blocker-ranked execution plan. Do not edit files, push, merge, migrate, deploy, rotate secrets, or change DNS during discovery. After reporting evidence, proceed only with local changes and tests that are safe without external owner approval.
