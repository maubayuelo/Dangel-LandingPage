import { useEffect } from 'react'

/* ── Meta Pixel ──────────────────────────────────────────────
   Injects fbq only when globalMetaPixelId is non-empty.
   Currently inert — ID will be provided at launch.
   ─────────────────────────────────────────────────────────── */
function useMetaPixel(pixelId) {
  useEffect(() => {
    if (!pixelId) return
    if (window.fbq) return // already injected

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
  }, [pixelId])
}

/* ── Google Analytics 4 ──────────────────────────────────────
   Injects gtag only when globalGa4Id is non-empty.
   Currently inert — ID will be provided at launch.
   ─────────────────────────────────────────────────────────── */
function useGa4(ga4Id) {
  useEffect(() => {
    if (!ga4Id) return
    if (document.getElementById('ga4-script')) return // already injected

    const scriptSrc = document.createElement('script')
    scriptSrc.id = 'ga4-script'
    scriptSrc.async = true
    scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`
    document.head.appendChild(scriptSrc)

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

export function useAnalytics({ metaPixelId, ga4Id }) {
  useMetaPixel(metaPixelId)
  useGa4(ga4Id)
}
