"""
utils.py - Traffic Sign Recognition utilities
Registers ALL custom Keras layers and provides preprocessing + sign database.
"""

import numpy as np
import keras
import tensorflow as tf
from PIL import Image

# ─────────────────────────────────────────────────────────────────────────────
# Generator Index → GTSRB Class ID mapping
#
# ImageDataGenerator.flow_from_dataframe sorts class labels as STRINGS.
# So "10" comes before "2" alphabetically → generator indices are NOT equal
# to GTSRB class IDs. This mapping translates model output indices to the
# correct GTSRB class IDs.
#
# Reproduced with: sorted([str(i) for i in range(43)])
# ─────────────────────────────────────────────────────────────────────────────
GENERATOR_TO_GTSRB = {
    0: 0,   1: 1,   2: 10,  3: 11,  4: 12,  5: 13,  6: 14,  7: 15,
    8: 16,  9: 17, 10: 18, 11: 19, 12: 2,  13: 20, 14: 21, 15: 22,
   16: 23, 17: 24, 18: 25, 19: 26, 20: 27, 21: 28, 22: 29, 23: 3,
   24: 30, 25: 31, 26: 32, 27: 33, 28: 34, 29: 35, 30: 36, 31: 37,
   32: 38, 33: 39, 34: 4,  35: 40, 36: 41, 37: 42, 38: 5,  39: 6,
   40: 7,  41: 8,  42: 9,
}

# ─────────────────────────────────────────────────────────────────────────────
# Custom Layers — MUST be defined and registered before load_model() is called
# Triple Attention mechanism uses MeanLayer and MaxLayer
# ─────────────────────────────────────────────────────────────────────────────

@keras.saving.register_keras_serializable(package="Custom")
class MeanLayer(keras.layers.Layer):
    """Computes channel-wise mean for attention: (B,H,W,C) -> (B,H,W,1)"""
    def call(self, inputs):
        return tf.reduce_mean(inputs, axis=-1, keepdims=True)

    def get_config(self):
        return super().get_config()


@keras.saving.register_keras_serializable(package="Custom")
class MaxLayer(keras.layers.Layer):
    """Computes channel-wise max for attention: (B,H,W,C) -> (B,H,W,1)"""
    def call(self, inputs):
        return tf.reduce_max(inputs, axis=-1, keepdims=True)

    def get_config(self):
        return super().get_config()


# Register under bare names too (model config stores registered_name without package)
keras.utils.get_custom_objects()["MeanLayer"] = MeanLayer
keras.utils.get_custom_objects()["MaxLayer"]  = MaxLayer

CUSTOM_OBJECTS = {
    "MeanLayer": MeanLayer,
    "MaxLayer":  MaxLayer,
}


# ─────────────────────────────────────────────────────────────────────────────
# Preprocessing — must exactly match training
# ─────────────────────────────────────────────────────────────────────────────

def preprocess_image(image, target_size=(224, 224)):
    """
    Preprocesses a PIL image to exactly match the standard Keras training pipeline:
      - RGB conversion
      - Resize to 224×224 using LANCZOS (high-quality, same as keras.utils.load_img default)
      - float32 cast
      - MobileNetV2 preprocess_input → [-1, 1]
    Returns numpy array shape (1, 224, 224, 3).
    """
    import tensorflow as tf

    image = image.convert("RGB")
    # Use LANCZOS for high-quality downsampling — matches keras.utils.load_img behavior
    image = image.resize(target_size, Image.LANCZOS)
    img_array = np.array(image, dtype=np.float32)                               # (224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)                               # (1, 224, 224, 3)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)  # [-1, 1]
    return img_array


# ─────────────────────────────────────────────────────────────────────────────
# GTSRB — 43-class sign database
# ─────────────────────────────────────────────────────────────────────────────

