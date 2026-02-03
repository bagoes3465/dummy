#!/usr/bin/env python
"""
Command Reference & Examples
Quick reference untuk common commands
"""

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

"""
# 1. Create virtual environment
python -m venv venv

# 2. Activate (Windows)
venv\Scripts\activate

# 3. Activate (Linux/Mac)
source venv/bin/activate

# 4. Install PyTorch dengan CUDA support (IMPORTANT!)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# 5. Install other dependencies
pip install -r requirements.txt

# 6. Verify CUDA
python -c "import torch; print('CUDA Available:', torch.cuda.is_available())"
"""

# ============================================================================
# DATASET PREPARATION
# ============================================================================

"""
# Analyze existing dataset
python -c "
from prepare_dataset import DatasetPreparator
prep = DatasetPreparator('./data')
prep.analyze_dataset()
"

# Validate all images
python -c "
from prepare_dataset import DatasetPreparator
prep = DatasetPreparator('./data')
prep.validate_images()
"

# Split dataset (if you have flat folder structure)
python -c "
from prepare_dataset import DatasetPreparator
prep = DatasetPreparator('./data')
prep.split_dataset('./raw_images', train_ratio=0.8)
"

# Balance dataset with augmentation
python -c "
from prepare_dataset import DatasetPreparator
prep = DatasetPreparator('./data')
prep.balance_dataset(target_size_per_class=1000)
"

# Export dataset summary
python -c "
from prepare_dataset import DatasetPreparator
prep = DatasetPreparator('./data')
prep.export_summary()
"
"""

# ============================================================================
# TRAINING
# ============================================================================

"""
# 1. Basic training dengan default config
python training.py

# 2. Training dengan custom config
python -c "
from training import FacialExpressionTrainer
config = {
    'model_name': 'resnet50',
    'pretrained': True,
    'num_classes': 7,
    'train_path': './data/train',
    'val_path': './data/val',
    'batch_size': 64,  # Increase untuk GPU dengan memory besar
    'num_workers': 4,
    'epochs': 100,
    'learning_rate': 1e-3,
    'weight_decay': 1e-5,
    'early_stopping_patience': 10,
    'checkpoint_dir': './checkpoints',
    'log_dir': './logs'
}
trainer = FacialExpressionTrainer(config)
trainer.load_data()
trainer.train()
trainer.plot_history()
"

# 3. Monitor GPU usage (separate terminal)
nvidia-smi -l 1

# 4. Watch continuous GPU stats
watch -n 0.5 nvidia-smi

# 5. Check checkpoint info
python -c "
import torch
checkpoint = torch.load('./checkpoints/best_model.pth')
print('Epoch:', checkpoint['epoch'])
print('Val Acc:', checkpoint['val_acc'])
print('Classes:', checkpoint['classes'])
"
"""

# ============================================================================
# INFERENCE
# ============================================================================

"""
# 1. Single image prediction
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
result = inf.predict_from_image_path('./sample.jpg')
print(f\"Emotion: {result['emoji']} {result['emotion']}\")
print(f\"Confidence: {result['confidence']:.1%}\")
print(f\"Probabilities: {result['probabilities']}\")
"

# 2. Batch prediction dari folder
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
results = inf.predict_batch_from_folder('./test_images')
for item in results:
    print(f\"{item['filename']}: {item['prediction']['emotion']} ({item['prediction']['confidence']:.1%})\")
"

# 3. Real-time webcam
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
inf.process_webcam(duration=60)  # 60 seconds
"

# 4. Process video file
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
inf.process_video('./input.mp4', './output.mp4')
"

# 5. Visualize prediction on image
python -c "
from inference import FacialExpressionInference
inf = FacialExpressionInference('./checkpoints/best_model.pth')
result = inf.visualize_prediction('./image.jpg', './output.jpg')
"
"""

# ============================================================================
# TESTING & VALIDATION
# ============================================================================

