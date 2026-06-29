// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — main.jsx — APPLICATION ENTRY POINT
//
// BUILD ORDER OVERVIEW (where this file fits):
//   STEP 1  index.html          → HTML shell, SEO meta tags, <div id="root">
//   STEP 2  styles/tokens.css   → Design tokens: colors, fonts, spacing
//   STEP 3  graphql/client.js   → Configure Apollo Client (where to fetch data)
//   STEP 4  graphql/queries.js  → Define WHAT data to fetch from WordPress
//   STEP 5  main.jsx            → ← YOU ARE HERE: wire everything together
//   STEP 6  App.jsx             → Fire the query, distribute data to sections
//   STEP 7  hooks/useLanguage   → Custom hook: language detection & switching
//   STEP 8  hooks/useAnalytics  → Custom hook: Meta Pixel + GA4 injection
//   STEP 9  Nav.jsx + Footer    → Shell/frame components (always visible)
//   STEP 10 Hero.jsx            → First section — establish component pattern
//   STEP 11 Benefits → Testimonials → remaining sections (same pattern)
//   STEP 12 FAQ.jsx             → First interactive component (accordion)
//   STEP 13 Contact.jsx         → Form with EmailJS (async side effects)
//   STEP 14 BookingModal.jsx    → Modal: useRef, focus trap, accessibility
//   STEP 15 public/ SEO files   → robots.txt, sitemap.xml, llms.txt
//
// This is the very first file JavaScript runs. Think of it as the "on switch"
// for the entire React app. It does three things:
//   1. Finds the <div id="root"> in index.html and takes it over
//   2. Wraps everything in ApolloProvider so any component can talk to GraphQL
//   3. Renders <App /> — the root React component that holds the whole page
// ─────────────────────────────────────────────────────────────────────────────

// React must be imported when using JSX syntax (the HTML-like code in .jsx files)
import React from 'react'

// ReactDOM is the bridge between React's virtual world and the real browser DOM.
// "react-dom/client" is the modern React 18+ API — replaces the old ReactDOM.render()
import ReactDOM from 'react-dom/client'

// ApolloProvider is a React "context provider" — it wraps the app and makes the
// Apollo GraphQL client available to every component below it in the tree,
// without having to pass it down as a prop manually.
import { ApolloProvider } from '@apollo/client'

// Our configured Apollo Client instance (points to the WordPress GraphQL API)
import client from './graphql/client'

// The root component — renders everything on the page
import App from './App'

// Global CSS design tokens loaded first so all other CSS files can use the variables.
// Import ORDER matters: tokens must load before component CSS files.
import './styles/tokens.css'

// ReactDOM.createRoot() attaches React to the real DOM element with id="root"
// (found in index.html). From this point, React controls that element entirely.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode is a development-only tool that activates extra warnings.
  // It renders components twice (in dev) to detect side-effect bugs. Has zero
  // effect on production builds.
  <React.StrictMode>
    {/*
      ApolloProvider makes `client` accessible via useQuery() in ANY descendant
      component. This is the React "Context" pattern — share data globally
      without prop drilling (passing props through every level manually).
    */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