TRAFFIC_SIGNS = {
    0:  {"name": "Speed Limit 20 km/h",   "description": "Maximum permitted speed is 20 km/h. Found in residential zones and school areas.", "safety_tip": "Reduce speed. Watch for pedestrians and children.", "icon": "🔢", "category": "speed_limit"},
    1:  {"name": "Speed Limit 30 km/h",   "description": "Maximum speed 30 km/h. Common in urban areas and near schools.", "safety_tip": "Keep speed at or below 30 km/h. Alert for pedestrian crossings.", "icon": "🔢", "category": "speed_limit"},
    2:  {"name": "Speed Limit 50 km/h",   "description": "Standard urban speed limit of 50 km/h.", "safety_tip": "Maintain 50 km/h or less. Watch intersections carefully.", "icon": "🔢", "category": "speed_limit"},
    3:  {"name": "Speed Limit 60 km/h",   "description": "Maximum speed 60 km/h on wider urban roads.", "safety_tip": "Do not exceed 60 km/h. Keep safe following distance.", "icon": "🔢", "category": "speed_limit"},
    4:  {"name": "Speed Limit 70 km/h",   "description": "Speed restricted to 70 km/h on suburban arterials.", "safety_tip": "Obey 70 km/h limit. Adjust for weather conditions.", "icon": "🔢", "category": "speed_limit"},
    5:  {"name": "Speed Limit 80 km/h",   "description": "Maximum permitted speed is 80 km/h on rural roads.", "safety_tip": "Keep at or below 80 km/h. Anticipate sharp curves.", "icon": "🔢", "category": "speed_limit"},
    6:  {"name": "End of Speed Limit 80 km/h", "description": "The 80 km/h restriction is lifted here.", "safety_tip": "Confirm new speed limit before accelerating.", "icon": "🔚", "category": "end_restriction"},
    7:  {"name": "Speed Limit 100 km/h",  "description": "Maximum speed 100 km/h on expressways.", "safety_tip": "Stay within 100 km/h. Maintain larger following distances.", "icon": "🔢", "category": "speed_limit"},
    8:  {"name": "Speed Limit 120 km/h",  "description": "Maximum motorway speed 120 km/h.", "safety_tip": "Never exceed 120 km/h. Stay fully alert at highway speeds.", "icon": "🔢", "category": "speed_limit"},
    9:  {"name": "No Passing",            "description": "Overtaking prohibited where visibility is limited.", "safety_tip": "Do not attempt to pass any vehicle.", "icon": "🚫", "category": "prohibition"},
    10: {"name": "No Passing for Vehicles over 3.5 Metric Tons", "description": "Heavy vehicles prohibited from overtaking.", "safety_tip": "Heavy vehicle drivers stay in lane.", "icon": "🚛", "category": "prohibition"},
    11: {"name": "Right-of-Way at Next Intersection", "description": "You have right-of-way at the upcoming intersection.", "safety_tip": "Proceed with caution — not all drivers may obey.", "icon": "➕", "category": "priority"},
    12: {"name": "Priority Road",         "description": "You are on a priority road with right-of-way.", "safety_tip": "Stay vigilant at junctions.", "icon": "💎", "category": "priority"},
    13: {"name": "Yield",                 "description": "Give way to all traffic on the road you are joining.", "safety_tip": "Slow down and yield. Do not assume road is clear.", "icon": "⬇️", "category": "mandatory"},
    14: {"name": "Stop",                  "description": "Mandatory full stop required before proceeding.", "safety_tip": "Come to a complete stop. Check all directions.", "icon": "🛑", "category": "mandatory"},
    15: {"name": "No Vehicles",           "description": "No motor vehicles allowed beyond this point.", "safety_tip": "Do not enter with any vehicle.", "icon": "⛔", "category": "prohibition"},
    16: {"name": "Vehicles Over 3.5 Metric Tons Prohibited", "description": "Heavy vehicles over 3.5t prohibited.", "safety_tip": "Heavy vehicle drivers must seek an alternative route.", "icon": "🚛", "category": "prohibition"},
    17: {"name": "No Entry",              "description": "Entry forbidden for all vehicles. One-way road.", "safety_tip": "Do not enter. Wrong-way entry is extremely dangerous.", "icon": "⛔", "category": "prohibition"},
    18: {"name": "General Caution",       "description": "General hazard ahead. Reduce speed and be alert.", "safety_tip": "Slow down. Hazard type may be on a supplementary panel.", "icon": "⚠️", "category": "warning"},
    19: {"name": "Dangerous Curve Left",  "description": "Sharp curve to the left ahead.", "safety_tip": "Reduce speed before the curve. No sharp braking mid-curve.", "icon": "↩️", "category": "warning"},
    20: {"name": "Dangerous Curve Right", "description": "Sharp curve to the right ahead.", "safety_tip": "Slow down before the curve. Stay in your lane.", "icon": "↪️", "category": "warning"},
    21: {"name": "Double Curve",          "description": "Two successive curves ahead.", "safety_tip": "Reduce speed significantly. Anticipate the second curve.", "icon": "〰️", "category": "warning"},
    22: {"name": "Bumpy Road",            "description": "Uneven road surface or speed bumps ahead.", "safety_tip": "Slow down to protect tyres and suspension.", "icon": "🪨", "category": "warning"},
    23: {"name": "Slippery Road",         "description": "Road may be slippery due to rain, ice, or oil.", "safety_tip": "Reduce speed. Avoid harsh braking or sharp steering.", "icon": "🌊", "category": "warning"},
    24: {"name": "Road Narrows on Right", "description": "Road width decreases on the right side.", "safety_tip": "Keep left. Reduce speed for the narrower section.", "icon": "📐", "category": "warning"},
    25: {"name": "Road Work",             "description": "Construction work on or near the road.", "safety_tip": "Slow down. Follow temporary signs and obey flagmen.", "icon": "🚧", "category": "warning"},
    26: {"name": "Traffic Signals",       "description": "Traffic lights are ahead.", "safety_tip": "Approach at safe speed. Prepare to stop.", "icon": "🚦", "category": "warning"},
    27: {"name": "Pedestrians",           "description": "Pedestrian crossing or high foot-traffic area ahead.", "safety_tip": "Slow down. Give way to pedestrians.", "icon": "🚶", "category": "warning"},
    28: {"name": "Children Crossing",     "description": "School crossing or children's play area nearby.", "safety_tip": "Reduce speed. Extra vigilance during school hours.", "icon": "👧", "category": "warning"},
    29: {"name": "Bicycles Crossing",     "description": "Cycle path crosses or joins the road ahead.", "safety_tip": "Watch for cyclists. Give them adequate space.", "icon": "🚲", "category": "warning"},
    30: {"name": "Beware of Ice/Snow",    "description": "Icy or snowy conditions likely ahead.", "safety_tip": "Greatly reduce speed. Avoid sudden manoeuvres.", "icon": "❄️", "category": "warning"},
    31: {"name": "Wild Animals Crossing", "description": "Wildlife frequently crosses in this area.", "safety_tip": "Reduce speed. Brake gently if animal spotted — don't swerve.", "icon": "🦌", "category": "warning"},
    32: {"name": "End of All Speed and Passing Limits", "description": "All speed and passing restrictions cancelled.", "safety_tip": "Confirm applicable speed limit before accelerating.", "icon": "🔚", "category": "end_restriction"},
    33: {"name": "Turn Right Ahead",      "description": "Must turn right at the upcoming junction.", "safety_tip": "Signal early. Check mirrors before turning.", "icon": "➡️", "category": "mandatory"},
    34: {"name": "Turn Left Ahead",       "description": "Must turn left at the next junction.", "safety_tip": "Check for oncoming traffic before turning left.", "icon": "⬅️", "category": "mandatory"},
    35: {"name": "Ahead Only",            "description": "Must proceed straight ahead.", "safety_tip": "Stay in lane. No turns at this intersection.", "icon": "⬆️", "category": "mandatory"},
    36: {"name": "Go Straight or Right",  "description": "May go straight or turn right. No left turn.", "safety_tip": "Signal if turning right.", "icon": "↗️", "category": "mandatory"},
    37: {"name": "Go Straight or Left",   "description": "May go straight or turn left. No right turn.", "safety_tip": "Signal clearly when turning left.", "icon": "↖️", "category": "mandatory"},
    38: {"name": "Keep Right",            "description": "Must pass to the right of the divider.", "safety_tip": "Stay right. Do not pass on the left.", "icon": "▶️", "category": "mandatory"},
    39: {"name": "Keep Left",             "description": "Must keep to the left of the divider.", "safety_tip": "Stay left. Follow directional arrows.", "icon": "◀️", "category": "mandatory"},
    40: {"name": "Roundabout Mandatory",  "description": "Entering a roundabout. Traffic inside has priority.", "safety_tip": "Yield to roundabout traffic. Signal when exiting.", "icon": "🔄", "category": "mandatory"},
    41: {"name": "End of No Passing",     "description": "No-passing zone has ended.", "safety_tip": "Overtake only when visibility and gap are sufficient.", "icon": "✅", "category": "end_restriction"},
    42: {"name": "End of No Passing by Vehicles over 3.5 Metric Tons", "description": "Heavy vehicle overtaking restrictions lifted.", "safety_tip": "Heavy vehicles may pass but should still overtake with caution.", "icon": "✅", "category": "end_restriction"},
}


def get_sign_info(class_id: int) -> dict:
    """Return sign metadata for a given class ID."""
    return TRAFFIC_SIGNS.get(
        class_id,
        {
            "name":        f"Unknown Sign (ID: {class_id})",
            "description": "Sign class not found in database.",
            "safety_tip":  "Consult the official traffic code.",
            "icon":        "❓",
            "category":    "unknown",
        },
    )
