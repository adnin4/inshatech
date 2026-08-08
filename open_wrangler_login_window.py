import subprocess

cmd = 'Start-Process powershell -ArgumentList "-NoExit -Command npx -y wrangler login"'
res = subprocess.run(["powershell", "-Command", cmd], capture_output=True, text=True)
print("Launched interactive wrangler login window!")
