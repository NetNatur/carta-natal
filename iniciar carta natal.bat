@echo off
cd /d "%~dp0"

rem Node viene empaquetado con AutoClaw; si no esta en el PATH del sistema
rem se usa la ruta completa. Si instalas Node global, este archivo sigue valido
rem porque el "if not exist" cae de nuevo en el comando "node".
set "NODE=C:\Program Files\AutoClaw\resources\node\node.exe"
if not exist "%NODE%" set "NODE=node"

echo ============================================
echo   Carta Natal - Swiss Ephemeris 2.10.03
echo   Iniciando servidor local...
echo ============================================
start "" http://localhost:8765
"%NODE%" server.js
pause
