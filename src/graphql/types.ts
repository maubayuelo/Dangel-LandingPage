// ─────────────────────────────────────────────────────────────────────────────
// src/graphql/types.ts — TYPESCRIPT TYPES FOR WPGRAPHQL RESPONSES
//
// WHY THIS FILE EXISTS:
//   WordPress + WPGraphQL return data with very specific field names that are
//   easy to mistype. For example, the FAQ field group is `fgFaq` (lowercase q),
//   NOT `fgFAQ` — because WPGraphQL lowercases the letter after an acronym.
//   TypeScript catches these typos at compile time instead of silently returning
//   `null` at runtime and showing a blank section to users.
//
// IMPORTANT NAMING RULES (match WPGraphQL exactly — do not "clean up"):
//   - All field group names are camelCase: fgNavigation, fgGlobal, fgFaq, etc.
//   - Repeater sub-fields keep their ACF prefix: ben*, sv*, ps*, sc*, etc.
//   - fgFaq not fgFAQ (WPGraphQL lowercases after acronyms — see README)
//
// HOW TYPES RELATE TO OTHER FILES:
//   queries.js   → defines which fields we ASK WordPress for
//   types.ts     → defines the SHAPE of what WordPress sends back
//   App.tsx      → uses PageData to type the useQuery() call
//   FAQ.tsx etc. → use the individual field group types for props
//
// ALL FIELDS ARE OPTIONAL (string | null | undefined):
//   WordPress fields are only populated if the client fills them in WP Admin.
//   Making fields optional (using `?:`) means TypeScript correctly forces us
//   to handle the "field not filled in yet" case — matching our existing
//   pattern of `d.fieldName || 'fallback'` throughout the components.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared sub-type: WordPress Media field ───────────────────────────────────
// WPGraphQL wraps image fields in a { node: { sourceUrl, altText } } structure.
// Used by fgHero.heroPhoto and fgAbout.aboutPhoto.
export interface WPImage {
  node: {
    sourceUrl: string
    altText:   string
  }
}

// ── fgNavigation (fg_navigation) ─────────────────────────────────────────────
// navLinks is a repeater: each item has a label (display text) and an anchor
// (the #section-id the nav link scrolls to, e.g. "#services").
export interface NavLink {
  nlLabel:  string
  nlAnchor: string
}

export interface FgNavigation {
  navLogoText?:  string | null
  navLogoImage?: WPImage | null
  navLinks?:     NavLink[] | null
  navCtaLabel?:  string | null
}

// ── fgGlobal (fg_global) ─────────────────────────────────────────────────────
// Site-wide settings used across multiple sections.
// globalBookingUrl → passed to every CTA button (Nav, Hero, Services, About, CtaFinal)
// globalMeta*/globalGa4Id → analytics hooks (empty string = hooks stay inert)
// globalSeo* → updated into <head> meta tags via useEffect in App.tsx
export interface FgGlobal {
  globalBookingUrl?:     string | null
  globalSitePhone?:      string | null
  globalSiteEmail?:      string | null
  globalSiteAddress?:    string | null
  globalSeoTitle?:       string | null
  globalSeoDescription?: string | null
  // globalSeoOgImageUrl is commented out in queries.js until the WP field exists.
  // Add it here (and uncomment in queries.js) when the WP ACF field is created.
  // globalSeoOgImageUrl?: string | null
  globalMetaPixelId?:    string | null
  globalGa4Id?:          string | null
}

// ── fgHero (fg_hero) ─────────────────────────────────────────────────────────
// heroHeadline contains raw HTML with <em> tags — DOMPurify sanitizes it before
// dangerouslySetInnerHTML injects it. stripOuterP() removes the WordPress <p> wrapper.
export interface FgHero {
  heroEyebrow?:           string | null
  heroHeadline?:          string | null  // contains HTML — sanitize before rendering
  heroSubtext?:           string | null
  heroSubtext2?:          string | null
  heroTrustRating?:       string | null
  heroTrustText?:         string | null
  heroCtaPrimaryLabel?:   string | null
  heroCtaSecondaryLabel?: string | null
  heroPhoto?:             WPImage | null
}

