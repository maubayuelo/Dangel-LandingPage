import { useEffect, useState } from 'react'
import '../styles/cookie-banner.css'

const CONSENT_KEY = 'dangel_cookie_consent'
const ENTRANCE_DELAY_MS = 1200

// ── Public getter — GA4 / Meta Pixel hooks check this before firing ─────────
// Returns 'accepted' | 'declined' | null (no choice made yet)
export function getCookieConsent() {
  return localStorage.getItem(CONSENT_KEY)
}

// Props: onOpenPolicy (fn) — opens PolicyModal from the "Politique de
// confidentialité" link
export default function CookieBanner({ onOpenPolicy }) {
  const [visible, setVisible] = useState(false)
  const [entered, setEntered] = useState(false)

  // Only show on first visit — no stored consent yet.
  useEffect(() => {
    if (getCookieConsent()) return
    setVisible(true)
  }, [])

  // Slide in 1200ms after mount, once we know the banner should show at all.
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setEntered(true), ENTRANCE_DELAY_MS)
    return () => clearTimeout(t)
  }, [visible])

  const choose = (value) => {
    localStorage.setItem(CONSENT_KEY, value)
    setEntered(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className={`cbanner${entered ? ' cbanner--entered' : ''}`}
      role="region"
      aria-label="Gestion des cookies"
    >
      <div className="cbanner__inner">
        <p className="cbanner__text">
          Ce site utilise des cookies pour analyser le trafic et améliorer votre
          expérience.{' '}
          <button type="button" className="cbanner__link" onClick={onOpenPolicy}>
            Politique de confidentialité →
          </button>
        </p>

        <div className="cbanner__actions">
          <button type="button" className="cbanner__decline" onClick={() => choose('declined')}>
            Refuser
          </button>
          <button type="button" className="cbanner__accept" onClick={() => choose('accepted')}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
