import { useState } from 'react'
import '../styles/nav.css'

export default function Nav({ data: d }) {
  const [open, setOpen] = useState(false)
  const links = d?.navLinks || []
  const ctaLabel = d?.navCtaLabel || 'Réserver'
  const logoText = d?.navLogoText || 'Dangel'
  const logoSrc = d?.navLogoImage?.node?.sourceUrl
  const logoAlt = d?.navLogoImage?.node?.altText || logoText

  const scrollTo = (anchor) => {
    const id = anchor.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <nav className="nav" aria-label="Navigation principale">
      <div className="nav__inner">
        <button className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {logoSrc
            ? <img src={logoSrc} alt={logoAlt} className="nav__logo-img" />
            : logoText}
        </button>

        {/* Desktop */}
        <div className="nav__desktop">
          <div className="nav__links">
            {links.map(l => (
              <button key={l.nlAnchor} className="nav__link" onClick={() => scrollTo(l.nlAnchor)}>
                {l.nlLabel}
              </button>
            ))}
          </div>
          <div className="nav__divider" />
          <div className="nav__lang">
            <button className="nav__lang-btn nav__lang-btn--active">FR</button>
            <span className="nav__lang-dot" aria-hidden="true">·</span>
            <button className="nav__lang-btn">EN</button>
            <span className="nav__lang-dot" aria-hidden="true">·</span>
            <button className="nav__lang-btn">ES</button>
          </div>
          <button className="nav__cta" onClick={() => scrollTo('#contact')}>
            {ctaLabel} →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav__hamburger"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="nav__mobile">
          {links.map(l => (
            <button key={l.nlAnchor} className="nav__mobile-link" onClick={() => scrollTo(l.nlAnchor)}>
              {l.nlLabel}
            </button>
          ))}
          <div className="nav__mobile-footer">
            <div className="nav__lang">
              <button className="nav__lang-btn nav__lang-btn--active">FR</button>
              <span className="nav__lang-dot" aria-hidden="true">·</span>
              <button className="nav__lang-btn">EN</button>
              <span className="nav__lang-dot" aria-hidden="true">·</span>
              <button className="nav__lang-btn">ES</button>
            </div>
            <button className="nav__cta" onClick={() => scrollTo('#contact')}>
              {ctaLabel} →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
