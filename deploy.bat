@echo off
echo Deploying to Vercel...
echo.

REM Add all files
echo Adding files to git...
git add .

REM Commit
echo Committing changes...
git commit -m "feat: Complete attendance system with Excel import - Added Excel import for bulk student upload - Changed late threshold to 7:00 AM - Fixed duplicate QR scan issue - All ESLint errors resolved - Production ready"

REM Push
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Vercel will auto-deploy from GitHub.
echo Check your Vercel dashboard for deployment status.
echo.
echo Dashboard: https://vercel.com/dashboard
pause
