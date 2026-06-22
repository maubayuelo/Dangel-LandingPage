# CLAUDE.md — Dangel Landing Page

This file gives Claude Code complete context about this project. Read it fully before making any changes.

---

## Project Overview

**Dangel, Thérapeute Holistique** — a single-page marketing landing page in French.

**Stack:** React 19 + Vite 8, Apollo Client 3, plain CSS with custom properties.
**Content source:** WordPress (Local by Flywheel) via WPGraphQL + ACF Pro.
**No Next.js. No Tailwind. No CSS-in-JS. No shadcn/ui. No lucide-react.**

---

## Architecture in One Sentence

`App.jsx` fires **one** GraphQL query (`GET_PAGE`) against a local WordPress GraphQL endpoint, then passes each section's data down as a `data` prop to the matching React component. No component ever calls `useQuery` directly.

---

## WordPress Setup

- **Local by Flywheel** must be running for any content to appear.
- Site name: `dangelwellness`
- GraphQL endpoint: `http://dangelwellness.local/graphql`
- WordPress admin: `http://dangelwellness.local/wp-admin`
- The page that holds all content has the slug `home` — the GraphQL query targets it with `page(id: "home", idType: URI)`.

### WPGraphQL behaviour to know
- **wpautop**: WordPress auto-wraps text fields in `<p>` tags. Use `stripOuterP()` (defined in `Hero.jsx`) when rendering HTML fields inside headings.
- **Repeaters**: ACF repeater fields return as plain JavaScript arrays, **not** wrapped in a `nodes` key (unlike WP post queries). Always access directly: `d.benefitsItems || []`.
- **ACF graphql_field_name**: WPGraphQL converts `snake_case` ACF field names to `camelCase`. If a field group's `graphql_field_name` was customised in ACF, the GraphQL name may differ from the automatic conversion. Always verify against the actual WP field `Name` column (not the Label).
- **Acronym casing**: WPGraphQL lowercases letters after an acronym — `fg_faq` becomes `fgFaq`, not `fgFAQ`.
- **ACF textarea line breaks**: Textarea fields from ACF contain `\n` characters. HTML ignores these by default. Apply `white-space: pre-line` in CSS to preserve line breaks.

---

## File Map

```
src/
├── main.jsx              — Entry. ApolloProvider wraps App. Imports tokens.css first.
├── App.jsx               — Single useQuery(GET_PAGE). Distributes data props to all sections.
├── graphql/
│   ├── client.js         — Apollo Client pointed at dangelwellness.local/graphql
│   └── queries.js        — GET_PAGE (master query) + GET_HERO (isolated test query)
├── components/
│   ├── Nav.jsx           — Sticky nav. Logo image from WP if available, text fallback.
│   ├── Hero.jsx          — Hero section. stripOuterP() for headline. Photo fallback to placehold.co.
│   ├── Benefits.jsx      — 5-column bento grid on desktop.
│   ├── Services.jsx      — 3-column [2+1] bento. svTechniqueTags split by comma/newline into tags.
│   ├── Process.jsx       — 3 equal cards with large step numbers.
│   ├── About.jsx         — 2-col photo+content. parseListItems() extracts <li> from aboutDisciplinesList HTML into teal chips.
│   ├── Testimonials.jsx  — 6-col grid, 3 rows of 2. Spans [2,4, 3,3, 4,2] = 1/3+2/3, equal, 2/3+1/3.
│   ├── FAQ.jsx           — Accordion. Inline SVG chevron (no icon library).
│   ├── Contact.jsx       — Info column + form card. Form has a sent-confirmation state.
│   ├── CtaFinal.jsx      — Dark background (#1C1C1A). Button is WHITE with TEAL text — intentional inversion.
│   └── Footer.jsx        — Dark background. Receives both `data` (fgFooter) and `global` (fgGlobal) props.
└── styles/
    ├── tokens.css        — Single source of truth for ALL design tokens. Import this first.
    └── [section].css     — One CSS file per component. Mobile-first.
```

