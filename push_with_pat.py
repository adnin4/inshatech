import subprocess

git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

token = "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"
remote_url = f"https://adnin4:{token}@github.com/adnin4/inshatech.git"

print("--- Pushing local master branch to remote main branch ---")
res1 = subprocess.run([git_exe, "push", remote_url, "master:main", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MAIN STDOUT:", res1.stdout)
print("PUSH MAIN STDERR:", res1.stderr)
print("PUSH MAIN EXIT CODE:", res1.returncode)

print("\n--- Pushing local master branch to remote master branch ---")
res2 = subprocess.run([git_exe, "push", remote_url, "master:master", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MASTER STDOUT:", res2.stdout)
print("PUSH MASTER STDERR:", res2.stderr)
print("PUSH MASTER EXIT CODE:", res2.returncode)
