// ─────────────────────────────────────────────────────────────────────────────
// lib/routes.js — POLICY ROUTE SLUGS, SINGLE SOURCE
//
// The public policy URL for each language, one slug segment appended to the
// language prefix already defined in lib/urls.js:
//   en → /en/legal-notice
//   fr → /fr/mentions-legales
//   es → /es/aviso-legal
//
// These slugs match the real WordPress page slugs (see LANG_POLICY_URIS in
// urls.js) so there's only one translation table to keep in sync, not two.
//
// Consumed by lib/router.js (view detection) and every component that links
// to the policy page (CookieBanner, Footer, useLanguage's changeLang).
// ─────────────────────────────────────────────────────────────────────────────

import { SITE_ORIGIN, LANG_PATHS } from './urls'

export const POLICY_SLUGS = {
  en: 'legal-notice',
  fr: 'mentions-legales',
  es: 'aviso-legal',
}

export function policyPathFor(lang) {
  const prefix = LANG_PATHS[lang] || LANG_PATHS.en
  const slug = POLICY_SLUGS[lang] || POLICY_SLUGS.en
  return `${prefix}/${slug}`
}

export function policyUrlFor(lang) {
  return `${SITE_ORIGIN}${policyPathFor(lang)}`
}
