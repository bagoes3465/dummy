# Quick Start: Facial Expression Detection Training

## ⚡ 5 Menit Setup

### Step 1: Check GPU
```bash
nvidia-smi
```
Output seharusnya menunjukkan GPU Anda dan CUDA version.

### Step 2: Setup
```bash
cd machine_learning

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# atau: source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

### Step 3: Verify CUDA
```bash
python -c "import torch; print('CUDA:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'None')"
```

## 🎓 Training

### Dengan Sample Dataset
```bash
# Prepare dataset folder structure
python prepare_dataset.py

# Start training
python training.py
```

### Monitoring
Di terminal lain:
```bash
nvidia-smi -l 1  # Monitor GPU setiap 1 detik
```

## 🔍 Inference

### Test dengan Webcam
```bash
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
inf.process_webcam(duration=60)
"
```

### Single Image
```bash
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
result = inf.predict_from_image_path('./image.jpg')
print(f'Emotion: {result[\"emoji\"]} {result[\"emotion\"]} ({result[\"confidence\"]:.1%})')
"
```

## 📊 Files Structure

```
machine_learning/
├── training.py              # Main training script
├── face_expressions.py      # Model architecture
├── inference.py             # Inference script
├── prepare_dataset.py       # Dataset preparation
├── requirements.txt         # Dependencies
├── TRAINING_GUIDE.md       # Detailed guide
├── data/                   # Dataset
│   ├── train/
│   └── val/
├── checkpoints/            # Trained models
└── logs/                   # Training logs & plots
```

## 🎯 Typical Training Results

- **Time**: 1-3 hours (depending on dataset size)
- **Accuracy**: 65-75% on FER2013
- **GPU Memory**: 4-8 GB
- **Output**: `best_model.pth` (~100 MB)

## 📚 Next Steps

1. **Prepare Dataset**: Use prepare_dataset.py untuk organize data
2. **Adjust Config**: Edit parameters di training.py sebelum training
3. **Monitor**: Check plots di logs/ folder
4. **Inference**: Use inference.py untuk predictions

## 🆘 Troubleshooting

```bash
# CUDA tidak available?
pip uninstall torch -y
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Out of memory?
# Edit training.py: batch_size = 16 (dari 32)

# Dataset error?
# Pastikan struktur: data/train/angry/, data/train/disgust/, dll
# Jalankan: python prepare_dataset.py

# Slow training?
# Check GPU dengan nvidia-smi
# Increase batch_size jika GPU memory tersedia
```

## 📖 Detailed Guide

Lihat [TRAINING_GUIDE.md](TRAINING_GUIDE.md) untuk informasi lengkap.

---

Happy Training! 🚀
