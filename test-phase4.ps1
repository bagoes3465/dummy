#!/usr/bin/env powershell

# Phase 4 Testing Script
# Test all image processing features

Write-Host "`nPhase 4 Image Processing - Testing Suite`n" -ForegroundColor Cyan

$ApiUrl = "http://localhost:3000/api"
$TestsPassed = 0
$TestsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Body
    )
    
    try {
        Write-Host "[TEST] $Name" -ForegroundColor Yellow
        
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method Get
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body ($Body | ConvertTo-Json) -ContentType "application/json"
        }
        
        if ($response.success -eq $true -or $response.status -eq "ok") {
            Write-Host "[PASS] $Name`n" -ForegroundColor Green
            $global:TestsPassed++
            return $response
        } else {
            Write-Host "[FAIL] $Name - $($response.error)`n" -ForegroundColor Red
            $global:TestsFailed++
            return $null
        }
    } catch {
        Write-Host "[ERROR] $Name - $_`n" -ForegroundColor Red
        $global:TestsFailed++
        return $null
    }
}

# Test 1: Health Check
Write-Host "`n=== Basic API Tests ===" -ForegroundColor Cyan
Test-Endpoint -Name "Health Check" -Method "GET" -Url "$ApiUrl/health" | Out-Null

# Test 2: Get Backgrounds
Test-Endpoint -Name "Get Backgrounds" -Method "GET" -Url "$ApiUrl/backgrounds" | Out-Null

# Test 3: Get Filters
Test-Endpoint -Name "Get Filters" -Method "GET" -Url "$ApiUrl/filters" | Out-Null

# Test 4: Get Mascots
Test-Endpoint -Name "Get Mascots" -Method "GET" -Url "$ApiUrl/mascots" | Out-Null

# Test 5: Create Session
Write-Host "`n=== Photo Session Tests ===" -ForegroundColor Cyan
$session = Test-Endpoint -Name "Create Photo Session" `
    -Method "POST" `
    -Url "$ApiUrl/photos/session" `
    -Body @{ background_id = 1; filter_id = 1 }

if ($session -and $session.session_id) {
    Write-Host "Session ID: $($session.session_id)" -ForegroundColor Green
    $global:SessionId = $session.session_id
}

# Test 6: Get Photos by Session
if ($global:SessionId) {
    Test-Endpoint -Name "Get Photos by Session" `
        -Method "GET" `
        -Url "$ApiUrl/photos/session/$global:SessionId" | Out-Null
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "[PASS] $TestsPassed tests passed" -ForegroundColor Green
Write-Host "[FAIL] $TestsFailed tests failed" -ForegroundColor $(if ($TestsFailed -gt 0) { "Red" } else { "Green" })

if ($TestsFailed -eq 0) {
    Write-Host "`n[SUCCESS] All tests PASSED!`n" -ForegroundColor Green
} else {
    Write-Host "`n[WARNING] Some tests failed. Check output above.`n" -ForegroundColor Yellow
}

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload a test photo via /api/photos/upload"
Write-Host "2. Call /api/photos/process to test image processing"
Write-Host "3. Check ./uploads/ for processed images`n"
