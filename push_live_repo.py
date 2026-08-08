import os, subprocess

cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
token = "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"
remote_url = f"https://adnin4:{token}@github.com/adnin4/inshatech-live.git"

print("--- Running git push origin master:main ---")
res_p1 = subprocess.run([git_exe, "push", remote_url, "master:main", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MAIN ERR:", res_p1.stderr)
