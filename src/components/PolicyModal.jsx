import { useEffect, useRef } from 'react'
import '../styles/policy-modal.css'
import { usePolicyPage } from '../hooks/usePolicyPage'
import PolicyContent from './PolicyContent'
import { clearConsent } from '../lib/consent'
import { t } from '../lib/i18n'

// Props: isOpen (bool), onClose (fn), lang — content is fetched here
// (usePolicyPage) and rendered via the same <PolicyContent> the public
// /legal-notice route uses, so the two never drift apart.
export default function PolicyModal({ isOpen, onClose, lang }) {
  const overlayRef = useRef(null)
  const closeRef = useRef(null)
  const triggerRef = useRef(null)
  const strings = t(lang).policyModal

  const { page, loading, resolvedLang } = usePolicyPage(lang)

  // Focus the close button on open, and return focus to whatever triggered
  // the modal on close.
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

  // Lock body scroll while open — restore whatever overflow value was
  // already there before we touched it, not an assumed ''.
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
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

  const handleManageCookies = () => {
    clearConsent()
    onClose()
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
          <p className="pmodal__title" id="policy-modal-title">{page?.title || strings.title}</p>
          <button
            ref={closeRef}
            className="pmodal__close"
            onClick={onClose}
            aria-label={strings.close}
          >
            ✕
          </button>
        </div>

        <div className="pmodal__body">
          <PolicyContent page={page} loading={loading} lang={lang} resolvedLang={resolvedLang} />
        </div>

        <div className="pmodal__footer">
          <button type="button" className="pmodal__manage-cookies" onClick={handleManageCookies}>
            {strings.manageCookies}
          </button>
          <button className="pmodal__close-btn" onClick={onClose}>{strings.close}</button>
        </div>
      </div>
    </div>
  )
}
