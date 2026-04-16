@echo off
echo 🚀 Initializing Git...
git init

echo 📦 Adding files...
git add .

echo 💾 Committing changes...
git commit -m "feat: complete refined campus hub suite with security fixes"

echo 🌿 Setting branch to main...
git branch -M main

echo 🔗 Adding remote origin...
git remote add origin https://github.com/vis-a11y/CampChat---Campus-Hub.git

echo 📤 Pushing to GitHub...
git push -u origin main

echo ✅ Done!
pause
