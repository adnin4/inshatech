# IINSHA AI-BOS: 1-Click Secure Git Push Helper
param(
    [string]$Pat = $env:GITHUB_PAT
)

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "🚀 IINSHA AI-BOS: GITHUB MASTER PUSH HELPER" -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan

if (-not $Pat) {
    Write-Host "ℹ️ No GITHUB_PAT env var found. Launching git push via Git Credential Manager..." -ForegroundColor Yellow
    Write-Host "👉 If an OAuth popup appears on your screen, click 'Authorize' to complete." -ForegroundColor Yellow
    git push origin master
} else {
    Write-Host "🔐 Pushing with provided Personal Access Token (PAT)..." -ForegroundColor Green
    git push "https://$Pat@github.com/adnin4/inshatech.git" master
}
