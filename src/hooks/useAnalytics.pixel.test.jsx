// Phase 3B: Meta Pixel branch of useAnalytics. GA4's consent gate/ID
// validation is covered in useAnalytics.test.jsx (Phase 3A); revocation/reload
// is covered in useAnalytics.revoke.test.jsx. Every test here passes
// ga4Id: undefined to keep the GA4 branch inert.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CONSENT_VERSION, setConsent } from '../lib/consent'

const STORAGE_KEY = 'dangel_consent'
const VALID_15_DIGIT_ID = '123456789012345' // exactly 15 digits
const VALID_16_DIGIT_ID = '1234567890123456' // exactly 16 digits

function seedConsent(value, overrides = {}) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ value, ts: Date.now(), version: CONSENT_VERSION, ...overrides }),
  )
}

function fbPixelScripts() {
  return document.querySelectorAll('script[src*="connect.facebook.net"]')
}

let consoleWarnSpy

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  // The fbq IIFE does
  // `s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(t, s)`
  // — it assumes at least one <script> already exists on the page (true in
  // production, where index.html always ships a module script) and throws
  // otherwise. Seed one here to emulate a real page. See the it.skip in this
  // file for what happens without it.
  const existingScript = document.createElement('script')
  document.head.appendChild(existingScript)
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  localStorage.clear()
  delete window.fbq
  delete window._fbq
  delete window.gtag
  delete window.dataLayer
  document.head.innerHTML = ''
  consoleWarnSpy.mockRestore()
})

describe('the gate', () => {
  it('injects nothing when there is no consent record, even with a valid 15-digit ID', async () => {
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeUndefined()
    expect(fbPixelScripts()).toHaveLength(0)
  })

  it('injects nothing when consent is declined', async () => {
    seedConsent('declined')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeUndefined()
    expect(fbPixelScripts()).toHaveLength(0)
  })

  it('injects fbq and a connect.facebook.net script when consent is accepted', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeTypeOf('function')
    expect(fbPixelScripts()).toHaveLength(1)
  })

  it('injects nothing when the consent record version is stale (below CONSENT_VERSION)', async () => {
    seedConsent('accepted', { version: 0 })
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeUndefined()
    expect(fbPixelScripts()).toHaveLength(0)
  })

  it('injects nothing when the consent record is older than 12 months', async () => {
    const THIRTEEN_MONTHS_MS = 13 * 30 * 24 * 60 * 60 * 1000
    seedConsent('accepted', { ts: Date.now() - THIRTEEN_MONTHS_MS })
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeUndefined()
    expect(fbPixelScripts()).toHaveLength(0)
  })
})

describe('ID validation', () => {
  it('injects nothing and does not throw when pixelId is undefined, even with consent accepted', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')

    expect(() => {
      renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: undefined }))
    }).not.toThrow()
    expect(window.fbq).toBeUndefined()
  })

  it.each(['1234567890123', '12345678901234567', '12345678901234a', 'abc'])(
    '%s is rejected by the Pixel ID regex — nothing injected, console.warn fires',
    async (malformedId) => {
      seedConsent('accepted')
      const { useAnalytics } = await import('../hooks/useAnalytics')
      renderHook(() => useAnalytics({ metaPixelId: malformedId, ga4Id: undefined }))

      expect(window.fbq).toBeUndefined()
      expect(consoleWarnSpy).toHaveBeenCalled()
    },
  )

  it('accepts a Pixel ID at the minimum regex boundary (exactly 15 digits)', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeTypeOf('function')
  })

  it('accepts a Pixel ID at the maximum regex boundary (exactly 16 digits)', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_16_DIGIT_ID, ga4Id: undefined }))

    expect(window.fbq).toBeTypeOf('function')
  })
})

describe('idempotency', () => {
  it('does not run fbq init a second time when a second consent-accepted change fires', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))

    expect(fbPixelScripts()).toHaveLength(1)

    act(() => {
      setConsent('accepted')
    })

    expect(fbPixelScripts()).toHaveLength(1)
  })
})

// Task 3 finding — not fixed, only documented. See the summary for full
// details: with no <script> element anywhere in the document, the fbq IIFE's
// `s = document.getElementsByTagName('script')[0]` returns undefined and the
// following `s.parentNode.insertBefore(t, s)` throws
// "TypeError: Cannot read properties of undefined (reading 'parentNode')".
// This is latent in production only because index.html always ships a module
// script tag, so document.getElementsByTagName('script') is never empty
// there. Verified empirically before writing this test; left skipped per
// instructions — do not unskip or "fix" this in useAnalytics.js.
it.skip('would throw when injecting into a document with no <script> element at all', async () => {
  document.head.innerHTML = ''
  seedConsent('accepted')
  const { useAnalytics } = await import('../hooks/useAnalytics')
  renderHook(() => useAnalytics({ metaPixelId: VALID_15_DIGIT_ID, ga4Id: undefined }))
})
