import os
import zipfile

def build_cloudflare_pages_zip():
    source_dir = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase"
    output_zip = os.path.join(source_dir, "cloudflare_pages_dist.zip")
    
    # Extensions and files allowed for Cloudflare Pages static upload
    allowed_extensions = {'.html', '.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.gif', '.ico', '.txt', '.xml'}
    allowed_exact_files = {'_headers', 'robots.txt', 'sitemap.xml'}
    
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
                
                # Check if it's the output zip itself
                if file.endswith('.zip') or file in ignored_exact_files:
                    continue
                    
                ext = os.path.splitext(file)[1].lower()
                
                if file in allowed_exact_files or ext in allowed_extensions:
                    # Do not include backend python scripts in static zip
                    if ext == '.py':
                        continue
                    zipf.write(filepath, relpath)
                    count += 1

    print(f"\nSuccessfully created clean Cloudflare Pages package: cloudflare_pages_dist.zip ({count} files)")

if __name__ == "__main__":
    build_cloudflare_pages_zip()

