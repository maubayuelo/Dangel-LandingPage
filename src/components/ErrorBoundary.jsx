// ─────────────────────────────────────────────────────────────────────────────
// components/ErrorBoundary.jsx — SAFETY NET FOR SECTION CRASHES
//
// WHAT THIS FILE DOES:
//   If any section component throws a JavaScript error (for example, because
//   WordPress returned unexpected data), this component catches that crash and
//   shows a polite fallback message instead of making the whole page go blank.
//
// WHY IT EXISTS (the problem it solves):
//   Imagine the FAQ section receives a badly-shaped GraphQL response and throws.
//   Without a safety net, React crashes the ENTIRE page — hero, services,
//   everything disappears. With an ErrorBoundary wrapped around each section,
//   only the FAQ section shows a fallback. The rest of the page still works.
//
// HOW TO USE IT:
//   Wrap any component you want to protect:
//     <ErrorBoundary>
//       <FAQ data={...} />
//     </ErrorBoundary>
//
// WHY A CLASS COMPONENT?
//   React's error-catching API (getDerivedStateFromError, componentDidCatch)
//   only works in class components — there is no hook equivalent for this
//   specific job. This is one of the very few cases where you still need a
//   class instead of a function component in modern React.
//
// OPTIONAL prop: `fallback`
//   Pass a custom message if you want to override the default French text:
//     <ErrorBoundary fallback={<p>Something went wrong</p>}>
//       <Hero data={...} />
//     </ErrorBoundary>
// ─────────────────────────────────────────────────────────────────────────────

// Component is a React base class — we extend it to build class components.
// Class components use a `render()` method instead of returning JSX directly.
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  // constructor runs once when the component is first created.
  // super(props) is required whenever you use a constructor in a class that
  // extends another class — it calls React's setup code before ours.
  constructor(props) {
    super(props)
    // `state` is the class-component equivalent of useState().
    // hasError flips to true the moment a child throws.
    // error stores the actual Error object (useful for debugging).
    this.state = { hasError: false, error: null }
  }

  // ── getDerivedStateFromError ──────────────────────────────────────────────
  // React calls this AUTOMATICALLY when any child component throws an error.
  // Whatever object you return here gets merged into this.state.
  // By returning { hasError: true }, we tell the component to switch to the
  // fallback UI on the next render.
  //
  // `static` means it belongs to the class itself, not a specific instance.
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // ── componentDidCatch ─────────────────────────────────────────────────────
  // Also called automatically after an error is caught.
  // Used for logging — we print the error AND React's component stack trace
  // (which component threw, which component rendered it, etc.) to the console.
  // In a production app you'd send this to a monitoring service like Sentry.
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] A section crashed:', error, info.componentStack)
  }

  // ── render ────────────────────────────────────────────────────────────────
  // render() is called on every state change (like the class-component
  // equivalent of the function body in a function component).
  render() {
    if (this.state.hasError) {
      // If the parent passed a custom fallback prop, show that instead.
      if (this.props.fallback) return this.props.fallback

      // Default fallback: a subtle, on-brand message in French.
      // We use inline style here because this fallback should work even if
      // the section's CSS file failed to load (e.g. an import error).
      // The values reference design tokens from tokens.css — they work because
      // tokens.css is imported globally in main.jsx, not in this component.
      return (
        <section style={{ padding: 'var(--space-16) var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
            Cette section est temporairement indisponible.
          </p>
        </section>
      )
    }

    // Normal case: no error has happened yet.
    // this.props.children renders whatever was placed between the opening and
    // closing <ErrorBoundary> tags — the actual section component.
    return this.props.children
  }
}
