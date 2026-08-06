@echo off
title Adnin Sadat (iinshaa) — Auto Netlify & Git Publisher
echo ======================================================================
echo ADNIN SADAT (iinshaa) — AUTO WEBSITE PUBLISHER & AI AGENT SYNC
echo ======================================================================
echo Target Site: https://iinsha.netlify.app
echo Direct Email: adnansadatmahin5@gmail.com
echo Direct Phone/WA: +8801629286887
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Packaging latest files into site_deploy.zip...
python deploy_to_netlify.py

echo.
echo [2/3] Triggering 24/7 AI Business Master Agent Daemon...
python ai_master_agent_daemon.py

echo.
echo [3/3] Deploying to Netlify...
npx -y netlify-cli deploy --dir=. --site=iinsha.netlify.app --prod

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ======================================================================
    echo 💡 NETLIFY CLI AUTHENTICATION NOTICE:
    echo Your updated website zip file 'site_deploy.zip' is ready at:
    echo %CD%\site_deploy.zip
    echo.
    echo To update https://iinsha.netlify.app in 5 seconds:
    echo 1. Open https://app.netlify.com/sites/iinsha/deploys
    echo 2. Drag & Drop 'site_deploy.zip' into the Netlify browser window!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo ✅ SUCCESS! Website & 24/7 AI Agent synced automatically!
    echo Live Website: https://iinsha.netlify.app
    echo ======================================================================
)

pause
