import { useState, useEffect } from 'react'

const SUPPORTED = ['en', 'fr', 'es']
const STORAGE_KEY = 'dangel_lang'

function getLangFromPath() {
  const segment = window.location.pathname.split('/').find(s => SUPPORTED.includes(s))
  return segment || null
}

function getInitialLang() {
  // 1. Path segment has highest priority — supports Meta Ads campaigns per language
  const pathLang = getLangFromPath()
  if (pathLang) return pathLang

  // 2. Last persisted choice
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED.includes(stored)) return stored

  // 3. Default
  return 'en'
}

export function useLanguage() {
  const [lang, setLang] = useState(getInitialLang)

  const changeLang = (newLang) => {
    if (!SUPPORTED.includes(newLang)) return

    window.history.pushState({}, '', `/${newLang}`)
    localStorage.setItem(STORAGE_KEY, newLang)
    setLang(newLang)
  }

  // Sync when user navigates with browser back/forward
  useEffect(() => {
    const onPop = () => {
      const pathLang = getLangFromPath()
      if (pathLang) setLang(pathLang)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { lang, changeLang, supported: SUPPORTED }
}
