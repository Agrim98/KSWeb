import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useTransitionNav } from '../transition'

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/kaleumstudios/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@kaleum.studios' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCRzX749f351NFEyMSVll50w' },
]

const menuLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/#contact' },
]

function Nav() {
  const go = useTransitionNav()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Collapse the top bar into a compact left-side menu button after the fold
  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu overlay open/close choreography
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      if (reduce) {
        gsap.set(overlay, { display: 'flex', autoAlpha: 1 })
        gsap.set('.menu-link, .menu-socials', { autoAlpha: 1, y: 0 })
      } else {
        gsap
          .timeline()
          .set(overlay, { display: 'flex' })
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
          .fromTo(
            '.menu-link',
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
            '-=0.15',
          )
          .fromTo(
            '.menu-socials',
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
            '-=0.3',
          )
      }
    } else {
      document.body.style.overflow = ''
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: reduce ? 0 : 0.25,
        ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Escape closes the menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navTo = (to: string) => {
    setMenuOpen(false)
    go(to)
  }

  return (
    <>
      <nav className={`nav ${collapsed ? 'nav--hidden' : ''}`}>
        <a
          href="/"
          className="nav-wordmark"
          onClick={(e) => {
            e.preventDefault()
            navTo('/')
          }}
        >
          Kaleum Studios
        </a>
        <div className="nav-links">
          {menuLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className={pathname === link.to ? 'is-active' : ''}
              onClick={(e) => {
                e.preventDefault()
                navTo(link.to)
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <button
        type="button"
        className={`menu-fab ${collapsed && !menuOpen ? 'menu-fab--visible' : ''}`}
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 16h6m0 0-2.4-2.4M20 16l-2.4 2.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Menu
      </button>

      <div className="menu-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label="Site menu">
        <button type="button" className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="menu-inner">
          {menuLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="menu-link"
              onClick={(e) => {
                e.preventDefault()
                navTo(link.to)
              }}
            >
              {link.label}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="arrow">
                <path d="M5 19 19 5m0 0h-9m9 0v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
          <div className="menu-socials">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav
