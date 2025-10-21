@echo off
echo Deploying to Vercel...
echo.

REM Add all files
echo Adding files to git...
git add .

REM Commit
echo Committing changes...
git commit -m "Fix: ESLint and TypeScript errors for production build - Fixed TypeScript 'any' type errors - Fixed React Hooks exhaustive-deps warnings - Removed unused variables and imports - Ready for production deployment"

REM Push
echo Pushing to GitHub...
git push origin main

echo.
echo Done! Vercel will auto-deploy from GitHub.
echo Check your Vercel dashboard for deployment status.
echo.
echo Dashboard: https://vercel.com/dashboard
pause
