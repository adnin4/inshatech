import subprocess

npx_cmd = r"C:\Program Files\nodejs\npx.cmd"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

print("--- Running Wrangler Pages Deploy ---")
proc = subprocess.run([npx_cmd, "-y", "wrangler", "pages", "deploy", "cloudflare_pages_dist", "--project-name=inshatech"], cwd=cwd, capture_output=True, text=True, timeout=30)

print("STDOUT:\n", proc.stdout)
print("STDERR:\n", proc.stderr)
print("EXIT CODE:", proc.returncode)
