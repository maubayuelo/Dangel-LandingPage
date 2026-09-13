// Covers useDocumentHead's DOM output: canonical, hreflang, title/description
// fallback, OG/Twitter tags, and noindex. urls.js (SITE_ORIGIN/LANG_PATHS) is
// already covered by urls.test.js and is not re-tested here.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, cleanup } from '@testing-library/react'
import { useDocumentHead } from './useDocumentHead'
import { SITE_ORIGIN, LANG_PATHS } from '../lib/urls'

function clearHead() {
  document
    .querySelectorAll(
      'link[rel="canonical"], link[rel="alternate"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], meta[name="robots"]',
    )
    .forEach((el) => el.remove())
  document.documentElement.lang = ''
  document.title = ''
}

beforeEach(() => {
  clearHead()
})

afterEach(() => {
  cleanup()
  clearHead()
})

function renderHead(props) {
  return renderHook((p) => useDocumentHead(p), { initialProps: props })
}

describe('canonical link', () => {
  it.each(Object.keys(LANG_PATHS))(
    'sets href to SITE_ORIGIN + LANG_PATHS.%s when no path override is given',
    (lang) => {
      renderHead({ lang, seoTitle: 'T', seoDescription: 'D' })
      const canonical = document.head.querySelector('link[rel="canonical"]')
      expect(canonical).not.toBeNull()
      expect(canonical.getAttribute('href')).toBe(`${SITE_ORIGIN}${LANG_PATHS[lang]}`)
    },
  )

  it('reflects an explicit path override in the canonical href', () => {
    renderHead({ lang: 'en', path: '/en/legal-notice', seoTitle: 'T', seoDescription: 'D' })
    const canonical = document.head.querySelector('link[rel="canonical"]')
    expect(canonical.getAttribute('href')).toBe(`${SITE_ORIGIN}/en/legal-notice`)
  })

  it('renders exactly one canonical link after render', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1)
  })
})

describe('hreflang alternates', () => {
  it('renders all four alternates (en, fr, es, x-default) on every language render', () => {
    renderHead({ lang: 'fr', seoTitle: 'T', seoDescription: 'D' })
    for (const hreflang of ['en', 'fr', 'es', 'x-default']) {
      expect(document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)).not.toBeNull()
    }
  })

  it.each(['en', 'fr', 'es'])('%s alternate points to SITE_ORIGIN + LANG_PATHS.%s', (lang) => {
    renderHead({ lang: 'es', seoTitle: 'T', seoDescription: 'D' })
    const link = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)
    expect(link.getAttribute('href')).toBe(`${SITE_ORIGIN}${LANG_PATHS[lang]}`)
  })

  // Per the hook source, x-default is hardcoded to LANG_PATHS.en regardless of
  // the active language — confirmed by reading useDocumentHead.js, not assumed.
  it('x-default alternate points to LANG_PATHS.en regardless of the active language', () => {
    renderHead({ lang: 'fr', seoTitle: 'T', seoDescription: 'D' })
    const link = document.head.querySelector('link[rel="alternate"][hreflang="x-default"]')
    expect(link.getAttribute('href')).toBe(`${SITE_ORIGIN}${LANG_PATHS.en}`)
  })
})

describe('title and description', () => {
  it('uses seoTitle and seoDescription when provided', () => {
    renderHead({ lang: 'en', seoTitle: 'Custom Title', seoDescription: 'Custom Description' })
    expect(document.title).toBe('Custom Title')
    expect(document.head.querySelector('meta[name="description"]').getAttribute('content')).toBe(
      'Custom Description',
    )
  })

  // The hook's only implemented fallback is seoTitle/seoDescription -> a
  // hardcoded per-language constant -> the English constant. There is no
  // fgGlobal parameter on this hook (the header comment describing a 3-step
  // chain does not match the code); this test asserts the real 2-step chain.
  it('falls back to the per-language hardcoded title when seoTitle is empty', () => {
    renderHead({ lang: 'fr', seoTitle: '', seoDescription: '' })
    expect(document.title).toBe('Dangel — Thérapeute Holistique & Intuitive | Montréal')
  })

  it('falls back to the per-language hardcoded description when seoDescription is empty', () => {
    renderHead({ lang: 'es', seoTitle: '', seoDescription: '' })
    const description = document.head.querySelector('meta[name="description"]').getAttribute('content')
    expect(description).toContain('Cuidados holísticos certificados en Montreal')
  })

  it('falls back to the English hardcoded title for an unrecognized lang', () => {
    renderHead({ lang: 'xx', seoTitle: '', seoDescription: '' })
    expect(document.title).toBe('Dangel — Holistic & Intuitive Therapist | Montreal')
  })
})

