import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  images: string[]
  onComplete: () => void
}

const MIN_DURATION = 2.2 // seconds — never flash the loader away instantly

function Preloader({ images, onComplete }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const counter = { value: 0 }
    let loaded = 0
    let finished = false
    const startedAt = performance.now()

    const render = () => {
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
      }
      setFrame(Math.min(images.length - 1, Math.floor((counter.value / 100) * images.length)))
    }

    const finish = () => {
      if (finished) return
      finished = true
      const elapsed = (performance.now() - startedAt) / 1000
      const wait = reduce ? 0 : Math.max(0, MIN_DURATION - elapsed)
      gsap.to(counter, {
        value: 100,
        duration: reduce ? 0 : Math.max(0.4, wait),
        ease: 'power2.inOut',
        onUpdate: render,
        onComplete: () => {
          gsap
            .timeline({ onComplete })
            .to('.preloader-center', { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in' })
            .to('.preloader-panel--top', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '<0.2')
            .to('.preloader-panel--bottom', { yPercent: 100, duration: 0.9, ease: 'expo.inOut' }, '<')
            .set(root.current, { display: 'none' })
        },
      })
    }

    const bump = () => {
      loaded += 1
      const target = (loaded / images.length) * 95 // hold the last 5% for finish()
      gsap.to(counter, {
        value: target,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: render,
        overwrite: true,
        onComplete: () => {
          if (loaded >= images.length) finish()
        },
      })
    }

    const loaders = images.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = img.onerror = () => {
            bump()
            resolve()
          }
          img.src = src
        }),
    )
    // Safety valve: never trap the user on the loader
    const failsafe = setTimeout(finish, 6000)
    Promise.all(loaders).then(() => clearTimeout(failsafe))

    return () => clearTimeout(failsafe)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader-panel preloader-panel--top" />
      <div className="preloader-panel preloader-panel--bottom" />
      <div className="preloader-center">
        <div className="preloader-frame">
          {images.map((src, i) => (
            <img key={src} src={src} alt="" style={{ opacity: i <= frame ? 1 : 0 }} />
          ))}
        </div>
        <div className="preloader-meta">
          <span className="preloader-label">Kaleum Studios</span>
          <span className="preloader-count" ref={counterRef}>
            000
          </span>
        </div>
      </div>
    </div>
  )
}

export default Preloader
