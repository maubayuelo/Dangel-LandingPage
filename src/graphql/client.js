// ─────────────────────────────────────────────────────────────────────────────
// graphql/client.js — APOLLO CLIENT CONFIGURATION
//
// Apollo Client is the library that handles all communication with the
// WordPress GraphQL API. Think of it as a smart HTTP client that:
//   - Sends GraphQL queries to the server
//   - Caches responses so the same data isn't fetched twice
//   - Integrates with React via the useQuery() hook
//
// WHAT IS GRAPHQL?
// REST API: you call /api/hero, /api/services, /api/faq → 3 separate requests
// GraphQL: you describe ALL the data you need in one query → 1 request, exactly
// the fields you asked for, nothing more. The server is at /graphql.
//
// ENDPOINT CONFIGURATION — environment variable:
//   The GraphQL URL is read from VITE_GRAPHQL_URI in your .env.local file.
//   This keeps the URL out of the committed source code (different per machine).
//
//   Local dev  → set VITE_GRAPHQL_URI=http://dangelwellness.local/graphql
//   Production → set VITE_GRAPHQL_URI=https://cms.dangelwellness.ca/graphql
//              (or leave the variable unset — the fallback below is the prod URL)
//
//   How Vite env vars work:
//     - Variables MUST be prefixed VITE_ to be accessible in browser code.
//     - They are accessed via import.meta.env.VITE_VARIABLE_NAME at build time.
//     - Vite replaces import.meta.env.VITE_* with the actual string value when
//       it bundles the code — they are NOT available at runtime like Node's
//       process.env. The .env.local file is never committed to git.
//     - See .env.example for a template of all required variables.
// ─────────────────────────────────────────────────────────────────────────────

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// createHttpLink defines WHERE to send GraphQL requests.
// import.meta.env.VITE_GRAPHQL_URI reads from .env.local (never committed to git).
// The || fallback kicks in when the variable is missing (e.g. on a first clone
// before anyone has created a .env.local file).
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'https://cms.dangelwellness.ca/graphql',
})

// ApolloClient is instantiated once and shared across the entire app via
// ApolloProvider in main.jsx. It combines:
//   link  → how/where to fetch data (HTTP in our case)
//   cache → how to store responses (InMemoryCache = plain JS object in RAM)
//
// InMemoryCache automatically deduplicates and normalizes data.
// If two queries ask for the same page, only one HTTP request is made.
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

// Export as default so main.jsx can import it as: import client from './graphql/client'
export default client
