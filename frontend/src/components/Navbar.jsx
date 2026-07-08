import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext.jsx'

const NAV_LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/predict', label: 'Predict' },
  { to: '/about',   label: 'About' },
]

// Traffic light dot colors for the logo
const TL_DOTS = ['#e11d48', '#eab308', '#16a34a']

function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const location = useLocation()

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300
        ${scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md border-b border-gray-200/60 dark:border-gray-700/60'
          : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
        }`}
    >
      {/* Traffic-light color strip at very top */}
      <div className="tl-strip w-full" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo — traffic light dots + text ── */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
            aria-label="TrafficSignAI home"
          >
            {/* Mini traffic light */}
            <div className="flex flex-col items-center justify-center gap-[3px] h-9 w-6 bg-gray-800 dark:bg-gray-700 rounded-lg px-1 py-1 shadow">
              {TL_DOTS.map((color, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
                />
              ))}
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              <span className="text-tred-600  dark:text-tred-400">Traffic</span>
              <span className="text-accent-600 dark:text-accent-400">Sign</span>
              <span className="text-primary-600 dark:text-primary-400">AI</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200
                   ${isActive
                     ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                     : 'text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary-500 dark:bg-primary-400"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Right: dark toggle + CTA + hamburger ── */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span key="sun"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
                  ><FiSun className="h-5 w-5" /></motion.span>
                ) : (
                  <motion.span key="moon"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
                  ><FiMoon className="h-5 w-5" /></motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Green CTA button */}
            <Link
              to="/predict"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
                         bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold
                         transition-colors duration-200 shadow-sm hover:shadow-glow-blue
                         focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              🔍 Try Now
            </Link>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800
                         focus:outline-none focus:ring-2 focus:ring-primary-500
                         transition-colors duration-200"
            >
              {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-1 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200
                       ${isActive
                         ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                       }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <Link
                  to="/predict"
                  className="mt-1 block px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700
                             text-white text-sm font-semibold text-center transition-colors duration-200"
                >
                  🔍 Try Prediction
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
