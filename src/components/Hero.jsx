// ─────────────────────────────────────────────────────────────────────────────
// components/Hero.jsx — HERO SECTION (above the fold)
//
// COMPONENT ANATOMY:
// Every section component in this project follows the same pattern:
//   1. Accept { data: d } as the only prop (destructured and aliased to `d`)
//   2. Return null if data hasn't arrived yet (guard clause)
//   3. Compute derived values from data
//   4. Return JSX
//
// This component also has one helper function (stripOuterP) that solves
// a specific WordPress behaviour — documented below.
// ─────────────────────────────────────────────────────────────────────────────

// Importing the CSS file for this component. Vite (the build tool) processes
// this import and injects the CSS into the page automatically.
import '../styles/hero.css'

// Fallback image URL shown when heroPhoto hasn't been set in WordPress.
// placehold.co generates placeholder images with custom dimensions and colors.
// Using a constant at module level (not inside the function) means it's created
// once, not on every render.
const PHOTO_FALLBACK = 'https://placehold.co/440x587/F7F4EE/9B9790?text=Photo'

// ── Helper function ───────────────────────────────────────────────────────────
// PROBLEM: WordPress "wpautop" feature automatically wraps text fields in <p>
// tags. So heroHeadline from WP looks like: "<p>My <em>headline</em></p>"
// If we put that inside an <h1>, we get <h1><p>...</p></h1> — invalid HTML.
//
// SOLUTION: strip the outer <p>...</p> wrapper before rendering.
// .replace() with a regex (regular expression):
//   ^        = start of string
//   <p>      = literal opening tag
//   ([\s\S]*?) = capture group: any characters (including newlines), non-greedy
//   <\/p>    = literal closing tag (backslash escapes the forward slash)
//   \s*      = optional trailing whitespace
//   $        = end of string
// '$1' replaces the whole match with just the capture group (the inner content).
function stripOuterP(html = '') {
  return html.replace(/^<p>([\s\S]*?)<\/p>\s*$/, '$1').trim()
}

// ── Component ─────────────────────────────────────────────────────────────────
// Props destructuring: { data: h, onBook }
//   data: h    → renames the `data` prop to `h` inside this function
//   onBook     → a callback function passed from App.jsx (opens booking modal)
//
// This is equivalent to:
//   function Hero(props) {
//     const h = props.data
//     const onBook = props.onBook
//   }
export default function Hero({ data: h, onBook }) {

  // Guard clause — if data prop is undefined/null, render nothing.
  // This handles the brief moment before the GraphQL response arrives.
  // (In practice the loading check in App.jsx prevents this, but it's good
  // defensive practice for every component to handle missing data.)
  if (!h) return null

  // Optional chaining (?.) to safely navigate nested object properties.
  // h.heroPhoto?.node?.sourceUrl means: if heroPhoto exists AND node exists,
  // return sourceUrl. Otherwise return undefined (triggering the fallback).
  // The || operator returns the right side when the left is falsy (undefined, null, '').
  const photoUrl = h.heroPhoto?.node?.sourceUrl || PHOTO_FALLBACK
  const photoAlt = h.heroPhoto?.node?.altText || 'Dangel, thérapeute holistique'

  return (
    // <section> is a semantic HTML5 element — groups thematically related content.
    // Screen readers and search engines use these to understand page structure.
    <section className="hero">
      {/* className instead of class — JSX uses camelCase for HTML attributes
          because "class" is a reserved keyword in JavaScript */}
      <div className="hero__container">

        {/* Image column */}
        <div className="hero__photo">
          {/*
            loading="eager" — override the browser's default lazy loading.
            The hero image is above the fold so we want it to load immediately.
            fetchPriority="high" — browser hint to prioritize this download.
            Both attributes together optimize the LCP (Largest Contentful Paint)
            score, which affects Google PageSpeed / Core Web Vitals ranking.
          */}
          <img src={photoUrl} alt={photoAlt} loading="eager" fetchPriority="high" />
        </div>

        {/* Content column */}
        <div className="hero__content">
          {/* Plain text field — rendered as a <p> tag, no HTML escaping needed */}
          <p className="hero__eyebrow">{h.heroEyebrow}</p>

          {/*
            dangerouslySetInnerHTML is React's way to inject raw HTML strings.
            The name "dangerously" is a warning: injecting HTML from untrusted
            sources enables XSS (cross-site scripting) attacks. It is safe here
            because the content comes from our own trusted WordPress backend.
            __html is required by React as a safety reminder — { __html: string }
          */}
          <h1
            className="hero__headline"
            dangerouslySetInnerHTML={{ __html: stripOuterP(h.heroHeadline) }}
          />

          <p className="hero__subtext">{h.heroSubtext}</p>
          <p className="hero__lang">{h.heroSubtext2}</p>

          <div className="hero__ctas">
            {/*
              onClick receives a function reference — NOT a function call.
              onClick={onBook}    ✓  passes the function (called when clicked)
              onClick={onBook()}  ✗  calls the function immediately during render
            */}
            <button className="btn-primary" onClick={onBook}>→ {h.heroCtaPrimaryLabel}</button>

            {/*
              Arrow function in onClick: needed when we want to pass arguments
              or run multiple statements. Here we call scrollIntoView inline.
              document.getElementById() finds an element by its id attribute.
              scrollIntoView({ behavior: 'smooth' }) animates scrolling to it.
            */}
            <button
              className="btn-outline"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {h.heroCtaSecondaryLabel} ↓
            </button>
          </div>

          {/* Conditional rendering: {condition && <JSX>} renders JSX only if condition is truthy.
              Short-circuit evaluation — if heroTrustRating is falsy, the <span> is skipped. */}
          <div className="hero__trust">
            {h.heroTrustRating && (
              <span className="hero__trust-badge">{h.heroTrustRating}</span>
            )}
            {h.heroTrustText && (
              <span className="hero__trust-badge">{h.heroTrustText}</span>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
