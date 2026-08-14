// ─────────────────────────────────────────────────────────────────────────────
// lib/urls.js — SINGLE SOURCE OF TRUTH FOR PUBLIC-FACING LANGUAGE URLS
//
// English is served at /en, not at the bare root. Every language, including
// English, has an explicit prefix — this avoids the duplicate-content trap of
// "/" and "/en" both existing as unrelated URLs for the same content. "/"
// still works as an entry point but is normalized client-side (see
// useLanguage.js) and its canonical always points at the prefixed URL.
//
// Consumed by useLanguage.js (URL rewrite + language switch) and
// useDocumentHead.js (canonical / hreflang / og:url) so the URL scheme is
// defined in exactly one place.
//
// WPML has no `language:` GraphQL argument — each language is a distinct
// WordPress page, identified by its own URI. LANG_PAGE_URIS / LANG_POLICY_URIS
// below are those WordPress URIs (used as the `$pageId` variable in GET_PAGE /
// GET_POLICY_PAGE) — not to be confused with LANG_PATHS above, which is the
// public-facing route scheme this app itself serves.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_ORIGIN = 'https://dangelwellness.ca'

export const LANG_PATHS = { en: '/en', fr: '/fr', es: '/es' }

// WordPress page URIs, one WPML translation per language.
export const LANG_PAGE_URIS = { en: '/home/', fr: '/fr/accueil/', es: '/es/inicio/' }

export const LANG_POLICY_URIS = {
  en: '/legal-notice/',
  fr: '/fr/mentions-legales/',
  es: '/es/aviso-legal/',
}
