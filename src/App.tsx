// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — ROOT COMPONENT / DATA ORCHESTRATOR
//
// This is the brain of the application. It does two main jobs:
//   1. Fetches ALL page content from WordPress with a single GraphQL query
//   2. Distributes that content down to each section component as props
//
// DATA FLOW PATTERN (one-way, top-down):
//   WordPress → GraphQL → useQuery() → App state → props → child components
//
// No child component ever fetches its own data. This is intentional:
//   - One network request instead of 11
//   - One loading/error state to handle
//   - Easy to trace where any piece of content comes from
//
// RESILIENCE PATTERN — ErrorBoundary:
//   Every section is wrapped in <ErrorBoundary>. If one section throws
//   (e.g. an unexpected shape from WordPress), only that section shows a
//   fallback message — the rest of the page keeps working normally.
//   See src/components/ErrorBoundary.jsx for details.
// ─────────────────────────────────────────────────────────────────────────────

// useState: hook for values that change over time and trigger re-renders
// useEffect: hook for running side effects (DOM mutations, timers, subscriptions)
// after the component renders
import { useState, useEffect } from 'react'

// useQuery: Apollo hook that runs a GraphQL query and returns { data, loading, error }
// This is the ONLY component in the app that calls useQuery — by design.
import { useQuery } from '@apollo/client'

import { GET_PAGE } from './graphql/queries'
import type { PageData } from './graphql/types'
import { useLanguage } from './hooks/useLanguage'
// Loading skeleton styles — the animated grey bars shown while GraphQL fetches
import './styles/loading-skeleton.css'
import { useAnalytics } from './hooks/useAnalytics'

// Each import below is a React component = a JS function that returns JSX
import Nav from './components/Nav'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Services from './components/Services'
import Process from './components/Process'
import About from './components/About'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import CtaFinal from './components/CtaFinal'
import Footer from './components/Footer'
import BookingModal from './components/BookingModal'
// ErrorBoundary: catches crashes inside a section and shows a friendly fallback
// instead of crashing the whole page. See components/ErrorBoundary.jsx.
import ErrorBoundary from './components/ErrorBoundary'

