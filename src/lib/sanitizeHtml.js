// ─────────────────────────────────────────────────────────────────────────────
// lib/sanitizeHtml.js — STRICT-ALLOWLIST SANITIZATION FOR WORDPRESS CONTENT
//
// Used for the policy page's native `content` field (native WP editor HTML,
// WPML-translated). Unlike Hero.jsx's stripOuterP + DOMPurify.sanitize()
// (which only strips dangerous tags from a small trusted string), this is a
// strict allowlist: only the tags a legal document needs, nothing else —
// no <img>, no <script>, no inline styles, no arbitrary attributes.
// ─────────────────────────────────────────────────────────────────────────────

import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br']
const ALLOWED_ATTR = ['href', 'target', 'rel']

// Runs once at module load (DOMPurify is a shared singleton) — forces
// rel="noopener noreferrer" on any link WordPress marked target="_blank",
// closing the reverse-tabnabbing hole that target="_blank" alone leaves open.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function sanitizePolicyHtml(html = '') {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}
