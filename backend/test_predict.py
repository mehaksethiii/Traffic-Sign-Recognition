"""Quick test — sends a stop sign image to the running API."""
import requests, io
from PIL import Image

# Create a synthetic stop sign: red octagon approximation
img = Image.new("RGB", (300, 300), color=(200, 20, 20))
buf = io.BytesIO()
img.save(buf, format="JPEG")
buf.seek(0)

resp = requests.post(
    "http://localhost:8000/predict",
    files={"file": ("stop.jpg", buf, "image/jpeg")},
    timeout=15,
)
print("Status :", resp.status_code)
d = resp.json()
print("Predicted :", d["traffic_sign"])
print("Class ID  :", d["class_id"])
print("Confidence:", d["confidence"], "%")
print("Full      :", d)
