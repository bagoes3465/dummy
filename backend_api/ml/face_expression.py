"""
AI Photobooth - Face Expression Detection
Uses trained YOLO model from machine_learning/Face_Expression
"""
import numpy as np
from PIL import Image
from pathlib import Path
from config import settings

# Expression class names matching the trained model (data.yaml)
EXPRESSION_CLASSES = ["angry", "happy", "neutral", "sad", "surprise"]

# Indonesian labels for display
EXPRESSION_LABELS = {
    "angry": "Marah",
    "happy": "Senang",
    "neutral": "Netral",
    "sad": "Sedih",
    "surprise": "Terkejut",
}

_model = None


def _load_model():
    """Load YOLO face expression model (lazy loading)."""
    global _model
    if _model is not None:
        return _model

    from ultralytics import YOLO

    model_path = Path(settings.face_expression_model_path)
    if model_path.exists():
        _model = YOLO(str(model_path))
        print(f"Face expression model loaded: {model_path}")
    else:
        # Fallback to base model
        fallback = Path(settings.yolo_fallback_model_path)
        if fallback.exists():
            _model = YOLO(str(fallback))
            print(f"Fallback model loaded: {fallback}")
        else:
            print("No face expression model found")
            return None

    return _model


def detect_expression(image: Image.Image, confidence_threshold: float = 0.3) -> list[dict]:
    """
    Detect face expressions in an image.

    Returns list of dicts:
        [{"expression": "happy", "expression_label": "Senang",
          "confidence": 0.92, "bbox": [x1, y1, x2, y2]}]
    """
    model = _load_model()
    if model is None:
        return []

    # Convert PIL to numpy array for YOLO
    img_array = np.array(image.convert("RGB"))

    try:
        results = model(img_array, conf=confidence_threshold, verbose=False)
    except Exception as e:
        print(f"Face expression detection error: {e}")
        return []

    detections = []
    for result in results:
        boxes = result.boxes
        if boxes is None:
            continue
        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

            if cls_id < len(EXPRESSION_CLASSES):
                expr = EXPRESSION_CLASSES[cls_id]
            else:
                expr = "unknown"

            detections.append({
                "expression": expr,
                "expression_label": EXPRESSION_LABELS.get(expr, expr),
                "confidence": round(conf, 4),
                "bbox": [x1, y1, x2, y2],
            })

    # Sort by confidence descending
    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections
