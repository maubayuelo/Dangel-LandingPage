import { describe, it, expect } from 'vitest'
import { SITE_ORIGIN, LANG_PATHS, LANG_PAGE_URIS, LANG_POLICY_URIS } from './urls'

const LANGS = Object.keys(LANG_PATHS)

describe('origin shape', () => {
  it('SITE_ORIGIN starts with https://', () => {
    expect(SITE_ORIGIN.startsWith('https://')).toBe(true)
  })

  it('SITE_ORIGIN does not end with a trailing slash, so SITE_ORIGIN + LANG_PATHS[lang] does not produce a double slash', () => {
    expect(SITE_ORIGIN.endsWith('/')).toBe(false)
  })
})

describe('language parity across the three maps', () => {
  it('LANG_PATHS, LANG_PAGE_URIS and LANG_POLICY_URIS all declare the same set of languages', () => {
    const sortedLangs = [...LANGS].sort()
    expect(Object.keys(LANG_PAGE_URIS).sort()).toEqual(sortedLangs)
    expect(Object.keys(LANG_POLICY_URIS).sort()).toEqual(sortedLangs)
  })
})

describe('public route shape (LANG_PATHS)', () => {
  it.each(LANGS)('%s: starts with /, does not end with /, and has no double slashes', (lang) => {
    const value = LANG_PATHS[lang]
    expect(value.startsWith('/')).toBe(true)
    expect(value.endsWith('/')).toBe(false)
    expect(value.includes('//')).toBe(false)
  })
})

describe('WordPress URI shape (LANG_PAGE_URIS and LANG_POLICY_URIS)', () => {
  const maps = { LANG_PAGE_URIS, LANG_POLICY_URIS }

  for (const [mapName, map] of Object.entries(maps)) {
    describe(mapName, () => {
      it.each(LANGS)('%s: starts and ends with /', (lang) => {
        const value = map[lang]
        expect(value.startsWith('/')).toBe(true)
        expect(value.endsWith('/')).toBe(true)
      })

      it('fr entries are prefixed with /fr/', () => {
        expect(map.fr.startsWith('/fr/')).toBe(true)
      })

      it('es entries are prefixed with /es/', () => {
        expect(map.es.startsWith('/es/')).toBe(true)
      })

      it('en entries are NOT prefixed with /en/ (English is unprefixed by WPML design)', () => {
        expect(map.en.startsWith('/en/')).toBe(false)
      })
    })
  }
})

describe('uniqueness within each map', () => {
  it.each(Object.entries({ LANG_PATHS, LANG_PAGE_URIS, LANG_POLICY_URIS }))(
    '%s has no two languages pointing at the same value',
    (_name, map) => {
      const values = Object.values(map)
      expect(new Set(values).size).toBe(values.length)
    },
  )
})

describe('architectural decision pin', () => {
  // Deliberate pin: English is served at /en, not the bare root, so that "/"
  // and "/en" never exist as two distinct URLs for the same content
  // (see the file-level comment in urls.js). This test should fail loudly
  // if that decision is ever silently reverted.
  it('LANG_PATHS.en is "/en", not "/" — English is never served at the bare root', () => {
    expect(LANG_PATHS.en).toBe('/en')
  })
})
