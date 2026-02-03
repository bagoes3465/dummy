"""
Facial Expression Model Architecture and Utilities
Support untuk training dan inference dengan CUDA
"""

import torch
import torch.nn as nn
from torchvision import models
import os
from pathlib import Path


class FacialExpressionModel(nn.Module):
    """
    Facial Expression Detection Model
    Menggunakan ResNet50 sebagai backbone dengan custom head
    
    Ekspresi yang dideteksi:
    0: Angry (Marah)
    1: Disgust (Jijik)
    2: Fear (Takut)
    3: Happy (Senang)
    4: Neutral (Netral)
    5: Sad (Sedih)
    6: Surprise (Terkejut)
    """
    
    def __init__(self, num_classes=7, pretrained=True, dropout_rate=0.5):
        """
        Initialize model
        
        Args:
            num_classes (int): Number of emotion classes
            pretrained (bool): Use pretrained weights
            dropout_rate (float): Dropout rate for regularization
        """
        super(FacialExpressionModel, self).__init__()
        
        # Load pretrained ResNet50
        self.backbone = models.resnet50(pretrained=pretrained)
        
        # Freeze earlier layers (optional)
        for param in self.backbone.layer1.parameters():
            param.requires_grad = False
        for param in self.backbone.layer2.parameters():
            param.requires_grad = False
        
        # Remove original classification head
        num_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Identity()
        
        # Custom classification head
        self.head = nn.Sequential(
            nn.Dropout(p=dropout_rate),
            nn.Linear(num_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout_rate),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout_rate),
            nn.Linear(256, num_classes)
        )
        
        self.num_classes = num_classes
    
    def forward(self, x):
        """
        Forward pass
        
        Args:
            x (torch.Tensor): Input image tensor (B, 3, 224, 224)
            
        Returns:
            torch.Tensor: Logits (B, num_classes)
        """
        features = self.backbone(x)
        logits = self.head(features)
        return logits
    
    def get_features(self, x):
        """
        Get feature representation (useful for visualization/analysis)
        
        Args:
            x (torch.Tensor): Input image tensor
            
        Returns:
            torch.Tensor: Feature representation
        """
        features = self.backbone(x)
        return features


