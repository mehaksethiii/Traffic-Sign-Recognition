import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Returns Tailwind color classes based on confidence percentage.
 */
function getColorClasses(confidence) {
  if (confidence >= 80) {
    return {
      bar:   'bg-green-500 dark:bg-green-400',
      text:  'text-green-700 dark:text-green-300',
      label: 'High Confidence',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    }
  }
  if (confidence >= 50) {
    return {
      bar:   'bg-yellow-400 dark:bg-yellow-300',
      text:  'text-yellow-700 dark:text-yellow-300',
      label: 'Medium Confidence',
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    }
  }
  return {
    bar:   'bg-red-500 dark:bg-red-400',
    text:  'text-red-700 dark:text-red-300',
    label: 'Low Confidence',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
}

/**
 * ConfidenceBar – animated progress bar for prediction confidence.
 *
 * @param {number}  confidence  - Value 0–100
 * @param {boolean} showLabel   - Whether to show the label text (default true)
 * @param {string}  className   - Extra wrapper classes
 */
function ConfidenceBar({ confidence = 0, showLabel = true, className = '' }) {
  // Animate from 0 to actual value on mount / change
  const [displayWidth, setDisplayWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDisplayWidth(confidence), 100)
    return () => clearTimeout(timer)
  }, [confidence])

  const colors = getColorClasses(confidence)

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Confidence
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${colors.text}`}>
              {confidence.toFixed(1)}%
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
              {colors.label}
            </span>
          </div>
        </div>
      )}

      {/* Track */}
      <div className="relative h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className={`h-full rounded-full confidence-fill ${colors.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${displayWidth}%` }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.5 }}
        />
      </div>

      {/* Tick marks */}
      <div className="flex justify-between mt-1 px-0.5">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="text-xs text-gray-400 dark:text-gray-600">
            {tick}%
          </span>
        ))}
      </div>
    </div>
  )
}

export default ConfidenceBar
