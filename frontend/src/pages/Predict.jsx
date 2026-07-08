import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUploadCloud, FiCamera, FiTrash2, FiDownload,
  FiAlertCircle, FiClock, FiRotateCcw, FiX, FiSearch,
} from 'react-icons/fi'
import { jsPDF } from 'jspdf'
import usePrediction from '../hooks/usePrediction.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ConfidenceBar from '../components/ConfidenceBar.jsx'

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatTimestamp(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

function getConfidenceBadge(confidence) {
  if (confidence >= 80) return 'badge-green'
  if (confidence >= 50) return 'badge-yellow'
  return 'badge-red'
}

// ── PDF report ───────────────────────────────────────────────────────────────
function downloadPDF(prediction, imageDataUrl) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW  = doc.internal.pageSize.getWidth()
  const margin = 48

  // Header bar
  doc.setFillColor(21, 128, 61)
  doc.rect(0, 0, pageW, 80, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('TrafficSignAI — Prediction Report', margin, 50)

  // Timestamp
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${formatTimestamp(prediction.timestamp)}`, margin, 65)

  let y = 110

  // Preview image (if available)
  if (imageDataUrl) {
    try {
      doc.addImage(imageDataUrl, 'JPEG', margin, y, 140, 140)
    } catch (_) { /* skip if image fails */ }
  }

  // Sign details block (beside image)
  const detailsX = margin + 160
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(prediction.traffic_sign, detailsX, y + 20, { maxWidth: pageW - detailsX - margin })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Class ID: ${prediction.class_id}`, detailsX, y + 42)
  doc.text(`Confidence: ${prediction.confidence.toFixed(1)}%`, detailsX, y + 58)

  y = y + 175

  // Divider
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, y, pageW - margin, y)
  y += 20

  // Description
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Description', margin, y)
  y += 16
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 60)
  const descLines = doc.splitTextToSize(prediction.description || '', pageW - margin * 2)
  doc.text(descLines, margin, y)
  y += descLines.length * 14 + 16

  // Safety tip box
  doc.setFillColor(255, 251, 235)
  doc.setDrawColor(217, 119, 6)
  doc.roundedRect(margin, y, pageW - margin * 2, 14 * Math.ceil((prediction.safety_tip || '').length / 90) + 28, 4, 4, 'FD')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(146, 64, 14)
  doc.text('⚠  Safety Tip', margin + 12, y + 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const tipLines = doc.splitTextToSize(prediction.safety_tip || '', pageW - margin * 2 - 24)
  doc.text(tipLines, margin + 12, y + 32)
  y += tipLines.length * 14 + 44

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(160, 160, 160)
  doc.text(
    'TrafficSignAI — Powered by MobileNetV2 trained on GTSRB (43 classes)',
    margin,
    doc.internal.pageSize.getHeight() - 28,
  )

  doc.save(`traffic-sign-report-${Date.now()}.pdf`)
}

