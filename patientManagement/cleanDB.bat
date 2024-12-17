@echo off

echo Cleaning the database...

REM Run the cleanDatabase.js script
node cleanDatabase.js
if %errorlevel% neq 0 (
    echo Error occurred while cleaning the database. Exiting...
    pause
    exit /b %errorlevel%
)

echo Database cleaned successfully.
pause