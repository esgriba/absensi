#!/bin/bash

echo "Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Ready to deploy to Vercel"
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi
