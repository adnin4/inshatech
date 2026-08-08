import subprocess

print("--- Triggering Wrangler Login ---")
try:
    proc = subprocess.Popen(["npx", "-y", "wrangler", "login"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print("Wrangler login process launched! Check browser for Cloudflare login.")
except Exception as e:
    print("ERR:", str(e))
