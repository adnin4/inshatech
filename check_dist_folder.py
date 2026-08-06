import os

cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

print("Root files:", os.listdir(cwd))

dist_dir = os.path.join(cwd, "dist")
if os.path.exists(dist_dir):
    print("dist files:", os.listdir(dist_dir))
else:
    print("dist directory does not exist!")
