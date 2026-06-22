# Dangel — Landing Page

Landing page for **Dangel, Thérapeute Holistique**. A single-page marketing site built with React + Vite, consuming content from a WordPress backend through GraphQL.

---

## What This Project Is

The site has no database of its own. All text, images, and settings live inside a **WordPress** installation running locally (via Local by Flywheel). React fetches that content through a **GraphQL API** (provided by the WPGraphQL plugin) and renders it as a fast, static-feeling landing page.

Think of it this way:
- **WordPress** = where the client edits content (text, photos, settings)
- **GraphQL** = the bridge that delivers that content as structured data
- **React** = what turns that data into the webpage visitors see

---

## Prerequisites

Before you can run this project you need two things running on your machine:

### 1. Local by Flywheel (WordPress)
The WordPress site is named **dangelwellness** and must be running in [Local by Flywheel](https://localwp.com/) before the React app will load any content.

- Open Local → start the **dangelwellness** site
- WordPress admin: `http://dangelwellness.local/wp-admin`
- GraphQL endpoint: `http://dangelwellness.local/graphql`

### 2. Node.js
Install [Node.js](https://nodejs.org/) (v18 or later). This lets you run the React development server.

---

## Getting Started

```bash
# 1. Go into the project folder
cd landing-page-dangel

# 2. Install dependencies (only needed once)
npm install

# 3. Start the development server
npm run dev
```

Then open your browser at `http://localhost:5173`.

> The page will be blank or show a GraphQL error if the Local WordPress site is not running.

---

## Project Structure

```
landing-page-dangel/
├── index.html                  # HTML shell — lang="fr", page title
├── vite.config.js              # Vite bundler config
├── package.json                # Dependencies and scripts
└── src/
    ├── main.jsx                # Entry point — wraps app with Apollo (GraphQL) provider
    ├── App.jsx                 # Root component — one GraphQL query, passes data to sections
    ├── graphql/
    │   ├── client.js           # Apollo Client setup pointing to WP GraphQL endpoint
    │   └── queries.js          # The single GET_PAGE query that fetches all content
    ├── components/             # One file per page section
    │   ├── Nav.jsx
    │   ├── Hero.jsx
    │   ├── Benefits.jsx
    │   ├── Services.jsx
    │   ├── Process.jsx
    │   ├── About.jsx
    │   ├── Testimonials.jsx
    │   ├── FAQ.jsx
    │   ├── Contact.jsx
    │   ├── CtaFinal.jsx
    │   └── Footer.jsx
    └── styles/                 # One CSS file per component + shared tokens
        ├── tokens.css          # ALL design variables (colors, fonts, spacing, radii)
        ├── nav.css
        ├── hero.css
        ├── benefits.css
        ├── services.css
        ├── process.css
        ├── about.css
        ├── testimonials.css
        ├── faq.css
        ├── contact.css
        ├── cta-final.css
        └── footer.css
```

---

## How Content Flows

```
WordPress Admin (client edits content)
        ↓
  ACF Pro field groups (structured fields per section)
        ↓
  WPGraphQL plugin (exposes fields as GraphQL API)
        ↓
  GET_PAGE query in queries.js (fetches everything at once)
        ↓
  App.jsx (distributes data as props to each section)
        ↓
  Section components (render the HTML)
```

### Key rule: data flows top-down
`App.jsx` runs **one** GraphQL query for the entire page. It then passes each section's data down as a `data` prop. No component fetches its own data. This means:

```jsx
// App.jsx
<Hero data={p?.fgHero} />
<Benefits data={p?.fgBenefits} />

// Hero.jsx — receives data as a prop, never calls useQuery
export default function Hero({ data: h }) { ... }
```

---

## WordPress ACF Field Groups

Content is organized into **12 ACF (Advanced Custom Fields) field groups**, each prefixed `fg_` and attached to the WordPress page with the slug `home`.

| GraphQL name | WP field group | Section |
|---|---|---|
| `fgNavigation` | `fg_navigation` | Top nav bar |
| `fgGlobal` | `fg_global` | Site-wide info (phone, email, address) |
| `fgHero` | `fg_hero` | Hero / above the fold |
| `fgBenefits` | `fg_benefits` | Why choose Dangel (5 cards) |
| `fgServices` | `fg_services` | Service offerings |
| `fgProcess` | `fg_process` | How it works (3 steps) |
| `fgAbout` | `fg_about` | About / bio section |
| `fgTestimonials` | `fg_testimonials` | Client reviews (6 cards) |
| `fgFaq` | `fg_faq` | Frequently asked questions |
| `fgContact` | `fg_contact` | Contact info + form |
| `fgCtaFinal` | `fg_cta_final` | Final call to action (dark section) |
| `fgFooter` | `fg_footer` | Footer links and copyright |

### Repeater fields
Some fields are **repeaters** (lists), like `benefitsItems`, `servicesItems`, `faqItems`. In GraphQL these return as plain arrays — not wrapped in `nodes`. Always access them directly and default to `[]` to avoid crashes when empty:

```js
const items = d.benefitsItems || []
```

---

## Styling Rules

- **No Tailwind, no CSS-in-JS.** Plain CSS only.
- All design tokens (colors, fonts, spacing, border radii, motion) live in `src/styles/tokens.css` as CSS custom properties (`--variable-name`).
- Every component imports only its own CSS file.
- Styles are **mobile-first**: base styles target small screens, `@media (min-width: ...)` overrides handle larger screens.

### Key tokens
```css
--cream:        #F7F4EE;   /* main background */
--cream-light:  #FDFCFA;   /* alternate section background */
--carbon:       #1C1C1A;   /* dark background (CtaFinal, Footer) */
--teal:         #3D8E8A;   /* primary accent / brand color */
--font-heading: 'Playfair Display', serif;
--font-body:    'DM Sans', sans-serif;
```

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server at `http://localhost:5173` |
| `npm run build` | Build production files into `/dist` |
| `npm run preview` | Preview the production build locally |

---

## Common Issues

**Page is blank / "GraphQL error"**
→ The Local WordPress site is not running. Open Local by Flywheel and start the dangelwellness site.

**Content shows but images are placeholders**
→ Images haven't been uploaded yet in WordPress Admin → Media or inside the ACF fields.

**A section is empty**
→ The ACF fields for that section haven't been filled in WordPress Admin → Pages → Home.

**Styles look broken after editing tokens.css**
→ Make sure your variable name matches exactly (CSS variables are case-sensitive).
