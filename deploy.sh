#!/bin/bash
echo "🚀 Deploying Keys Credit Predictor to GitHub..."

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git is not installed or XCode Developer Tools are missing."
    echo "   Please run 'xcode-select --install' in your terminal first."
    exit 1
fi

# Initialize and push
git init
git add .
git commit -m "Initial commit of Keys Credit Predictor (B.L.A.S.T. Protocol)"
git branch -M main
git remote add origin https://github.com/helloupmarketing-create/KeysCreditPredictor
git push -u origin main

echo "✅ Deployment Complete!"
