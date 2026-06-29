import { useEffect, useRef } from 'react'
import '../styles/booking-modal.css'

const BOOKING_BASE = 'https://dangeltherapeuteholistique.datedechoix.com/main.php'

const LANG_MAP = { en: 'english', fr: 'french', es: 'spanish' }

const MODAL_TITLES = { en: 'Book a session', fr: 'Réserver une séance', es: 'Reservar una sesión' }

function buildBookingUrl(base, lang) {
  const url = new URL(base || BOOKING_BASE)
  url.searchParams.set('mode', 'mobile')
  url.searchParams.set('language', LANG_MAP[lang] || 'english')
  return url.toString()
}

export default function BookingModal({ open, onClose, bookingUrl, lang = 'en' }) {
  const overlayRef = useRef(null)
  const closeRef = useRef(null)
  const src = buildBookingUrl(bookingUrl, lang)

  // Focus the close button when modal opens
  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  // Close on Esc key
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus trap — keep Tab/Shift+Tab inside modal
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return
    const focusable = overlayRef.current?.querySelectorAll(
      'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }

  if (!open) return null

  return (
    <div
      className="bmodal__overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Réservation en ligne"
      ref={overlayRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bmodal__panel">
        <div className="bmodal__header">
          <p className="bmodal__title">{MODAL_TITLES[lang] || MODAL_TITLES.en}</p>
          <button
            ref={closeRef}
            className="bmodal__close"
            onClick={onClose}
            aria-label="Fermer la fenêtre de réservation"
          >
            ✕
          </button>
        </div>
        <iframe
          src={src}
          className="bmodal__iframe"
          title="Réservation en ligne"
          loading="lazy"
          tabIndex={0}
        />
      </div>
    </div>
  )
}
