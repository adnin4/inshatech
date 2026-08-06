import subprocess

ps_script = """
Add-Type -AssemblyName System.Windows.Forms;
$wshell = New-Object -ComObject WScript.Shell;
$app = Get-Process -Name "GitHubDesktop" -ErrorAction SilentlyContinue;
if ($app) {
    $wshell.AppActivate($app[0].Id);
    Start-Sleep -Milliseconds 500;
    [System.Windows.Forms.SendKeys]::SendWait("^p");
    Start-Sleep -Milliseconds 500;
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}");
}
"""

res = subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
