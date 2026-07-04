import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import heroScene from './assets/hero_scene.webp'
import kitchenScene from './assets/kitchen_scene.webp'
import backdrop from './assets/backdrop.webp'
import walkA from './assets/walk_a.webp'
import walkB from './assets/walk_b.webp'
import walkC from './assets/walk_c.webp'
import pointCutout from './assets/point_cutout.webp'
import './App.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// A→B→C→B loops like a flipbook walk cycle
const walkFrames = [walkA, walkB, walkC, walkB]
// Preload so scroll-driven frame swaps never flicker
for (const src of [...walkFrames, pointCutout]) {
  const img = new Image()
  img.src = src
}

const services = [
  {
    title: 'Restaurants & Local Eateries',
    detail: 'Plate reveals & ambience edits tuned for the algorithm.',
  },
  {
    title: "Chef's Culinary Magic",
    detail: 'Knife work, fire & plating choreography — the chef is the star.',
  },
  {
    title: 'Bars & Nightlife',
    detail: 'Pours, garnishes & signature-drink hooks built to loop.',
  },
  {
    title: 'Luxury Hotels & Resorts',
    detail: 'Editorial content that sells the stay before the guest arrives.',
  },
]

const manifesto =
  'Kaleum Studios is where hospitality meets the algorithm. We build AI-powered short-form content for restaurants, chefs, bars and luxury hotels — engineered to stop the scroll, start cravings and fill every seat in the house. No corporate playbooks. No recycled trends. Just content your guests cannot stop sharing.'

const platforms = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Google Maps']

function App() {
  const root = useRef<HTMLDivElement>(null)
  const walkerImg = useRef<HTMLImageElement>(null)

  useGSAP(
    () => {
      // Scrollytelling pages should always start from the top
      history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)

      // Hero intro
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.nav', { autoAlpha: 0, y: -20, duration: 0.8 })
        .from('.hero-eyebrow', { autoAlpha: 0, y: 30, duration: 0.8 }, '-=0.4')
        .from('.hero-title', { autoAlpha: 0, y: 140, duration: 1.1 }, '-=0.5')

      // Hero parallax zoom while scrolling away
      gsap.to('.hero .scene-bg', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.hero-title', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Services: pinned — bunny walks in, points, then cards slide in
      const walkCycle = { progress: 0 }
      const stepCount = 10 // frame swaps across the walk
      gsap.set('.walker', { x: '70vw' })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.services',
            start: 'top top',
            end: '+=260%',
            pin: true,
            scrub: 0.6,
          },
        })
        // walk in from off-screen right
        .to('.walker', { x: 0, duration: 4, ease: 'none' })
        .to(
          walkCycle,
          {
            progress: 1,
            duration: 4,
            ease: 'none',
            onUpdate: () => {
              const img = walkerImg.current
              if (!img) return
              const p = walkCycle.progress
              const frame = walkFrames[Math.floor(p * stepCount) % walkFrames.length]
              if (img.src !== frame) img.src = frame
              // gentle step bob + sway
              const beat = p * Math.PI * stepCount * 0.5
              gsap.set(img, {
                y: -Math.abs(Math.sin(beat)) * 12,
                rotation: Math.sin(beat) * 1.5,
              })
            },
          },
          0,
        )
        // arrive: settle and switch to the pointing pose
        .set(walkerImg.current, { attr: { src: pointCutout }, y: 0, rotation: 0 })
        .from('.walker', { scale: 0.98, duration: 0.4, ease: 'power2.out' })
        // ...and present what we cook up
        .from('.services-heading', { autoAlpha: 0, y: 60, duration: 0.8 })
        .from('.service-card', {
          autoAlpha: 0,
          x: -90,
          stagger: 0.5,
          duration: 1,
        })

      // Manifesto: pinned, word-by-word reveal
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.manifesto',
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 0.6,
          },
        })
        .to('.mword', { opacity: 1, stagger: 0.08 })
        .from('.platform-strip', { autoAlpha: 0, y: 30 }, '>-0.3')

      // Contact reveal
      gsap.from('.contact-inner > *', {
        autoAlpha: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 65%',
        },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <nav className="nav">
        <a href="#top" className="nav-brand">
          <span className="nav-mark">K</span>
          <span className="nav-brand-text">
            <strong>Kaleum Studios</strong>
            <em>AI Viral Content. We Make You Unmissable.</em>
          </span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#manifesto">Manifesto</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div
          className="scene-bg"
          style={{ backgroundImage: `url(${heroScene})` }}
        />
        <p className="hero-eyebrow">AI Viral Content for Hospitality</p>
        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
        <h1 className="hero-title" aria-label="Kaleum Studios">
          Kaleum&nbsp;Studios
        </h1>
      </header>

      <section className="services" id="work">
        <div
          className="scene-bg"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
        <div className="walker">
          <img ref={walkerImg} src={walkA} alt="Kaleum bunny chef walking in" />
        </div>
        <div className="services-inner">
          <p className="services-heading">What we cook up</p>
          <div className="service-cards">
            {services.map((service, i) => (
              <div className={`service-card service-card--${i}`} key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <div
          className="scene-bg scene-bg--right"
          style={{ backgroundImage: `url(${kitchenScene})` }}
        />
        <div className="manifesto-inner">
          <p className="manifesto-text">
            {manifesto.split(' ').map((word, i) => (
              <span className="mword" key={i}>
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
        <ul className="platform-strip">
          {platforms.map((platform) => (
            <li key={platform}>{platform}</li>
          ))}
        </ul>
      </section>

      <section className="contact" id="contact">
        <div className="contact-inner">
          <p className="contact-eyebrow">Hungry for reach?</p>
          <h2 className="contact-title">
            Let's go
            <br />
            viral.
          </h2>
          <div className="contact-actions">
            <a href="mailto:crafterlabs0506@gmail.com" className="pill pill--solid">
              crafterlabs0506@gmail.com
            </a>
            <a
              href="https://www.instagram.com/kaleumstudios/"
              target="_blank"
              rel="noreferrer"
              className="pill pill--ghost"
            >
              @kaleumstudios
            </a>
          </div>
        </div>
        <footer className="footer">
          <span>© {new Date().getFullYear()} Kaleum Studios</span>
          <span>Restaurants · Chefs · Bars · Luxury Hotels</span>
        </footer>
      </section>
    </div>
  )
}

export default App
