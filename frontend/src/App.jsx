import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Predict from './pages/Predict.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import { useTheme } from './context/ThemeContext.jsx'

function App() {
  const { isDark } = useTheme()

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"        element={<Home />}    errorElement={<ErrorPage />} />
            <Route path="/predict" element={<Predict />} errorElement={<ErrorPage />} />
            <Route path="/about"   element={<About />}   errorElement={<ErrorPage />} />
            <Route path="/404"     element={<NotFound />} />
            <Route path="*"        element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
