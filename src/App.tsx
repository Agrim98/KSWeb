import PortalScene from './three/PortalScene'
import './App.css'

const services = [
  {
    title: 'Restaurants & Local Eateries',
    description:
      'Short-form video that turns your dining room into a discovery engine — plate reveals, ambience edits, and story-driven Reels tuned for the algorithm.',
  },
  {
    title: "Chef's Culinary Magic",
    description:
      'Cinematic, high-motion content built around the chef as the star — knife work, fire, plating choreography, and behind-the-pass moments.',
  },
  {
    title: 'Bars & Nightlife',
    description:
      'Late-night energy captured for daytime feeds — pours, garnishes, crowd shots, and signature-drink hooks built to loop.',
  },
  {
    title: 'Luxury Hotels & Resorts',
    description:
      'Aspirational, editorial content that sells the stay before the guest arrives — suites, amenities, and experiences framed for aspiration and booking intent.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Concept',
    description:
      "We study your venue, your guests, and the platforms where your next guest is scrolling — then build a content angle built to be shared.",
  },
  {
    step: '02',
    title: 'AI Production',
    description:
      'AI-accelerated shooting, editing, and iteration means more variations, faster turnaround, and content that keeps pace with trends.',
  },
  {
    step: '03',
    title: 'Viral Distribution',
    description:
      'Every piece is cut for the hook, the loop, and the share — built for TikTok, Reels, and Shorts from the first frame.',
  },
]

const formats = [
  'Chef POV & behind-the-pass',
  'Plate & pour reveals',
  'Ambience & aesthetic edits',
  'Menu spotlight series',
  'Guest experience storytelling',
  'Trend-jacked short-form hooks',
]

function App() {
  return (
    <>
      <nav className="ghost-nav">
        <a href="#top" className="wordmark">
          Kaleum Studios
        </a>
        <div className="ghost-nav-links">
          <a href="#work" className="ghost-btn">
            Work
          </a>
          <span className="nav-dot" aria-hidden="true" />
          <a href="#contact" className="ghost-btn">
            Contact
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <PortalScene />
        <div className="aurora" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">AI Viral Content Studio</p>
          <h1>We make hospitality impossible to scroll past.</h1>
          <p className="hero-sub">
            Kaleum Studios builds AI-powered short-form video for restaurants, chefs,
            bars, and luxury hotels — content engineered to stop the scroll and fill
            the room.
          </p>
          <a href="#contact" className="pill-btn pill-btn--violet">
            Start a Project
          </a>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-head">
          <p className="eyebrow">What We Do</p>
          <h2>Built for the venues people talk about.</h2>
        </div>
        <div className="card-grid">
          {services.map((service) => (
            <div className="ghost-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="process">
        <div className="section-head">
          <p className="eyebrow">How It Works</p>
          <h2>From concept to viral, without the guesswork.</h2>
        </div>
        <div className="process-grid">
          {processSteps.map((item) => (
            <div className="process-item" key={item.step}>
              <span className="process-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="formats">
        <div className="section-head">
          <p className="eyebrow">Content We Create</p>
          <h2>Every format the algorithm rewards.</h2>
        </div>
        <ul className="format-tags">
          {formats.map((format) => (
            <li key={format} className="tag">
              {format}
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--contact" id="contact">
        <div className="contact-panel">
          <p className="eyebrow">Get In Touch</p>
          <h2>Let's make your venue impossible to ignore.</h2>
          <p className="hero-sub">
            Tell us about your restaurant, bar, or hotel and we'll put together a
            content plan built for your guests.
          </p>
          <div className="contact-actions">
            <a href="mailto:crafterlabs0506@gmail.com" className="pill-btn pill-btn--violet">
              crafterlabs0506@gmail.com
            </a>
            <a
              href="https://www.instagram.com/kaleumstudios/"
              target="_blank"
              rel="noreferrer"
              className="pill-btn pill-btn--ghost"
            >
              @kaleumstudios
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Kaleum Studios</span>
        <div className="footer-links">
          <a href="mailto:crafterlabs0506@gmail.com" className="hairline-link">
            crafterlabs0506@gmail.com
          </a>
          <a
            href="https://www.instagram.com/kaleumstudios/"
            target="_blank"
            rel="noreferrer"
            className="hairline-link"
          >
            Instagram
          </a>
        </div>
      </footer>
    </>
  )
}

export default App
