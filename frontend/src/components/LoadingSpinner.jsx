import React from 'react'
import { motion } from 'framer-motion'

/**
 * LoadingSpinner – animated Framer Motion spinner.
 * @param {string}  size     - Tailwind size class (default 'h-12 w-12')
 * @param {string}  message  - Optional text below the spinner
 * @param {boolean} fullPage - If true, centres spinner in a full-screen overlay
 */
function LoadingSpinner({ size = 'h-12 w-12', message = '', fullPage = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Outer ring */}
      <div className={`relative ${size}`}>
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900`}
        />
        <motion.div
          className={`absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400`}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner pulsing dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400" />
        </motion.div>
      </div>

      {message && (
        <motion.p
          className="text-sm font-medium text-gray-500 dark:text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