class FacialExpressionPredictor:
    """Inference wrapper untuk facial expression detection"""
    
    EMOTION_LABELS = {
        0: {'name': 'Angry', 'emoji': '😠', 'description': 'Marah'},
        1: {'name': 'Disgust', 'emoji': '🤢', 'description': 'Jijik'},
        2: {'name': 'Fear', 'emoji': '😨', 'description': 'Takut'},
        3: {'name': 'Happy', 'emoji': '😊', 'description': 'Senang'},
        4: {'name': 'Neutral', 'emoji': '😐', 'description': 'Netral'},
        5: {'name': 'Sad', 'emoji': '😢', 'description': 'Sedih'},
        6: {'name': 'Surprise', 'emoji': '😲', 'description': 'Terkejut'}
    }
    
    def __init__(self, model_path, device=None):
        """
        Initialize predictor
        
        Args:
            model_path (str): Path to saved model checkpoint
            device (torch.device): Device to use (cuda or cpu)
        """
        self.device = device or torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self._load_model(model_path)
        self.model.eval()
    
    def _load_model(self, model_path):
        """Load model from checkpoint"""
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        checkpoint = torch.load(model_path, map_location=self.device)
        model = FacialExpressionModel(num_classes=7, pretrained=False)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.to(self.device)
        return model
    
    def predict(self, image_tensor):
        """
        Predict emotion from image
        
        Args:
            image_tensor (torch.Tensor): Image tensor (1, 3, 224, 224) or (3, 224, 224)
            
        Returns:
            dict: Prediction results with confidence scores
        """
        # Ensure batch dimension
        if image_tensor.dim() == 3:
            image_tensor = image_tensor.unsqueeze(0)
        
        image_tensor = image_tensor.to(self.device)
        
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0, predicted_class].item()
        
        emotion_info = self.EMOTION_LABELS[predicted_class]
        
        return {
            'class_id': predicted_class,
            'emotion': emotion_info['name'],
            'emoji': emotion_info['emoji'],
            'description': emotion_info['description'],
            'confidence': float(confidence),
            'probabilities': {
                self.EMOTION_LABELS[i]['name']: float(prob)
                for i, prob in enumerate(probabilities[0].cpu().numpy())
            }
        }
    
    def predict_batch(self, images_tensor):
        """
        Predict emotions for batch of images
        
        Args:
            images_tensor (torch.Tensor): Batch of images (B, 3, 224, 224)
            
        Returns:
            list: List of prediction results
        """
        images_tensor = images_tensor.to(self.device)
        
        with torch.no_grad():
            outputs = self.model(images_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_classes = torch.argmax(probabilities, dim=1)
        
        results = []
        for idx, (pred_class, probs) in enumerate(zip(predicted_classes, probabilities)):
            emotion_info = self.EMOTION_LABELS[pred_class.item()]
            results.append({
                'class_id': pred_class.item(),
                'emotion': emotion_info['name'],
                'emoji': emotion_info['emoji'],
                'confidence': float(probs[pred_class].item()),
                'probabilities': {
                    self.EMOTION_LABELS[i]['name']: float(prob)
                    for i, prob in enumerate(probs.cpu().numpy())
                }
            })
        
        return results


def save_checkpoint(checkpoint, save_path):
    """
    Save model checkpoint
    
    Args:
        checkpoint (dict): Checkpoint dictionary
        save_path (str): Path to save checkpoint
    """
    save_path = Path(save_path)
    save_path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(checkpoint, save_path)


def load_checkpoint(checkpoint_path, model, optimizer=None, device=None):
    """
    Load checkpoint
    
    Args:
        checkpoint_path (str): Path to checkpoint
        model (nn.Module): Model to load weights into
        optimizer (optim.Optimizer): Optimizer to load state into
        device (torch.device): Device to load to
        
    Returns:
        tuple: (start_epoch, best_val_acc)
    """
    checkpoint = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(checkpoint['model_state_dict'])
    
    if optimizer is not None:
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    
    start_epoch = checkpoint.get('epoch', 0)
    best_val_acc = checkpoint.get('val_acc', 0.0)
    
    return start_epoch, best_val_acc


class ExpressionAnalyzer:
    """Utility untuk analisis ekspresi wajah"""
    
    @staticmethod
    def get_emotion_description(emotion_id):
        """Get detailed description of emotion"""
        descriptions = {
            0: "Ekspresi marah menunjukkan ketidakpuasan atau kemarahan",
            1: "Ekspresi jijik menunjukkan perasaan terganggu",
            2: "Ekspresi takut menunjukkan ketakutan atau kekhawatiran",
            3: "Ekspresi senang menunjukkan kegembiraan",
            4: "Ekspresi netral menunjukkan wajah tanpa emosi khusus",
            5: "Ekspresi sedih menunjukkan kesedihan",
            6: "Ekspresi terkejut menunjukkan kekagetannya"
        }
        return descriptions.get(emotion_id, "Unknown emotion")
    
    @staticmethod
    def get_confidence_level(confidence):
        """Convert confidence score to level"""
        if confidence >= 0.9:
            return "Very High"
        elif confidence >= 0.7:
            return "High"
        elif confidence >= 0.5:
            return "Medium"
        else:
            return "Low"
    
    @staticmethod
    def format_prediction(prediction):
        """Format prediction for display"""
        return f"""
Emotion: {prediction['emoji']} {prediction['emotion']}
Confidence: {prediction['confidence']:.2%}
Level: {ExpressionAnalyzer.get_confidence_level(prediction['confidence'])}
Description: {ExpressionAnalyzer.get_emotion_description(prediction['class_id'])}

All Probabilities:
{chr(10).join(f"  {emotion}: {prob:.2%}" for emotion, prob in prediction['probabilities'].items())}
        """


# Model size comparison
MODEL_CONFIGS = {
    'resnet18': {'layers': 18, 'params': '11.2M', 'speed': 'Fast'},
    'resnet34': {'layers': 34, 'params': '21.8M', 'speed': 'Fast'},
    'resnet50': {'layers': 50, 'params': '25.6M', 'speed': 'Medium'},
    'resnet101': {'layers': 101, 'params': '44.5M', 'speed': 'Slow'},
    'resnet152': {'layers': 152, 'params': '60.2M', 'speed': 'Very Slow'}
}


if __name__ == '__main__':
    # Test model
    print("Testing Facial Expression Model...\n")
    
    # Check CUDA
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Device: {device}")
    print(f"CUDA Available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"GPU: {torch.cuda.get_device_name(0)}\n")
    
    # Create model
    model = FacialExpressionModel(num_classes=7, pretrained=True)
    model.to(device)
    
    # Test forward pass
    test_input = torch.randn(2, 3, 224, 224).to(device)
    with torch.no_grad():
        output = model(test_input)
    
    print(f"Model created successfully!")
    print(f"Input shape: {test_input.shape}")
    print(f"Output shape: {output.shape}")
    print(f"Total parameters: {sum(p.numel() for p in model.parameters()):,}")
    print(f"Trainable parameters: {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")
    
    # Print emotion labels
    print(f"\nEmotion Classes:")
    for emotion_id, info in FacialExpressionPredictor.EMOTION_LABELS.items():
        print(f"  {emotion_id}: {info['emoji']} {info['name']} ({info['description']})")
