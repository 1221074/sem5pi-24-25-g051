@echo off

REM Execute bootstrap.js
echo Running bootstrap.js...
node bootstrap.js
if %errorlevel% neq 0 (
    echo Error running bootstrap.js. Exiting...
    pause
    exit /b %errorlevel%
)

REM Execute project setup
echo Running 'npm run start'...
npm run start
if %errorlevel% neq 0 (
    echo Error running index.js.
    pause
    exit /b %errorlevel%
)

REM Pause to keep the window open
pause
