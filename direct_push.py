import subprocess, os, sys

git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

env = os.environ.copy()
env["GIT_TERMINAL_PROMPT"] = "0"

print("--- Step 1: Checking Git Status ---")
res1 = subprocess.run([git_exe, "status"], cwd=cwd, capture_output=True, text=True, env=env)
print("STATUS STDOUT:", res1.stdout)
print("STATUS STDERR:", res1.stderr)

print("--- Step 2: Attempting Push origin master:main ---")
res2 = subprocess.run([git_exe, "push", "origin", "master:main", "--force"], cwd=cwd, capture_output=True, text=True, env=env, timeout=30)
print("PUSH MAIN STDOUT:", res2.stdout)
print("PUSH MAIN STDERR:", res2.stderr)

print("--- Step 3: Attempting Push origin master:master ---")
res3 = subprocess.run([git_exe, "push", "origin", "master:master", "--force"], cwd=cwd, capture_output=True, text=True, env=env, timeout=30)
print("PUSH MASTER STDOUT:", res3.stdout)
print("PUSH MASTER STDERR:", res3.stderr)
