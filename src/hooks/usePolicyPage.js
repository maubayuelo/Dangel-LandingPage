// ─────────────────────────────────────────────────────────────────────────────
// hooks/usePolicyPage.js — FETCH THE PRIVACY POLICY PAGE, WITH FALLBACK
//
// Same one-page-per-language WPML pattern as App.tsx's main GET_PAGE query
// (see LANG_POLICY_URIS in lib/urls.js). If the active language's policy
// page doesn't exist yet in WordPress, falls back to FR — the legal
// baseline document — never to EN.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from '@apollo/client'
import { GET_POLICY_PAGE } from '../graphql/queries'
import { LANG_POLICY_URIS } from '../lib/urls'

export function usePolicyPage(lang) {
  const primaryUri = LANG_POLICY_URIS[lang] || LANG_POLICY_URIS.fr

  const { data: primaryData, loading: primaryLoading, error: primaryError } = useQuery(GET_POLICY_PAGE, {
    variables: { pageId: primaryUri },
  })

  const primaryMissing = !primaryLoading && !primaryError && !primaryData?.page
  const needsFallback = primaryMissing && lang !== 'fr'

  const { data: fallbackData, loading: fallbackLoading } = useQuery(GET_POLICY_PAGE, {
    variables: { pageId: LANG_POLICY_URIS.fr },
    skip: !needsFallback,
  })

  const loading = primaryLoading || (needsFallback && fallbackLoading)
  const page = primaryData?.page || (needsFallback ? fallbackData?.page : null)
  const resolvedLang = primaryData?.page ? lang : (fallbackData?.page ? 'fr' : lang)

  return { page, loading, resolvedLang }
}
