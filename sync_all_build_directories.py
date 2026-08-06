import os, shutil

cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

target_dirs = ["dist", "public", "build", "cloudflare_pages_dist"]

# Files to sync
files_to_copy = [
    "index.html", "app.js", "style.css", "store.html", "portal.html",
    "affiliate.html", "blog.html", "compare.html", "marketplace.html",
    "robots.txt", "sitemap.xml", "_headers", "_redirects"
]

# Add all jpg/png files
for f in os.listdir(cwd):
    if f.endswith(".jpg") or f.endswith(".png") or f.endswith(".svg"):
        files_to_copy.append(f)

for t in target_dirs:
    target_path = os.path.join(cwd, t)
    os.makedirs(target_path, exist_ok=True)
    for f in files_to_copy:
        src = os.path.join(cwd, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(target_path, f))
    print(f"Synced {len(files_to_copy)} files to folder: {t}")

print("All build output directories synchronized successfully!")
