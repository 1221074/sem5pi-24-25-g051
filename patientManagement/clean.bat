@echo off

echo Cleaning project...

REM Delete the node_modules folder
if exist node_modules (
    echo Deleting node_modules...
    rmdir /s /q node_modules
) else (
    echo node_modules folder not found.
)

REM Confirm cleanup completion
echo Project cleaned successfully.
pause