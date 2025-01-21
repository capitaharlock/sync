@echo off
setlocal enabledelayedexpansion

:: Set base directory
set "BASE_DIR=C:\Users\Workstation\Documents\Prj\pwc\sync\cb-scadot-api"

:: Colors
set "GREEN=[32m"
set "BLUE=[34m"
set "NC=[0m"

:: Print folder structure
echo %GREEN%Folder structure:%NC%
dir /s /b "%BASE_DIR%"

echo.
echo %GREEN%File contents:%NC%

:: Main files to check
set "FILES=cmd\main.go go.mod go.sum docker-compose.yml Dockerfile .env"

:: Print content of main files
for %%f in (%FILES%) do (
    if exist "%BASE_DIR%\%%f" (
        echo %BLUE%=== %%f ===%NC%
        echo Contents:
        type "%BASE_DIR%\%%f"
        echo.
        echo %BLUE%=== End of %%f ===%NC%
        echo.
    ) else (
        echo %BLUE%File %%f does not exist%NC%
    )
)

:: Print all other .go files
for /r "%BASE_DIR%" %%f in (*.go) do (
    if not "%%f"=="%BASE_DIR%\cmd\main.go" (
        echo %BLUE%=== %%~nxf ===%NC%
        echo Contents:
        type "%%f"
        echo.
        echo %BLUE%=== End of %%~nxf ===%NC%
        echo.
    )
)

echo %GREEN%End of file listing%NC%
endlocal