// ── fgBenefits (fg_benefits) ─────────────────────────────────────────────────
// benefitsItems is a repeater. Sub-field prefix: ben*
export interface BenefitsItem {
  benNumber:      string
  benTitle:       string
  benDescription: string
}

export interface FgBenefits {
  benefitsEyebrow?:  string | null
  benefitsTitle?:    string | null
  benefitsSubtitle?: string | null
  benefitsItems?:    BenefitsItem[] | null
}

// ── fgServices (fg_services) ─────────────────────────────────────────────────
// servicesItems is a repeater. Sub-field prefix: sv*
// svTechniqueTags is a plain text field that the component splits by comma/newline
// into individual tag chips — it is NOT a repeater itself.
export interface ServicesItem {
  svName?:          string | null
  svDescription?:   string | null
  svDuration?:      string | null
  svPrice?:         string | null
  svTechniqueTags?: string | null  // comma/newline separated — split in component
  svCtaLabel?:      string | null
}

export interface FgServices {
  servicesEyebrow?:  string | null
  servicesTitle?:    string | null
  servicesSubtitle?: string | null
  servicesNote?:     string | null
  servicesItems?:    ServicesItem[] | null
}

// ── fgProcess (fg_process) ────────────────────────────────────────────────────
// processSteps is a repeater. Sub-field prefix: ps*
export interface ProcessStep {
  psNumber:      string
  psTitle:       string
  psDescription: string
}

export interface FgProcess {
  processEyebrow?:  string | null
  processTitle?:    string | null
  processSubtitle?: string | null
  processSteps?:    ProcessStep[] | null
}

// ── fgAbout (fg_about) ───────────────────────────────────────────────────────
// aboutDisciplinesList returns HTML <ul><li> — About.jsx parses it with
// parseListItems() to extract text and render teal chip badges.
// aboutLanguages is a repeater. Sub-field prefix: lang*
export interface AboutLanguage {
  langFlag:  string
  langLabel: string
}

export interface FgAbout {
  aboutEyebrow?:          string | null
  aboutTitle?:            string | null
  aboutBody?:             string | null
  aboutDiffBody?:         string | null
  aboutDisciplinesList?:  string | null  // HTML <ul><li> — parse with parseListItems()
  aboutCtaLabel?:         string | null
  aboutPhoto?:            WPImage | null
  aboutPhotoCaption?:     string | null
  aboutLanguages?:        AboutLanguage[] | null
}

// ── fgTestimonials (fg_testimonials) ─────────────────────────────────────────
// testimonialsItems is a repeater. Sub-field prefix: ts*
// tsOriginalLang stores the language the quote was written in (e.g. "fr").
// Testimonials.jsx uses this to show "Translated from French" when viewing
// the site in a different language.
export interface TestimonialItem {
  tsName?:         string | null
  tsQuote?:        string | null
  tsService?:      string | null
  tsDate?:         string | null
  tsOriginalLang?: string | null  // e.g. "fr", "en", "es"
}

export interface FgTestimonials {
  testimonialsEyebrow?:    string | null
  testimonialsTitle?:      string | null
  testimonialsSocialProof?: string | null
  testimonialsItems?:      TestimonialItem[] | null
  testimonialsFbLinkLabel?: string | null
  testimonialsFbLinkUrl?:  string | null
}

// ── fgFaq (fg_faq) ───────────────────────────────────────────────────────────
// ⚠️  NOTE: This is fgFaq (lowercase q), NOT fgFAQ.
// WPGraphQL lowercases the first letter after an acronym: fg_faq → fgFaq.
// If you type fgFAQ anywhere in the codebase, TypeScript will now catch it.
// faqItems is a repeater. Sub-field prefix: fq* (not faq*)
export interface FaqItem {
  fqQuestion: string
  fqAnswer:   string
}

