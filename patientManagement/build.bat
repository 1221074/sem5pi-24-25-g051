@echo off

REM Install dependencies
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error during npm install. Exiting...
    pause
    exit /b %errorlevel%
)