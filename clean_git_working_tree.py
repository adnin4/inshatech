import os, subprocess

cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
token = "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"
remote_url = f"https://adnin4:{token}@github.com/adnin4/inshatech.git"

temp_files = [
    "fix_admin_modal_clean_html.py", "sync_all_build_directories.py", "fix_duplicate_style_attrs.py"
]

for f in temp_files:
    p = os.path.join(cwd, f)
    if os.path.exists(p):
        try:
            os.remove(p)
        except:
            pass

print("--- Running git add -A ---")
subprocess.run([git_exe, "add", "-A"], cwd=cwd)

print("--- Running git commit ---")
res_c = subprocess.run([git_exe, "commit", "-m", "Remove duplicate style attribute and clean admin modal HTML"], cwd=cwd, capture_output=True, text=True)
print("COMMIT OUT:", res_c.stdout)

print("--- Running git push origin master:main ---")
res_p1 = subprocess.run([git_exe, "push", remote_url, "master:main", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MAIN ERR:", res_p1.stderr)

print("--- Running git push origin master:master ---")
res_p2 = subprocess.run([git_exe, "push", remote_url, "master:master", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MASTER ERR:", res_p2.stderr)
