import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiTarget, FiGrid, FiArrowRight } from 'react-icons/fi'
import { MdSpeed, MdSecurity, MdModelTraining } from 'react-icons/md'

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
}

// ── Floating signs in the hero ──────────────────────────────────────────────
const FLOATING_SIGNS = [
  { emoji: '🛑', top: '12%', left: '4%',   delay: 0,    duration: 3.2, size: 'text-6xl sm:text-7xl' },
  { emoji: '⚠️', top: '18%', right: '6%',  delay: 0.6,  duration: 4.1, size: 'text-6xl sm:text-7xl' },
  { emoji: '🚦', top: '55%', left: '2%',   delay: 1.2,  duration: 3.7, size: 'text-7xl sm:text-8xl' },
  { emoji: '🔢', top: '65%', right: '4%',  delay: 0.4,  duration: 4.5, size: 'text-6xl sm:text-7xl' },
  { emoji: '⛔', top: '38%', left: '7%',   delay: 0.9,  duration: 3.0, size: 'text-5xl sm:text-6xl' },
  { emoji: '🔄', top: '42%', right: '3%',  delay: 1.5,  duration: 3.9, size: 'text-5xl sm:text-6xl' },
  { emoji: '🚧', top: '78%', left: '14%',  delay: 0.3,  duration: 4.2, size: 'text-6xl sm:text-7xl' },
  { emoji: '❄️', top: '8%',  right: '18%', delay: 1.8,  duration: 3.5, size: 'text-5xl sm:text-6xl' },
  { emoji: '🚸', top: '30%', left: '18%',  delay: 2.1,  duration: 4.0, size: 'text-5xl sm:text-6xl' },
  { emoji: '🛤️', top: '85%', right: '20%', delay: 0.7,  duration: 3.6, size: 'text-6xl sm:text-7xl' },
]

const FEATURES = [
  {
    icon: <FiZap className="h-6 w-6" />,
    title: 'Instant Predictions',
    description: 'Upload or capture a traffic sign and get a prediction in under a second.',
    color: 'bg-tred-100 text-tred-700 dark:bg-tred-900/40 dark:text-tred-300',
  },
  {
    icon: <FiTarget className="h-6 w-6" />,
    title: 'High Accuracy',
    description: 'Trained with MobileNetV2 + Triple Attention on the GTSRB benchmark for state-of-the-art accuracy.',
    color: 'bg-accent-100 text-accent-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  },
  {
    icon: <FiGrid className="h-6 w-6" />,
    title: '43 Sign Classes',
    description: 'Recognizes all 43 German Traffic Sign Recognition Benchmark categories.',
    color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  },
]

const STATS = [
  { value: '43',       label: 'Sign Classes',    icon: <FiGrid className="h-5 w-5" /> },
  { value: '224×224',  label: 'Input Resolution', icon: <MdModelTraining className="h-5 w-5" /> },
  { value: 'MobileV2', label: 'Architecture',     icon: <MdSpeed className="h-5 w-5" /> },
  { value: '100%',     label: 'Open Source',      icon: <MdSecurity className="h-5 w-5" /> },
]

// ─────────────────────────────────────────────────────────────────────────────
function Home() {
  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-hero-gradient dark:bg-dark-gradient overflow-hidden">
        {/* Floating signs */}
        {FLOATING_SIGNS.map(({ emoji, top, left, right, delay, duration, size }, i) => (
          <motion.div
            key={i}
            className={`absolute ${size} select-none pointer-events-none opacity-70 dark:opacity-50`}
            style={{ top, left, right, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))' }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-primary-600/20 via-transparent to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            custom={0}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mb-4"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Powered by TensorFlow &amp; MobileNetV2
            </span>
          </motion.div>

          <motion.h1
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            AI-Powered{' '}
            <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
              Traffic Sign
            </span>
            <br />
            Recognition
          </motion.h1>

          <motion.p
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload a photo or capture with your camera and instantly identify any of the
            43 GTSRB traffic sign classes with detailed safety information.
          </motion.p>

          <motion.div
            custom={0.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/predict"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                         bg-accent-400 hover:bg-accent-500 text-gray-900 font-bold text-lg
                         transition-all duration-200 shadow-glow-yellow hover:shadow-xl
                         hover:-translate-y-0.5"
            >
              🔍 Start Prediction
              <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                         bg-white/10 hover:bg-white/20 text-white font-semibold text-lg
                         border border-white/20 hover:border-white/40
                         backdrop-blur-sm transition-all duration-200"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Road + lane lines at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800 dark:bg-gray-950 overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="road-line" />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading text-gray-900 dark:text-white">
              Why TrafficSignAI?
            </h2>
            <p className="section-subheading">
              Fast, accurate, and informative — everything you need to identify traffic signs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon, title, description, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card-hover p-8"
              >
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl ${color} mb-5`}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Traffic light stripe above stats */}
          <div className="tl-strip rounded-full mb-10 mx-auto w-32" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white/80 mb-3 mx-auto">
                  {icon}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{value}</div>
                <div className="text-sm text-primary-300">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🚦</div>
            <h2 className="section-heading text-gray-900 dark:text-white mb-4">
              Ready to recognize a sign?
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              Upload an image or use your camera — results in under a second.
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                         bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg
                         transition-all duration-200 shadow-glow-blue hover:shadow-xl
                         hover:-translate-y-0.5"
            >
              Start Predicting
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
