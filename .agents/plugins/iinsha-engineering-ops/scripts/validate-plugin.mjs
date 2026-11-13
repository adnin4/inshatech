import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const manifest = readJson("plugin.json");
assert.match(manifest.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
assert.ok(manifest.version && manifest.description && manifest.suggestedPrompts?.length);
readJson("mcp_config.json");
readJson("hooks.json");
assert.ok(fs.existsSync(path.join(root, manifest.logo)), "Plugin logo is missing");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
const skills = walk(path.join(root, "skills")).filter(file => path.basename(file) === "SKILL.md");
assert.ok(skills.length >= 5, "Expected multiple skills");
for (const file of skills) {
  const body = fs.readFileSync(file, "utf8");
  const rel = path.relative(path.join(root, "skills"), path.dirname(file)).split(path.sep).join("/");
  const nameMatch = body.match(/^name:\s*([a-z0-9-]+)\s*$/m);
  const descriptionMatch = body.match(/^description:\s*(.+)$/m);
  assert.ok(nameMatch, `Missing skill name: ${file}`);
  assert.ok(descriptionMatch, `Missing skill description: ${file}`);
  assert.equal(nameMatch[1], rel, `Skill name must match its folder: ${file}`);
}

const agents = walk(path.join(root, "agents")).filter(file => file.endsWith(".md"));
assert.ok(agents.length >= 4, "Expected specialist agents");
for (const file of agents) {
  const body = fs.readFileSync(file, "utf8");
  assert.match(body, /^name:\s*[a-z0-9-]+\s*$/m, `Missing agent name: ${file}`);
  assert.match(body, /^description:\s*.+$/m, `Missing agent description: ${file}`);
}

console.log(`PASS: manifest/MCP/hooks JSON, logo, ${skills.length} skills, and ${agents.length} agent definitions validated.`);