---

## ACF Field Groups

All 12 field groups are attached to the WordPress `home` page. The GraphQL field group names (camelCase) and their WP ACF names (snake_case with `fg_` prefix):

| GraphQL | WP name | Notes |
|---|---|---|
| `fgNavigation` | `fg_navigation` | `navLinks` is a repeater: `{ nlLabel, nlAnchor }` |
| `fgGlobal` | `fg_global` | Site-wide: phone, email, address, booking URL. Passed to Footer as `global` prop. |
| `fgHero` | `fg_hero` | `heroHeadline` contains HTML (`<em>`). `heroPhoto` is a WP media field. |
| `fgBenefits` | `fg_benefits` | `benefitsItems` repeater: `{ benNumber, benTitle, benDescription }` |
| `fgServices` | `fg_services` | `servicesItems` repeater: `{ svName, svDescription, svDuration, svPrice, svTechniqueTags, svCtaLabel }` |
| `fgProcess` | `fg_process` | `processSteps` repeater: `{ psNumber, psTitle, psDescription }`. Field confirmed as `processEyebrow`. |
| `fgAbout` | `fg_about` | `aboutDisciplinesList` returns HTML `<ul><li>` — parse with `parseListItems()`. `aboutLanguages` repeater: `{ langFlag, langLabel }`. |
| `fgTestimonials` | `fg_testimonials` | `testimonialsItems` repeater: `{ tsName, tsQuote, tsService, tsDate }`. Quote symbols omitted — client adds them in WP. |
| `fgFaq` | `fg_faq` | Note lowercase: `fgFaq` not `fgFAQ`. `faqItems` repeater: `{ fqQuestion, fqAnswer }` |
| `fgContact` | `fg_contact` | `contactScheduleItems` repeater: `{ scDay, scHours }`. All 19 fields confirmed against WP admin. |
| `fgCtaFinal` | `fg_cta_final` | Only 3 fields exist: `ctaFinalTitle`, `ctaFinalSubtitle`, `ctaFinalCtaLabel`. Do NOT add fields that aren't in WP or GraphQL will error the entire query. |
| `fgFooter` | `fg_footer` | `footerNavItems` repeater: `{ fnLabel, fnAnchor }`. `footerSocialItems` repeater: `{ fsName, fsUrl }`. No address/legalLinks fields — those come from `fgGlobal`. |

---

## Data Flow

```
WordPress Admin
  └── ACF fields on page slug "home"
        └── WPGraphQL exposes as GraphQL types
              └── GET_PAGE query in queries.js
                    └── App.jsx receives { data, loading, error }
                          ├── <Nav data={p?.fgNavigation} />
                          ├── <Hero data={p?.fgHero} />
                          ├── <Benefits data={p?.fgBenefits} />
                          ├── <Services data={p?.fgServices} />
                          ├── <Process data={p?.fgProcess} />
                          ├── <About data={p?.fgAbout} />
                          ├── <Testimonials data={p?.fgTestimonials} />
                          ├── <FAQ data={p?.fgFaq} />
                          ├── <Contact data={p?.fgContact} />
                          ├── <CtaFinal data={p?.fgCtaFinal} />
                          └── <Footer data={p?.fgFooter} global={p?.fgGlobal} />
```

---

## Design System

All tokens live in `src/styles/tokens.css`. Never hardcode color, spacing, or font values in component CSS files — always use a token.

### Colors
```css
--cream:       #F7F4EE   /* main page background */
--cream-light: #FDFCFA   /* alternate section background */
--white:       #ffffff
--carbon:      #1C1C1A   /* dark sections: CtaFinal, Footer */
--teal:        #3D8E8A   /* brand accent, primary buttons, links */
--teal-border: #C2D4CF   /* light teal for borders */
--border:      #E8E2D9   /* standard card/divider border */
--text-muted:  #6B6B6B
--text-dimmer: #9B9790
```

