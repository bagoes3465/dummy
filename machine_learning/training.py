"""
Facial Expression Detection Training Script with CUDA Support
Mendeteksi 7 ekspresi wajah: Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise

Requirements:
- PyTorch dengan CUDA support
- torchvision
- numpy, matplotlib, scikit-learn, tqdm

Dataset: FER2013 atau dataset custom dengan struktur:
  data/
    train/
      angry/
      disgust/
      fear/
      happy/
      neutral/
      sad/
      surprise/
    val/
      [same structure]
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, models
from torchvision.datasets import ImageFolder
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from tqdm import tqdm
import json
from datetime import datetime
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

from face_expressions import FacialExpressionModel, load_checkpoint, save_checkpoint


class FacialExpressionTrainer:
    """Trainer class untuk facial expression detection dengan CUDA support"""
    
    def __init__(self, config):
        """
        Initialize trainer dengan config
        
        Args:
            config (dict): Configuration dictionary
        """
        self.config = config
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        print(f"\n{'='*60}")
        print(f"🚀 Facial Expression Detection Training")
        print(f"{'='*60}")
        print(f"Device: {self.device}")
        if torch.cuda.is_available():
            print(f"GPU: {torch.cuda.get_device_name(0)}")
            print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
        print(f"{'='*60}\n")
        
        # Create directories
        self.create_directories()
        
        # Load model
        self.model = self._build_model()
        self.model.to(self.device)
        
        # Loss, optimizer, scheduler
        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.Adam(
            self.model.parameters(),
            lr=config['learning_rate'],
            weight_decay=config['weight_decay']
        )
        self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer,
            mode='min',
            factor=0.5,
            patience=5,
            verbose=True
        )
        
        # Training history
        self.history = {
            'train_loss': [],
            'val_loss': [],
            'train_acc': [],
            'val_acc': [],
            'learning_rate': []
        }
        
    def create_directories(self):
        """Create necessary directories"""
        self.checkpoint_dir = Path(self.config['checkpoint_dir'])
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)
        
        self.log_dir = Path(self.config['log_dir'])
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"✓ Checkpoint dir: {self.checkpoint_dir}")
        print(f"✓ Log dir: {self.log_dir}")
    
    def _build_model(self):
        """Build facial expression model"""
        print("\n📦 Building Model...")
        model = FacialExpressionModel(
            num_classes=self.config['num_classes'],
            pretrained=self.config['pretrained']
        )
        print(f"✓ Model: {self.config['model_name']}")
        return model
    
    def _get_data_transforms(self):
        """Get data augmentation transforms"""
        train_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(p=0.3),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        val_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        return train_transform, val_transform
    
    def load_data(self):
        """Load training and validation data"""
        print("\n📂 Loading Data...")
        
        train_transform, val_transform = self._get_data_transforms()
        
        # Load datasets
        train_dataset = ImageFolder(
            self.config['train_path'],
            transform=train_transform
        )
        
        val_dataset = ImageFolder(
            self.config['val_path'],
            transform=val_transform
        )
        
        # Get class names
        self.classes = train_dataset.classes
        self.class_to_idx = train_dataset.class_to_idx
        
        print(f"✓ Classes: {self.classes}")
        print(f"✓ Train samples: {len(train_dataset)}")
        print(f"✓ Val samples: {len(val_dataset)}")
        
        # Create dataloaders
        self.train_loader = DataLoader(
            train_dataset,
            batch_size=self.config['batch_size'],
            shuffle=True,
            num_workers=self.config['num_workers'],
            pin_memory=True
        )
        
        self.val_loader = DataLoader(
            val_dataset,
            batch_size=self.config['batch_size'],
            shuffle=False,
            num_workers=self.config['num_workers'],
            pin_memory=True
        )
        
        return self.train_loader, self.val_loader
    
    def _train_epoch(self, epoch):
        """Train one epoch"""
        self.model.train()
        running_loss = 0.0
        running_corrects = 0
        total_samples = 0
        
        pbar = tqdm(self.train_loader, desc=f"Epoch {epoch+1}/{self.config['epochs']}")
        
        for inputs, labels in pbar:
            inputs = inputs.to(self.device)
            labels = labels.to(self.device)
            
            # Forward pass
            self.optimizer.zero_grad()
            outputs = self.model(inputs)
            loss = self.criterion(outputs, labels)
            
            # Backward pass
            loss.backward()
            
            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
            
            self.optimizer.step()
            
            # Statistics
            running_loss += loss.item() * inputs.size(0)
            preds = torch.argmax(outputs, dim=1)
            running_corrects += torch.sum(preds == labels.data)
            total_samples += inputs.size(0)
            
            # Update progress bar
            current_loss = running_loss / total_samples
            current_acc = running_corrects.double() / total_samples
            pbar.set_postfix({
                'loss': f'{current_loss:.4f}',
                'acc': f'{current_acc:.4f}'
            })
        
        epoch_loss = running_loss / total_samples
        epoch_acc = running_corrects.double() / total_samples
        
        return epoch_loss, epoch_acc
    
    def _validate(self):
        """Validate model"""
        self.model.eval()
        running_loss = 0.0
        running_corrects = 0
        total_samples = 0
        
        all_preds = []
        all_labels = []
        
        with torch.no_grad():
            for inputs, labels in tqdm(self.val_loader, desc="Validation"):
                inputs = inputs.to(self.device)
                labels = labels.to(self.device)
                
                outputs = self.model(inputs)
                loss = self.criterion(outputs, labels)
                
                running_loss += loss.item() * inputs.size(0)
                preds = torch.argmax(outputs, dim=1)
                running_corrects += torch.sum(preds == labels.data)
                total_samples += inputs.size(0)
                
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
        
        epoch_loss = running_loss / total_samples
        epoch_acc = running_corrects.double() / total_samples
        
        return epoch_loss, epoch_acc, all_preds, all_labels
    
    def train(self):
        """Main training loop"""
        print(f"\n🎓 Starting Training for {self.config['epochs']} epochs...")
        
        best_val_acc = 0.0
        best_epoch = 0
        patience_counter = 0
        
        for epoch in range(self.config['epochs']):
            # Train
            train_loss, train_acc = self._train_epoch(epoch)
            
            # Validate
            val_loss, val_acc, val_preds, val_labels = self._validate()
            
            # Save history
            self.history['train_loss'].append(train_loss)
            self.history['train_acc'].append(float(train_acc))
            self.history['val_loss'].append(val_loss)
            self.history['val_acc'].append(float(val_acc))
            self.history['learning_rate'].append(self.optimizer.param_groups[0]['lr'])
            
            # Print epoch summary
            print(f"\nEpoch {epoch+1}/{self.config['epochs']}")
            print(f"  Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.4f}")
            print(f"  Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.4f}")
            print(f"  LR: {self.optimizer.param_groups[0]['lr']:.6f}")
            
            # Scheduler step
            self.scheduler.step(val_loss)
            
            # Save best model
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                best_epoch = epoch
                patience_counter = 0
                
                checkpoint = {
                    'epoch': epoch,
                    'model_state_dict': self.model.state_dict(),
                    'optimizer_state_dict': self.optimizer.state_dict(),
                    'val_acc': float(val_acc),
                    'classes': self.classes,
                    'class_to_idx': self.class_to_idx
                }
                
                save_path = self.checkpoint_dir / f'best_model.pth'
                save_checkpoint(checkpoint, save_path)
                print(f"  ✓ Best model saved (Acc: {val_acc:.4f})")
            else:
                patience_counter += 1
            
            # Early stopping
            if patience_counter >= self.config['early_stopping_patience']:
                print(f"\n⏹️  Early stopping at epoch {epoch+1}")
                break
        
        print(f"\n{'='*60}")
        print(f"✅ Training Completed!")
        print(f"Best Validation Accuracy: {best_val_acc:.4f} (Epoch {best_epoch+1})")
        print(f"{'='*60}\n")
        
        return self.history
    
    def plot_history(self):
        """Plot training history"""
        fig, axes = plt.subplots(1, 2, figsize=(15, 5))
        
        # Loss
        axes[0].plot(self.history['train_loss'], label='Train Loss', marker='o')
        axes[0].plot(self.history['val_loss'], label='Val Loss', marker='o')
        axes[0].set_xlabel('Epoch')
        axes[0].set_ylabel('Loss')
        axes[0].set_title('Training & Validation Loss')
        axes[0].legend()
        axes[0].grid(True)
        
        # Accuracy
        axes[1].plot(self.history['train_acc'], label='Train Acc', marker='o')
        axes[1].plot(self.history['val_acc'], label='Val Acc', marker='o')
        axes[1].set_xlabel('Epoch')
        axes[1].set_ylabel('Accuracy')
        axes[1].set_title('Training & Validation Accuracy')
        axes[1].legend()
        axes[1].grid(True)
        
        plt.tight_layout()
        plot_path = self.log_dir / f"training_history_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        plt.savefig(plot_path, dpi=150, bbox_inches='tight')
        print(f"✓ Plot saved: {plot_path}")
        plt.show()
    
    def save_config(self):
        """Save training configuration"""
        config_path = self.checkpoint_dir / 'training_config.json'
        with open(config_path, 'w') as f:
            json.dump(self.config, f, indent=4)
        print(f"✓ Config saved: {config_path}")


def main():
    """Main training function"""
    
    # Configuration
    config = {
        # Model
        'model_name': 'resnet50',
        'pretrained': True,
        'num_classes': 7,
        
        # Data
        'train_path': './data/train',
        'val_path': './data/val',
        'batch_size': 32,
        'num_workers': 4,
        
        # Training
        'epochs': 100,
        'learning_rate': 1e-3,
        'weight_decay': 1e-5,
        'early_stopping_patience': 10,
        
        # Directories
        'checkpoint_dir': './checkpoints',
        'log_dir': './logs'
    }
    
    # Check CUDA
    print("\n🔧 System Information:")
    print(f"CUDA Available: {torch.cuda.is_available()}")
    print(f"CUDA Version: {torch.version.cuda}")
    print(f"PyTorch Version: {torch.__version__}")
    
    # Initialize trainer
    trainer = FacialExpressionTrainer(config)
    
    # Load data
    trainer.load_data()
    
    # Train
    history = trainer.train()
    
    # Plot
    trainer.plot_history()
    
    # Save config
    trainer.save_config()
    
    print("\n🎉 Training Pipeline Completed!")


if __name__ == '__main__':
    main()
