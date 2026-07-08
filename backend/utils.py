"""
utils.py - Traffic Sign Recognition utilities
Contains the full GTSRB 43-class database and preprocessing helpers.
"""

import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
# GTSRB - 43 Traffic Sign Classes
# ─────────────────────────────────────────────────────────────────────────────
TRAFFIC_SIGNS = {
    0: {
        "name": "Speed Limit 20 km/h",
        "description": "Indicates the maximum permitted speed is 20 km/h. Typically found in residential zones, school areas, and pedestrian-heavy streets.",
        "safety_tip": "Reduce speed immediately and watch for pedestrians, cyclists, and children near the road.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    1: {
        "name": "Speed Limit 30 km/h",
        "description": "Maximum speed allowed is 30 km/h. Common in urban areas, near schools, and in 'Tempo 30' zones across Europe.",
        "safety_tip": "Keep speed at or below 30 km/h. Be alert for sudden pedestrian crossings.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    2: {
        "name": "Speed Limit 50 km/h",
        "description": "Standard urban speed limit of 50 km/h. Applied in most city streets and built-up areas.",
        "safety_tip": "Maintain 50 km/h or less. Watch intersections carefully and be prepared to stop.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    3: {
        "name": "Speed Limit 60 km/h",
        "description": "Maximum speed of 60 km/h. Found on wider urban roads and some rural access roads.",
        "safety_tip": "Do not exceed 60 km/h. Stay focused and keep a safe following distance.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    4: {
        "name": "Speed Limit 70 km/h",
        "description": "Speed is restricted to 70 km/h on this stretch. Often found on suburban arterials and approach roads.",
        "safety_tip": "Obey the 70 km/h limit. Adjust speed for weather and traffic conditions.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    5: {
        "name": "Speed Limit 80 km/h",
        "description": "Maximum permitted speed is 80 km/h. Common on rural two-lane roads and transition zones between urban and highway.",
        "safety_tip": "Keep speed at or below 80 km/h. Anticipate slower-moving vehicles and sharp curves.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    6: {
        "name": "End of Speed Limit 80 km/h",
        "description": "The 80 km/h speed restriction is lifted here. Drivers may return to the default national speed limit unless a new sign indicates otherwise.",
        "safety_tip": "Confirm the new applicable speed limit before accelerating. Transition smoothly.",
        "icon": "🔚",
        "category": "end_restriction",
    },
    7: {
        "name": "Speed Limit 100 km/h",
        "description": "Maximum speed of 100 km/h. Typical on expressways, motorway approach sections, and some divided highways.",
        "safety_tip": "Stay within 100 km/h. Maintain larger following distances at higher speeds.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    8: {
        "name": "Speed Limit 120 km/h",
        "description": "Maximum motorway speed of 120 km/h. Found on autobahns and motorways with controlled access.",
        "safety_tip": "Never exceed 120 km/h. At highway speeds, small errors have large consequences — stay fully alert.",
        "icon": "🔢",
        "category": "speed_limit",
    },
    9: {
        "name": "No Passing",
        "description": "Overtaking other vehicles is prohibited here. Usually placed where road visibility is limited, such as curves, hills, or narrow sections.",
        "safety_tip": "Do not attempt to pass any vehicle. Wait until you see the 'End of No Passing' sign.",
        "icon": "🚫",
        "category": "prohibition",
    },
    10: {
        "name": "No Passing for Vehicles over 3.5 Metric Tons",
        "description": "Heavy goods vehicles and trucks exceeding 3.5 metric tons are prohibited from overtaking. Passenger cars may still pass.",
        "safety_tip": "If driving a heavy vehicle, stay in your lane. Passenger car drivers should be cautious around large vehicles.",
        "icon": "🚛",
        "category": "prohibition",
    },
    11: {
        "name": "Right-of-Way at Next Intersection",
        "description": "You have right-of-way at the upcoming intersection over traffic on crossing roads. Stay alert as other drivers must yield to you.",
        "safety_tip": "Proceed with caution even though you have priority — not all drivers may obey the rule.",
        "icon": "➕",
        "category": "priority",
    },
    12: {
        "name": "Priority Road",
        "description": "You are on a priority road where you have right-of-way over all intersecting traffic. The priority continues until a yield or end-of-priority sign appears.",
        "safety_tip": "Stay vigilant at junctions. Even with priority, cross-traffic may not yield correctly.",
        "icon": "💎",
        "category": "priority",
    },
    13: {
        "name": "Yield",
        "description": "You must give way to all traffic on the road you are joining or crossing. Slow down and be prepared to stop if necessary.",
        "safety_tip": "Slow down and yield to all oncoming traffic. Do not assume the road is clear.",
        "icon": "⬇️",
        "category": "mandatory",
    },
    14: {
        "name": "Stop",
        "description": "A mandatory full stop is required at this sign. The driver must come to a complete halt before proceeding and yield to all traffic.",
        "safety_tip": "Come to a complete stop — a rolling stop is illegal. Check all directions before moving.",
        "icon": "🛑",
        "category": "mandatory",
    },
    15: {
        "name": "No Vehicles",
        "description": "No motor vehicles of any kind are allowed beyond this point. The road may be restricted to pedestrians, cyclists, or emergency vehicles only.",
        "safety_tip": "Do not enter with any vehicle. Look for an alternative route or permitted access point.",
        "icon": "⛔",
        "category": "prohibition",
    },
    16: {
        "name": "Vehicles Over 3.5 Metric Tons Prohibited",
        "description": "Heavy vehicles exceeding 3.5 metric tons total weight are prohibited from entering this road or area.",
        "safety_tip": "Heavy vehicle drivers must seek an alternative route. Do not risk bridge or road damage.",
        "icon": "🚛",
        "category": "prohibition",
    },
    17: {
        "name": "No Entry",
        "description": "Entry is strictly forbidden for all vehicles. Typically placed on one-way roads against the direction of traffic flow.",
        "safety_tip": "Do not enter. Entering a one-way road from the wrong direction is extremely dangerous.",
        "icon": "⛔",
        "category": "prohibition",
    },
    18: {
        "name": "General Caution",
        "description": "A general hazard ahead that is not covered by a specific warning sign. Drivers should reduce speed and be prepared for unexpected road conditions.",
        "safety_tip": "Slow down and be alert. Hazard type may be indicated by a supplementary panel below.",
        "icon": "⚠️",
        "category": "warning",
    },
    19: {
        "name": "Dangerous Curve Left",
        "description": "A sharp curve to the left lies ahead. Adjust speed well before entering the curve to maintain control.",
        "safety_tip": "Reduce speed before the curve. Do not brake sharply mid-curve and watch for oncoming traffic.",
        "icon": "↩️",
        "category": "warning",
    },
    20: {
        "name": "Dangerous Curve Right",
        "description": "A sharp curve to the right is approaching. Braking inside a curve reduces traction — slow down in advance.",
        "safety_tip": "Slow down before entering the curve and stay in your lane to avoid crossing centre lines.",
        "icon": "↪️",
        "category": "warning",
    },
    21: {
        "name": "Double Curve",
        "description": "Two or more curves in succession are ahead. The road bends first in one direction, then the other. Extra caution is required.",
        "safety_tip": "Reduce speed significantly. Keep both hands on the wheel and anticipate the second curve.",
        "icon": "〰️",
        "category": "warning",
    },
    22: {
        "name": "Bumpy Road",
        "description": "The road surface ahead is uneven, rough, or contains speed bumps. Sudden drops or humps can cause loss of vehicle control at speed.",
        "safety_tip": "Slow down to protect your tyres, suspension, and cargo. Hold the steering wheel firmly.",
        "icon": "🪨",
        "category": "warning",
    },
    23: {
        "name": "Slippery Road",
        "description": "The road surface may be slippery due to rain, ice, snow, oil spills, or fallen leaves. Traction is significantly reduced.",
        "safety_tip": "Reduce speed and avoid harsh braking, sharp steering, or sudden acceleration.",
        "icon": "🌊",
        "category": "warning",
    },
    24: {
        "name": "Road Narrows on Right",
        "description": "The road width decreases on the right side ahead. Oncoming or overtaking vehicles may be closer than usual.",
        "safety_tip": "Keep left and be prepared to give way. Reduce speed to safely navigate the narrower section.",
        "icon": "📐",
        "category": "warning",
    },
    25: {
        "name": "Road Work",
        "description": "Construction or maintenance work is being carried out on or near the road. Expect reduced lanes, detours, workers, and machinery.",
        "safety_tip": "Slow down and be patient. Follow temporary signs, obey flagmen, and keep a safe distance from workers.",
        "icon": "🚧",
        "category": "warning",
    },
    26: {
        "name": "Traffic Signals",
        "description": "Traffic lights are ahead. Drivers should be prepared to stop if the light is amber or red.",
        "safety_tip": "Approach at a safe speed. Don't attempt to beat amber lights — prepare to stop smoothly.",
        "icon": "🚦",
        "category": "warning",
    },
    27: {
        "name": "Pedestrians",
        "description": "A pedestrian crossing or area with significant pedestrian activity is ahead. Pedestrians may enter the road.",
        "safety_tip": "Slow down and be ready to stop. Give way to pedestrians already on or entering the crossing.",
        "icon": "🚶",
        "category": "warning",
    },
    28: {
        "name": "Children Crossing",
        "description": "A school crossing or children's play area is nearby. Children may unexpectedly enter the road, especially near schools.",
        "safety_tip": "Reduce speed considerably. Be extra vigilant during school hours and watch for groups of children.",
        "icon": "👧",
        "category": "warning",
    },
    29: {
        "name": "Bicycles Crossing",
        "description": "A cycle path crosses or joins the road ahead. Cyclists may enter from the side without expecting fast traffic.",
        "safety_tip": "Watch for cyclists crossing or merging. Give them adequate space and do not block the cycle path.",
        "icon": "🚲",
        "category": "warning",
    },
    30: {
        "name": "Beware of Ice/Snow",
        "description": "Icy or snowy road conditions are likely ahead. Black ice can be invisible and extremely dangerous.",
        "safety_tip": "Greatly reduce speed. Avoid sudden manoeuvres. Ensure your tyres are suitable for winter conditions.",
        "icon": "❄️",
        "category": "warning",
    },
    31: {
        "name": "Wild Animals Crossing",
        "description": "Wildlife such as deer, boars, or other animals frequently cross the road in this area, especially at dawn and dusk.",
        "safety_tip": "Reduce speed and scan the roadsides. If an animal is spotted, brake gently — don't swerve sharply.",
        "icon": "🦌",
        "category": "warning",
    },
    32: {
        "name": "End of All Speed and Passing Limits",
        "description": "All previously imposed speed and passing restrictions are cancelled. National default speed limits and highway code rules apply again.",
        "safety_tip": "Confirm the applicable speed limit for the road type before increasing speed.",
        "icon": "🔚",
        "category": "end_restriction",
    },
    33: {
        "name": "Turn Right Ahead",
        "description": "Drivers must turn right at the upcoming junction. Going straight or left is not permitted.",
        "safety_tip": "Signal early, check mirrors, and position your vehicle in the correct lane before turning.",
        "icon": "➡️",
        "category": "mandatory",
    },
    34: {
        "name": "Turn Left Ahead",
        "description": "Drivers are required to turn left at the next junction. Continuing straight is not allowed.",
        "safety_tip": "Check for oncoming traffic and cyclists before turning left. Signal clearly in advance.",
        "icon": "⬅️",
        "category": "mandatory",
    },
    35: {
        "name": "Ahead Only",
        "description": "Vehicles must proceed straight ahead. Turning left or right is not permitted at this junction.",
        "safety_tip": "Stay in the correct lane for going straight. Do not make unexpected turns at this intersection.",
        "icon": "⬆️",
        "category": "mandatory",
    },
    36: {
        "name": "Go Straight or Right",
        "description": "Drivers may go straight ahead or turn right. Turning left is prohibited at this junction.",
        "safety_tip": "Signal if turning right. If going straight, ensure you are not blocking the right-turn lane.",
        "icon": "↗️",
        "category": "mandatory",
    },
    37: {
        "name": "Go Straight or Left",
        "description": "Proceeding straight or turning left are both permitted. Turning right is prohibited.",
        "safety_tip": "Signal clearly when turning left and watch for oncoming traffic and cyclists.",
        "icon": "↖️",
        "category": "mandatory",
    },
    38: {
        "name": "Keep Right",
        "description": "Vehicles must pass to the right of an obstruction, island, or divider. This is also used to enforce right-hand driving.",
        "safety_tip": "Stay to the right of the divider. Do not pass on the left side as it may put you in oncoming traffic.",
        "icon": "▶️",
        "category": "mandatory",
    },
    39: {
        "name": "Keep Left",
        "description": "Drivers must keep to the left of an obstruction or traffic divider. Common in left-hand traffic countries or one-way systems.",
        "safety_tip": "Stay to the left of the divider. Follow directional arrows painted on the road.",
        "icon": "◀️",
        "category": "mandatory",
    },
    40: {
        "name": "Roundabout Mandatory",
        "description": "You are entering a roundabout. Traffic already in the roundabout has priority. Enter only when safe.",
        "safety_tip": "Yield to traffic in the roundabout. Signal when exiting and be cautious of cyclists and pedestrians.",
        "icon": "🔄",
        "category": "mandatory",
    },
    41: {
        "name": "End of No Passing",
        "description": "The no-passing zone has ended. Overtaking is now permitted again, subject to general road safety rules.",
        "safety_tip": "Only overtake when there is sufficient visibility and a safe gap. Still check for oncoming traffic.",
        "icon": "✅",
        "category": "end_restriction",
    },
    42: {
        "name": "End of No Passing by Vehicles over 3.5 Metric Tons",
        "description": "Heavy vehicle overtaking restrictions are lifted. Trucks and lorries exceeding 3.5 metric tons may now pass other vehicles.",
        "safety_tip": "Heavy vehicle drivers should still overtake cautiously — ensure sufficient clear road ahead.",
        "icon": "✅",
        "category": "end_restriction",
    },
}


def get_sign_info(class_id: int) -> dict:
    """Return sign metadata for a given class ID, or a default if not found."""
    return TRAFFIC_SIGNS.get(
        class_id,
        {
            "name": f"Unknown Sign (ID: {class_id})",
            "description": "This sign class was not found in the database.",
            "safety_tip": "Please consult the official traffic code for this sign.",
            "icon": "❓",
            "category": "unknown",
        },
    )


def preprocess_image(image, target_size=(224, 224)):
    """
    Resize a PIL Image to target_size, convert to RGB, convert to numpy array,
    expand dims for batch, and apply MobileNetV2 preprocessing (scales to [-1, 1]).
    
    Returns: numpy array of shape (1, 224, 224, 3)
    """
    # Lazy import to avoid loading TF at module-import time during tests
    import tensorflow as tf

    image = image.resize(target_size)
    image = image.convert("RGB")
    img_array = np.array(image, dtype=np.float32)        # (224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)         # (1, 224, 224, 3)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    return img_array