"""
# 1. Test model architecture
python face_expressions.py

# 2. List available GPU
python -c "
import torch
print('GPU Count:', torch.cuda.device_count())
if torch.cuda.is_available():
    for i in range(torch.cuda.device_count()):
        print(f'GPU {i}: {torch.cuda.get_device_name(i)}')
        props = torch.cuda.get_device_properties(i)
        print(f'  Memory: {props.total_memory / 1e9:.1f} GB')
"

# 3. Check model parameters
python -c "
from face_expressions import FacialExpressionModel
model = FacialExpressionModel(num_classes=7)
total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f'Total Parameters: {total_params:,}')
print(f'Trainable Parameters: {trainable_params:,}')
"

# 4. Test emotion labels
python -c "
from face_expressions import FacialExpressionPredictor
for emotion_id, info in FacialExpressionPredictor.EMOTION_LABELS.items():
    print(f\"{emotion_id}: {info['emoji']} {info['name']} ({info['description']})\")
"
"""

# ============================================================================
# OPTIMIZATION & ADVANCED
# ============================================================================

"""
# 1. Mixed Precision Training (faster, less memory)
python -c "
from torch.cuda.amp import autocast, GradScaler
# Use in training loop:
# scaler = GradScaler()
# with autocast():
#     outputs = model(inputs)
#     loss = criterion(outputs, labels)
# scaler.scale(loss).backward()
"

# 2. Export model untuk mobile/edge (ONNX)
python -c "
import torch
import torch.onnx
from face_expressions import FacialExpressionModel

model = FacialExpressionModel()
checkpoint = torch.load('./checkpoints/best_model.pth')
model.load_state_dict(checkpoint['model_state_dict'])

dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    'model.onnx',
    input_names=['image'],
    output_names=['logits'],
    opset_version=12
)
print('ONNX model exported!')
"

# 3. Model quantization (untuk inference optimization)
python -c "
import torch
from face_expressions import FacialExpressionModel

model = FacialExpressionModel()
checkpoint = torch.load('./checkpoints/best_model.pth')
model.load_state_dict(checkpoint['model_state_dict'])

# Static quantization
quantized_model = torch.quantization.quantize_dynamic(
    model,
    {torch.nn.Linear},
    dtype=torch.qint8
)

torch.save(quantized_model.state_dict(), 'model_quantized.pth')
print('Quantized model saved!')
"

# 4. Profile model performance
python -c "
import torch
from face_expressions import FacialExpressionModel
from torch.profiler import profile, record_function

model = FacialExpressionModel().cuda()
input_tensor = torch.randn(1, 3, 224, 224).cuda()

with profile(
    activities=['cpu', 'cuda'],
    record_shapes=True,
    on_trace_ready=lambda p: print(p.key_averages().table(sort_by='cuda_time_total'))
) as prof:
    model(input_tensor)
"
"""

# ============================================================================
# DEBUGGING & TROUBLESHOOTING
# ============================================================================

"""
# 1. Check CUDA installation
nvcc --version
nvidia-smi

# 2. Test CUDA memory allocation
python -c "
import torch
print('CUDA Available:', torch.cuda.is_available())
if torch.cuda.is_available():
    t = torch.rand(1000, 1000).cuda()
    print('CUDA test: PASSED')
else:
    print('CUDA test: FAILED')
"

# 3. Clear GPU memory
python -c "
import torch
torch.cuda.empty_cache()
print('GPU cache cleared')
"

# 4. Check loaded model size
python -c "
import torch
checkpoint = torch.load('./checkpoints/best_model.pth')
model_size = sum(p.numel() * p.element_size() for p in checkpoint['model_state_dict'].values())
print(f'Model size: {model_size / 1e6:.1f} MB')
"

# 5. Verify dataset structure
python -c "
from pathlib import Path
from collections import defaultdict

data_dir = Path('./data')
stats = defaultdict(lambda: defaultdict(int))

for split in ['train', 'val']:
    for emotion_dir in (data_dir / split).glob('*'):
        emotion = emotion_dir.name
        count = len(list(emotion_dir.glob('*.jpg'))) + len(list(emotion_dir.glob('*.png')))
        stats[split][emotion] = count

for split in stats:
    print(f'{split.upper()}:')
    for emotion, count in stats[split].items():
        print(f'  {emotion}: {count}')
"
"""

# ============================================================================
# BATCH OPERATIONS
# ============================================================================

