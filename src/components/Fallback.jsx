// ─────────────────────────────────────────────────────────────────────────────
// components/Fallback.jsx — LAST-RESORT SAFETY NET FOR A FAILED GET_PAGE QUERY
//
// Rendered by App.tsx when the single GraphQL query that powers the whole
// page fails (CORS block, server down, network error, timeout) or returns no
// `data.page`. It is intentionally self-contained: everything it needs is
// hardcoded here, because the thing that failed is the same source every
// other component depends on. A paid-ad visitor who lands here must still be
// able to call, book, or email — never see a blank screen.
// ─────────────────────────────────────────────────────────────────────────────

import '../styles/fallback.css'

const COPY = {
  en: {
    reassurance: "We're having trouble loading the page — you can still reach us below.",
    call: 'Call us',
    book: 'Book an appointment',
    email: 'Email us',
    retry: 'Try again',
  },
  fr: {
    reassurance: 'Nous avons un problème de chargement de la page — vous pouvez tout de même nous joindre ci-dessous.',
    call: 'Appelez-nous',
    book: 'Prendre rendez-vous',
    email: 'Écrivez-nous',
    retry: 'Réessayer',
  },
  es: {
    reassurance: 'Estamos teniendo problemas para cargar la página — aún puede contactarnos abajo.',
    call: 'Llámenos',
    book: 'Reservar una cita',
    email: 'Escríbanos',
    retry: 'Reintentar',
  },
}

const PHONE_DISPLAY = '(514) 585-2224'
const PHONE_TEL = 'tel:+15145852224'
const BOOKING_URL = 'https://dangeltherapeuteholistique.datedechoix.com/main.php'
const EMAIL = 'contact@dangelwellness.ca'

// lang may be undefined if useLanguage() itself couldn't resolve — default to 'en'.
export default function Fallback({ lang, onRetry }) {
  const strings = COPY[lang] || COPY.en

  return (
    <div className="fallback" role="alert">
      <div className="fallback__card">
        <p className="fallback__brand">Dangel — Thérapeute Holistique</p>
        <p className="fallback__message">{strings.reassurance}</p>

        <div className="fallback__actions">
          <a className="fallback__link fallback__link--primary" href={PHONE_TEL}>{strings.call} — {PHONE_DISPLAY}</a>
          <a className="fallback__link" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{strings.book}</a>
          <a className="fallback__link" href={`mailto:${EMAIL}`}>{strings.email} — {EMAIL}</a>
        </div>

        {onRetry && (
          <button type="button" className="fallback__retry" onClick={onRetry}>
            {strings.retry}
          </button>
        )}
      </div>
    </div>
  )
}
