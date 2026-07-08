/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Traffic Light Green (primary / go / actions) ──────────────────
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',  // main green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // ── Traffic Light Yellow (accent / caution) ───────────────────────
        accent: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',  // main yellow
          600: '#ca8a04',
          700: '#a16207',
        },
        // ── Traffic Light Red (danger / stop) ─────────────────────────────
        tred: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',  // main red
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.6s ease-out forwards',
        'slide-up':    'slideUp 0.5s ease-out forwards',
        'float':       'float 3s ease-in-out infinite',
        'float-slow':  'float 5s ease-in-out infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':   'spin 8s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'road-move':   'roadMove 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        roadMove: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
      },
      boxShadow: {
        // renamed but kept same keys so existing @apply classes still work
        'glow-blue':   '0 0 20px rgba(34, 197, 94, 0.5)',   // green glow
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.55)',   // yellow glow
        'glow-red':    '0 0 20px rgba(225, 29, 72, 0.5)',    // red glow
        'card':        '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-dark':   '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Traffic light: red top → yellow middle → green bottom
        'hero-gradient':   'linear-gradient(160deg, #9f1239 0%, #be123c 20%, #a16207 50%, #15803d 80%, #166534 100%)',
        'dark-gradient':   'linear-gradient(160deg, #1a0a0d 0%, #1a1200 50%, #071a0e 100%)',
      },
    },
  },
  plugins: [],
}
