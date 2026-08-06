import urllib.request, json

token = "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"
headers = {
    "User-Agent": "Python-App",
    "Authorization": f"token {token}",
    "Accept": "application/vnd.github.v3+json"
}

# 1. Get Repo Details
req = urllib.request.Request("https://api.github.com/repos/adnin4/inshatech", headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("DEFAULT BRANCH:", data.get("default_branch"))
except Exception as e:
    print("REPO ERR:", str(e))

# 2. Get Branches
req2 = urllib.request.Request("https://api.github.com/repos/adnin4/inshatech/branches", headers=headers)
try:
    with urllib.request.urlopen(req2) as resp2:
        data2 = json.loads(resp2.read().decode('utf-8'))
        print("BRANCHES:", [b["name"] for b in data2])
except Exception as e:
    print("BRANCH ERR:", str(e))

# 3. Get Recent Commits on main and master
for b in ["main", "master"]:
    req3 = urllib.request.Request(f"https://api.github.com/repos/adnin4/inshatech/commits?sha={b}&per_page=3", headers=headers)
    try:
        with urllib.request.urlopen(req3) as resp3:
            data3 = json.loads(resp3.read().decode('utf-8'))
            print(f"\n--- Recent Commits on {b} ---")
            for c in data3:
                print(c["sha"][:7], c["commit"]["message"].split("\n")[0])
    except Exception as e:
        print(f"COMMIT ERR {b}:", str(e))
