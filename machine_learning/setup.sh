#!/bin/bash
# Setup script untuk Facial Expression Detection Training
# Run: bash setup.sh

echo "============================================================"
echo "Facial Expression Detection Training - Setup Script"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "Step 1: Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment"
    exit 1
fi

echo "Step 2: Activating virtual environment..."
source venv/bin/activate

echo "Step 3: Installing PyTorch with CUDA support..."
echo "This may take a few minutes..."
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
if [ $? -ne 0 ]; then
    echo "Error: Failed to install PyTorch"
    exit 1
fi

echo "Step 4: Installing other dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "Step 5: Verifying CUDA setup..."
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"None\"}')"

echo ""
echo "============================================================"
echo "Setup completed successfully!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "1. Prepare dataset:"
echo "   python prepare_dataset.py"
echo ""
echo "2. Start training:"
echo "   python training.py"
echo ""
echo "3. Test inference:"
echo "   python inference.py"
echo ""
echo "For detailed documentation, see:"
echo "- README.md for quick start"
echo "- TRAINING_GUIDE.md for detailed guide"
echo "- INDEX.md for navigation"
echo ""
echo "============================================================"
