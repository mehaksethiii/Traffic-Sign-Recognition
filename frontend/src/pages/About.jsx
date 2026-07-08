import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiExternalLink, FiDatabase } from 'react-icons/fi'
import { MdModelTraining, MdSpeed, MdSecurity } from 'react-icons/md'
import {
  SiTensorflow, SiPython, SiReact, SiTailwindcss, SiFastapi,
} from 'react-icons/si'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
})

const ARCH_STEPS = [
  { step: '01', title: 'Image Input', desc: 'User uploads or captures a 224×224 RGB image.' },
  { step: '02', title: 'MobileNetV2 Backbone', desc: 'Feature extraction using the lightweight MobileNetV2 network pre-trained on ImageNet.' },
  { step: '03', title: 'Triple Attention', desc: 'Channel, spatial, and cross-dimensional attention refine the feature maps for fine-grained sign discrimination.' },
  { step: '04', title: 'Classification Head', desc: 'Global Average Pooling → Dense(256, ReLU) → Dropout → Dense(43, Softmax).' },
  { step: '05', title: 'Prediction', desc: 'The class with the highest probability is returned along with confidence and safety information.' },
]

const TECH_STACK = [
  { icon: <SiPython className="h-8 w-8" />,      name: 'Python 3.11',       color: 'text-blue-500',   desc: 'Backend language' },
  { icon: <SiFastapi className="h-8 w-8" />,      name: 'FastAPI',           color: 'text-teal-500',   desc: 'REST API framework' },
  { icon: <SiTensorflow className="h-8 w-8" />,   name: 'TensorFlow 2.16',   color: 'text-orange-500', desc: 'Deep learning engine' },
  { icon: <SiReact className="h-8 w-8" />,        name: 'React 18',          color: 'text-cyan-400',   desc: 'UI framework' },
  { icon: <SiTailwindcss className="h-8 w-8" />,  name: 'Tailwind CSS',      color: 'text-sky-400',    desc: 'Styling framework' },
]

const HOW_TO_USE = [
  { n: '1', title: 'Go to Predict', desc: 'Navigate to the Predict page using the top navigation or the "Try Now" button.' },
  { n: '2', title: 'Upload or Capture', desc: 'Drag & drop an image, click to browse files, or use the camera button to capture a photo live.' },
  { n: '3', title: 'Click Predict', desc: 'Hit the blue "Predict Sign" button to send your image to the AI model.' },
  { n: '4', title: 'Read the Results', desc: 'The sign name, confidence score, description, and safety tip appear on the right panel.' },
  { n: '5', title: 'Download Report', desc: 'Use the "Download PDF Report" button to save the prediction as a PDF document.' },
]

function About() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* ── Header ── */}
      <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl font-extrabold mb-4"
          >
            About TrafficSignAI
          </motion.h1>
          <motion.p
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-lg text-primary-200 max-w-2xl mx-auto"
          >
            A deep dive into the model architecture, dataset, and technology behind this application.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* ── Dataset ── */}
        <motion.section
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              <FiDatabase className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">GTSRB Dataset</h2>
          </div>
          <div className="card p-6 sm:p-8 grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                The <strong className="text-gray-800 dark:text-white">German Traffic Sign Recognition Benchmark (GTSRB)</strong> is
                a large multi-class, single-image classification challenge for traffic signs.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                It contains over <strong className="text-gray-800 dark:text-white">51,000 images</strong> across
                43 classes, captured under real-world conditions including varying lighting,
                blur, perspective distortion, and partial occlusion.
              </p>
              <a
                href="https://benchmark.ini.rub.de/gtsrb_news.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Visit GTSRB website <FiExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Images', value: '51,839' },
                { label: 'Training Set', value: '39,209' },
                { label: 'Test Set',     value: '12,630' },
                { label: 'Classes',      value: '43' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-primary-50 dark:bg-primary-950/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-primary-800 dark:text-primary-300">{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Architecture ── */}
        <motion.section
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
              <MdModelTraining className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Model Architecture</h2>
          </div>
          <div className="space-y-3">
            {ARCH_STEPS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card p-5 flex items-start gap-4"
              >
                <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-primary-800 text-white text-xs font-bold flex items-center justify-center">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              💡 The <strong>Triple Attention</strong> mechanism applies channel, spatial, and cross-dimensional
              attention simultaneously, helping the model focus on discriminative sign features even under
              challenging lighting and rotation conditions.
            </p>
          </div>
        </motion.section>

        {/* ── How to use ── */}
        <motion.section
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
              <MdSpeed className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to Use</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOW_TO_USE.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card p-5"
              >
                <div className="text-3xl font-extrabold text-primary-200 dark:text-primary-800 mb-2">{n}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Tech Stack ── */}
        <motion.section
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              <MdSecurity className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TECH_STACK.map(({ icon, name, color, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="card p-5 text-center hover:scale-105 transition-transform duration-200"
              >
                <div className={`${color} flex justify-center mb-3`}>{icon}</div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <div className="text-center">
          <Link to="/predict" className="btn-primary text-base px-8 py-4 rounded-2xl">
            Try It Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
