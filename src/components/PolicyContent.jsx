// ─────────────────────────────────────────────────────────────────────────────
// components/PolicyContent.jsx — SHARED POLICY BODY
//
// Rendered identically by PolicyModal.jsx (quick preview from the cookie
// banner) and PolicyPage.jsx (the public, crawlable /privacy-policy route).
// One component, one markup — never duplicated.
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizePolicyHtml } from '../lib/sanitizeHtml'
import { t } from '../lib/i18n'

export default function PolicyContent({ page, loading, lang, resolvedLang }) {
  const strings = t(lang).policyPage

  if (loading) {
    return (
      <div className="policy-content policy-content--loading" aria-busy="true" aria-label="…">
        <div className="skeleton__bar" style={{ height: '1.25rem', width: '55%' }} />
        <div className="skeleton__bar" style={{ height: '1rem', width: '92%', marginTop: 'var(--space-4)' }} />
        <div className="skeleton__bar" style={{ height: '1rem', width: '88%' }} />
        <div className="skeleton__bar" style={{ height: '1rem', width: '76%' }} />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="policy-content">
        <p>
          {strings.emptyBody}{' '}
          <a href="mailto:contact@dangelwellness.ca">contact@dangelwellness.ca</a>
        </p>
      </div>
    )
  }

  const lastUpdated = page.fgPolicies?.policyLastUpdated
  const formattedDate = lastUpdated
    ? new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(lastUpdated))
    : null
  const contactEmail = page.fgPolicies?.policyContactEmail

  return (
    <div className="policy-content">
      {resolvedLang !== lang && (
        <p className="policy-content__notice">{strings.fallbackNotice}</p>
      )}

      <div
        className="policy-content__body"
        dangerouslySetInnerHTML={{ __html: sanitizePolicyHtml(page.content || '') }}
      />

      {(formattedDate || contactEmail) && (
        <p className="policy-content__meta">
          {formattedDate && <>{strings.updated}: {formattedDate}</>}
          {formattedDate && contactEmail && ' · '}
          {contactEmail && (
            <>{strings.contact} <a href={`mailto:${contactEmail}`}>{contactEmail}</a></>
          )}
        </p>
      )}
    </div>
  )
}
