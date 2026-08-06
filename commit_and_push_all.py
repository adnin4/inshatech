import subprocess

git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
token = "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"
remote_url = f"https://adnin4:{token}@github.com/adnin4/inshatech.git"

print("--- Step 1: Git Add . ---")
subprocess.run([git_exe, "add", "."], cwd=cwd)

print("--- Step 2: Git Commit ---")
res_c = subprocess.run([git_exe, "commit", "-m", "Embed full pre-rendered 20-Module Control Studio HTML in index.html"], cwd=cwd, capture_output=True, text=True)
print("COMMIT OUT:", res_c.stdout)
print("COMMIT ERR:", res_c.stderr)

print("--- Step 3: Git Push to main ---")
res_p = subprocess.run([git_exe, "push", remote_url, "master:main", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MAIN OUT:", res_p.stdout)
print("PUSH MAIN ERR:", res_p.stderr)
print("PUSH MAIN CODE:", res_p.returncode)
