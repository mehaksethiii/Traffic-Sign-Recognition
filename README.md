# Traffic-Sign-Recognition AI

An interactive web application designed for classifying German Traffic Sign Recognition Benchmark (GTSRB) traffic signs using deep learning.

---

## 🌟 Features
* **Real-time Classification:** Drag-and-drop or click to upload any traffic sign image and receive instant classification results.
* **43 Traffic Sign Classes:** Full support for predicting all 43 distinct classes from the GTSRB dataset (ranging from speed limits to warnings and regulatory signs).
* **Comprehensive Information:** Returns the exact class ID, sign category, confidence percentage, detailed description, and safety tips for each recognized sign.
* **PDF Report Generation:** Export your classification results, including sign info and safety recommendations, into a downloadable PDF report with one click.
* **Smooth User Experience:** Crafted with modern typography, smooth animations, and a fully responsive layout.

---

## 🛠️ Tech Stack

### Frontend
* **React 18 & Vite:** For building a lightning-fast, modular, and reactive user interface.
* **Tailwind CSS:** Modern utility-first CSS styling framework.
* **Framer Motion:** High-fidelity interactive animations and transition effects.
* **jsPDF & React Icons:** For PDF exports and clean iconography.

### Backend
* **FastAPI:** An asynchronous, high-performance web framework for Python APIs.
* **Uvicorn:** ASGI web server for running the FastAPI application.
* **Pillow & NumPy:** For image preprocessing and numerical operations.

---

## 🧠 Deep Learning Model
* **Architecture:** MobileNetV2 backbone integrated with a custom **Triple Attention** mechanism.
* **Backend:** TensorFlow / Keras 3.x
* **Dataset:** Trained on the German Traffic Sign Recognition Benchmark (GTSRB).
* **Output:** Classifies input images into one of **43 traffic sign classes** with high confidence.