// ─────────────────────────────────────────────────────────────────────────────
// hooks/useAnalytics.js — CUSTOM HOOK: META PIXEL + GOOGLE ANALYTICS 4
//
// Loi 25 hard-gate: neither script fires a single network request until
// getConsent() === 'accepted'. No lazy-load, no timeout fallback — consent
// is the only valid trigger. See src/lib/consent.js for the source of truth.
//
// ARCHITECTURE:
// - useMetaPixel(pixelId) handles Facebook/Instagram ad tracking
// - useGa4(ga4Id) handles Google Analytics 4 tracking
// - useAnalytics({ metaPixelId, ga4Id }) is the public API — called from App.tsx
//
// Both IDs come from WordPress ACF (fg_global) with NO hardcoded fallback:
// a missing or malformed ID means the script simply never loads.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import { getConsent, subscribeConsent } from '../lib/consent'

const PIXEL_ID_RE = /^\d{15,16}$/
const GA4_ID_RE = /^G-[A-Z0-9]{6,12}$/

// Consent was revoked (or cleared) after a script had already been injected
// in this session. We can't reliably "uninject" a third-party tracker, so we
// reload the page once to guarantee a clean document with nothing loaded.
let reloadTriggered = false
function reloadOnceOnRevoke() {
  if (reloadTriggered) return
  reloadTriggered = true
  window.location.reload()
}

// ── Meta Pixel (Facebook / Instagram Ads) ────────────────────────────────────
function useMetaPixel(pixelId) {
  useEffect(() => {
    if (!pixelId) {
      if (import.meta.env.DEV) console.warn('[useAnalytics] Meta Pixel ID missing (fg_global.globalMetaPixelId) — skipping injection')
      return
    }

    if (!PIXEL_ID_RE.test(pixelId)) {
      console.warn('[useAnalytics] Meta Pixel ID has an invalid format — skipping injection:', pixelId)
      return
    }

    function inject() {
      if (window.fbq) return

      /* eslint-disable */
      ;(function (f, b, e, v, n, t, s) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
      /* eslint-enable */

      window.fbq('init', pixelId)
      window.fbq('track', 'PageView')
    }

    function evaluate() {
      if (getConsent() === 'accepted') {
        inject()
      } else if (window.fbq) {
        // Already injected earlier this session, consent just got revoked.
        reloadOnceOnRevoke()
      }
    }

    evaluate()
    return subscribeConsent(evaluate)
  }, [pixelId])
}

// ── Google Analytics 4 ───────────────────────────────────────────────────────
function useGa4(ga4Id) {
  useEffect(() => {
    if (!ga4Id) {
      if (import.meta.env.DEV) console.warn('[useAnalytics] GA4 ID missing (fg_global.globalGa4Id) — skipping injection')
      return
    }

    if (!GA4_ID_RE.test(ga4Id)) {
      console.warn('[useAnalytics] GA4 ID has an invalid format — skipping injection:', ga4Id)
      return
    }

    function inject() {
      if (window.gtag || document.getElementById('ga4-script')) return

      const scriptSrc = document.createElement('script')
      scriptSrc.id = 'ga4-script'
      scriptSrc.async = true
      scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
      document.head.appendChild(scriptSrc)

      const scriptInit = document.createElement('script')
      scriptInit.id = 'ga4-init'
      scriptInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${ga4Id}');
      `
      document.head.appendChild(scriptInit)
    }

    function evaluate() {
      if (getConsent() === 'accepted') {
        inject()
      } else if (window.gtag || document.getElementById('ga4-script')) {
        reloadOnceOnRevoke()
      }
    }

    evaluate()
    return subscribeConsent(evaluate)
  }, [ga4Id])
}

// ── Public API ────────────────────────────────────────────────────────────────
export function useAnalytics({ metaPixelId, ga4Id }) {
  useMetaPixel(metaPixelId)
  useGa4(ga4Id)
}
