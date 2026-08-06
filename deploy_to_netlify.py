import os
import zipfile

def zip_site_files():
    zip_filename = "site_deploy.zip"
    
    # Exclude virtual environments or temporary build files
    exclude_dirs = {".git", "__pycache__", "node_modules", ".vscode", "scratch"}
    exclude_files = {zip_filename}
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file in exclude_files:
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ".")
                zipf.write(full_path, rel_path)
                print(f"Zipped: {rel_path}")
    
    print(f"\nSuccessfully created {zip_filename} ({os.path.getsize(zip_filename)} bytes)")

if __name__ == "__main__":
    zip_site_files()
