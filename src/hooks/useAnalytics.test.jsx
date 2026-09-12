// Phase 3A: GA4 branch of useAnalytics only. Meta Pixel, consent revocation,
// and window.location.reload behaviour are out of scope (Phase 3B) — every
// test here passes metaPixelId: undefined to keep that branch inert.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CONSENT_VERSION, setConsent } from '../lib/consent'

const STORAGE_KEY = 'dangel_consent'
const VALID_GA4_ID = 'G-TESTID123' // 9 chars after "G-": within the 6–12 bound
const SIX_CHAR_ID = 'G-A1B2C3' // exactly 6 chars after "G-"
const TWELVE_CHAR_ID = 'G-A1B2C3D4E5F6' // exactly 12 chars after "G-"

function seedConsent(value, overrides = {}) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ value, ts: Date.now(), version: CONSENT_VERSION, ...overrides }),
  )
}

function clearInjectedDom() {
  document.getElementById('ga4-script')?.remove()
  document.getElementById('ga4-init')?.remove()
}

let consoleWarnSpy

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  clearInjectedDom()
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  localStorage.clear()
  delete window.gtag
  delete window.dataLayer
  clearInjectedDom()
  consoleWarnSpy.mockRestore()
})

describe('the Loi 25 gate', () => {
  it('starts with a clean document and injects nothing when no consent record exists', async () => {
    // Guards against state leaking from a previous test showing up as a false pass.
    expect(document.getElementById('ga4-script')).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.getElementById('ga4-script')).toBeNull()
    expect(window.gtag).toBeUndefined()
  })

  it('injects nothing when consent is declined', async () => {
    seedConsent('declined')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.getElementById('ga4-script')).toBeNull()
  })

  it('injects ga4-script (with the GA4 ID in its src) and ga4-init when consent is accepted', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    const script = document.getElementById('ga4-script')
    expect(script).not.toBeNull()
    expect(script.src).toContain(VALID_GA4_ID)
    expect(document.getElementById('ga4-init')).not.toBeNull()
  })

  it('injects nothing when the consent record version is stale (below CONSENT_VERSION)', async () => {
    seedConsent('accepted', { version: 0 })
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.getElementById('ga4-script')).toBeNull()
  })

  it('injects nothing when the consent record is older than 12 months', async () => {
    const THIRTEEN_MONTHS_MS = 13 * 30 * 24 * 60 * 60 * 1000
    seedConsent('accepted', { ts: Date.now() - THIRTEEN_MONTHS_MS })
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.getElementById('ga4-script')).toBeNull()
  })

  it('injects nothing and does not throw when localStorage holds invalid JSON', async () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{')
    const { useAnalytics } = await import('../hooks/useAnalytics')

    expect(() => {
      renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))
    }).not.toThrow()
    expect(document.getElementById('ga4-script')).toBeNull()
  })
})

describe('consent arriving after mount', () => {
  it('injects ga4-script only at the moment consent is accepted, not before', async () => {
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.getElementById('ga4-script')).toBeNull()

    act(() => {
      setConsent('accepted')
    })

    expect(document.getElementById('ga4-script')).not.toBeNull()
  })
})

describe('ID validation', () => {
  it('injects nothing and does not throw when ga4Id is undefined, even with consent accepted', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')

    expect(() => {
      renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: undefined }))
    }).not.toThrow()
    expect(document.getElementById('ga4-script')).toBeNull()
  })

  it.each(['UA-123456', 'G-abc', 'G-', 'GA4-ABC123'])(
    '%s is rejected by the GA4 ID regex — nothing injected, console.warn fires',
    async (malformedId) => {
      seedConsent('accepted')
      const { useAnalytics } = await import('../hooks/useAnalytics')
      renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: malformedId }))

      expect(document.getElementById('ga4-script')).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalled()
    },
  )

  it('accepts a GA4 ID at the minimum regex boundary (6 chars after G-)', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: SIX_CHAR_ID }))

    const script = document.getElementById('ga4-script')
    expect(script).not.toBeNull()
    expect(script.src).toContain(SIX_CHAR_ID)
  })

  it('accepts a GA4 ID at the maximum regex boundary (12 chars after G-)', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: TWELVE_CHAR_ID }))

    const script = document.getElementById('ga4-script')
    expect(script).not.toBeNull()
    expect(script.src).toContain(TWELVE_CHAR_ID)
  })
})

describe('idempotency and teardown', () => {
  it('keeps exactly one #ga4-script node after a second consent-accepted change fires', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.querySelectorAll('#ga4-script')).toHaveLength(1)

    act(() => {
      setConsent('accepted')
    })

    expect(document.querySelectorAll('#ga4-script')).toHaveLength(1)
  })

  it('stops reacting to consent changes after unmount, proving the unsubscribe is used', async () => {
    const { useAnalytics } = await import('../hooks/useAnalytics')
    const { unmount } = renderHook(() => useAnalytics({ metaPixelId: undefined, ga4Id: VALID_GA4_ID }))

    expect(document.getElementById('ga4-script')).toBeNull()

    unmount()

    act(() => {
      setConsent('accepted')
    })

    expect(document.getElementById('ga4-script')).toBeNull()
  })
})
