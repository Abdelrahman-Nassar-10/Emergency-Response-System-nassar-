import sys
import json
from id_checker import EgyptianIDChecker  

image_path = sys.argv[1]

checker = EgyptianIDChecker(
    yolo_path="aiModel/best.pt",
    mean_feature_path="aiModel/mean_feature.npy"
)

result = checker.check_id(image_path)

def make_json_serializable(obj):
    if isinstance(obj, (bool, int, float)):
        return obj
    if hasattr(obj, "tolist"):
        return obj.tolist()
    if obj is None:
        return None
    return str(obj)

safe_result = {k: make_json_serializable(v) for k, v in result.items()}
print(json.dumps(safe_result))
