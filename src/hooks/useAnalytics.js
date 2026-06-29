// ─────────────────────────────────────────────────────────────────────────────
// STEP 7b — hooks/useAnalytics.js — CUSTOM HOOK: META PIXEL + GOOGLE ANALYTICS 4
//
// WHY USE A HOOK FOR ANALYTICS?
// Analytics scripts need to be injected into the <head> dynamically — after
// React renders — and only once per page load. useEffect is the right tool:
// it runs after rendering and can be guarded to run only once.
//
// ARCHITECTURE:
// - useMetaPixel(pixelId) handles Facebook/Instagram ad tracking
// - useGa4(ga4Id) handles Google Analytics 4 tracking
// - useAnalytics({ metaPixelId, ga4Id }) is the public API — called from App.jsx
//
// CURRENT STATE: Both hooks are inert (do nothing) because the IDs passed from
// WordPress are empty strings. Fill them in WP Admin → Pages → Home → Global
// Settings to activate. GA4 is ALSO loaded statically in index.html as a
// backup — whichever loads first wins.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'

// ── Meta Pixel (Facebook / Instagram Ads) ────────────────────────────────────
// Injects the official Facebook pixel snippet only when a real ID is provided.
function useMetaPixel(pixelId) {
  useEffect(() => {
    // Early return pattern: if no ID, do nothing. This is how the hook stays
    // "inert" — calling it with an empty string has zero side effects.
    if (!pixelId) return

    // Idempotency guard: don't inject the script twice if the component
    // re-renders. window.fbq is set by the script below.
    if (window.fbq) return

    // The block below is Meta's official pixel bootstrap snippet — minified JS
    // that creates window.fbq (the tracking function) before the actual
    // pixel script loads asynchronously. This pattern lets you call fbq()
    // immediately even before the network request finishes.
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
      t = b.createElement(e)    // creates a <script> element
      t.async = !0               // async = doesn't block rendering
      t.src = v                  // URL of the pixel library
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)  // injects before the first <script> tag
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    /* eslint-enable */

    // Initialize the pixel with our ID and track the initial page view
    window.fbq('init', pixelId)
    window.fbq('track', 'PageView')

  }, [pixelId]) // re-run if the pixelId ever changes (e.g. language switch)
}

// ── Google Analytics 4 ───────────────────────────────────────────────────────
// Dynamically injects the gtag.js script when a GA4 measurement ID is provided.
// GA4 IDs follow the format: G-XXXXXXXXXX
function useGa4(ga4Id) {
  useEffect(() => {
    // Inert guard: empty string = do nothing
    if (!ga4Id) return

    // Idempotency guard: check for a script tag we'll add below with id="ga4-script"
    if (document.getElementById('ga4-script')) return

    // Create and inject the GA4 loader script (<script async src="gtag/js?id=...">)
    const scriptSrc = document.createElement('script')
    scriptSrc.id = 'ga4-script'
    scriptSrc.async = true
    scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
    document.head.appendChild(scriptSrc)

    // Create and inject the gtag() initialization inline script.
    // Template literal (backtick string) lets us embed ga4Id directly in the JS code.
    const scriptInit = document.createElement('script')
    scriptInit.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ga4Id}');
    `
    document.head.appendChild(scriptInit)

  }, [ga4Id])
}

// ── Public API ────────────────────────────────────────────────────────────────
// This is the only function App.jsx imports. It accepts an object with both IDs
// and delegates to the two private hooks above.
// Destructuring in the parameter: { metaPixelId, ga4Id } pulls values from
// the object passed in — equivalent to (options) => { options.metaPixelId ... }
export function useAnalytics({ metaPixelId, ga4Id }) {
  useMetaPixel(metaPixelId)
  useGa4(ga4Id)
}