export interface FgFaq {
  faqEyebrow?: string | null
  faqTitle?:   string | null
  faqItems?:   FaqItem[] | null
}

// ── fgContact (fg_contact) ───────────────────────────────────────────────────
// contactScheduleItems is a repeater. Sub-field prefix: sc*
// The remaining fields are all plain text: labels, placeholders, and display values.
export interface ContactScheduleItem {
  scDay:   string
  scHours: string
}

export interface FgContact {
  contactEyebrow?:               string | null
  contactTitle?:                 string | null
  contactSubtitle?:              string | null
  contactLabelAddress?:          string | null
  contactAddress?:               string | null
  contactLabelPhone?:            string | null
  contactPhone?:                 string | null
  contactLabelEmail?:            string | null
  contactEmail?:                 string | null
  contactScheduleTitle?:         string | null
  contactScheduleItems?:         ContactScheduleItem[] | null
  contactFormTitle?:             string | null
  contactFormLabelName?:         string | null
  contactFormPlaceholderName?:   string | null
  contactFormLabelEmail?:        string | null
  contactFormPlaceholderEmail?:  string | null
  contactFormLabelMessage?:      string | null
  contactFormPlaceholderMsg?:    string | null
  contactFormCtaLabel?:          string | null
}

// ── fgCtaFinal (fg_cta_final) ────────────────────────────────────────────────
// ⚠️  IMPORTANT: Only 3 fields exist in WordPress for this group.
// Do NOT add more fields here without first creating them in WP Admin → ACF.
// A field in the GraphQL query that doesn't exist in WP causes the ENTIRE
// page query to fail — not just this section.
export interface FgCtaFinal {
  ctaFinalTitle?:    string | null
  ctaFinalSubtitle?: string | null
  ctaFinalCtaLabel?: string | null
}

// ── fgFooter (fg_footer) ─────────────────────────────────────────────────────
// footerNavItems and footerSocialItems are repeaters.
// Sub-field prefixes: fn* and fs* respectively.
// Address, phone, email, and copyright come from fgGlobal — NOT from fgFooter.
// Footer.jsx receives both `data` (fgFooter) and `global` (fgGlobal) as props.
export interface FooterNavItem {
  fnLabel:  string
  fnAnchor: string
}

export interface FooterSocialItem {
  fsName: string
  fsUrl:  string
}

export interface FgFooter {
  footerBrandName?:    string | null
  footerTagline?:      string | null
  footerNavTitle?:     string | null
  footerNavItems?:     FooterNavItem[] | null
  footerSocialTitle?:  string | null
  footerSocialItems?:  FooterSocialItem[] | null
  footerCopyright?:    string | null
}

// ── PageData — the full shape of data.page from GET_PAGE ─────────────────────
// This is the top-level type used to annotate useQuery in App.tsx:
//   useQuery<{ page: PageData }>(GET_PAGE)
//
// Every field group is optional because:
//   a) WordPress might not have the ACF field group attached yet
//   b) The page might not exist at the queried URI (WPML language not set up yet)
//
// Matching the App.jsx pattern: `const p = data?.page` then `p?.fgHero`, etc.
export interface PageData {
  fgNavigation?:  FgNavigation  | null
  fgGlobal?:      FgGlobal      | null
  fgHero?:        FgHero        | null
  fgBenefits?:    FgBenefits    | null
  fgServices?:    FgServices    | null
  fgProcess?:     FgProcess     | null
  fgAbout?:       FgAbout       | null
  fgTestimonials?: FgTestimonials | null
  fgFaq?:         FgFaq         | null   // ← fgFaq NOT fgFAQ
  fgContact?:     FgContact     | null
  fgCtaFinal?:    FgCtaFinal    | null
  fgFooter?:      FgFooter      | null
}
