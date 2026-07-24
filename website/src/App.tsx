import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import ScrollGuide from './components/ScrollGuide'
import LenisProvider from './motion/LenisProvider'
import AmbientBackground from './components/AmbientBackground'
import Intro from './intro/Intro'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Brands from './pages/Brands'
import Creators from './pages/Creators'
import Directory from './pages/Directory'
import CreatorProfile from './pages/CreatorProfile'
import Pricing from './pages/Pricing'
import TrustCheck from './pages/TrustCheck'
import About from './pages/About'
import Contact from './pages/Contact'
import Join from './pages/Join'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  function handleIntroDone() {
    setIntroDone(true)
    // Land the user at the very top of the homepage.
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AmbientBackground />
      {!introDone && <Intro onDone={handleIntroDone} />}
      <LenisProvider>
        <div className="flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directory/:handle" element={<CreatorProfile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/trust-check" element={<TrustCheck />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join" element={<Join />} />
            </Routes>
          </main>
          <Footer />
        </div>
        {introDone && <ScrollGuide />}
      </LenisProvider>
    </BrowserRouter>
  )
}
