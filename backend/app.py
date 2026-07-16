"""
app.py - FastAPI backend for TrafficSignAI
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

# Import utils FIRST — registers MeanLayer + MaxLayer with Keras before any model load
from utils import get_sign_info, preprocess_image, CUSTOM_OBJECTS, GENERATOR_TO_GTSRB

# ─────────────────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Use a mutable dict so lifespan can update state without `global` keyword issues
# ─────────────────────────────────────────────────────────────────────────────
_state = {"model": None, "model_file": None}


def find_model_path() -> str | None:
    model_dir = os.path.join(os.path.dirname(__file__), "model")
    if not os.path.isdir(model_dir):
        return None
    for preferred in ["TrafficSignAI_Final.keras", "TrafficSignAI_Best.keras"]:
        p = os.path.join(model_dir, preferred)
        if os.path.exists(p):
            return p
    keras_files = sorted(f for f in os.listdir(model_dir) if f.lower().endswith(".keras"))
    if keras_files:
        return os.path.join(model_dir, keras_files[0])
    h5_files = sorted(f for f in os.listdir(model_dir) if f.lower().endswith(".h5"))
    if h5_files:
        return os.path.join(model_dir, h5_files[0])
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Lifespan — load model once on startup
# ─────────────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    import keras

    model_path = find_model_path()

    if model_path is None:
        logger.warning("⚠️  No .keras model found in backend/model/ — /predict will return 503")
    else:
        try:
            logger.info("Loading model: %s", os.path.basename(model_path))
            model = keras.models.load_model(
                model_path,
                compile=False,
                custom_objects=CUSTOM_OBJECTS,
            )
            # Warm-up
            dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
            model.predict(dummy, verbose=0)

            _state["model"]      = model
            _state["model_file"] = os.path.basename(model_path)

            logger.info("=" * 55)
            logger.info("✅  Model Loaded Successfully")
            logger.info("    File   : %s", _state["model_file"])
            logger.info("    Input  : %s", model.input_shape)
            logger.info("    Output : %s", model.output_shape)
            logger.info("    Classes: %d", model.output_shape[-1])
            logger.info("=" * 55)
        except Exception:
            logger.exception("❌  Failed to load model")

    yield
    logger.info("Shutdown complete.")


# ─────────────────────────────────────────────────────────────────────────────
# App
# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="TrafficSignAI API",
    description="Classify GTSRB traffic signs using MobileNetV2 + Triple Attention.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {
    "image/jpeg", "image/jpg", "image/png",
    "image/bmp", "image/gif", "image/webp", "image/tiff",
}


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    return {
        "status":       "ok",
        "model_loaded": _state["model"] is not None,
        "model_file":   _state["model_file"],
        "version":      "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status":       "healthy" if _state["model"] is not None else "model_not_loaded",
        "model_loaded": _state["model"] is not None,
        "model_file":   _state["model_file"],
    }


@app.post("/predict", tags=["Prediction"])
async def predict(file: UploadFile = File(...)):
    model = _state["model"]

    # 1. Model guard
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Place a .keras file in backend/model/ and restart.",
        )

    # 2. File type check
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type '{content_type}'.")

    # 3. Read + decode image
    try:
        data = await file.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty file.")
        image = Image.open(io.BytesIO(data))
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Cannot identify file as a valid image.")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error reading image: {exc}")

    # 4. Preprocess — resize 224x224, RGB, float32, MobileNetV2 normalization
    try:
        img_array = preprocess_image(image, target_size=(224, 224))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Preprocessing error: {exc}")

    # 5. Inference
    try:
        preds         = model.predict(img_array, verbose=0)   # shape (1, 43)
        gen_index     = int(np.argmax(preds[0]))
        class_id      = GENERATOR_TO_GTSRB[gen_index]         # ← correct GTSRB ID
        confidence    = float(np.max(preds[0])) * 100
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    # 6. Build + return response
    info = get_sign_info(class_id)
    logger.info("Predict → gen=%d gtsrb=%d | %s | %.2f%%", gen_index, class_id, info["name"], confidence)

    return JSONResponse(content={
        "class_id":     class_id,
        "traffic_sign": info["name"],
        "confidence":   round(confidence, 2),
        "description":  info["description"],
        "safety_tip":   info["safety_tip"],
        "icon":         info["icon"],
        "category":     info["category"],
    })


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
