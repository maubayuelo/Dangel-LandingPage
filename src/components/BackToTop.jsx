import { useEffect, useState } from 'react'
import '../styles/back-to-top.css'
import { getConsent, subscribeConsent } from '../lib/consent'
import { t } from '../lib/i18n'

const SHOW_AFTER_PX = 480

// Fixed floating button, bottom-right. Appears once the visitor has
// scrolled past the hero. Steps aside (--raised) while the cookie banner
// is on screen so the two never overlap.
export default function BackToTop({ lang }) {
  const [visible, setVisible] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(() => getConsent() === null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    return subscribeConsent((value) => setBannerVisible(value == null))
  }, [])

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      className={`btt${bannerVisible ? ' btt--raised' : ''}`}
      onClick={scrollToTop}
      aria-label={t(lang).backToTop}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
