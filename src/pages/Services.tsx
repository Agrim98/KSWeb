import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Footer from '../components/Footer'
import { useTransitionNav } from '../transition'
import { stills } from '../stills'

const steps = [
  {
    n: '01',
    title: 'Brand Brief',
    text: "Share your photos, existing video clips and a one-line goal for your brand's mission. No creative decks, no agency briefs needed.",
    image: stills.hotel,
  },
  {
    n: '02',
    title: 'Creative Storyboard',
    text: 'We plan a scene-by-scene storyboard script from your existing assets. Every frame is defined before production begins.',
    image: stills.plating,
  },
  {
    n: '03',
    title: 'Video Content Creation',
    text: 'Brand assets are transformed into cinematic motion sequences using the best AI rendering models on the market — cut with the latest hooks, ready to publish.',
    image: stills.flame,
  },
  {
    n: '04',
    title: 'Brand Narration',
    text: 'The voice of your brand is the hook that makes it stand out. Voices are available in every language, discussed and approved before finalization.',
    image: stills.bar,
  },
  {
    n: '05',
    title: 'Music & Video Edits',
    text: 'Original score and trend-matched music, stitched with professional edits that follow every social platform’s guidelines.',
    image: stills.club,
  },
  {
    n: '06',
    title: 'Platform Export & Delivery',
    text: 'Final short-form delivery in 9:16 for Reels, Shorts and Stories, plus 16:9 — formatted, labelled, publish-ready.',
    image: stills.hotel,
  },
]

function Services() {
  const root = useRef<HTMLDivElement>(null)
  const go = useTransitionNav()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.services-head .hero-line', { yPercent: 110, duration: 0.9, stagger: 0.1 }, 0.1)
        .from(
          '.services-head .eyebrow, .services-intro',
          { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.1 },
          '-=0.5',
        )

      // Pinned horizontal deck — scroll drives the six steps across the screen
      const mm = gsap.matchMedia()
      mm.add('(min-width: 721px)', () => {
        const track = document.querySelector<HTMLElement>('.flow-track')
        if (!track) return
        const distance = () => track.scrollWidth - window.innerWidth

        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.flow',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.flow-progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.flow',
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.8,
          },
        })

        // Cards wake up as they travel toward center
        for (const card of gsap.utils.toArray<HTMLElement>('.flow-card')) {
          gsap.from(card, {
            scale: 0.92,
            autoAlpha: 0.45,
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 92%',
              end: 'left 45%',
              scrub: true,
            },
          })
        }
        return () => {
          ScrollTrigger.getAll().forEach((t) => t.kill())
        }
      })
    },
    { scope: root },
  )

  return (
    <div className="services-page" ref={root}>
      <header className="services-head">
        <p className="eyebrow">Our Service</p>
        <h1 className="services-title">
          <span className="hero-mask">
            <span className="hero-line">From brief to</span>
          </span>
          <span className="hero-mask">
            <span className="hero-line">publish-ready</span>
          </span>
          <span className="hero-mask">
            <span className="hero-line">content</span>
          </span>
        </h1>
        <p className="services-intro">
          One pipeline from your first message to the moment it goes live.
        </p>
      </header>

      <section className="flow" aria-label="Our six-step process">
        <div className="flow-track">
          {steps.map((step) => (
            <article className="flow-card" key={step.n}>
              <img className="flow-card-bg" src={step.image} alt="" loading="lazy" />
              <div className="flow-card-scrim" aria-hidden="true" />
              <span className="flow-n" aria-hidden="true">
                {step.n}
              </span>
              <div className="flow-card-body">
                <p className="flow-count">
                  {step.n} / 06
                </p>
                <h2>{step.title}</h2>
                <p className="flow-text">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="flow-progress" aria-hidden="true">
          <i />
        </div>
      </section>

      <div className="services-cta">
        <p className="eyebrow">Ready when you are</p>
        <a
          href="/#contact"
          className="services-cta-link"
          onClick={(e) => {
            e.preventDefault()
            go('/#contact')
          }}
        >
          Start your brief
          <svg viewBox="0 0 24 24" aria-hidden="true" className="arrow">
            <path d="M4 12h14m0 0-6-6m6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </a>
      </div>

      <Footer />
    </div>
  )
}

export default Services
