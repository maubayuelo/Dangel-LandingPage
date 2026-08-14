// ─────────────────────────────────────────────────────────────────────────────
// STEP 7a — hooks/useLanguage.js — CUSTOM HOOK: LANGUAGE DETECTION & PERSISTENCE
//
// WHAT IS A CUSTOM HOOK?
// A custom hook is just a JavaScript function whose name starts with "use".
// It can call built-in React hooks (useState, useEffect, etc.) internally.
// The naming convention lets React enforce the Rules of Hooks on it.
// Custom hooks are how you extract and reuse stateful logic between components.
//
// This hook answers: "what language should the site display right now?"
// It checks three sources in priority order:
//   1. URL path  (e.g. /fr → French)   ← highest priority, used for ad campaigns
//   2. localStorage (last user choice)
//   3. Fallback: 'en'
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { LANG_PATHS } from '../lib/urls'
import { getView, navigate as goToPath } from '../lib/router'
import { policyPathFor } from '../lib/routes'

// Array of valid language codes. Used to validate input and prevent
// localStorage poisoning with unexpected values.
const SUPPORTED = ['en', 'fr', 'es']

// The key used in localStorage. Storing as a constant avoids typos.
const STORAGE_KEY = 'dangel_lang'

// ── Helper: read language from the URL path ──────────────────────────────────
// Only the FIRST path segment is ever a language code — everything after it
// (e.g. "mentions-legales" in /fr/mentions-legales)
// is route content, not language, and must never be mistaken for one.
// "/" → [] → null. "/fr" or "/fr/" → 'fr'. "/es/aviso-legal" → 'es'.
function getLangFromPath() {
  const first = window.location.pathname.split('/').filter(Boolean)[0]
  return SUPPORTED.includes(first) ? first : null
}

// ── Helper: determine the initial language on first render ───────────────────
// This function runs ONCE when the hook is first called.
// Passing a function to useState (not a value) is called "lazy initialization"
// — React calls it only on the first render, not on every re-render.
function getInitialLang() {
  // Priority 1: URL path — allows Meta Ads to link directly to a specific language
  // e.g. dangelwellness.ca/fr goes straight to French without the user choosing
  const pathLang = getLangFromPath()
  if (pathLang) return pathLang

  // Priority 2: localStorage — remembers what the user chose last visit
  // localStorage is synchronous browser storage that persists across sessions.
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED.includes(stored)) return stored

  // Priority 3: default language
  return 'en'
}

// ── The custom hook ──────────────────────────────────────────────────────────
// Exported as a named export — imported as: import { useLanguage } from './hooks/useLanguage'
export function useLanguage() {

  // useState with a function (not a value) = lazy initialization.
  // getInitialLang runs once; subsequent re-renders skip it entirely.
  const [lang, setLang] = useState(getInitialLang)

  // ── changeLang: called when user clicks EN / FR / ES in the nav ─────────────
  const changeLang = (newLang) => {
    // Guard: ignore invalid language codes (defensive programming)
    if (!SUPPORTED.includes(newLang)) return

    // Translate the URL, not just the language: if we're on the policy page,
    // switching language must land on that page's translation
    // (/fr/mentions-legales → /es/aviso-legal),
    // not bounce back to the home page. router.navigate() also fires
    // 'dangel:routechange', so useRoute() re-evaluates the view immediately.
    const targetPath = getView() === 'policy' ? policyPathFor(newLang) : LANG_PATHS[newLang]
    goToPath(targetPath)

    // Persist choice to localStorage so the next visit starts in this language
    localStorage.setItem(STORAGE_KEY, newLang)

    // Update React state → triggers re-render → App re-runs useQuery with new
    // pageId → WordPress returns the translated page content
    setLang(newLang)
  }

  // ── Normalize "/" to an explicit language prefix ─────────────────────────────
  // "/" itself is never the canonical URL for any language (see lib/urls.js).
  // A visitor landing on the bare root gets bounced to /en, /fr, or /es —
  // whichever getInitialLang() already resolved above — using replaceState so
  // this doesn't add a history entry (Back button keeps working normally) and
  // doesn't reload the page. A crawler with no localStorage always lands on
  // /en here, which matches the x-default hreflang.
  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', LANG_PATHS[lang])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount, using the initial lang resolved by getInitialLang()

  // ── Sync on browser back/forward navigation ──────────────────────────────────
  // Problem: history.pushState changes the URL, but pressing browser Back/Forward
  // fires a "popstate" event — we must listen for it and sync our React state.
  //
  // useEffect with [] (empty array) = run once after first render, like
  // componentDidMount in class components.
  useEffect(() => {
    const onPop = () => {
      const pathLang = getLangFromPath()
      if (pathLang) setLang(pathLang)
    }

    // addEventListener registers the handler
    window.addEventListener('popstate', onPop)

    // The RETURN function is the "cleanup" — React calls it before the component
    // unmounts or before the effect runs again. Always remove event listeners
    // in cleanup to prevent memory leaks.
    return () => window.removeEventListener('popstate', onPop)
  }, []) // [] = no dependencies, run once only

  // Return the values consumers need. Any component calling useLanguage()
  // gets lang (current code) and changeLang (function to switch).
  return { lang, changeLang, supported: SUPPORTED }
}
