import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi'

function ErrorPage() {
  const error = useRouteError()

  const message =
    error?.statusText ||
    error?.message ||
    'An unexpected error occurred while rendering this page.'

  const status = error?.status || 'Error'

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="h-20 w-20 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <FiAlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">
            Status {status}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {message}
          </p>

          {/* Technical details in collapsible */}
          {error && (
            <details className="mb-8 text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <summary className="text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                Technical details
              </summary>
              <pre className="mt-2 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(
                  { status: error.status, message: error.message, stack: error.stack },
                  null,
                  2,
                )}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary gap-2"
            >
              <FiRefreshCw />
              Reload Page
            </button>
            <Link to="/" className="btn-secondary gap-2">
              <FiHome />
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ErrorPage
