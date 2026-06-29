// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — graphql/client.js — APOLLO CLIENT CONFIGURATION
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
// ─────────────────────────────────────────────────────────────────────────────

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// createHttpLink defines WHERE to send GraphQL requests.
// This points to the WordPress site's GraphQL endpoint (provided by WPGraphQL plugin).
// In development this was dangelwellness.local/graphql (Local by Flywheel).
// In production it points to the live CMS subdomain.
const httpLink = createHttpLink({
  uri: 'https://cms.dangelwellness.ca/graphql',
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
