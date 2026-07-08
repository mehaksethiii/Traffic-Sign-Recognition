import React from 'react'
import { Link } from 'react-router-dom'
import { MdTraffic } from 'react-icons/md'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

const YEAR = new Date().getFullYear()

const LINKS = {
  product: [
    { label: 'Home',    to: '/' },
    { label: 'Predict', to: '/predict' },
    { label: 'About',   to: '/about' },
  ],
  resources: [
    { label: 'GTSRB Dataset',  href: 'https://benchmark.ini.rub.de/gtsrb_news.html' },
    { label: 'MobileNetV2',    href: 'https://arxiv.org/abs/1801.04381' },
    { label: 'FastAPI Docs',   href: 'https://fastapi.tiangolo.com/' },
    { label: 'React Docs',     href: 'https://react.dev/' },
  ],
}

function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 group w-fit">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-800 text-white shadow group-hover:bg-primary-700 transition-colors">
                <MdTraffic className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                Traffic<span className="text-primary-600 dark:text-primary-400">Sign</span>AI
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              AI-powered traffic sign recognition using MobileNetV2 trained on the GTSRB benchmark dataset — 43 classes, instant predictions.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {LINKS.product.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              {LINKS.resources.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {label}
                    <FiExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
            © {YEAR} TrafficSignAI. Built with React, FastAPI &amp; TensorFlow.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <FiGithub className="h-4 w-4" />
            </a>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              GTSRB · 43 Classes · MobileNetV2
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
