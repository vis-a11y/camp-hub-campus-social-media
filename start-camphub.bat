@echo off
echo Starting CampHub Setup...

echo.
echo Installing Backend Dependencies...
cd backend
call npm install

echo.
echo Starting Backend Server...
start "CampHub Backend" cmd /k "npm run dev"

echo.
echo Installing Frontend Dependencies...
cd ../client
call npm install

echo.
echo Starting Frontend React App...
start "CampHub Frontend" cmd /k "npm run dev"

echo.
echo CampHub is starting in separate windows!
pause
