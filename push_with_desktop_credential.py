import subprocess

git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
helper_path = r"C:/Users/mahin khan/AppData/Local/GitHubDesktop/app-3.6.3/resources/app/git/mingw64/libexec/git-core/git-credential-desktop.exe"
cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"

print("--- Testing git push with git-credential-desktop ---")
cmd1 = [git_exe, "-c", f"credential.helper={helper_path}", "push", "origin", "master:main", "--force"]
res1 = subprocess.run(cmd1, cwd=cwd, capture_output=True, text=True, timeout=30)
print("OUT 1:", res1.stdout)
print("ERR 1:", res1.stderr)
print("CODE 1:", res1.returncode)

helper2_path = r"C:/Users/mahin khan/AppData/Local/GitHubDesktop/app-3.6.3/resources/app/git/mingw64/libexec/git-core/git-credential-wincred.exe"
print("--- Testing git push with git-credential-wincred ---")
cmd2 = [git_exe, "-c", f"credential.helper={helper2_path}", "push", "origin", "master:main", "--force"]
res2 = subprocess.run(cmd2, cwd=cwd, capture_output=True, text=True, timeout=30)
print("OUT 2:", res2.stdout)
print("ERR 2:", res2.stderr)
print("CODE 2:", res2.returncode)
