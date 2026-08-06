import os

for k, v in os.environ.items():
    if "CLOUDFLARE" in k.upper() or "CF_" in k.upper() or "TOKEN" in k.upper() or "KEY" in k.upper() or "SECRET" in k.upper():
        print(f"{k} = {v[:10]}...")

print("\n--- Searching user profile for Wrangler/Cloudflare files ---")
user_profile = os.environ.get("USERPROFILE", "")
for root, dirs, files in os.walk(os.path.join(user_profile, ".wrangler")):
    for f in files:
        print(os.path.join(root, f))
