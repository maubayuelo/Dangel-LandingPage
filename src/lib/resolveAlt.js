// ─────────────────────────────────────────────────────────────────────────────
// lib/resolveAlt.js — ALT TEXT FALLBACK CHAIN FOR CONTENT IMAGES
//
// Priority: ACF field (per-language, source of truth) → Media Library
// altText (safety net, not translatable) → hardcoded default (never empty).
// Blank/whitespace-only strings count as empty at every level.
//
// In dev, warns when the ACF field wasn't the source — a working fallback
// silently hides an empty WordPress field otherwise; nothing is logged
// in production.
// ─────────────────────────────────────────────────────────────────────────────

export function resolveAlt({ acf, mediaAlt, hardcoded, imageName }) {
  const acfValue = (acf ?? '').trim()
  if (acfValue) return acfValue

  const mediaValue = (mediaAlt ?? '').trim()
  if (mediaValue) {
    if (import.meta.env.DEV) {
      console.warn(`[resolveAlt] "${imageName}" — ACF alt field is empty, using Media Library altText instead`)
    }
    return mediaValue
  }

  if (import.meta.env.DEV) {
    console.warn(`[resolveAlt] "${imageName}" — ACF alt field and Media Library altText are both empty, using hardcoded fallback`)
  }
  return hardcoded
}
