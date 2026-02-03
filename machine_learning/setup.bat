@echo off
REM Setup script untuk Facial Expression Detection Training
REM Run ini untuk automatic setup

echo ============================================================
echo Facial Expression Detection Training - Setup Script
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org
    pause
    exit /b 1
)

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat

echo Step 3: Installing PyTorch with CUDA support...
echo This may take a few minutes...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
if errorlevel 1 (
    echo Error: Failed to install PyTorch
    echo Make sure you have internet connection
    pause
    exit /b 1
)

echo Step 4: Installing other dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Step 5: Verifying CUDA setup...
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"None\"}')"
if errorlevel 1 (
    echo Warning: Could not verify CUDA
    echo Check CUDA installation manually
)

echo.
echo ============================================================
echo Setup completed successfully!
echo ============================================================
echo.
echo Next steps:
echo 1. Prepare dataset:
echo    python prepare_dataset.py
echo.
echo 2. Start training:
echo    python training.py
echo.
echo 3. Test inference:
echo    python inference.py
echo.
echo For detailed documentation, see:
echo - README.md for quick start
echo - TRAINING_GUIDE.md for detailed guide
echo - INDEX.md for navigation
echo.
echo ============================================================
pause
