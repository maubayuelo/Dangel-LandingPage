import { useEffect, useRef } from 'react'
import '../styles/policy-modal.css'

// Static French copy for the privacy policy — no WordPress round-trip needed.
const SECTIONS = [
  {
    title: 'Responsable',
    body: (
      <>
        Dangel Manik est responsable de la protection des renseignements personnels
        collectés via ce site. Pour toute question :{' '}
        <a href="mailto:contact@dangelwellness.ca">contact@dangelwellness.ca</a>
      </>
    ),
  },
  {
    title: 'Renseignements collectés',
    body: "Nous collectons les informations suivantes via le formulaire de contact : nom, adresse courriel et contenu de votre message. Nous collectons également des données de navigation anonymes via Google Analytics.",
  },
  {
    title: 'Finalités',
    body: "Les renseignements collectés sont utilisés uniquement pour répondre à vos demandes et améliorer l'expérience du site. Ils ne sont jamais vendus.",
  },
  {
    title: 'Partage',
    body: "Vos renseignements peuvent être partagés avec Google Analytics (analyse anonyme) et Meta Pixel (publicité). Ces services ont leurs propres politiques.",
  },
  {
    title: 'Conservation',
    body: "Les messages reçus par formulaire sont conservés 12 mois, puis supprimés.",
  },
  {
    title: 'Vos droits (Loi 25)',
    body: (
      <>
        Conformément à la Loi 25, vous avez le droit de consulter, corriger, supprimer
        vos renseignements et retirer votre consentement. Contact :{' '}
        <a href="mailto:contact@dangelwellness.ca">contact@dangelwellness.ca</a>
      </>
    ),
  },
  {
    title: 'Cookies',
    body: "Ce site utilise des cookies analytiques (Google Analytics) et publicitaires (Meta Pixel). Vous pouvez refuser les cookies non essentiels via la bannière de consentement affichée à votre première visite.",
  },
  {
    title: 'Modifications',
    body: "Cette politique peut être modifiée à tout moment. La version en vigueur est toujours disponible sur cette page. Dernière mise à jour : juillet 2025.",
  },
]

// Props: isOpen (bool), onClose (fn)
export default function PolicyModal({ isOpen, onClose }) {
  const overlayRef = useRef(null)
  const closeRef = useRef(null)
  const triggerRef = useRef(null)

  // Focus the close button on open, and return focus to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement
      closeRef.current?.focus()
    } else {
      triggerRef.current?.focus?.()
    }
  }, [isOpen])

  // Esc closes the modal.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus trap: keep Tab cycling within the modal panel.
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return

    const focusable = overlayRef.current?.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="pmodal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      ref={overlayRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="pmodal__panel">
        <div className="pmodal__header">
          <p className="pmodal__title" id="policy-modal-title">Politique de confidentialité</p>
          <button
            ref={closeRef}
            className="pmodal__close"
            onClick={onClose}
            aria-label="Fermer la politique de confidentialité"
          >
            ✕
          </button>
        </div>

        <div className="pmodal__body">
          {SECTIONS.map((section, i) => (
            <div className="pmodal__section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {i < SECTIONS.length - 1 && <hr className="pmodal__divider" />}
            </div>
          ))}
        </div>

        <div className="pmodal__footer">
          <button className="pmodal__close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}
