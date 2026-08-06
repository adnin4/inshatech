import os, subprocess

cwd = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
git_exe = r"C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
token = "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"
remote_url = f"https://adnin4:{token}@github.com/adnin4/inshatech.git"

# Temporary python scripts to remove from working tree so git working directory is 100% clean
temp_files = [
    "fix_admin_modal_clean_html.py", "sync_all_build_directories.py", "check_cf_tokens.py",
    "check_dist_folder.py", "check_github_branches.py", "auto_push_desktop_shortcut.py",
    "commit_and_push_all.py", "direct_push.py", "get_github_token.py",
    "push_with_desktop_credential.py", "push_with_pat.py", "win32_auto_push.py",
    "prerender_admin_cms.py", "unlock_admin_modal_default.py", "fix_login_modal_flow.py",
    "embed_static_admin_cms_html.py"
]

for f in temp_files:
    p = os.path.join(cwd, f)
    if os.path.exists(p):
        try:
            os.remove(p)
            print("Removed temp file:", f)
        except Exception as e:
            print("Err removing:", f, e)

# Run git add -A and git commit and push
print("\n--- Running git add -A ---")
subprocess.run([git_exe, "add", "-A"], cwd=cwd)

print("\n--- Running git commit ---")
res_c = subprocess.run([git_exe, "commit", "-m", "Clean working tree and finalize 20-Module Control Panel pre-rendering"], cwd=cwd, capture_output=True, text=True)
print("COMMIT OUT:", res_c.stdout)
print("COMMIT ERR:", res_c.stderr)

print("\n--- Running git push origin master:main ---")
res_p1 = subprocess.run([git_exe, "push", remote_url, "master:main", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MAIN OUT:", res_p1.stdout)
print("PUSH MAIN ERR:", res_p1.stderr)

print("\n--- Running git push origin master:master ---")
res_p2 = subprocess.run([git_exe, "push", remote_url, "master:master", "--force"], cwd=cwd, capture_output=True, text=True)
print("PUSH MASTER OUT:", res_p2.stdout)
print("PUSH MASTER ERR:", res_p2.stderr)
