# Dangel — Landing Page

Landing page for **Dangel, Thérapeute Holistique**. A single-page marketing site built with React + Vite, consuming content from a WordPress backend through GraphQL.

---

## What This Project Is

The site has no database of its own. All text, images, and settings live inside a **WordPress** installation. React fetches that content through a **GraphQL API** (provided by the WPGraphQL plugin) and renders it as a fast, modern landing page.

```
WordPress Admin (client edits content)
       ↓  ACF Pro (structured fields)
  WPGraphQL (exposes fields as GraphQL API)
       ↓  one HTTP request
  Apollo Client (caches and delivers to React)
       ↓  props
  Section Components (render the HTML)
```

Think of it this way:
- **WordPress** = where the client edits content (text, photos, settings)
- **GraphQL** = the bridge that delivers that content as structured JSON
- **Apollo Client** = the smart fetcher that caches responses
- **React** = what turns that JSON into the webpage visitors see

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI framework | React 19 | Component model, hooks, reactive state |
| Build tool | Vite 8 | Fast dev server, optimized production builds |
| Data fetching | Apollo Client 3 | GraphQL client with caching |
| CMS | WordPress + WPGraphQL + ACF Pro | Client-editable content via GraphQL |
| Styling | Plain CSS + custom properties | No Tailwind, no CSS-in-JS |
| Form delivery | EmailJS | Client-side form sending, no backend needed |
| Analytics | GA4 + Meta Pixel | Loaded dynamically from WP Admin |
| i18n | WPML + custom useLanguage hook | FR / EN / ES via separate WP pages |

---

## Prerequisites

Before you can run this project you need three things:

### 1. WordPress CMS
Content is fetched from a WordPress GraphQL endpoint. The URL is configured
via an environment variable — see the **Environment Variables** section below.

