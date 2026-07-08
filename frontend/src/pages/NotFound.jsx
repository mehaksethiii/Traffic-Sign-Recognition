import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiHome } from 'react-icons/fi'

function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="text-[10rem] font-extrabold leading-none select-none">
            <span className="text-primary-200 dark:text-primary-900">4</span>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              🚦
            </motion.span>
            <span className="text-primary-200 dark:text-primary-900">4</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3"
        >
          Road Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
        >
          Looks like this page took a wrong turn. The route you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="btn-primary gap-2"
          >
            <FiHome />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary gap-2"
          >
            <FiArrowLeft />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound
