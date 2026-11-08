import urllib.request
import json
import base64
import os

TOKEN = "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"
REPO = "adnin4/inshatech"

def request(method, url, data=None):
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python"
    }
    req = urllib.request.Request(url, headers=headers, method=method)
    if data:
        req.data = json.dumps(data).encode("utf-8")
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error {e.code}: {e.read().decode()}")
        return None

# Get master branch ref
master_ref = request("GET", f"https://api.github.com/repos/{REPO}/git/ref/heads/master")
if not master_ref:
    print("Failed to get master ref")
    exit(1)

master_sha = master_ref['object']['sha']

# Check if gh-pages branch exists
gh_pages_ref = request("GET", f"https://api.github.com/repos/{REPO}/git/ref/heads/gh-pages")

if gh_pages_ref:
    # Update existing gh-pages branch
    print("gh-pages branch exists, updating...")
    data = {"sha": master_sha, "force": True}
    res = request("PATCH", f"https://api.github.com/repos/{REPO}/git/refs/heads/gh-pages", data=data)
    print("Updated gh-pages:", res)
else:
    # Create gh-pages branch
    print("Creating gh-pages branch...")
    data = {"ref": "refs/heads/gh-pages", "sha": master_sha}
    res = request("POST", f"https://api.github.com/repos/{REPO}/git/refs", data=data)
    print("Created gh-pages:", res)

# Attempt to configure Pages via API (requires specific permissions, but might work)
print("Enabling GitHub Pages...")
pages_data = {
    "source": {
        "branch": "gh-pages",
        "path": "/"
    }
}
pages_res = request("POST", f"https://api.github.com/repos/{REPO}/pages", data=pages_data)
if not pages_res:
    # Maybe it's already enabled or updating
    pages_res = request("PUT", f"https://api.github.com/repos/{REPO}/pages", data=pages_data)
    
print("Pages Config:", pages_res)
