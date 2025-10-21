@echo off
echo Building application...
call npm run build

if %errorlevel% equ 0 (
    echo Build successful!
    echo Ready to deploy to Vercel
) else (
    echo Build failed. Please fix the errors above.
    exit /b 1
)
