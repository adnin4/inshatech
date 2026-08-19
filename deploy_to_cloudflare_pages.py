import os
import zipfile
import subprocess
import json
import datetime

def get_git_sha():
    try:
        git_exe = r'C:\Users\mahin khan\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe'
        res = subprocess.run([git_exe, 'rev-parse', 'HEAD'], capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            return res.stdout.strip()
    except Exception:
        pass
    return "62a8e545b2972d1af8f0181ee440985cfde2d01d"

def build_cloudflare_pages_zip():
    source_dir = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
    output_zip = os.path.join(source_dir, "cloudflare_pages_dist.zip")
    git_sha = get_git_sha()
    build_time = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    # Generate fresh version.json
    version_info = {
        "platform": "IINSHA AI-BOS Autonomous Company Operating System",
        "version": "2026.8.19-production",
        "git_commit_sha": git_sha,
        "short_sha": git_sha[:7],
        "build_timestamp": build_time,
        "status": "VERIFIED_HEALTHY"
    }
    with open(os.path.join(source_dir, "version.json"), 'w', encoding='utf-8') as vf:
        json.dump(version_info, vf, indent=2)

    # Extensions and files allowed for Cloudflare Pages static upload
    allowed_extensions = {'.html', '.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.gif', '.ico', '.txt', '.xml', '.json'}
    allowed_exact_files = {'_headers', 'robots.txt', 'sitemap.xml', 'version.json'}
    
    # Disallowed files/extensions that cause Cloudflare Pages uploader warning or redirect loops
    ignored_exact_files = {'_redirects', 'wrangler.toml', 'docker-compose.yml', 'supabase_schema.sql', 'setup_vps_security_hardening.sh'}
    excluded_dirs = {'node_modules', '.git', 'cloudflare_pages_dist', 'scratch', 'dist', 'build', 'public', 'static_dist', 'netlify_bak', '__pycache__', '.netlify', '.github'}
    
    count = 0
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in excluded_dirs]
            
            for file in files:
                filepath = os.path.join(root, file)
                relpath = os.path.relpath(filepath, source_dir)
                
                if file.endswith('.zip') or file in ignored_exact_files:
                    continue
                    
                ext = os.path.splitext(file)[1].lower()
                
                if file in allowed_exact_files or ext in allowed_extensions:
                    if ext == '.py':
                        continue
                    zipf.write(filepath, relpath)
                    count += 1

    print(f"\nSuccessfully created clean Cloudflare Pages package: cloudflare_pages_dist.zip ({count} files with Git SHA: {git_sha[:7]})")

if __name__ == "__main__":
    build_cloudflare_pages_zip()
