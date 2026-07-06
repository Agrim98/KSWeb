import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Full-page ember field — fluid orange flame trails that follow the mouse
 * across the whole site (Vivid Motion style). Drawn on a low-res canvas,
 * blurred and screen-blended so passing over content makes it shine.
 */
function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    if (reduce || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const RES = 0.28 // low res — upscaling smooths the blobs into soft flames
    let w = 0
    let h = 0
    const resize = () => {
      w = canvas.width = Math.ceil(window.innerWidth * RES)
      h = canvas.height = Math.ceil(window.innerHeight * RES)
    }
    resize()
    window.addEventListener('resize', resize)

    const fine = window.matchMedia('(pointer: fine)').matches
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight * 0.6, vx: 0, vy: 0 }
    const trail = { x: mouse.x, y: mouse.y }
    let lastMove = 0

    const onMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.x
      mouse.vy = e.clientY - mouse.y
      mouse.x = e.clientX
      mouse.y = e.clientY
      lastMove = performance.now()
    }
    if (fine) window.addEventListener('mousemove', onMove)

    const blob = (x: number, y: number, radius: number, alpha: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius)
      g.addColorStop(0, `rgba(244, 62, 10, ${alpha})`)
      g.addColorStop(0.5, `rgba(206, 38, 6, ${alpha * 0.5})`)
      g.addColorStop(1, 'rgba(140, 18, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }

    let raf = 0
    let t = 0
    let lastFrame = 0
    let emberOpacity = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now - lastFrame < 33) return // ~30fps is plenty for soft glow
      lastFrame = now
      t += 0.016

      // The ember lives on the hero only, glows faintly over the manifesto,
      // and disappears everywhere else
      let target = 0
      const hero = document.querySelector('.hero-wrap')
      if (hero) {
        const r = hero.getBoundingClientRect()
        if (r.bottom > 0 && r.top < window.innerHeight) {
          target = gsap.utils.clamp(0, 1, r.bottom / (window.innerHeight * 0.9))
        }
      }
      if (target < 0.2) {
        const mani = document.querySelector('.manifesto')
        if (mani) {
          const r = mani.getBoundingClientRect()
          if (r.bottom > 0 && r.top < window.innerHeight) target = Math.max(target, 0.22)
        }
      }
      emberOpacity += (target - emberOpacity) * 0.07
      canvas.style.opacity = emberOpacity.toFixed(3)
      if (emberOpacity < 0.01) return // nothing visible — skip painting

      // Slow dissipation keeps trails lingering like smoke; source-over
      // drawing (not additive) keeps the color deep red-orange, never white
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'

      // Ambient drifting ember so the page breathes even without a mouse
      const ax = (0.5 + 0.38 * Math.sin(t * 0.7)) * w
      const ay = (0.55 + 0.3 * Math.sin(t * 1.13 + 2)) * h
      blob(ax, ay, Math.max(w, h) * 0.2, 0.05)

      if (fine) {
        // Trail eases toward the cursor; speed drives size + heat
        trail.x += (mouse.x - trail.x) * 0.16
        trail.y += (mouse.y - trail.y) * 0.16
        const speed = Math.hypot(mouse.x - trail.x, mouse.y - trail.y)
        const idleFor = performance.now() - lastMove
        const heat = gsap.utils.clamp(0.1, 0.32, 0.1 + speed * 0.008)
        if (idleFor < 3000) {
          const r = Math.max(w, h) * gsap.utils.clamp(0.13, 0.24, 0.13 + speed * 0.0035)
          blob(trail.x * RES, trail.y * RES, r, heat)
        }
      }
    }
    raf = requestAnimationFrame(tick)

    // Cursor dot
    if (fine && dotRef.current) {
      const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.18, ease: 'power3.out' })
      const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.18, ease: 'power3.out' })
      const moveDot = (e: MouseEvent) => {
        dotX(e.clientX)
        dotY(e.clientY)
      }
      const over = (e: MouseEvent) => {
        const interactive = (e.target as HTMLElement).closest('a, button')
        gsap.to(dotRef.current, { scale: interactive ? 2.6 : 1, duration: 0.25, ease: 'power2.out' })
      }
      window.addEventListener('mousemove', moveDot)
      window.addEventListener('mouseover', over)
      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mousemove', moveDot)
        window.removeEventListener('mouseover', over)
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (fine) window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <canvas className="ember-field" ref={canvasRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}

export default Cursor
