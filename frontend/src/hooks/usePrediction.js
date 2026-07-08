import { useState, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const HISTORY_KEY = 'traffic_sign_history'
const MAX_HISTORY = 10

/**
 * Load prediction history from localStorage.
 */
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Persist prediction history to localStorage.
 */
function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Quota exceeded or private browsing — silently ignore
  }
}

/**
 * usePrediction – custom hook that handles:
 *   - Sending an image to POST /predict
 *   - Storing the latest prediction result
 *   - Maintaining a history of the last MAX_HISTORY predictions
 *   - Loading / error / reset state
 */
export function usePrediction() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [history, setHistory]       = useState(loadHistory)

  /**
   * Send an image File to the backend and store the result.
   * @param {File} imageFile
   */
  const predict = useCallback(async (imageFile) => {
    if (!imageFile) return

    setLoading(true)
    setError(null)
    setPrediction(null)

    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30_000, // 30 s
      })

      const result = {
        ...response.data,
        timestamp: new Date().toISOString(),
        filename: imageFile.name,
      }

      setPrediction(result)

      // Prepend to history, cap at MAX_HISTORY
      setHistory((prev) => {
        const next = [result, ...prev].slice(0, MAX_HISTORY)
        saveHistory(next)
        return next
      })
    } catch (err) {
      let message = 'An unexpected error occurred. Please try again.'

      if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
        message = 'Cannot reach the server. Make sure the backend is running on port 8000.'
      } else if (err.response) {
        const status = err.response.status
        const detail = err.response.data?.detail || ''
        if (status === 400) {
          message = detail || 'Invalid image. Please upload a valid image file (JPEG, PNG, etc.).'
        } else if (status === 503) {
          message = 'The AI model is not loaded on the server. Please check the backend setup.'
        } else if (status === 500) {
          message = 'Server error during prediction. Please try again later.'
        } else {
          message = detail || `Server returned status ${status}.`
        }
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Clear the current prediction and error state (but keep history).
   */
  const reset = useCallback(() => {
    setPrediction(null)
    setError(null)
  }, [])

  /**
   * Remove a single item from history by index.
   */
  const removeFromHistory = useCallback((index) => {
    setHistory((prev) => {
      const next = prev.filter((_, i) => i !== index)
      saveHistory(next)
      return next
    })
  }, [])

  /**
   * Clear all history.
   */
  const clearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
  }, [])

  return {
    prediction,
    loading,
    error,
    history,
    predict,
    reset,
    removeFromHistory,
    clearHistory,
  }
}

export default usePrediction
