// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { trackEvent } from './analytics'

describe('trackEvent under a non-browser environment', () => {
  it('does not throw when window is undefined', () => {
    expect(typeof window).toBe('undefined')
    expect(() => trackEvent('x')).not.toThrow()
  })
})