For local development, start the **dangelwellness** site in
[Local by Flywheel](https://localwp.com/) before running `npm run dev`.

### 2. Node.js
Install [Node.js](https://nodejs.org/) v18 or later.

### 3. Environment variables
Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

`.env.local` is gitignored — it lives only on your machine and is never
committed. `.env.example` is committed and serves as a template so every
developer knows which variables are needed.

---

## Environment Variables

All secrets and machine-specific URLs live in `.env.local` (never committed).

| Variable | What it is |
|---|---|
| `VITE_GRAPHQL_URI` | WordPress GraphQL endpoint. Local: `http://dangelwellness.local/graphql` · Prod: `https://cms.dangelwellness.ca/graphql` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID (contact form delivery) |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS auto-reply template ID |
| `VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID` | EmailJS notification template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

> **Why the `VITE_` prefix?** Vite only exposes variables that start with `VITE_`
> to browser code. Variables without that prefix stay server-side only (for
> safety). They're accessed in code as `import.meta.env.VITE_VARIABLE_NAME`.

---

## Getting Started

```bash
# 1. Install dependencies (only needed once)
npm install

# 2. Copy the environment variable template and fill in your values
cp .env.example .env.local

# 3. Start Local by Flywheel (dangelwellness site must be running for content to appear)

# 4. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
landing-page-dangel/
├── index.html                  # HTML shell — SEO meta tags, GA4 script, <div id="root">
├── vite.config.js              # Vite bundler + Vitest test runner configuration
├── package.json                # Dependencies and npm scripts
├── .env.example                # Template listing all required environment variables (committed)
├── .env.local                  # Your actual secrets — NEVER committed to git
├── public/
│   ├── robots.txt              # Allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
│   ├── sitemap.xml             # All three language URLs for search engines
│   └── llms.txt                # AI-readable site description (for ChatGPT, Perplexity, etc.)
└── src/
    ├── main.jsx                # Entry — ReactDOM.createRoot, ApolloProvider wraps App
    ├── App.jsx                 # Root — ONE useQuery, distributes data as props to sections
    ├── graphql/
    │   ├── client.js           # Apollo Client — reads endpoint from VITE_GRAPHQL_URI env var
    │   └── queries.js          # GET_PAGE master query (all content in one request)
    ├── hooks/
    │   ├── useLanguage.js      # Custom hook — URL path > localStorage > 'en' priority
    │   └── useAnalytics.js     # Custom hook — injects Meta Pixel + GA4 scripts on demand
    ├── components/             # One file per page section
    │   ├── ErrorBoundary.jsx   # Catches crashes inside a section; shows friendly fallback
    │   ├── Nav.jsx             # Sticky nav, hamburger menu, language switcher
    │   ├── Hero.jsx            # Above-the-fold, DOMPurify sanitizes WP headline HTML
    │   ├── Benefits.jsx        # 5-card bento grid
    │   ├── Services.jsx        # 3-column service cards with technique tags
    │   ├── Process.jsx         # 3-step how-it-works cards
    │   ├── About.jsx           # 2-col photo + bio, discipline chips
    │   ├── Testimonials.jsx    # 6-card grid, "Translated from" language labels
    │   ├── FAQ.jsx             # Accordion — useState controls which item is open
    │   ├── Contact.jsx         # Info column + EmailJS form
    │   ├── CtaFinal.jsx        # Dark section, final booking CTA
    │   ├── Footer.jsx          # Dark section, receives data + global props
    │   └── BookingModal.jsx    # iframe modal, focus trap, Esc/backdrop close
    └── styles/
        ├── tokens.css          # ALL design tokens (colors, fonts, spacing, radii)
        ├── loading-skeleton.css# Animated grey-bar skeleton shown while GraphQL fetches
        └── [section].css       # One CSS file per component, mobile-first
```

---

## How Data Flows (One-Way, Top-Down)

```
App.jsx
 useQuery(GET_PAGE)
  ↓ data.page
  ├── p.fgNavigation  →  <Nav data={...} />
  ├── p.fgGlobal      →  <Footer global={...} />  +  useAnalytics()  +  SEO useEffect
  ├── p.fgHero        →  <Hero data={...} />
  ├── p.fgBenefits    →  <Benefits data={...} />
  ├── p.fgServices    →  <Services data={...} />
  ├── p.fgProcess     →  <Process data={...} />
  ├── p.fgAbout       →  <About data={...} />
  ├── p.fgTestimonials→  <Testimonials data={...} />
  ├── p.fgFaq         →  <FAQ data={...} />
  ├── p.fgContact     →  <Contact data={...} />
  ├── p.fgCtaFinal    →  <CtaFinal data={...} />
  └── p.fgFooter      →  <Footer data={...} />
```

**Rule:** No component ever calls `useQuery` directly. All data enters through `App.jsx` and flows down via props.

---

## WordPress ACF Field Groups

12 ACF field groups attached to the WordPress page slug `home` (and its WPML translations).

| GraphQL name | WP field group | Notes |
|---|---|---|
| `fgNavigation` | `fg_navigation` | `navLinks` repeater: `{ nlLabel, nlAnchor }` |
| `fgGlobal` | `fg_global` | Phone, email, address, booking URL, SEO fields, analytics IDs |
| `fgHero` | `fg_hero` | `heroHeadline` contains HTML `<em>` — use `stripOuterP()` |
| `fgBenefits` | `fg_benefits` | `benefitsItems` repeater: `{ benNumber, benTitle, benDescription }` |
| `fgServices` | `fg_services` | `servicesItems` repeater, `svTechniqueTags` split by comma/newline |
| `fgProcess` | `fg_process` | `processSteps` repeater: `{ psNumber, psTitle, psDescription }` |
| `fgAbout` | `fg_about` | `aboutDisciplinesList` is HTML `<ul><li>` — parsed by `parseListItems()` |
| `fgTestimonials` | `fg_testimonials` | `tsOriginalLang` drives "Translated from" labels |
| `fgFaq` | `fg_faq` | Note: `fgFaq` not `fgFAQ` — WPGraphQL lowercases after acronyms |
| `fgContact` | `fg_contact` | `contactScheduleItems` repeater: `{ scDay, scHours }` |
| `fgCtaFinal` | `fg_cta_final` | Only 3 fields — do not add non-existent fields |
| `fgFooter` | `fg_footer` | `footerNavItems` + `footerSocialItems` repeaters |

---

## Coding Conventions

### Every section component follows this pattern
```jsx
export default function SectionName({ data: d }) {
  if (!d) return null                    // guard: no data → render nothing
  const items = d.repeatField || []     // safe default for repeater arrays

  return (
    <section className="section-name" id="anchor">
      {/* JSX here */}
    </section>
  )
}
```

### CSS rules
- **No Tailwind, no CSS-in-JS.** Plain CSS with custom properties only.
- All tokens live in `tokens.css` — never hardcode colors or spacing in component CSS.
- **Mobile-first:** base styles = mobile, `@media (min-width: 768px)` = tablet, `@media (min-width: 1024px)` = desktop.
- BEM-ish naming: `.section__element`, `.section__element--modifier`.

### GraphQL rules
- Every field in `queries.js` **must exist** in WordPress ACF. One non-existent field breaks the entire page.
- ACF field names are `snake_case` in WP; WPGraphQL converts them to `camelCase` in GraphQL.
- `fgFAQ` → `fgFaq` (WPGraphQL lowercases after acronyms).

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server at `http://localhost:5173` |
| `npm run build` | Build production files into `/dist` |
| `npm run preview` | Preview the production build locally |

---

## Multilanguage

Language detection priority (highest to lowest):
1. **URL path** — `/fr` shows French, `/es` shows Spanish. Used for ad campaign links.
2. **localStorage** — remembers last user selection across visits.
3. **Default** — `en` (English).

Each language version is a **separate WordPress page** managed by WPML:
- English: `/home/`
- French: `/fr/accueil/`
- Spanish: `/es/inicio/`

---

## SEO & AI Discoverability

- **`index.html`** — primary/OG/Twitter meta tags + GA4 script (static fallback)
- **`public/robots.txt`** — allows all crawlers including GPTBot, ClaudeBot, PerplexityBot
- **`public/sitemap.xml`** — all 3 language URLs with `hreflang` attributes
- **`public/llms.txt`** — plain-text site summary for AI answer engines (ChatGPT, Perplexity)
- **JSON-LD in `index.html`** — `LocalBusiness` schema with full service catalog + `Person` schema
- **Dynamic SEO from WP** — `globalSeoTitle` and `globalSeoDescription` in `fgGlobal` override meta tags at runtime via `useEffect` in `App.jsx`

---

## Deployment

```bash
npm run build          # generates /dist
```

Upload the entire `/dist` folder to `dangelwellness.ca/public_html/`. The `.htaccess` file inside `/dist` handles SPA routing on Apache (all routes return `index.html`).

---

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| Blank page / "GraphQL error" | Queried a field that doesn't exist in WP | Remove the field from `queries.js` |
| Section shows "Cette section est temporairement indisponible" | A section component crashed (bad data shape) | Open browser console — the ErrorBoundary logs the exact error and component stack |
| Skeleton spins forever, no content | `VITE_GRAPHQL_URI` points to a server that isn't running | Start Local by Flywheel (dev) or check network tab for the failing request |
| Section is empty | ACF fields not filled in WP Admin | Fill content in Pages → Home |
| Images show placeholder | `heroPhoto` / `aboutPhoto` not set in WP | Upload image in WP Admin → Media |
| `useQuery` not exported | Apollo Client v4 breaks this export | Project pins `@apollo/client@^3.x` |
| Stale bundle after package changes | Vite caches aggressively | `rm -rf node_modules/.vite` then restart |
| `fgFAQ` returns null | WPGraphQL lowercases after acronym | Use `fgFaq` (lowercase q) |
| `VITE_GRAPHQL_URI` is undefined in code | Variable not prefixed with `VITE_` | All browser-accessible env vars must start with `VITE_` |

---

## Key JavaScript / React Concepts Used

| Concept | Where to see it |
|---|---|
| `useState` | `App.jsx` (modal), `FAQ.jsx` (accordion), `Contact.jsx` (form), `Nav.jsx` (mobile menu) |
| `useEffect` | `App.jsx` (SEO tags), `BookingModal.jsx` (focus, Esc key, body scroll) |
| `useRef` | `BookingModal.jsx` (DOM focus management) |
| Custom hooks | `src/hooks/useLanguage.js`, `src/hooks/useAnalytics.js` |
| `useQuery` (Apollo) | `App.jsx` only |
| Props + destructuring | Every component: `({ data: d, onBook })` |
| Optional chaining `?.` | Everywhere: `h.heroPhoto?.node?.sourceUrl` |
| Nullish coalescing `??` / OR `\|\|` | Everywhere: `d.faqItems \|\| []` |
| `Array.map()` | Every list/repeater: `items.map((item, i) => ...)` |
| Conditional rendering | `{condition && <JSX>}` and `{cond ? a : b}` |
| `dangerouslySetInnerHTML` + DOMPurify | `Hero.jsx` — injects WP HTML, sanitized before injection |
| Class component + error lifecycle | `ErrorBoundary.jsx` — `getDerivedStateFromError`, `componentDidCatch` |
| CSS `@keyframes` animation | `loading-skeleton.css` — pulse animation for skeleton bars |
| Vite environment variables | `src/graphql/client.js` — `import.meta.env.VITE_GRAPHQL_URI` |
| Event listener cleanup | `BookingModal.jsx`, `useLanguage.js` |
| Focus trap | `BookingModal.jsx` |
| `history.pushState` | `useLanguage.js` (URL-based language switching) |
