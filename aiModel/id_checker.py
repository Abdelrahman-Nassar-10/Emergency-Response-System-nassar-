import torch
import torchvision.transforms as T
import torchvision.models as models
from PIL import Image
import numpy as np
from ultralytics import YOLO

class EgyptianIDChecker:
    def __init__(self, yolo_path, mean_feature_path, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = YOLO(yolo_path)
        
        self.mobilenet = models.mobilenet_v2(pretrained=True)
        self.mobilenet.eval()
        self.mobilenet.classifier = torch.nn.Identity()
        self.mobilenet.to(self.device)
        
        self.mean_feature = np.load(mean_feature_path)
        
        self.transform = T.Compose([
            T.Resize((224, 224)),
            T.ToTensor(),
            T.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
        ])
    
    def extract_features(self, image):
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            feat = self.mobilenet(img_tensor)
        return feat.cpu().numpy().flatten()
    
    def check_id(self, image_path, threshold=0.8):
        img = Image.open(image_path).convert("RGB")
        results = self.model.predict(image_path, verbose=False, conf=0.25)
        
        if len(results[0].boxes.xyxy) == 0:
            return {"valid": False, "similarity": 0.0, "error": "No ID detected"}
        
        x1, y1, x2, y2 = results[0].boxes.xyxy[0].cpu().numpy()
        cropped = img.crop((x1, y1, x2, y2))
        
        feat = self.extract_features(cropped)
        feat_norm = feat / np.linalg.norm(feat)
        mean_norm = self.mean_feature / np.linalg.norm(self.mean_feature)
        similarity = np.dot(feat_norm, mean_norm)
        
        valid = similarity >= threshold
        return {"valid": valid, "similarity": float(similarity)}
