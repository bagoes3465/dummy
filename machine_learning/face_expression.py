import cv2
from ultralytics import YOLO

# Load the trained YOLO model for face expression detection
model = YOLO(r'E:\!project\project_photobooth\machine_learning\runs\detect\yolo11n_telur_20260203_141241\weights\best.pt')

# Define the expression classes (correcting 'netural' to 'neutral')
classes = ['angry', 'happy', 'neutral', 'sad', 'surprise']

# Initialize webcam
cap = cv2.VideoCapture(2)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run inference on the frame
    results = model(frame)

    # Process results
    for result in results:
        boxes = result.boxes
        for box in boxes:
            # Get bounding box coordinates
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            conf = box.conf[0].cpu().numpy()
            cls = int(box.cls[0].cpu().numpy())

            # Get the expression class
            expression = classes[cls] if cls < len(classes) else 'unknown'

            # Draw bounding box and label
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            label = f"{expression}: {conf:.2f}"
            cv2.putText(frame, label, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            print(classes[cls], conf)
            if conf > 0.5:
                print(f"Detected expression: {expression} with confidence {conf:.2f}")
    # Display the frame
    cv2.imshow('Face Expression Detection', frame)

    # Break on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
