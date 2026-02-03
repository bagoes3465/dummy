@echo off
REM Test Phase 4 API Endpoints

echo.
echo === TESTING PHASE 4 API ===
echo.

REM Test 1: Health
echo [TEST] Health Check...
curl -s http://localhost:3000/api/health > nul
if %errorlevel% equ 0 (
  echo [PASS] Health Check
) else (
  echo [FAIL] Health Check
)

REM Test 2: Backgrounds
echo [TEST] Backgrounds...
curl -s http://localhost:3000/api/backgrounds > nul
if %errorlevel% equ 0 (
  echo [PASS] Backgrounds
) else (
  echo [FAIL] Backgrounds
)

REM Test 3: Filters
echo [TEST] Filters...
curl -s http://localhost:3000/api/filters > nul
if %errorlevel% equ 0 (
  echo [PASS] Filters
) else (
  echo [FAIL] Filters
)

REM Test 4: Mascots
echo [TEST] Mascots...
curl -s http://localhost:3000/api/mascots > nul
if %errorlevel% equ 0 (
  echo [PASS] Mascots
) else (
  echo [FAIL] Mascots
)

echo.
echo === Testing Complete ===
echo.
