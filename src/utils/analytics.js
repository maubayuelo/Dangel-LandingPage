// ─────────────────────────────────────────────────────────────────────────────
// utils/analytics.js — GA4 CUSTOM EVENT HELPER
//
// Thin wrapper around window.gtag('event', …). It is deliberately dumb:
// it does NOT load gtag and does NOT check consent itself. That is already
// handled upstream by hooks/useAnalytics.js, which only injects gtag once
// getConsent() === 'accepted' (Loi 25). Until then window.gtag is undefined,
// so the typeof guard below means events simply no-op when consent was not
// given. Never call window.gtag directly from components — use this.
// ─────────────────────────────────────────────────────────────────────────────

export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}
