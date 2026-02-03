@echo off
REM Script untuk memasukkan sample data ke database
REM Gunakan: insert-data.bat

echo Memasukkan data Background, Mascot, dan Filter...
node insert-data.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Data berhasil ditambahkan!
) else (
    echo.
    echo Terjadi error saat memasukkan data.
)

pause
