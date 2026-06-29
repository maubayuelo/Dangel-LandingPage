import { useState } from 'react'
import '../styles/nav.css'

export default function Nav({ data: d, lang, onLangChange, onBook }) {
  const [open, setOpen] = useState(false)
  const links = d?.navLinks || []
  const ctaLabel = d?.navCtaLabel || 'Réserver'
  const logoText = d?.navLogoText || 'Dangel'
  const logoSrc = d?.navLogoImage?.node?.sourceUrl
  const logoAlt = d?.navLogoImage?.node?.altText || logoText

  const scrollTo = (anchor) => {
    const id = anchor.replace('#', '')
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
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
            {['en', 'fr', 'es'].map((l, i, arr) => (
              <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 'inherit' }}>
                <button
                  className={`nav__lang-btn${lang === l ? ' nav__lang-btn--active' : ''}`}
                  onClick={() => onLangChange(l)}
                  aria-current={lang === l ? 'true' : undefined}
                >
                  {l.toUpperCase()}
                </button>
                {i < arr.length - 1 && <span className="nav__lang-dot" aria-hidden="true">·</span>}
              </span>
            ))}
          </div>
          <button className="nav__cta" onClick={onBook}>
            {ctaLabel} →
          </button>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="nav__mobile-right">
          <button className="nav__cta nav__cta--mobile" onClick={onBook}>
            {ctaLabel}
          </button>
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
              {['en', 'fr', 'es'].map((l, i, arr) => (
                <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 'inherit' }}>
                  <button
                    className={`nav__lang-btn${lang === l ? ' nav__lang-btn--active' : ''}`}
                    onClick={() => { onLangChange(l); setOpen(false) }}
                    aria-current={lang === l ? 'true' : undefined}
                  >
                    {l.toUpperCase()}
                  </button>
                  {i < arr.length - 1 && <span className="nav__lang-dot" aria-hidden="true">·</span>}
                </span>
              ))}
            </div>
            <button className="nav__cta" onClick={() => { onBook(); setOpen(false) }}>
              {ctaLabel} →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
