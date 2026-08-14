import { useState } from 'react'
import '../styles/nav.css'
import Picture from './Picture'
import { getView, navigate } from '../lib/router'
import { LANG_PATHS } from '../lib/urls'

// .nav__logo-img is a fixed 45px-tall mark (width: auto) at every
// breakpoint — no responsive layout change, so a single size hint suffices.
const LOGO_SIZES = '180px'

export default function Nav({ data: d, lang, onLangChange, onBook }) {
  const [open, setOpen] = useState(false)
  const links = d?.navLinks || []
  const ctaLabel = d?.navCtaLabel || 'Réserver'
  const logoText = d?.navLogoText || 'Dangel'
  const logoSrc = d?.navLogoImage?.node?.sourceUrl

  // Section anchors (#services, #about, ...) only exist on the home view —
  // on the policy page (/en/legal-notice etc.) that <main> isn't mounted.
  // Navigate home first when needed, then scroll once it has re-rendered.
  const scrollTo = (anchor) => {
    const id = anchor.replace('#', '')
    setOpen(false)
    const cameFromPolicy = getView() === 'policy'
    if (cameFromPolicy) navigate(LANG_PATHS[lang] || LANG_PATHS.en)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, cameFromPolicy ? 80 : 50)
  }

  const goHome = () => {
    if (getView() === 'policy') {
      navigate(LANG_PATHS[lang] || LANG_PATHS.en)
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav className="nav" aria-label="Navigation principale">
      <div className="nav__inner">
        <button className="nav__logo" onClick={goHome}>
          {logoSrc
            ? <Picture image={d.navLogoImage} alt={logoText} sizes={LOGO_SIZES} eager className="nav__logo-img" />
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
