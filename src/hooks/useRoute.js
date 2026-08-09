// ─────────────────────────────────────────────────────────────────────────────
// hooks/useRoute.js — REACT BINDING FOR lib/router.js
//
// Returns the current view ('home' | 'policy') and re-renders on navigation
// — same-tab pushState (via router.navigate) or Back/Forward (popstate).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { getView, subscribeRoute } from '../lib/router'

export function useRoute() {
  const [view, setView] = useState(getView)

  useEffect(() => {
    return subscribeRoute(() => setView(getView()))
  }, [])

  return view
}
