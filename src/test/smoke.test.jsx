import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LANG_PATHS } from '../lib/urls'

describe('smoke', () => {
  it('resolves LANG_PATHS for en/fr/es', () => {
    expect(LANG_PATHS.en).toBe('/en')
    expect(LANG_PATHS.fr).toBe('/fr')
    expect(LANG_PATHS.es).toBe('/es')
  })

  it('renders into jsdom with jest-dom matchers', () => {
    render(<p>hello</p>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})
