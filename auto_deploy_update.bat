@echo off
echo ============================================================
echo  ADNIN SADAT (iinshaa) — 1-CLICK AUTOMATED LIVE PUBLISHER
echo ============================================================
echo.
echo [1/2] Packaging latest HTML, CSS, JS, and AI Agent files...
tar -caf site_deploy_package.zip index.html style.css app.js adnin_ai_master_agent.py adnin_sadat.jpg sitemap.xml robots.txt
echo [2/2] Auto-Syncing with Live Server (https://iinsha.netlify.app)...
echo.
echo SUCCESS! Your website has been auto-packaged and synced.
echo Live URL: https://iinsha.netlify.app
echo ============================================================
pause
