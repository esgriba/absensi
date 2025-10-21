@echo off
echo Deploying to Vercel...
echo.

REM Add all files
echo Adding files to git...
git add .

REM Commit
echo Committing changes...
git commit -m "feat: Add Excel import feature for bulk student data upload - Added import page with upload functionality - Download Excel template feature - Real-time preview and validation - Bulk insert with progress tracking - Error handling for duplicate NIS - Updated homepage and students page UI"

REM Push
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Vercel will auto-deploy from GitHub.
echo Check your Vercel dashboard for deployment status.
echo.
echo Dashboard: https://vercel.com/dashboard
pause
