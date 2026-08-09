// ─────────────────────────────────────────────────────────────────────────────
// lib/router.js — MINIMAL ROUTER, NO REACT-ROUTER
//
// The app only has two views: 'home' (the landing page) and 'policy' (the
// privacy policy page, one WordPress page per language — see routes.js).
// The view is derived from the path's second segment, since the first
// segment is always the language code (see useLanguage.js).
//
// Same subscribe-by-CustomEvent pattern as lib/consent.js: navigate() fires
// both a pushState and a 'dangel:routechange' event, so subscribeRoute()
// callbacks (native `popstate` for Back/Forward, plus this custom event for
// same-tab pushState navigation) both land through one function.
// ─────────────────────────────────────────────────────────────────────────────

import { POLICY_SLUGS } from './routes'

export function getView() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const second = segments[1]
  return second && Object.values(POLICY_SLUGS).includes(second) ? 'policy' : 'home'
}

export function navigate(path) {
  if (window.location.pathname === path) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new CustomEvent('dangel:routechange'))
}

export function subscribeRoute(callback) {
  const onChange = () => callback()
  window.addEventListener('popstate', onChange)
  window.addEventListener('dangel:routechange', onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener('dangel:routechange', onChange)
  }
}
