// Phase 3B: consent revocation / reload-once path in useAnalytics, shared by
// useMetaPixel and useGa4 via the module-level `reloadTriggered` flag. GA4's
// consent gate/ID validation is covered in useAnalytics.test.jsx; Meta Pixel's
// gate/ID validation is covered in useAnalytics.pixel.test.jsx.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CONSENT_VERSION, setConsent, clearConsent } from '../lib/consent'

const STORAGE_KEY = 'dangel_consent'
const VALID_PIXEL_ID = '123456789012345' // exactly 15 digits
const VALID_GA4_ID = 'G-TESTID123'

function seedConsent(value, overrides = {}) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ value, ts: Date.now(), version: CONSENT_VERSION, ...overrides }),
  )
}

let reloadSpy

beforeEach(() => {
  vi.resetModules()
  localStorage.clear()
  // reloadTriggered is module-level state in useAnalytics.js, shared across
  // useMetaPixel and useGa4 for the lifetime of the module. Without
  // vi.resetModules() + a dynamic import per test, the flag set to `true` by
  // one test's revoke would silently make every later revoke test in this
  // file pass without a reload ever being attempted.
  const existingScript = document.createElement('script')
  document.head.appendChild(existingScript)
  reloadSpy = vi.fn()
  vi.stubGlobal('location', { ...window.location, reload: reloadSpy })
})

afterEach(() => {
  localStorage.clear()
  delete window.fbq
  delete window._fbq
  delete window.gtag
  delete window.dataLayer
  document.head.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('revocation triggers exactly one reload', () => {
  it('reloads once after fbq was injected and consent is cleared', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_PIXEL_ID, ga4Id: undefined }))

    expect(window.fbq).toBeTypeOf('function')

    act(() => {
      clearConsent()
    })

    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })

  it('reloads exactly once total even if clearConsent fires twice (pins the reloadTriggered guard)', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_PIXEL_ID, ga4Id: undefined }))

    act(() => {
      clearConsent()
    })
    act(() => {
      clearConsent()
    })

    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })

  it('reloads exactly once total when both a Pixel and a GA4 tracker were injected, not once per tracker', async () => {
    // reloadTriggered is shared module state between useMetaPixel and useGa4
    // (see the comment on reloadOnceOnRevoke in useAnalytics.js) — each
    // tracker's evaluate() would independently want to reload on revoke, but
    // the flag ensures only the first one to run actually calls reload().
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_PIXEL_ID, ga4Id: VALID_GA4_ID }))

    expect(window.fbq).toBeTypeOf('function')
    expect(document.getElementById('ga4-script')).not.toBeNull()

    act(() => {
      clearConsent()
    })

    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })
})

describe('revocation without prior injection is a no-op', () => {
  it('does not reload when consent is declined and nothing was ever accepted', async () => {
    const { useAnalytics } = await import('../hooks/useAnalytics')
    renderHook(() => useAnalytics({ metaPixelId: VALID_PIXEL_ID, ga4Id: VALID_GA4_ID }))

    expect(window.fbq).toBeUndefined()
    expect(document.getElementById('ga4-script')).toBeNull()

    act(() => {
      setConsent('declined')
    })

    expect(reloadSpy).not.toHaveBeenCalled()
  })
})

describe('teardown', () => {
  it('does not reload after unmount, proving the unsubscribe is used', async () => {
    seedConsent('accepted')
    const { useAnalytics } = await import('../hooks/useAnalytics')
    const { unmount } = renderHook(() => useAnalytics({ metaPixelId: VALID_PIXEL_ID, ga4Id: undefined }))

    expect(window.fbq).toBeTypeOf('function')

    unmount()

    act(() => {
      clearConsent()
    })

    expect(reloadSpy).not.toHaveBeenCalled()
  })
})
