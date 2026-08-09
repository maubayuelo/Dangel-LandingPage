// ─────────────────────────────────────────────────────────────────────────────
// lib/consent.js — SOURCE OF TRUTH FOR COOKIE/TRACKING CONSENT (Loi 25)
//
// Plain module, no React dependency, so both UI (CookieBanner) and
// non-UI code (useAnalytics) can read/write the same state without a
// circular import through a component.
//
// Storage shape: { value: 'accepted' | 'declined', ts: <epoch ms>, version }
// A record is only valid if version >= CONSENT_VERSION and it's under
// MAX_AGE_MS old — otherwise getConsent() returns null (no consent).
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'dangel_consent'
const LEGACY_KEY = 'dangel_cookie_consent'
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000 // 12 months

export const CONSENT_VERSION = 1

// The old banner (pre-Loi-25-fix) stored a plain string under a different key
// and never actually gated anything. That "consent" was not informed — it is
// discarded, not migrated, so every returning visitor is asked again.
function migrateLegacyKey() {
  try {
    if (localStorage.getItem(LEGACY_KEY) !== null && localStorage.getItem(STORAGE_KEY) === null) {
      localStorage.removeItem(LEGACY_KEY)
    }
  } catch {
    // localStorage unavailable (private mode, disabled) — nothing to migrate
  }
}
migrateLegacyKey()

function notify(value) {
  try {
    window.dispatchEvent(new CustomEvent('dangel:consentchange', { detail: value }))
  } catch {
    // ignore — non-browser environment
  }
}

// Returns 'accepted' | 'declined' | null. Any parse failure, missing
// localStorage, stale version, or expired record fails toward null
// (= no consent), never toward 'accepted'.
export function getConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const { value, ts, version } = parsed
    if (value !== 'accepted' && value !== 'declined') return null
    if (typeof ts !== 'number') return null
    if (typeof version !== 'number' || version < CONSENT_VERSION) return null
    if (Date.now() - ts > MAX_AGE_MS) return null

    return value
  } catch {
    return null
  }
}

export function setConsent(value) {
  if (value !== 'accepted' && value !== 'declined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, ts: Date.now(), version: CONSENT_VERSION }))
  } catch {
    // localStorage unavailable — consent can't persist, but we still notify
    // this tab so in-memory state (if any) reflects the user's choice.
  }
  notify(value)
}

export function clearConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  notify(null)
}

// Registers a listener for consent changes — both same-tab (custom event,
// fired by setConsent/clearConsent) and cross-tab (native `storage` event).
// Returns an unsubscribe function.
export function subscribeConsent(callback) {
  const onCustom = (e) => callback(e.detail)
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) callback(getConsent())
  }

  window.addEventListener('dangel:consentchange', onCustom)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener('dangel:consentchange', onCustom)
    window.removeEventListener('storage', onStorage)
  }
}
