// ─────────────────────────────────────────────────────────────────────────────
// components/FAQ.tsx — FREQUENTLY ASKED QUESTIONS (accordion)
//
// KEY CONCEPTS IN THIS FILE:
//   - useState for UI state (which item is open)
//   - Array.map() to render a list of items
//   - Conditional CSS classes using template literals
//   - Inline SVG icon (no icon library — keeps bundle small)
//   - aria-expanded for accessibility (screen reader announces open/closed state)
//
// TYPESCRIPT PATTERN (reference example for all other section components):
//   1. Import the specific field group type from graphql/types.ts
//   2. Define a Props interface — data is optional (nullable) matching PageData
//   3. Type useState with the correct value type — useState<number | null>
//   4. Keep the `if (!d) return null` guard — TypeScript still requires it
//      because `data` is typed as FgFaq | null | undefined
//
//   Why FgFaq and not FgFAQ?
//   WPGraphQL lowercases the letter after an acronym: fg_faq → fgFaq (not fgFAQ).
//   The type name in types.ts matches exactly. TypeScript will catch any typo.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { FgFaq } from '../graphql/types'
import '../styles/faq.css'

// ── Props interface ───────────────────────────────────────────────────────────
// Props interfaces are the TypeScript equivalent of PropTypes in older React.
// They describe the shape of what the parent component (App.tsx) must pass in.
//
// `data` is optional/nullable — App.tsx passes p?.fgFaq which can be
// undefined if the page or field group isn't loaded yet.
// Matching it as FgFaq | null | undefined covers all three cases:
//   undefined → query still loading (shouldn't happen — App guards with loading check)
//   null      → WordPress returned null for this field group (group not attached)
//   FgFaq     → the happy path with real data
interface FAQProps {
  data?: FgFaq | null
}

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

// ── Component ─────────────────────────────────────────────────────────────────
// The `{ data: d }` destructuring renames the `data` prop to `d` inside the function.
// The `: FAQProps` annotation tells TypeScript to enforce the prop contract.
export default function FAQ({ data: d }: FAQProps) {

  // ── Accordion state ───────────────────────────────────────────────────────────
  // `open` stores the INDEX of the currently open FAQ item, or null if all closed.
  // Only one item can be open at a time (classic accordion behavior).
  //
  // useState<number | null>(null) — the explicit generic type tells TypeScript:
  //   - The state can only be a number (a valid index) or null (nothing open)
  //   - Without the generic, TypeScript would infer `null` as the only allowed
  //     value and reject `setOpen(i)` because `i` is a `number`, not `null`.
  const [open, setOpen] = useState<number | null>(null)

  // Guard clause — still required even in TypeScript because `d` is typed as
  // FgFaq | null | undefined. TypeScript narrows the type to FgFaq after this check.
  if (!d) return null

  // Default to empty array if faqItems is null/undefined.
  // `d.faqItems` is typed as `FaqItem[] | null | undefined`, so `|| []` gives
  // us a guaranteed `FaqItem[]` (never null/undefined) for the .map() below.
  const items = d.faqItems ?? []

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
              TypeScript infers `item` as `FaqItem` from the array type —
              so item.fqQuestion and item.fqAnswer are type-safe.
              If you typed item.fqText (which doesn't exist), you'd get:
              "Property 'fqText' does not exist on type 'FaqItem'"

              key={i} — React needs a unique key on each list item so it can
              efficiently update only the items that change. Using the index is
              acceptable here because FAQ items don't get reordered.
            */}
            {items.map((item, i) => (
              // className: template literal + ternary adds --open modifier when active.
              // open === i ? ' faq__item--open' : ''  →  condition ? true_value : false_value
              <div
                key={i}
                className={`faq__item${open === i ? ' faq__item--open' : ''}`}
              >
                {/*
                  The toggle button. aria-expanded tells screen readers whether
                  the controlled content is visible — required for accessibility.
                  Value must be a boolean, so we use {open === i} which evaluates
                  to true/false. TypeScript enforces this — passing a string here
                  would be a type error.
                */}
                <button
                  className="faq__question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  {/*
                    onClick: setOpen(open === i ? null : i)
                    - Already open (open === i) → close it: setOpen(null)
                    - Closed → open it: setOpen(i)   [i is number — TS allows it]
                    This is a toggle with mutual exclusion (only one open at a time).
                  */}
                  <span>{item.fqQuestion}</span>
                  <ChevronIcon />
                </button>

                {/*
                  Conditional rendering: show the answer only when this item is open.
                  {open === i && <div>...</div>} — renders nothing when open !== i.
                  React removes the element from the DOM when the condition is false.
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
