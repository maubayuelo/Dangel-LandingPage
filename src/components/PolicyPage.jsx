import '../styles/policy-modal.css'
import { usePolicyPage } from '../hooks/usePolicyPage'
import PolicyContent from './PolicyContent'
import { t } from '../lib/i18n'

// The public, crawlable /legal-notice route (see lib/routes.js). Renders
// the same <PolicyContent> as PolicyModal — the modal is a quick preview
// from the cookie banner, this page is the real, indexable document Meta
// and Google expect a link to point to.
export default function PolicyPage({ lang }) {
  const { page, loading, resolvedLang } = usePolicyPage(lang)
  const strings = t(lang).policyPage

  return (
    <main className="policy-page">
      <div className="container policy-page__inner">
        <h1 className="policy-page__title">{page?.title || strings.emptyTitle}</h1>
        <PolicyContent page={page} loading={loading} lang={lang} resolvedLang={resolvedLang} />
      </div>
    </main>
  )
}
