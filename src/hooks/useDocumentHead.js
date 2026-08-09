// ─────────────────────────────────────────────────────────────────────────────
// hooks/useDocumentHead.js — CUSTOM HOOK: MULTILINGUAL <head> MANAGEMENT
//
// Centralizes every SEO-relevant <head> mutation in one place: document.title,
// meta description, Open Graph, Twitter Card, documentElement.lang, canonical,
// and hreflang alternates. Runs on every (lang, seoTitle, seoDescription,
// ogImage) change and is idempotent — updates existing tags in place instead
// of appending duplicates when the language changes without a page reload.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { SITE_ORIGIN, LANG_PATHS } from '../lib/urls'

const OG_LOCALES = { en: 'en_CA', fr: 'fr_CA', es: 'es_ES' }

// Hardcoded last-resort fallback — used only when both fgNavigation.seoTitle
// and fgGlobal.globalSeoTitle are empty. document.title must never be blank
// or left at Vite's default "Vite + React".
const FALLBACK_TITLE = {
  en: 'Dangel — Holistic & Intuitive Therapist | Montreal',
  fr: 'Dangel — Thérapeute Holistique & Intuitive | Montréal',
  es: 'Dangel — Terapeuta Holística e Intuitiva | Montreal',
}

const FALLBACK_DESCRIPTION = {
  en: 'Certified holistic care in Montreal: Reiki, Shiatsu, NLP, Psychosomatic Therapy, Mayan Life Path. In person and online. Book your session.',
  fr: "Soins holistiques certifiés à Montréal : Reiki, Shiatsu, PNL, Thérapie Psychosomatique, Chemin de vie Kin Maya. En personne et en ligne. Réservez votre séance.",
  es: 'Cuidados holísticos certificados en Montreal: Reiki, Shiatsu, PNL, Terapia Psicosomática, Camino de Vida Maya. En persona y en línea. Reserva tu sesión.',
}

// Idempotent upsert: updates the attribute if the element exists, creates it
// (with the given tag + attrs) if it doesn't. Avoids duplicating tags when
// this effect re-runs on a language switch without a full page reload.
function upsertMeta(selector, tag, attrs, content, contentAttr = 'content') {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  el.setAttribute(contentAttr, content)
}

function upsertLink(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
}

export function useDocumentHead({ lang, seoTitle, seoDescription, ogImage, path: pathOverride, noindex = false }) {
  useEffect(() => {
    // ── Title & description, with fallback chain ────────────────────────────
    // 1. fgNavigation (per-language, from the migration)
    // 2. fgGlobal (legacy, identical across languages)
    // TODO: eliminar tras verificar migración SEO — quitar fgGlobal del
    // fallback (paso 3 de la cadena) una vez confirmado en producción.
    // 3. Hardcoded constant per language
    const title = seoTitle || FALLBACK_TITLE[lang] || FALLBACK_TITLE.en
    const description = seoDescription || FALLBACK_DESCRIPTION[lang] || FALLBACK_DESCRIPTION.en

    document.title = title
    upsertMeta('meta[name="description"]', 'meta', { name: 'description' }, description)

    // ── Open Graph ───────────────────────────────────────────────────────────
    upsertMeta('meta[property="og:type"]', 'meta', { property: 'og:type' }, 'website')
    upsertMeta('meta[property="og:title"]', 'meta', { property: 'og:title' }, title)
    upsertMeta('meta[property="og:description"]', 'meta', { property: 'og:description' }, description)
    upsertMeta('meta[property="og:locale"]', 'meta', { property: 'og:locale' }, OG_LOCALES[lang] || OG_LOCALES.en)

    // path defaults to the home URL for the active language; overridden by
    // callers on non-home views (e.g. the policy page) so canonical/og:url
    // reflect the URL actually being served, not always the homepage.
    const path = pathOverride || LANG_PATHS[lang] || LANG_PATHS.en
    upsertMeta('meta[property="og:url"]', 'meta', { property: 'og:url' }, `${SITE_ORIGIN}${path}`)

    if (ogImage) {
      upsertMeta('meta[property="og:image"]', 'meta', { property: 'og:image' }, ogImage)
      upsertMeta('meta[name="twitter:image"]', 'meta', { name: 'twitter:image' }, ogImage)
    }

    // ── Twitter Card ─────────────────────────────────────────────────────────
    upsertMeta('meta[name="twitter:card"]', 'meta', { name: 'twitter:card' }, 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', 'meta', { name: 'twitter:title' }, title)
    upsertMeta('meta[name="twitter:description"]', 'meta', { name: 'twitter:description' }, description)

    // ── <html lang> — direct signal to search engines and screen readers ────
    document.documentElement.lang = lang

    // ── Canonical + hreflang ─────────────────────────────────────────────────
    // Canonical follows the active language. The four alternates are always
    // emitted, identically, on all three language versions of the page.
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: `${SITE_ORIGIN}${path}` })
    upsertLink('link[rel="alternate"][hreflang="en"]', { rel: 'alternate', hreflang: 'en', href: `${SITE_ORIGIN}${LANG_PATHS.en}` })
    upsertLink('link[rel="alternate"][hreflang="fr"]', { rel: 'alternate', hreflang: 'fr', href: `${SITE_ORIGIN}${LANG_PATHS.fr}` })
    upsertLink('link[rel="alternate"][hreflang="es"]', { rel: 'alternate', hreflang: 'es', href: `${SITE_ORIGIN}${LANG_PATHS.es}` })
    upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: `${SITE_ORIGIN}${LANG_PATHS.en}` })

    // ── robots — the policy page shouldn't compete for search ranking ───────
    if (noindex) {
      upsertMeta('meta[name="robots"]', 'meta', { name: 'robots' }, 'noindex')
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }
  }, [lang, seoTitle, seoDescription, ogImage, pathOverride, noindex])
}
