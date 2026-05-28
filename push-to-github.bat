@echo off
echo Initializing Git repository...
git init

echo.
echo Adding files to staging area...
git add .

echo.
echo Committing changes...
git commit -m "Complete campus social media app features"

echo.
echo Setting branch to main...
git branch -M main

echo.
echo Adding remote origin...
git remote add origin https://github.com/vis-a11y/camp-hub-campus-social-media.git

echo.
echo Pushing to GitHub...
git push -u origin main --force

echo.
echo Done! Press any key to exit.
pause
