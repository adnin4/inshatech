import subprocess

git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

cmd = [git_exe, "push", "--set-upstream", "origin", "master"]
res = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
print("OUT:", res.stdout)
print("ERR:", res.stderr)
print("CODE:", res.returncode)