### Section background alternation
- `--cream` (`#F7F4EE`): Hero, Services, About, Testimonials, Contact
- `--cream-light` (`#FDFCFA`): Benefits, Process, FAQ
- `--carbon` (`#1C1C1A`): CtaFinal, Footer

### Typography
```css
--font-heading: 'Playfair Display', serif   /* section titles, hero h1 */
--font-body:    'DM Sans', sans-serif       /* body text, nav, buttons */
```
Fonts loaded via Google Fonts import at top of `tokens.css`.

### Spacing scale
`--space-1` through `--space-28` in `0.25rem` increments. `--section-py: var(--space-24)` (96px) is the standard vertical padding for every section.

### Shared CSS classes (defined in tokens.css)
- `.container` — centers content, applies max-width + horizontal padding
- `.section-header` — centers eyebrow + title + subtitle block, applies bottom margin
- `.eyebrow` — small uppercase teal label above section titles
- `.btn-primary` — teal background, white text
- `.btn-outline` — transparent background, teal border and text

---

## Coding Rules

### Never do this
- Add `useQuery` inside a component — all data comes from `App.jsx` via props
- Use Tailwind classes or install Tailwind
- Install or import lucide-react, shadcn/ui, or any icon library
- Hardcode hex colors or pixel values in component CSS
- Query a GraphQL field that doesn't exist in WP (causes a full-page GraphQL error)

### Always do this
- Default repeater arrays to `[]`: `const items = d.faqItems || []`
- Return `null` early if `data` prop is missing: `if (!d) return null`
- Use `placehold.co` for image fallbacks: `https://placehold.co/440x587/F7F4EE/9B9790?text=Photo`
- Write mobile-first CSS (base = mobile, `@media (min-width: ...)` = desktop)
- Apply `white-space: pre-line` to elements rendering ACF textarea content

### Adding a new section
1. Add the ACF field group to WordPress and note the `graphql_field_name` for the group
2. Add the fields to `GET_PAGE` in `queries.js` — verify each field name against WP admin's "Name" column (not Label)
3. Create `src/components/MySectionName.jsx` — accept `{ data: d }`, return `null` if `!d`
4. Create `src/styles/my-section-name.css` — import inside the component
5. Import the component in `App.jsx` and pass `data={p?.fgMySection}`

### Modifying GraphQL fields
Before adding a field to the query, confirm it exists in WP Admin → Custom Fields → the relevant field group → Name column. A single non-existent field in the query causes the **entire page** to return a GraphQL error.

---

## Known Gotchas

| Issue | Cause | Fix |
|---|---|---|
| Entire page shows GraphQL error | Queried a field that doesn't exist in WP | Remove the field from `queries.js` |
| `useQuery` not exported | Apollo Client v4 breaks this export | Project pins `@apollo/client@^3.x` — do not upgrade to v4 |
| Stale bundle after package changes | Vite caches aggressively | `rm -rf node_modules/.vite` then restart dev server |
| `heroHeadline` renders `<p>` inside `<h1>` | WPGraphQL applies wpautop | Use `stripOuterP()` before `dangerouslySetInnerHTML` |
| Textarea content ignores line breaks | HTML collapses whitespace | Add `white-space: pre-line` in CSS |
| `fgFAQ` returns null | WPGraphQL lowercases after acronym | Use `fgFaq` (lowercase q) |
| Section is blank with no error | ACF fields not filled in WP admin | Fill content in WP Admin → Pages → Home |

---

## Phase Scope

**Phase 2 (current — complete):** All 11 sections built and wired to WPGraphQL.

**Not built (Phase 3):**
- Language switching (FR / EN / ES) — nav buttons are UI-only stubs
- Booking modal (`fgGlobal` has `globalBookingUrl` for when ready)
- Analytics
- Form backend (Contact form currently shows a UI-only sent confirmation state)