"""
# 1. Train multiple models dengan different configs
python -c "
from training import FacialExpressionTrainer

configs = [
    {'model_name': 'resnet18', 'batch_size': 64},
    {'model_name': 'resnet50', 'batch_size': 32},
    {'model_name': 'resnet101', 'batch_size': 16},
]

for config in configs:
    print(f\"Training {config['model_name']}...\")
    trainer = FacialExpressionTrainer(config)
    trainer.load_data()
    trainer.train()
    trainer.save_config()
"

# 2. Batch inference dengan multiple models
python -c "
from inference import FacialExpressionInference

models = [
    './checkpoints/model_resnet18.pth',
    './checkpoints/model_resnet50.pth',
    './checkpoints/model_resnet101.pth',
]

image_path = './test.jpg'

for model_path in models:
    inf = FacialExpressionInference(model_path)
    result = inf.predict_from_image_path(image_path)
    print(f\"Model {model_path}: {result['emotion']} ({result['confidence']:.1%})\")
"
"""

# ============================================================================
# PERFORMANCE BENCHMARKING
# ============================================================================

"""
# 1. Measure inference time
python -c "
import torch
import time
from inference import FacialExpressionInference

inf = FacialExpressionInference('./checkpoints/best_model.pth')
image_tensor = torch.randn(1, 3, 224, 224)

# Warmup
for _ in range(10):
    inf.predictor.predict(image_tensor)

# Benchmark
times = []
for _ in range(100):
    start = time.time()
    inf.predictor.predict(image_tensor)
    times.append(time.time() - start)

import statistics
print(f'Average time: {statistics.mean(times)*1000:.2f} ms')
print(f'Min time: {min(times)*1000:.2f} ms')
print(f'Max time: {max(times)*1000:.2f} ms')
"

# 2. Measure GPU memory usage
python -c "
import torch
from face_expressions import FacialExpressionModel

model = FacialExpressionModel().cuda()

# Allocate input
batch_sizes = [1, 16, 32, 64, 128]
for batch_size in batch_sizes:
    torch.cuda.reset_peak_memory_stats()
    input_tensor = torch.randn(batch_size, 3, 224, 224).cuda()
    with torch.no_grad():
        model(input_tensor)
    peak_memory = torch.cuda.max_memory_allocated() / 1e9
    print(f'Batch size {batch_size}: {peak_memory:.2f} GB')
"
"""

# ============================================================================
# PRODUCTION DEPLOYMENT
# ============================================================================

"""
# 1. Package model untuk deployment
python -c "
import torch
import json
from pathlib import Path

checkpoint_dir = Path('./checkpoints')
checkpoint = torch.load(checkpoint_dir / 'best_model.pth')

# Prepare deployment package
deployment = {
    'model_state_dict': checkpoint['model_state_dict'],
    'classes': checkpoint['classes'],
    'class_to_idx': checkpoint['class_to_idx'],
    'metadata': {
        'model_name': 'resnet50',
        'num_classes': 7,
        'input_size': 224,
        'framework': 'pytorch'
    }
}

torch.save(deployment, 'model_production.pth')
"

# 2. Create inference service
python -c "
from flask import Flask, request
from inference import FacialExpressionInference
import json

app = Flask(__name__)
inference = FacialExpressionInference('./checkpoints/best_model.pth')

@app.route('/predict', methods=['POST'])
def predict():
    # Receive base64 image
    data = request.json
    # ... decode and process
    result = inference.predict(image_tensor)
    return json.dumps(result)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
"
"""

print(\"\"\"
╔════════════════════════════════════════════════════════════════════╗
║     Facial Expression Detection - Command Reference                ║
║                                                                    ║
║  See the string constants above for detailed examples              ║
║  Copy & paste commands dari sections yang Anda butuhkan            ║
║                                                                    ║
║  Quick Reference:                                                  ║
║  - SETUP & INSTALLATION: Environment setup                        ║
║  - DATASET PREPARATION: Organize & validate data                  ║
║  - TRAINING: Start training dengan berbagai config                ║
║  - INFERENCE: Make predictions                                    ║
║  - TESTING & VALIDATION: Verify setup & models                    ║
║  - OPTIMIZATION: Advanced techniques                              ║
║  - DEBUGGING: Troubleshoot issues                                 ║
║  - BATCH OPERATIONS: Process multiple items                       ║
║  - BENCHMARKING: Measure performance                              ║
║  - PRODUCTION: Deploy ke production                               ║
╚════════════════════════════════════════════════════════════════════╝
\"\"\")
