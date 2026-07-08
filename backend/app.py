"""
app.py - FastAPI backend for Traffic Sign Recognition
"""

import io
import os
import logging
from contextlib import asynccontextmanager

import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError

from utils import get_sign_info, preprocess_image

# ─────────────────────────────────────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Global model holder
# ─────────────────────────────────────────────────────────────────────────────
MODEL = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "TrafficSignAI_Final.keras")


# ─────────────────────────────────────────────────────────────────────────────
# Lifespan – load model once on startup
# ─────────────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global MODEL
    try:
        import tensorflow as tf
        logger.info("Loading model from %s …", MODEL_PATH)
        if not os.path.exists(MODEL_PATH):
            logger.warning(
                "Model file not found at %s. "
                "Place 'TrafficSignAI_Final.keras' in the model/ directory.",
                MODEL_PATH,
            )
        else:
            MODEL = tf.keras.models.load_model(MODEL_PATH)
            # Warm-up pass to JIT-compile the graph
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            MODEL.predict(dummy, verbose=0)
            logger.info("Model loaded and warmed up successfully.")
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)
    yield
    # Cleanup (nothing needed here)
    logger.info("Shutting down — goodbye!")


# ─────────────────────────────────────────────────────────────────────────────
# App
# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="TrafficSignAI API",
    description=(
        "REST API for classifying German Traffic Sign Recognition Benchmark (GTSRB) "
        "images using a fine-tuned MobileNetV2 model with Triple Attention."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS – allow all origins for development / public deployment
# ─────────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Allowed image MIME types
# ─────────────────────────────────────────────────────────────────────────────
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/bmp",
    "image/gif",
    "image/webp",
    "image/tiff",
}


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint — returns API status and whether the model is loaded."""
    return {
        "status": "ok",
        "message": "TrafficSignAI API is running",
        "model_loaded": MODEL is not None,
        "version": "1.0.0",
    }


@app.post("/predict", tags=["Prediction"])
async def predict(file: UploadFile = File(...)):
    """
    Predict the traffic sign class from an uploaded image.

    - Accepts: JPEG, PNG, BMP, GIF, WebP, TIFF
    - Returns: class_id, traffic_sign name, confidence percentage, description, safety_tip, icon
    """
    # ── 1. Model availability check ──────────────────────────────────────────
    if MODEL is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model is not loaded. Please ensure 'TrafficSignAI_Final.keras' "
                "is placed in the backend/model/ directory and restart the server."
            ),
        )

    # ── 2. Content-type validation ────────────────────────────────────────────
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{content_type}'. Please upload a valid image (JPEG, PNG, BMP, WebP, TIFF).",
        )

    # ── 3. Read & decode image ────────────────────────────────────────────────
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        image = Image.open(io.BytesIO(contents))
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Cannot identify the uploaded file as a valid image. Please try a different file.",
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error reading uploaded file: %s", exc)
        raise HTTPException(status_code=400, detail=f"Error reading image: {str(exc)}")

    # ── 4. Preprocess ─────────────────────────────────────────────────────────
    try:
        img_array = preprocess_image(image, target_size=(224, 224))
    except Exception as exc:
        logger.error("Preprocessing failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Image preprocessing error: {str(exc)}")

    # ── 5. Inference ──────────────────────────────────────────────────────────
    try:
        predictions = MODEL.predict(img_array, verbose=0)  # shape (1, 43)
        class_id = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0])) * 100  # percentage
    except Exception as exc:
        logger.error("Inference failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")

    # ── 6. Build response ─────────────────────────────────────────────────────
    sign_info = get_sign_info(class_id)

    logger.info(
        "Prediction → class_id=%d | sign='%s' | confidence=%.2f%%",
        class_id,
        sign_info["name"],
        confidence,
    )

    return JSONResponse(
        content={
            "class_id": class_id,
            "traffic_sign": sign_info["name"],
            "confidence": round(confidence, 2),
            "description": sign_info["description"],
            "safety_tip": sign_info["safety_tip"],
            "icon": sign_info["icon"],
            "category": sign_info["category"],
        }
    )


# ─────────────────────────────────────────────────────────────────────────────
# Dev entry-point
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
