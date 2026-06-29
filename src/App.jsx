// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — App.jsx — ROOT COMPONENT / DATA ORCHESTRATOR
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
// ─────────────────────────────────────────────────────────────────────────────

// useState: hook for values that change over time and trigger re-renders
// useEffect: hook for running side effects (DOM mutations, timers, subscriptions)
// after the component renders
import { useState, useEffect } from 'react'

// useQuery: Apollo hook that runs a GraphQL query and returns { data, loading, error }
// This is the ONLY component in the app that calls useQuery — by design.
import { useQuery } from '@apollo/client'

import { GET_PAGE } from './graphql/queries'
import { useLanguage } from './hooks/useLanguage'
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
  const LANG_PAGE_URIS = { en: '/home/', fr: '/fr/accueil/', es: '/es/inicio/' }

  // ── GraphQL data fetch ──────────────────────────────────────────────────────
  // useQuery sends the GET_PAGE query to WordPress GraphQL and returns:
  //   data    → the response when successful (initially undefined)
  //   loading → true while the request is in flight
  //   error   → populated if the request fails or GraphQL returns an error
  //
  // variables: the $pageId argument in the query is filled in here.
  // When lang changes, Apollo re-runs the query with the new pageId automatically.
  const { data, loading, error } = useQuery(GET_PAGE, {
    variables: { pageId: LANG_PAGE_URIS[lang] || '/home/' },
  })

  // ── Shorthand aliases ────────────────────────────────────────────────────────
  // Optional chaining (?.) safely accesses nested properties.
  // If data is undefined, data?.page returns undefined instead of throwing an error.
  // This is equivalent to: data && data.page ? data.page : undefined
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
  // React renders the return value of this function. By returning early, we
  // show a different UI while data is loading or if something went wrong.
  // This prevents child components from receiving undefined data.
  if (loading) return <div style={{ minHeight: '100vh', background: '#F7F4EE' }} />
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>GraphQL error: {error.message}</p>

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
          is the primary content area (not nav or footer) */}
      <main>
        <Hero data={p?.fgHero} onBook={openModal} />
        <Benefits data={p?.fgBenefits} />
        <Services data={p?.fgServices} onBook={openModal} />
        <Process data={p?.fgProcess} />
        <About data={p?.fgAbout} onBook={openModal} />
        {/* Testimonials also needs lang to show "Translated from X" labels */}
        <Testimonials data={p?.fgTestimonials} lang={lang} />
        <FAQ data={p?.fgFaq} />
        <Contact data={p?.fgContact} />
        <CtaFinal data={p?.fgCtaFinal} onBook={openModal} />
      </main>

      {/* Footer gets BOTH fgFooter AND fgGlobal — it uses phone/email from global */}
      <Footer data={p?.fgFooter} global={g} />

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
