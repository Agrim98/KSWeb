import { useCallback, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import Services from './pages/Services'
import { TransitionContext } from './transition'
import { preloadImages } from './stills'
import './App.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function App() {
  const [ready, setReady] = useState(false)
  const curtainRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const busy = useRef(false)

  const scrollToHash = (hash: string) => {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  const go = useCallback(
    (to: string) => {
      const [path, hash] = to.split('#')
      const targetPath = path || '/'
      const samePage = targetPath === location.pathname

      if (samePage) {
        if (hash) scrollToHash(`#${hash}`)
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (busy.current) return
      busy.current = true

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const arrive = () => {
        navigate(targetPath)
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
          if (hash) scrollToHash(`#${hash}`)
          ScrollTrigger.refresh()
        })
      }

      if (reduce) {
        arrive()
        busy.current = false
        return
      }

      // Soft crossfade — quick in, gentle out, no attention-grabbing color
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false
          },
        })
        .set(curtainRef.current, { display: 'block', opacity: 0 })
        .to(curtainRef.current, { opacity: 1, duration: 0.28, ease: 'power1.in' })
        .call(arrive)
        .to(curtainRef.current, { opacity: 0, duration: 0.45, ease: 'power1.out', delay: 0.1 })
        .set(curtainRef.current, { display: 'none' })
    },
    [location.pathname, navigate],
  )

  return (
    <TransitionContext.Provider value={go}>
      {!ready && (
        <Preloader
          images={preloadImages}
          onComplete={() => {
            window.scrollTo(0, 0)
            setReady(true)
          }}
        />
      )}
      <Cursor />
      <Nav />
      <div className="page-curtain" ref={curtainRef} aria-hidden="true" />
      <Routes>
        <Route path="/" element={<Home introReady={ready} />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </TransitionContext.Provider>
  )
}

export default App
