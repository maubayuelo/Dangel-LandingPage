// ─────────────────────────────────────────────────────────────────────────────
// STEP 14 — components/BookingModal.jsx — BOOKING MODAL WITH IFRAME
//
// KEY CONCEPTS IN THIS FILE:
//   - useRef: access a real DOM element from React code
//   - Multiple useEffects with different dependencies
//   - Cleanup functions (return () => ...) to prevent memory leaks
//   - Focus trap: keeping keyboard focus inside the modal (WCAG 2.1 requirement)
//   - Accessibility: role, aria-modal, aria-label for screen readers
//   - Early return pattern: return null when modal is closed
// ─────────────────────────────────────────────────────────────────────────────

// useRef: creates a mutable reference object that persists across renders.
// Unlike useState, changing a ref does NOT trigger a re-render.
// Common use: hold a reference to a real DOM element so you can call browser
// methods on it (.focus(), .scrollIntoView(), etc.)
import { useEffect, useRef } from 'react'
import '../styles/booking-modal.css'

// Fallback booking URL used if WordPress hasn't set globalBookingUrl yet
const BOOKING_BASE = 'https://dangeltherapeuteholistique.datedechoix.com/main.php'

// Maps our language codes (en/fr/es) to the language parameter the booking
// system expects in its URL. Object literal used as a lookup table.
const LANG_MAP = { en: 'english', fr: 'french', es: 'spanish' }

// Translated modal titles — avoids fetching this from WordPress for a few words
const MODAL_TITLES = { en: 'Book a session', fr: 'Réserver une séance', es: 'Reservar una sesión' }

// ── Helper: build the booking iframe URL ─────────────────────────────────────
// Constructs the booking URL with query parameters:
//   ?mode=mobile&language=french (or english/spanish)
// The URL constructor parses an existing URL and lets us safely add/modify params.
function buildBookingUrl(base, lang) {
  const url = new URL(base || BOOKING_BASE)
  url.searchParams.set('mode', 'mobile')
  url.searchParams.set('language', LANG_MAP[lang] || 'english')
  return url.toString()
}

// ── Component ─────────────────────────────────────────────────────────────────
// Props:
//   open       → boolean — whether the modal is visible
//   onClose    → function — called to close the modal (lives in App.jsx state)
//   bookingUrl → string from WordPress (or undefined → fallback used)
//   lang       → 'en' | 'fr' | 'es' — controls which language the iframe loads
export default function BookingModal({ open, onClose, bookingUrl, lang = 'en' }) {

  // useRef creates a container: { current: null }
  // We attach it to the overlay div via ref={overlayRef} — after render,
  // overlayRef.current will point to the actual DOM element.
  const overlayRef = useRef(null)

  // A ref for the close button — used to focus it automatically when the modal opens
  const closeRef = useRef(null)

  // Build the full iframe URL (runs on every render, but that's fine — it's cheap)
  const src = buildBookingUrl(bookingUrl, lang)

  // ── Effect 1: Auto-focus the close button when modal opens ──────────────────
  // Accessibility requirement: when a modal opens, focus must move INTO the modal.
  // Without this, keyboard users can't interact with it.
  // ?. (optional chaining) on ref.current because the ref might not be attached yet.
  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open]) // runs whenever `open` changes

  // ── Effect 2: Close modal on Escape key ──────────────────────────────────────
  // Standard UX pattern: Esc closes any dialog/modal.
  useEffect(() => {
    // Guard: don't add listener when modal is closed
    if (!open) return

    const onKey = (e) => { if (e.key === 'Escape') onClose() }

    // addEventListener on document catches keydowns anywhere on the page
    document.addEventListener('keydown', onKey)

    // Cleanup function: React calls this when the effect re-runs or component unmounts.
    // Without cleanup, each time open changes, another listener gets added — leaking.
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose]) // re-run when open or onClose changes

  // ── Effect 3: Prevent body scroll while modal is open ────────────────────────
  // When a modal is open, the background page shouldn't scroll.
  // document.body.style.overflow = 'hidden' disables scrolling on the page body.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    // Cleanup: always restore scrolling, even if the component unmounts unexpectedly
    return () => { document.body.style.overflow = '' }
  }, [open])

  // ── Focus trap ────────────────────────────────────────────────────────────────
  // WCAG 2.1 requirement: Tab key must cycle through focusable elements WITHIN
  // the modal — it must NOT leave the modal and focus elements behind it.
  //
  // querySelectorAll returns all focusable elements inside the overlay.
  // We intercept Tab keydown and manually move focus to keep it inside.
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return

    // Find all focusable elements within the modal overlay
    const focusable = overlayRef.current?.querySelectorAll(
      'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      // Shift+Tab: moving backwards. If we're on the first element, wrap to last.
      if (document.activeElement === first) {
        e.preventDefault() // stop browser's default Tab behavior
        last.focus()
      }
    } else {
      // Tab: moving forward. If we're on the last element, wrap to first.
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  // ── Early return when closed ──────────────────────────────────────────────────
  // Return null = render nothing at all. React removes the element from the DOM.
  // This is more efficient than CSS display:none for an iframe (stops the iframe
  // from loading when closed).
  if (!open) return null

  return (
    <div
      className="bmodal__overlay"
      // ARIA roles communicate component semantics to screen readers:
      // role="dialog" → screen reader announces "dialog" when this gets focus
      // aria-modal="true" → tells screen reader this is a modal (hide background)
      // aria-label → the accessible name for the dialog
      role="dialog"
      aria-modal="true"
      aria-label="Réservation en ligne"
      ref={overlayRef}
      onKeyDown={handleKeyDown}
      {/*
        Backdrop click to close: we only close when the click target IS the overlay
        itself (not a child inside it). e.target === e.currentTarget checks this.
        If the user clicks inside the panel, e.target would be a child element.
      */}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bmodal__panel">
        <div className="bmodal__header">
          <p className="bmodal__title">{MODAL_TITLES[lang] || MODAL_TITLES.en}</p>
          <button
            ref={closeRef}         // attach ref so useEffect can call .focus()
            className="bmodal__close"
            onClick={onClose}
            aria-label="Fermer la fenêtre de réservation"
          >
            ✕
          </button>
        </div>

        {/*
          <iframe> embeds an external page (the booking system) inside our page.
          loading="lazy" → browser loads iframe only when visible (performance)
          tabIndex={0}   → makes the iframe focusable by keyboard
          title          → required for accessibility (screen readers read it)
        */}
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
