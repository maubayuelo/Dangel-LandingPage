// This suite covers only the no-op guard in trackEvent() (window.gtag missing
// or non-callable). Consent enforcement is tested against hooks/useAnalytics.js,
// not here — trackEvent deliberately does not know about consent.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackEvent } from './analytics'

afterEach(() => {
  delete window.gtag
})

describe('happy path', () => {
  it('calls window.gtag exactly once with ("event", name, params) when gtag is a function', () => {
    window.gtag = vi.fn()
    trackEvent('book_click', { cta_location: 'hero' })
    expect(window.gtag).toHaveBeenCalledTimes(1)
    expect(window.gtag).toHaveBeenCalledWith('event', 'book_click', { cta_location: 'hero' })
  })

  it('passes an empty object as the third argument when params is omitted, not undefined', () => {
    window.gtag = vi.fn()
    trackEvent('book_click')
    expect(window.gtag).toHaveBeenCalledWith('event', 'book_click', {})
  })

  it('does not mutate the params object passed in by the caller', () => {
    window.gtag = vi.fn()
    const params = { cta_location: 'hero' }
    const snapshot = { ...params }
    trackEvent('book_click', params)
    expect(params).toEqual(snapshot)
  })
})

describe('safety path — no-op guard', () => {
  it('does not throw when window.gtag is undefined', () => {
    delete window.gtag
    expect(() => trackEvent('book_click')).not.toThrow()
  })

  it('calls nothing when window.gtag is undefined', () => {
    delete window.gtag
    // The typeof check reads window.gtag exactly once. If the guard were
    // removed, trackEvent would go on to evaluate `window.gtag(...)`, which
    // reads the property a second time before attempting to call it — so a
    // second read is the signal that the guard was bypassed.
    let readCount = 0
    Object.defineProperty(window, 'gtag', {
      configurable: true,
      get() {
        readCount += 1
        return undefined
      },
    })
    trackEvent('book_click')
    expect(readCount).toBe(1)
    delete window.gtag
  })

  it('does not throw or invoke gtag when window.gtag is a non-function object', () => {
    window.gtag = { not: 'callable' }
    expect(() => trackEvent('book_click')).not.toThrow()
  })

  it('does not throw or invoke gtag when window.gtag is an array (partially-initialised GA snippet)', () => {
    window.gtag = []
    expect(() => trackEvent('book_click')).not.toThrow()
  })
})