describe('Open Graph and Twitter Card tags', () => {
  it('sets og:type to website', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    expect(document.head.querySelector('meta[property="og:type"]').getAttribute('content')).toBe('website')
  })

  it('sets og:title, og:description, og:locale and og:url from title/description/lang/path', () => {
    renderHead({ lang: 'fr', seoTitle: 'T', seoDescription: 'D' })
    const head = document.head
    expect(head.querySelector('meta[property="og:title"]').getAttribute('content')).toBe('T')
    expect(head.querySelector('meta[property="og:description"]').getAttribute('content')).toBe('D')
    expect(head.querySelector('meta[property="og:locale"]').getAttribute('content')).toBe('fr_CA')
    expect(head.querySelector('meta[property="og:url"]').getAttribute('content')).toBe(
      `${SITE_ORIGIN}${LANG_PATHS.fr}`,
    )
  })

  it('sets og:image and twitter:image from ogImage when provided', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D', ogImage: 'https://example.com/img.jpg' })
    expect(document.head.querySelector('meta[property="og:image"]').getAttribute('content')).toBe(
      'https://example.com/img.jpg',
    )
    expect(document.head.querySelector('meta[name="twitter:image"]').getAttribute('content')).toBe(
      'https://example.com/img.jpg',
    )
  })

  it('does not create og:image/twitter:image tags when ogImage is not provided', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull()
    expect(document.head.querySelector('meta[name="twitter:image"]')).toBeNull()
  })

  it('sets twitter:card, twitter:title and twitter:description following title/description', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    const head = document.head
    expect(head.querySelector('meta[name="twitter:card"]').getAttribute('content')).toBe('summary_large_image')
    expect(head.querySelector('meta[name="twitter:title"]').getAttribute('content')).toBe('T')
    expect(head.querySelector('meta[name="twitter:description"]').getAttribute('content')).toBe('D')
  })
})

describe('robots noindex', () => {
  it('adds meta robots noindex when noindex is true', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D', noindex: true })
    expect(document.head.querySelector('meta[name="robots"]').getAttribute('content')).toBe('noindex')
  })

  it('does not render meta robots when noindex is false/absent', () => {
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })

  it('removes an existing meta robots tag when noindex flips from true to false on rerender', () => {
    const { rerender } = renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D', noindex: true })
    expect(document.head.querySelector('meta[name="robots"]')).not.toBeNull()
    rerender({ lang: 'en', seoTitle: 'T', seoDescription: 'D', noindex: false })
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})

describe('idempotency across re-renders', () => {
  it('starts from a clean head so a tag leak would fail this test rather than pass silently', () => {
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(0)
    expect(document.head.querySelectorAll('link[rel="alternate"]').length).toBe(0)
    renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1)
  })

  it('updates canonical and hreflang tags in place instead of duplicating them when lang changes', () => {
    const { rerender } = renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    rerender({ lang: 'fr', seoTitle: 'T2', seoDescription: 'D2' })

    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1)
    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      `${SITE_ORIGIN}${LANG_PATHS.fr}`,
    )

    for (const hreflang of ['en', 'fr', 'es', 'x-default']) {
      expect(document.head.querySelectorAll(`link[rel="alternate"][hreflang="${hreflang}"]`).length).toBe(1)
    }
  })

  it('updates document.documentElement.lang when lang changes', () => {
    const { rerender } = renderHead({ lang: 'en', seoTitle: 'T', seoDescription: 'D' })
    expect(document.documentElement.lang).toBe('en')
    rerender({ lang: 'fr', seoTitle: 'T', seoDescription: 'D' })
    expect(document.documentElement.lang).toBe('fr')
  })
})
