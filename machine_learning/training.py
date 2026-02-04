from ultralytics import YOLO
import os

if __name__ == "__main__":
    # Disable CUDA to avoid paging file issues on Windows
    os.environ["CUDA_VISIBLE_DEVICES"] = ""
    device = "cpu"
    print(f"Menggunakan device: CPU (CUDA disabled due to memory constraints)")
    model = YOLO("yolo11n.pt")

    model.train(
        data=r"E:\!project\project_photobooth\machine_learning\dataset\data.yaml",
        epochs=5,
        batch=16,
        imgsz=416,
        device=0,
        workers=2,
        cache=False,
        amp=True,
        single_cls=False,
        augment=True,
        val=True,
        patience=10,
        project=r"E:\!project\project_photobooth\machine_learning\runs\detect",
        name="train_tes",
        box=0.5,
        iou=0.5,
    )