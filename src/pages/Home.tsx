import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Marquee from '../components/Marquee'
import Footer from '../components/Footer'
import BriefForm from '../components/BriefForm'
import { useTransitionNav } from '../transition'
import { stills } from '../stills'
import brandTitle from '../assets/brand_title.webp'

const SHOWREEL_VIMEO_ID = '1207603496'

const kicker = ['Bold Ideas', 'Viral Instagram Hooks', 'Endless Reach']

const marqueeItems = [
  'Hotels',
  'Bars and Night Clubs',
  'Restaurants',
  "Chef's Special Culinary Skills",
]

const manifesto =
  'Kaleum Studios helps brands crack the algorithm for endless reach on social. We build AI-powered short-form content for restaurants, chefs, bars and luxury hotels — engineered to stop the scroll, start cravings and fill every seat in the house. No corporate playbooks. No recycled trends. Just content your guests cannot stop sharing.'

const contactMedia = [stills.flame, stills.bar, stills.hotel, stills.plating, stills.club]

interface HomeProps {
  introReady: boolean
}

function Home({ introReady }: HomeProps) {
  const root = useRef<HTMLDivElement>(null)
  const peekRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLElement>(null)
  const [peekIndex, setPeekIndex] = useState(0)
  const [reelInView, setReelInView] = useState(false)
  const [reelSound, setReelSound] = useState(false)
  const showreelRef = useRef<HTMLDivElement>(null)
  const go = useTransitionNav()

  // Lazy-start the muted background reel when the section approaches
  useEffect(() => {
    const el = showreelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReelInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Cycle the floating media fragment
  useEffect(() => {
    const id = setInterval(() => setPeekIndex((i) => (i + 1) % contactMedia.length), 1600)
    return () => clearInterval(id)
  }, [])

  // Media fragment follows the mouse — only inside the contact section
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const peek = peekRef.current
    const section = contactRef.current
    if (!fine || reduce || !peek || !section) return

    const xTo = gsap.quickTo(peek, 'x', { duration: 0.9, ease: 'power3.out' })
    const yTo = gsap.quickTo(peek, 'y', { duration: 0.9, ease: 'power3.out' })
    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const enter = () => gsap.to(peek, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
    const leave = () => gsap.to(peek, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: 'power2.in' })

    section.addEventListener('mousemove', move)
    section.addEventListener('mouseenter', enter)
    section.addEventListener('mouseleave', leave)
    return () => {
      section.removeEventListener('mousemove', move)
      section.removeEventListener('mouseenter', enter)
      section.removeEventListener('mouseleave', leave)
    }
  }, [])

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      history.scrollRestoration = 'manual'

      // Hero shrinks into a framed card as the next slide arrives
      gsap.to('.hero', {
        scale: 0.9,
        borderRadius: 36,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-wrap',
          start: 'top top',
          end: 'bottom 65%',
          scrub: 0.4,
        },
      })
      gsap.to('.hero-dim', {
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-wrap',
          start: 'top top',
          end: 'bottom 65%',
          scrub: 0.4,
        },
      })

      // Manifesto word-by-word reveal (pinned)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.manifesto',
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 0.6,
          },
        })
        .to('.mword', { opacity: 1, stagger: 0.08 })

      // Section reveals
      for (const el of gsap.utils.toArray<HTMLElement>('.reveal')) {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      }
    },
    { scope: root },
  )

  // Hero intro — plays once the preloader curtain opens
  useGSAP(
    () => {
      if (!introReady) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-line', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.1)
        .from('.kicker-word', { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.1 }, '-=0.6')
    },
    { scope: root, dependencies: [introReady] },
  )

  return (
    <div ref={root}>
      <div className="hero-wrap">
        <header className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <p className="hero-kicker">
            {kicker.map((word, i) => (
              <span className="kicker-word" key={word}>
                {word}
                {i < kicker.length - 1 && <em aria-hidden="true"> · </em>}
              </span>
            ))}
          </p>
          <h1 className="hero-title">
            <span className="hero-mask">
              <span className="hero-line">Kaleum</span>
            </span>
            <span className="hero-mask">
              <span className="hero-line">Studios</span>
            </span>
          </h1>
          <div className="hero-dim" aria-hidden="true" />
        </header>
      </div>

      <section className="showreel">
        <Marquee items={marqueeItems} />
        <div className="showreel-stage" ref={showreelRef}>
          {reelSound ? (
            <iframe
              src={`https://player.vimeo.com/video/${SHOWREEL_VIMEO_ID}?autoplay=1&title=0&byline=0&portrait=0`}
              title="Kaleum Studios showreel"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img src={stills.club} alt="" aria-hidden="true" />
              {reelInView && (
                <iframe
                  src={`https://player.vimeo.com/video/${SHOWREEL_VIMEO_ID}?background=1`}
                  title="Kaleum Studios showreel (muted preview)"
                  allow="autoplay; fullscreen; picture-in-picture"
                  tabIndex={-1}
                />
              )}
              <button type="button" className="reel-btn" onClick={() => setReelSound(true)}>
                Play Reel
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              </button>
            </>
          )}
        </div>
      </section>

      <section className="manifesto" id="manifesto">
        <p className="eyebrow">Manifesto</p>
        <p className="manifesto-text">
          {manifesto.split(' ').map((word, i) => (
            <span className="mword" key={i}>
              {word}{' '}
            </span>
          ))}
        </p>
      </section>

      <a
        href="/services"
        className="services-teaser"
        onClick={(e) => {
          e.preventDefault()
          go('/services')
        }}
      >
        <div className="services-teaser-inner reveal">
          <p className="eyebrow">Our Service</p>
          <span className="services-teaser-title">
            From brief to publish-ready content
            <svg viewBox="0 0 24 24" aria-hidden="true" className="arrow">
              <path d="M4 12h14m0 0-6-6m6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
          <span className="services-teaser-hint">
            Check it out to know more — our full six-step pipeline
          </span>
        </div>
      </a>

      <section className="contact" id="contact" ref={contactRef}>
        <div className="contact-peek" ref={peekRef} aria-hidden="true">
          {contactMedia.map((src, i) => (
            <img key={src} src={src} alt="" style={{ opacity: i === peekIndex ? 1 : 0 }} />
          ))}
        </div>
        <div className="contact-inner">
          <div className="contact-copy">
            <p className="eyebrow reveal">Hungry for reach?</p>
            <h2 className="contact-title reveal">
              Let's go
              <br />
              viral.
            </h2>
            <div className="contact-actions reveal">
              <a href="mailto:crafterlabs0506@gmail.com" className="pill pill--ghost">
                crafterlabs0506@gmail.com
              </a>
            </div>
          </div>
          <div className="contact-form reveal">
            <BriefForm />
          </div>
        </div>
        <div className="contact-brand reveal">
          <img src={brandTitle} alt="Kaleum Studios" loading="lazy" />
          <span className="brand-sheen" aria-hidden="true" />
        </div>
        <Footer />
      </section>
    </div>
  )
}

export default Home