// ─────────────────────────────────────────────────────────────────────────────
function Predict() {
  const { prediction, loading, error, history, predict, reset, clearHistory } = usePrediction()

  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [cameraError, setCameraError]   = useState(null)
  const [cameraActive, setCameraActive] = useState(false)

  const fileInputRef  = useRef(null)
  const videoRef      = useRef(null)
  const streamRef     = useRef(null)

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, etc.)')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
    reset()
  }, [reset])

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true)  }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  // ── Camera ─────────────────────────────────────────────────────────────────
  const startCamera = async () => {
    setCameraError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Your browser does not support camera access.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      setCameraActive(true)
      // Give the DOM a tick to render the video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 50)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission was denied. Please allow camera access and try again.')
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera device found on this device.')
      } else {
        setCameraError(`Camera error: ${err.message}`)
      }
    }
  }

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width  = video.videoWidth  || 640
    canvas.height = video.videoHeight || 480
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
      handleFile(file)
      stopCamera()
    }, 'image/jpeg', 0.92)
  }

  // ── Predict ────────────────────────────────────────────────────────────────
  const handlePredict = () => {
    if (imageFile) predict(imageFile)
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    reset()
    stopCamera()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Download PDF ───────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    if (prediction) downloadPDF(prediction, imagePreview)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Traffic Sign Prediction
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload an image or use your camera to identify any of the 43 GTSRB traffic sign classes.
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          {/* ── LEFT: Upload / Camera ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-6 sm:p-8 flex flex-col gap-6"
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FiUploadCloud className="text-primary-600 dark:text-primary-400" />
              Upload Image
            </h2>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
              aria-label="Upload image file"
            />

            {/* Camera view */}
            <AnimatePresence>
              {cameraActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative rounded-xl overflow-hidden bg-black"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-xl"
                    style={{ maxHeight: '320px', objectFit: 'cover' }}
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-sm shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      📸 Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {cameraError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                {cameraError}
              </div>
            )}

            {/* Drag & Drop zone */}
            {!cameraActive && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                aria-label="Upload image by clicking or dragging"
                className={`relative flex flex-col items-center justify-center gap-3 
                            border-2 border-dashed rounded-2xl p-8 cursor-pointer
                            transition-all duration-200
                            ${isDragging
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 scale-[1.01]'
                              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                            }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <FiUploadCloud className={`h-7 w-7 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Drop an image here, or{' '}
                    <span className="text-primary-600 dark:text-primary-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    JPEG, PNG, WebP, BMP — max 20 MB
                  </p>
                </div>
              </div>
            )}

            {/* Image preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square max-h-64 mx-auto w-full"
                >
                  <img
                    src={imagePreview}
                    alt="Selected traffic sign"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleReset}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!cameraActive && (
                <button
                  onClick={startCamera}
                  className="btn-secondary flex-1 gap-2"
                >
                  <FiCamera />
                  Use Camera
                </button>
              )}
              <button
                onClick={handlePredict}
                disabled={!imageFile || loading}
                className="btn-primary flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="h-4 w-4" />
                    Predicting…
                  </>
                ) : (
                  <>
                    <FiSearch className="h-5 w-5" />
                    Predict Sign
                  </>
                )}
              </button>
            </div>

            {imageFile && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors mx-auto"
              >
                <FiRotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </motion.div>

          {/* ── RIGHT: Results ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-6 sm:p-8 flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
              <FiSearch className="text-primary-600 dark:text-primary-400" />
              Prediction Result
            </h2>

            {/* Loading state */}
            {loading && (
              <div className="flex-1 flex items-center justify-center py-12">
                <LoadingSpinner size="h-16 w-16" message="Analyzing traffic sign…" />
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 py-8"
              >
                <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <FiAlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Prediction Failed</p>
                  <p className="text-sm text-red-600 dark:text-red-400 max-w-xs">{error}</p>
                </div>
                <button onClick={handleReset} className="btn-secondary gap-2 text-sm">
                  <FiRotateCcw className="h-4 w-4" />
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Empty / placeholder state */}
            {!loading && !error && !prediction && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-7xl"
                >
                  🚦
                </motion.div>
                <p className="text-gray-400 dark:text-gray-500 font-medium">
                  Upload an image and click <span className="text-primary-600 dark:text-primary-400">Predict Sign</span> to see results here.
                </p>
              </div>
            )}

            {/* Result state */}
            {!loading && !error && prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-5 flex-1"
              >
                {/* Sign icon + name */}
                <div className="text-center">
                  <div className="sign-emoji-display mb-2">{prediction.icon}</div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    {prediction.traffic_sign}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    <span className="badge-blue">Class ID: {prediction.class_id}</span>
                    <span className={`badge ${getConfidenceBadge(prediction.confidence)}`}>
                      {prediction.confidence >= 80 ? '✓ High' : prediction.confidence >= 50 ? '~ Medium' : '✗ Low'} Confidence
                    </span>
                  </div>
                </div>

                {/* Confidence bar */}
                <ConfidenceBar confidence={prediction.confidence} />

                {/* Description */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
                    Description
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {prediction.description}
                  </p>
                </div>

                {/* Safety tip */}
                <div className="safety-box">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-70">
                    ⚠️ Safety Tip
                  </h4>
                  <p className="text-sm leading-relaxed">{prediction.safety_tip}</p>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <FiClock className="h-3.5 w-3.5" />
                  {formatTimestamp(prediction.timestamp)}
                </div>

                {/* Download PDF */}
                <button
                  onClick={handleDownloadPDF}
                  className="btn-accent w-full gap-2"
                >
                  <FiDownload />
                  Download PDF Report
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── Prediction History ── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiClock className="text-primary-600 dark:text-primary-400" />
              Prediction History
              {history.length > 0 && (
                <span className="badge-blue text-xs">{history.length}</span>
              )}
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                No predictions yet. Your history will appear here after your first prediction.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {history.map((item, i) => (
                  <motion.div
                    key={item.timestamp + i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="card p-4 flex items-start gap-3 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="text-3xl flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.traffic_sign}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className={`badge text-xs px-2 py-0.5 ${getConfidenceBadge(item.confidence)}`}>
                          {item.confidence.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                        <FiClock className="h-3 w-3" />
                        {formatTimestamp(item.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}

export default Predict