// "export default" means other files can import this as any name they choose.
// function App() {} is a React "function component" — a plain JS function that
// returns JSX (HTML-like syntax that React compiles to real DOM elements).
export default function App() {

  // ── Custom hooks ────────────────────────────────────────────────────────────
  // useLanguage() is our own custom hook (src/hooks/useLanguage.js).
  // Custom hooks are just functions whose name starts with "use" — they can
  // call other hooks internally. This one reads the URL path or localStorage
  // to determine which language to display (en / fr / es).
  const { lang, changeLang } = useLanguage()

  // useState(false) declares a state variable. Returns [currentValue, setter].
  // When setModalOpen(true) is called, React re-renders App and all children.
  // Naming convention: [value, setValue] — the setter is always prefixed with "set".
  const [modalOpen, setModalOpen] = useState(false)

  // ── Language → WordPress page URI mapping ───────────────────────────────────
  // WPML creates a separate WordPress page for each language translation.
  // We map the current language code to its WordPress URI so GraphQL knows
  // which translated page to return.
  // Record<string, string> allows indexing by `lang` (a string).
  // Without this type annotation, TypeScript infers the literal type
  // { en: string; fr: string; es: string } which rejects string-key access.
  const LANG_PAGE_URIS: Record<string, string> = { en: '/home/', fr: '/fr/accueil/', es: '/es/inicio/' }

  // ── GraphQL data fetch ──────────────────────────────────────────────────────
  // useQuery sends the GET_PAGE query to WordPress GraphQL and returns:
  //   data    → the response when successful (initially undefined)
  //   loading → true while the request is in flight
  //   error   → populated if the request fails or GraphQL returns an error
  //
  // variables: the $pageId argument in the query is filled in here.
  // When lang changes, Apollo re-runs the query with the new pageId automatically.
  // useQuery<{ page: PageData }> tells TypeScript the exact shape of data.
  // From this point on, `data.page.fgFAQ` is a compile-time error (correct: fgFaq).
  // Any field name typo that would silently return undefined at runtime is now
  // caught here, before the code ever runs.
  const { data, loading, error } = useQuery<{ page: PageData }>(GET_PAGE, {
    variables: { pageId: LANG_PAGE_URIS[lang] || '/home/' },
  })

  // ── Shorthand aliases ────────────────────────────────────────────────────────
  // Optional chaining (?.) safely accesses nested properties.
  // If data is undefined, data?.page returns undefined instead of throwing an error.
  // This is equivalent to: data && data.page ? data.page : undefined
  //
  // Using ?. consistently here means an unexpected shape from Apollo won't throw
  // a TypeError before we even reach the section components. Any crash that does
  // slip through will be caught by the <ErrorBoundary> around that section.
  const p = data?.page       // the full page object from WordPress
  const g = p?.fgGlobal      // the global settings field group (phone, email, etc.)

  // ── SEO: update <head> tags dynamically from WordPress ──────────────────────
  // useEffect(fn, [deps]) runs fn AFTER the component renders.
  // The second argument [g] is the dependency array — the effect re-runs only
  // when g changes (i.e. when new data arrives from WordPress).
  // This pattern lets the CMS control meta tags without rebuilding the app.
  useEffect(() => {
    // Guard clause: if g is undefined (data not yet loaded), do nothing
    if (!g) return

    if (g.globalSeoTitle) {
      // document.title directly sets the browser tab title
      document.title = g.globalSeoTitle
      // querySelector finds a DOM element by CSS selector — here we find the
      // existing <meta> tag in index.html and update its content attribute
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', g.globalSeoTitle)
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', g.globalSeoTitle)
    }
    if (g.globalSeoDescription) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', g.globalSeoDescription)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', g.globalSeoDescription)
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', g.globalSeoDescription)
    }
    // OG image — not yet active. To enable:
    //   1. Add Text field "global_seo_og_image_url" in WP Admin → ACF → fg_global
    //   2. Uncomment globalSeoOgImageUrl in queries.js AND in src/graphql/types.ts
    //   3. Uncomment the block below
    // if (g.globalSeoOgImageUrl) {
    //   document.querySelector('meta[property="og:image"]')?.setAttribute('content', g.globalSeoOgImageUrl)
    //   document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', g.globalSeoOgImageUrl)
    // }
  }, [g]) // re-run this effect whenever g changes

  // ── Analytics ────────────────────────────────────────────────────────────────
  // Passes analytics IDs from WordPress to the analytics hook.
  // The hook does nothing when the strings are empty (IDs not yet configured).
  // Fill globalMetaPixelId and globalGa4Id in WP Admin to activate tracking.
  useAnalytics({
    metaPixelId: g?.globalMetaPixelId || '',
    ga4Id: g?.globalGa4Id || '',
  })

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  // Arrow functions assigned to variables — these are passed as callback props
  // (onBook, onClose) to child components. The child calls onBook() and the
  // state lives here in App, not inside the button component.
  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  // ── Loading / error states ────────────────────────────────────────────────────
  // React renders the return value of this function. By returning early ("early
  // return"), we show a completely different UI while the query is in flight or
  // if something went wrong. This prevents child components from ever receiving
  // undefined data — they always get either real content or null.
  //
  // LOADING: skeleton UI
  //   While the GraphQL request is pending, we show animated grey bars that
  //   mimic the shape of the real page (nav bar + hero layout). This is called
  //   a "skeleton screen" — better UX than a blank white page or a spinner.
  //   The animation is a CSS @keyframes pulse defined in loading-skeleton.css.
  //
  //   aria-busy="true" tells screen readers "content is still loading".
  //   aria-label gives the element an accessible name so it's not announced
  //   as an anonymous div.
  //
  //   Each grey bar is a <div className="skeleton__bar"> — just a rounded
  //   grey rectangle. Widths vary to simulate different text lengths.
  if (loading) return (
    <div className="skeleton" aria-label="Chargement…" aria-busy="true">
      {/* Fake navigation bar */}
      <div className="skeleton__bar skeleton__nav" />

      {/* Fake hero: two columns on desktop (text left, image right) */}
      <div className="skeleton__hero">
        <div className="skeleton__hero-text">
          {/* Eyebrow label */}
          <div className="skeleton__bar" style={{ height: '1rem', width: '35%' }} />
          {/* Headline — two lines */}
          <div className="skeleton__bar" style={{ height: '2.5rem', width: '90%' }} />
          <div className="skeleton__bar" style={{ height: '2.5rem', width: '70%' }} />
          {/* Subtext */}
          <div className="skeleton__bar" style={{ height: '1rem', width: '80%', marginTop: 'var(--space-4)' }} />
          <div className="skeleton__bar" style={{ height: '1rem', width: '60%' }} />
          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <div className="skeleton__bar" style={{ height: '48px', width: '160px', borderRadius: '8px' }} />
            <div className="skeleton__bar" style={{ height: '48px', width: '160px', borderRadius: '8px' }} />
          </div>
        </div>
        {/* Fake hero photo */}
        <div className="skeleton__hero-img" />
      </div>

      {/* Fake first section header */}
      <div className="skeleton__section">
        <div className="skeleton__bar" style={{ height: '1rem', width: '20%', margin: '0 auto' }} />
        <div className="skeleton__bar" style={{ height: '2rem', width: '45%', margin: '0 auto' }} />
      </div>
    </div>
  )

  // ERROR: friendly message in French
  //   This only shows when the GraphQL request itself fails entirely (network
  //   error, server down, completely broken query). Normal section-level issues
  //   are caught by the per-section <ErrorBoundary> wrappers instead.
  if (error) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
        Impossible de charger le contenu. Veuillez réessayer.
        {/* Technical error message — small and dim, helpful for debugging */}
        <br />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dimmer)' }}>{error.message}</span>
      </p>
    </div>
  )

  // ── Main render ───────────────────────────────────────────────────────────────
  // JSX looks like HTML but is actually JavaScript. Rules:
  //   - Attributes use camelCase: className (not class), onClick (not onclick)
  //   - Self-closing tags need /: <img /> not <img>
  //   - {expression} injects JavaScript values into JSX
  //   - <></> is a Fragment — renders no DOM element, just groups children
  //
  // Each section receives exactly the slice of data it needs via the `data` prop.
  // p?.fgHero uses optional chaining — safe even if p is undefined (though after
  // the loading check above, p should always be defined here).
  return (
    <>
      {/* Nav receives both data AND callbacks (onLangChange, onBook) as props */}
      <Nav
        data={p?.fgNavigation}
        lang={lang}
        onLangChange={changeLang}
        onBook={openModal}
      />

      {/* <main> is a semantic HTML landmark — tells browsers/screen readers this
          is the primary content area (not nav or footer).
          Each section is wrapped in <ErrorBoundary> so a crash in one section
          (e.g. a missing WordPress field) shows a small fallback message and
          leaves every other section on screen. Without these wrappers, one
          broken section would make the entire <main> disappear. */}
      <main>
        <ErrorBoundary><Hero data={p?.fgHero} onBook={openModal} /></ErrorBoundary>
        <ErrorBoundary><Benefits data={p?.fgBenefits} /></ErrorBoundary>
        <ErrorBoundary><Services data={p?.fgServices} onBook={openModal} /></ErrorBoundary>
        <ErrorBoundary><Process data={p?.fgProcess} /></ErrorBoundary>
        <ErrorBoundary><About data={p?.fgAbout} onBook={openModal} /></ErrorBoundary>
        <ErrorBoundary><Testimonials data={p?.fgTestimonials} lang={lang} /></ErrorBoundary>
        <ErrorBoundary><FAQ data={p?.fgFaq} /></ErrorBoundary>
        <ErrorBoundary><Contact data={p?.fgContact} /></ErrorBoundary>
        <ErrorBoundary><CtaFinal data={p?.fgCtaFinal} onBook={openModal} /></ErrorBoundary>
      </main>

      {/* Footer gets BOTH fgFooter AND fgGlobal — it uses phone/email from global */}
      <ErrorBoundary><Footer data={p?.fgFooter} global={g} /></ErrorBoundary>

      {/* BookingModal is always in the DOM but returns null when open=false.
          This avoids unmounting/remounting the iframe on every open/close. */}
      <BookingModal
        open={modalOpen}
        onClose={closeModal}
        bookingUrl={g?.globalBookingUrl}
        lang={lang}
      />
    </>
  )
}
