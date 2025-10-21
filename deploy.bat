@echo off
echo Deploying to Vercel...
echo.

REM Add all files
echo Adding files to git...
git add .

REM Commit
echo Committing changes...
git commit -m "Fix: Prevent duplicate QR scan - Added 3 second cooldown between scans - Added processing state to prevent rapid scanning - Clear scanned data after 3 seconds"

REM Push
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Vercel will auto-deploy from GitHub.
echo Check your Vercel dashboard for deployment status.
echo.
echo Dashboard: https://vercel.com/dashboard
pause
