// ─────────────────────────────────────────────────────────────────────────────
// components/FAQ.jsx — FREQUENTLY ASKED QUESTIONS (accordion)
//
// KEY CONCEPTS IN THIS FILE:
//   - useState for UI state (which item is open)
//   - Array.map() to render a list of items
//   - Conditional CSS classes using template literals
//   - Inline SVG icon (no icon library — keeps bundle small)
//   - aria-expanded for accessibility (screen reader announces open/closed state)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import '../styles/faq.css'

// ── Inline SVG icon ───────────────────────────────────────────────────────────
// Instead of importing an icon library (lucide-react, etc.), we define the SVG
// directly as a React component. This approach:
//   - Adds zero bytes to the bundle for unused icons
//   - Lets CSS animate/style it via currentColor (inherits text color)
//   - Makes the component fully self-contained
//
// aria-hidden="true" hides it from screen readers — the button's aria-expanded
// already communicates open/closed state, so the icon is purely decorative.
const ChevronIcon = () => (
  <svg className="faq__chevron" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function FAQ({ data: d }) {

  // ── Accordion state ───────────────────────────────────────────────────────────
  // `open` stores the INDEX of the currently open FAQ item, or null if all closed.
  // Only one item can be open at a time (classic accordion behavior).
  // Using null (not -1 or '') because null is the clearest "nothing is open" value.
  const [open, setOpen] = useState(null)

  // Guard clause
  if (!d) return null

  // Default to empty array if the repeater field has no items yet.
  // Without || [], this would crash with "Cannot read properties of undefined"
  // when trying to call .map() on null/undefined.
  const items = d.faqItems || []

  return (
    <section className="faq" id="faq">
      <div className="container">
        {/* .section-header and .eyebrow are shared utility classes from tokens.css */}
        <div className="section-header">
          <p className="eyebrow">{d.faqEyebrow}</p>
          <h2 className="faq__title">{d.faqTitle}</h2>
        </div>

        {/* Render the list only when there are items — avoids an empty <div> in the DOM */}
        {items.length > 0 && (
          <div className="faq__list">
            {/*
              Array.map() transforms each item in the array into JSX.
              It returns a new array of JSX elements.
              Parameters: (item, i) → item is the current object, i is its index (0, 1, 2...)

              key={i} — React needs a unique key on each list item so it can efficiently
              update only the items that change. Using the index as a key is acceptable
              here because FAQ items don't get reordered. For lists that do reorder,
              use a unique ID from the data instead.
            */}
            {items.map((item, i) => (
              <div
                key={i}
                {/*
                  Dynamic class name: template literal combines static class with
                  conditional class. When open === i (this item is open), adds
                  the modifier class ' faq__item--open' (BEM naming convention).
                  open === i ? ' faq__item--open' : '' is a ternary operator:
                    condition ? value_if_true : value_if_false
                */}
                className={`faq__item${open === i ? ' faq__item--open' : ''}`}
              >
                {/*
                  The toggle button. aria-expanded tells screen readers whether
                  the controlled content is visible — required for accessibility.
                  Value must be a boolean, not a string, so we use {open === i}
                  which evaluates to true/false.
                */}
                <button
                  className="faq__question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  {/*
                    onClick logic: setOpen(open === i ? null : i)
                    - If this item is already open (open === i): close it by setting null
                    - If this item is closed: open it by setting its index i
                    This is a toggle with mutual exclusion (only one open at a time).
                  */}
                  <span>{item.fqQuestion}</span>
                  <ChevronIcon />
                </button>

                {/*
                  Conditional rendering: show the answer only when this item is open.
                  {open === i && <div>...</div>} — when open !== i, renders nothing.
                  React removes the element from the DOM when the condition is false.
                  (An alternative would be CSS display:none, but this is cleaner.)
                */}
                {open === i && (
                  <div className="faq__answer">
                    <p>{item.fqAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
