import { useEffect, useState } from 'react'
import '../styles/cookie-banner.css'
import { getConsent, setConsent, subscribeConsent } from '../lib/consent'
import { t } from '../lib/i18n'

const ENTRANCE_DELAY_MS = 1200

// Props: lang (drives displayed strings, re-renders on language switch
// without remount), onOpenPolicy (fn — opens PolicyModal for a quick
// preview; the Footer's own policy link goes to the real crawlable URL
// instead, see Footer.jsx)
export default function CookieBanner({ lang, onOpenPolicy }) {
  const strings = t(lang).cookieBanner
  const [visible, setVisible] = useState(() => getConsent() === null)
  const [entered, setEntered] = useState(false)

  // Reacts to consent changes from anywhere — this banner's own buttons,
  // the "Gérer les témoins" link in the Footer or PolicyModal, or another
  // tab. Reappears whenever consent goes back to null.
  useEffect(() => {
    return subscribeConsent((value) => setVisible(value == null))
  }, [])

  // Slide in 1200ms after mount, once we know the banner should show at all.
  useEffect(() => {
    if (!visible) {
      setEntered(false)
      return
    }
    const timer = setTimeout(() => setEntered(true), ENTRANCE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [visible])

  const choose = (value) => setConsent(value)

  if (!visible) return null

  return (
    <div
      className={`cbanner${entered ? ' cbanner--entered' : ''}`}
      role="dialog"
      aria-live="polite"
      aria-label={strings.ariaLabel}
    >
      <div className="cbanner__inner">
        <p className="cbanner__text">
          {strings.message}{' '}
          <button type="button" className="cbanner__link" onClick={onOpenPolicy}>
            {strings.policyLink}
          </button>
        </p>

        <div className="cbanner__actions">
          <button type="button" className="cbanner__decline" onClick={() => choose('declined')}>
            {strings.decline}
          </button>
          <button type="button" className="cbanner__accept" onClick={() => choose('accepted')}>
            {strings.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
