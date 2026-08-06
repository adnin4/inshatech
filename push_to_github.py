import subprocess, os

git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

try:
    res = subprocess.run([git_exe, "push", "origin", "master"], cwd=cwd, capture_output=True, text=True, timeout=30)
    print("STDOUT:", res.stdout)
    print("STDERR:", res.stderr)
    print("RETURNCODE:", res.returncode)
except Exception as e:
    print("EXCEPTION:", str(e))
