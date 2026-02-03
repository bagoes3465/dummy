"""
Facial Expression Inference Script
Menggunakan trained model untuk prediksi emotion dari images
"""

import torch
import cv2
import numpy as np
from pathlib import Path
from torchvision import transforms
from face_expressions import FacialExpressionPredictor, ExpressionAnalyzer


class FacialExpressionInference:
    """Wrapper untuk facial expression inference"""
    
    def __init__(self, model_path, device=None):
        """
        Initialize inference
        
        Args:
            model_path (str): Path ke saved model
            device (torch.device): Device untuk inference
        """
        self.device = device or torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.predictor = FacialExpressionPredictor(model_path, device=self.device)
        
        # Image preprocessing
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Resize((224, 224)),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def predict_from_image_path(self, image_path):
        """
        Predict emotion dari image file
        
        Args:
            image_path (str): Path ke image
            
        Returns:
            dict: Prediction results
        """
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Preprocess
        img_tensor = self.transform(img).unsqueeze(0)
        
        # Predict
        prediction = self.predictor.predict(img_tensor)
        
        return prediction
    
    def predict_from_cv_image(self, cv_image):
        """
        Predict emotion dari OpenCV image
        
        Args:
            cv_image: Image dari cv2.imread atau camera
            
        Returns:
            dict: Prediction results
        """
        # Convert BGR to RGB
        rgb_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
        
        # Preprocess
        img_tensor = self.transform(rgb_image).unsqueeze(0)
        
        # Predict
        prediction = self.predictor.predict(img_tensor)
        
        return prediction
    
    def predict_batch_from_folder(self, folder_path):
        """
        Batch predict từ folder chứa images
        
        Args:
            folder_path (str): Path to folder with images
            
        Returns:
            list: List of predictions with filenames
        """
        folder = Path(folder_path)
        image_files = list(folder.glob('*.jpg')) + list(folder.glob('*.png'))
        
        results = []
        for img_path in image_files:
            try:
                prediction = self.predict_from_image_path(str(img_path))
                results.append({
                    'filename': img_path.name,
                    'path': str(img_path),
                    'prediction': prediction
                })
            except Exception as e:
                print(f"Error processing {img_path.name}: {e}")
        
        return results
    
    def visualize_prediction(self, image_path, output_path=None):
        """
        Visualize prediction dengan annotasi di image
        
        Args:
            image_path (str): Path ke input image
            output_path (str): Path untuk save output (optional)
        """
        # Load & predict
        img = cv2.imread(image_path)
        prediction = self.predict_from_cv_image(img)
        
        # Get image dimensions
        h, w = img.shape[:2]
        
        # Create result display
        result_img = img.copy()
        
        # Add emotion info
        emotion = prediction['emotion']
        emoji = prediction['emoji']
        confidence = prediction['confidence']
        
        text = f"{emoji} {emotion} ({confidence:.1%})"
        
        # Draw rectangle
        cv2.rectangle(result_img, (10, 10), (w-10, 50), (0, 255, 0), 2)
        
        # Put text
        cv2.putText(
            result_img,
            text,
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 255, 0),
            2
        )
        
        # Add all probabilities
        y_offset = 60
        for emotion_name, prob in prediction['probabilities'].items():
            prob_text = f"{emotion_name}: {prob:.1%}"
            cv2.putText(
                result_img,
                prob_text,
                (20, y_offset),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                1
            )
            y_offset += 25
        
        # Save if output path provided
        if output_path:
            cv2.imwrite(output_path, result_img)
            print(f"✓ Saved to: {output_path}")
        
        return result_img
    
    def process_video(self, video_path, output_path=None):
        """
        Process video file
        
        Args:
            video_path (str): Path ke video file
            output_path (str): Path untuk save output video (optional)
        """
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise FileNotFoundError(f"Video not found: {video_path}")
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Setup output
        if output_path:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        frame_idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Predict
            prediction = self.predict_from_cv_image(frame)
            
            # Annotate frame
            emotion = prediction['emotion']
            confidence = prediction['confidence']
            emoji = prediction['emoji']
            
            text = f"{emoji} {emotion} ({confidence:.1%})"
            
            cv2.rectangle(frame, (10, 10), (width-10, 50), (0, 255, 0), 2)
            cv2.putText(
                frame,
                text,
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.2,
                (0, 255, 0),
                2
            )
            
            # Write frame
            if output_path:
                out.write(frame)
            
            # Display
            cv2.imshow('Facial Expression', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
            frame_idx += 1
            print(f"Processed frame {frame_idx}/{total_frames}")
        
        cap.release()
        if output_path:
            out.release()
        cv2.destroyAllWindows()
    
    def process_webcam(self, duration=30):
        """
        Real-time emotion detection dari webcam
        
        Args:
            duration (int): Lama recording dalam detik
        """
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            raise RuntimeError("Cannot open webcam")
        
        print(f"Starting webcam inference for {duration} seconds...")
        print("Press 'q' to quit\n")
        
        import time
        start_time = time.time()
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Predict
            prediction = self.predict_from_cv_image(frame)
            
            # Annotate
            emotion = prediction['emotion']
            confidence = prediction['confidence']
            emoji = prediction['emoji']
            
            text = f"{emoji} {emotion} ({confidence:.1%})"
            
            h, w = frame.shape[:2]
            cv2.rectangle(frame, (10, 10), (w-10, 50), (0, 255, 0), 2)
            cv2.putText(
                frame,
                text,
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.2,
                (0, 255, 0),
                2
            )
            
            # Show probabilities
            y_offset = 60
            for emotion_name, prob in prediction['probabilities'].items():
                prob_text = f"{emotion_name}: {prob:.1%}"
                cv2.putText(
                    frame,
                    prob_text,
                    (20, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (255, 255, 255),
                    1
                )
                y_offset += 20
            
            # Display
            cv2.imshow('Facial Expression Detection', frame)
            
            # Check quit or timeout
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
            if time.time() - start_time > duration:
                break
        
        cap.release()
        cv2.destroyAllWindows()


def main():
    """Example usage"""
    
    # Model path
    model_path = './checkpoints/best_model.pth'
    
    # Initialize
    inference = FacialExpressionInference(model_path)
    
    print("Facial Expression Inference\n")
    print("=" * 60)
    
    # Example 1: Single image
    print("\n📸 Example 1: Single Image Prediction")
    try:
        result = inference.predict_from_image_path('./sample_image.jpg')
        print(ExpressionAnalyzer.format_prediction(result))
    except FileNotFoundError:
        print("Sample image not found")
    
    # Example 2: Batch images
    print("\n📂 Example 2: Batch Prediction from Folder")
    try:
        results = inference.predict_batch_from_folder('./test_images')
        for item in results:
            print(f"{item['filename']}: {item['prediction']['emotion']}")
    except Exception as e:
        print(f"Folder processing error: {e}")
    
    # Example 3: Webcam
    print("\n📹 Example 3: Webcam Real-time Detection")
    print("Press 'q' to quit")
    try:
        inference.process_webcam(duration=30)
    except Exception as e:
        print(f"Webcam error: {e}")
    
    print("\n✅ Inference examples completed!")


if __name__ == '__main__':
    main()
