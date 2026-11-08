import os
import re
import json

project_dir = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

audit_results = {
    "files": [],
    "hardcoded_objects": [],
    "storage_usage": [],
    "api_calls": [],
    "missing_functions": [],
    "duplicate_data": []
}

for root, dirs, files in os.walk(project_dir):
    if '.git' in root or 'node_modules' in root or '.wrangler' in root:
        continue
    for f in files:
        if f.endswith(('.html', '.js', '.css', '.sql', '.toml', '.json')):
            fp = os.path.join(root, f)
            rel_path = os.path.relpath(fp, project_dir)
            size = os.path.getsize(fp)
            audit_results["files"].append({"path": rel_path, "size": size})

print(f"Audited {len(audit_results['files'])} project files.")
with open(os.path.join(project_dir, "audit_summary.json"), "w", encoding="utf-8") as out:
    json.dump(audit_results, out, indent=2)

print("Audit summary written to audit_summary.json")
