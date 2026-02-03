"""
Dataset Preparation Utility
Helper script untuk prepare dan organize facial expression dataset
"""

import os
import shutil
from pathlib import Path
import numpy as np
import cv2
from tqdm import tqdm
import random


class DatasetPreparator:
    """Utility untuk prepare dataset"""
    
    EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
    
    def __init__(self, output_dir='./data'):
        """Initialize"""
        self.output_dir = Path(output_dir)
        self.create_folder_structure()
    
    def create_folder_structure(self):
        """Create required folder structure"""
        print("Creating folder structure...")
        for split in ['train', 'val']:
            for emotion in self.EMOTIONS:
                folder = self.output_dir / split / emotion
                folder.mkdir(parents=True, exist_ok=True)
        print("✓ Folder structure created")
    
    def organize_fer2013(self, fer2013_csv_path, train_ratio=0.8):
        """
        Organize FER2013 dataset dari CSV format
        
        Args:
            fer2013_csv_path (str): Path ke fer2013.csv
            train_ratio (float): Ratio train/val split
        """
        print(f"\n📂 Organizing FER2013 Dataset...")
        
        import csv
        
        data = []
        with open(fer2013_csv_path, 'r') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            for row in reader:
                data.append(row)
        
        print(f"Total images: {len(data)}")
        
        # Split and move
        for emotion_idx, emotion in enumerate(self.EMOTIONS):
            emotion_data = [d for d in data if int(d[0]) == emotion_idx]
            
            # Shuffle
            random.shuffle(emotion_data)
            
            # Split train/val
            split_idx = int(len(emotion_data) * 0.8)
            train_data = emotion_data[:split_idx]
            val_data = emotion_data[split_idx:]
            
            # Process images
            self._process_fer2013_images(train_data, emotion, 'train')
            self._process_fer2013_images(val_data, emotion, 'val')
            
            print(f"✓ {emotion}: {len(train_data)} train, {len(val_data)} val")
    
    def _process_fer2013_images(self, data, emotion, split):
        """Process FER2013 images"""
        output_folder = self.output_dir / split / emotion
        
        for idx, row in enumerate(data):
            # FER2013 format: emotion, pixels, usage
            pixels = row[1].split()
            pixels = np.array(pixels, dtype='uint8').reshape(48, 48)
            
            # Convert to RGB (duplicate grayscale)
            img = cv2.cvtColor(pixels, cv2.COLOR_GRAY2BGR)
            
            # Save
            filename = f"{emotion}_{idx:05d}.jpg"
            cv2.imwrite(str(output_folder / filename), img)
    
    def split_dataset(self, source_dir, train_ratio=0.8):
        """
        Split existing dataset ke train/val
        
        Args:
            source_dir (str): Source folder dengan semua images
            train_ratio (float): Train/val ratio
        """
        print(f"\n📂 Splitting Dataset...")
        
        source_path = Path(source_dir)
        
        for emotion in self.EMOTIONS:
            emotion_folder = source_path / emotion
            if not emotion_folder.exists():
                continue
            
            images = list(emotion_folder.glob('*.jpg')) + \
                     list(emotion_folder.glob('*.png'))
            
            random.shuffle(images)
            split_idx = int(len(images) * train_ratio)
            
            train_images = images[:split_idx]
            val_images = images[split_idx:]
            
            # Copy to organized structure
            for img in tqdm(train_images, desc=f"Train - {emotion}"):
                shutil.copy(img, self.output_dir / 'train' / emotion / img.name)
            
            for img in tqdm(val_images, desc=f"Val - {emotion}"):
                shutil.copy(img, self.output_dir / 'val' / emotion / img.name)
            
            print(f"✓ {emotion}: {len(train_images)} train, {len(val_images)} val")
    
    def balance_dataset(self, target_size_per_class=1000):
        """
        Balance dataset dengan data augmentation jika perlu
        
        Args:
            target_size_per_class (int): Target size per class
        """
        print(f"\n⚖️  Balancing Dataset...")
        
        for split in ['train', 'val']:
            for emotion in self.EMOTIONS:
                emotion_folder = self.output_dir / split / emotion
                images = list(emotion_folder.glob('*.jpg')) + \
                          list(emotion_folder.glob('*.png'))
                
                current_size = len(images)
                
                if current_size < target_size_per_class:
                    # Need augmentation
                    shortage = target_size_per_class - current_size
                    self._augment_images(emotion_folder, shortage)
                    print(f"✓ {split}/{emotion}: Augmented {shortage} images")
                elif current_size > target_size_per_class:
                    # Remove excess
                    excess = current_size - target_size_per_class
                    for img in images[-excess:]:
                        img.unlink()
                    print(f"✓ {split}/{emotion}: Removed {excess} images")
                else:
                    print(f"✓ {split}/{emotion}: Already balanced ({current_size})")
    
    def _augment_images(self, folder, count):
        """Augment images in folder"""
        images = list(folder.glob('*.jpg')) + list(folder.glob('*.png'))
        
        for i in range(count):
            img_path = random.choice(images)
            img = cv2.imread(str(img_path))
            
            # Random augmentation
            if random.random() > 0.5:
                img = cv2.flip(img, 1)  # Horizontal flip
            
            if random.random() > 0.5:
                rows, cols = img.shape[:2]
                angle = random.uniform(-15, 15)
                matrix = cv2.getRotationMatrix2D((cols/2, rows/2), angle, 1)
                img = cv2.warpAffine(img, matrix, (cols, rows))
            
            if random.random() > 0.5:
                brightness = random.uniform(0.8, 1.2)
                img = cv2.convertScaleAbs(img, alpha=brightness, beta=0)
            
            # Save
            new_name = f"{img_path.stem}_aug{i:03d}{img_path.suffix}"
            cv2.imwrite(str(folder / new_name), img)
    
    def analyze_dataset(self):
        """Analyze dataset statistics"""
        print(f"\n📊 Dataset Analysis...")
        print(f"{'='*60}")
        
        for split in ['train', 'val']:
            print(f"\n{split.upper()} SPLIT:")
            print(f"{'-'*60}")
            
            total = 0
            for emotion in self.EMOTIONS:
                emotion_folder = self.output_dir / split / emotion
                count = len(list(emotion_folder.glob('*.jpg'))) + \
                        len(list(emotion_folder.glob('*.png')))
                total += count
                print(f"  {emotion:10s}: {count:5d} images")
            
            print(f"  {'Total':10s}: {total:5d} images")
        
        print(f"\n{'='*60}")
    
    def validate_images(self):
        """Validate all images dapat dibaca"""
        print(f"\n✓ Validating images...")
        
        corrupted = []
        for split in ['train', 'val']:
            for emotion in self.EMOTIONS:
                emotion_folder = self.output_dir / split / emotion
                images = list(emotion_folder.glob('*.jpg')) + \
                          list(emotion_folder.glob('*.png'))
                
                for img_path in images:
                    try:
                        img = cv2.imread(str(img_path))
                        if img is None:
                            corrupted.append(str(img_path))
                    except Exception as e:
                        corrupted.append(str(img_path))
        
        if corrupted:
            print(f"⚠️  Found {len(corrupted)} corrupted images:")
            for path in corrupted:
                print(f"  {path}")
        else:
            print("✓ All images valid")
        
        return corrupted
    
    def export_summary(self):
        """Export summary sebagai JSON"""
        import json
        
        summary = {}
        
        for split in ['train', 'val']:
            summary[split] = {}
            total = 0
            
            for emotion in self.EMOTIONS:
                emotion_folder = self.output_dir / split / emotion
                count = len(list(emotion_folder.glob('*.jpg'))) + \
                        len(list(emotion_folder.glob('*.png')))
                summary[split][emotion] = count
                total += count
            
            summary[split]['total'] = total
        
        output_path = self.output_dir / 'dataset_summary.json'
        with open(output_path, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"✓ Summary saved: {output_path}")
        
        return summary


def main():
    """Main function"""
    
    preparator = DatasetPreparator('./data')
    
    print("\n" + "="*60)
    print("Dataset Preparation Tool")
    print("="*60)
    
    # Example 1: Analyze existing dataset
    print("\n1️⃣  Analyzing dataset...")
    preparator.analyze_dataset()
    
    # Example 2: Validate images
    print("\n2️⃣  Validating images...")
    preparator.validate_images()
    
    # Example 3: Export summary
    print("\n3️⃣  Exporting summary...")
    preparator.export_summary()
    
    # Example 4: Balance (jika needed)
    # print("\n4️⃣  Balancing dataset...")
    # preparator.balance_dataset(target_size_per_class=1000)
    
    print("\n✅ Dataset preparation completed!")


if __name__ == '__main__':
    main()
