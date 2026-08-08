import subprocess
import time
import sys
import os

print("Starting surge deployment...")

p = subprocess.Popen('surge ./ inshatech-demo.surge.sh', shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

try:
    stdout, stderr = p.communicate(input="insha.demo.user1@gmail.com\ninsha123456\ninsha123456\n", timeout=30)
    print("STDOUT:", stdout)
    print("STDERR:", stderr)
except Exception as e:
    print("Error:", e)
    p.kill()
