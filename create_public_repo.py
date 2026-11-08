import urllib.request
import json
import subprocess
import os

TOKEN = "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"
NEW_REPO_NAME = "inshatech-live"

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

# Create public repo
print(f"Creating public repo {NEW_REPO_NAME}...")
repo_data = {
    "name": NEW_REPO_NAME,
    "description": "Live production deployment for IINSHA TECH OS",
    "private": False,
    "has_pages": True
}
res = request("POST", "https://api.github.com/user/repos", data=repo_data)
if res:
    print("Repo created:", res['html_url'])
else:
    print("Failed to create repo, maybe it exists.")
