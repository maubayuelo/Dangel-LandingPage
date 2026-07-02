// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — graphql/queries.js — GRAPHQL QUERY DEFINITIONS
//
// This file defines the shape of the data we ask WordPress for.
//
// HOW GRAPHQL QUERIES WORK:
//   - gql is a "tagged template literal" — it parses the string inside backticks
//     into a structured query object that Apollo understands.
//   - The query is like a JSON blueprint: you list exactly which fields you want.
//     WordPress will return ONLY those fields — no more, no less.
//   - Variables (like $pageId) are placeholders filled in at runtime from JS.
//
// CRITICAL RULE:
//   Every field listed here MUST exist in WordPress ACF admin.
//   One typo or non-existent field causes a GraphQL error that breaks the
//   ENTIRE page — not just one section.
// ─────────────────────────────────────────────────────────────────────────────

import { gql } from '@apollo/client'

// GET_PAGE is the master query — fetches ALL content for the entire page in one
// HTTP request. App.jsx runs this query once and distributes the data.
//
// $pageId: ID! means the variable is required (! = non-null in GraphQL).
// We pass the WordPress page URI (e.g. "/fr/accueil/") so WPML can serve
// the correct language version of the page.
export const GET_PAGE = gql`
  query GetPage($pageId: ID!) {
    # page() is a WPGraphQL built-in resolver.
    # idType: URI means we identify the page by its URL slug, not its database ID.
    page(id: $pageId, idType: URI) {

      # ── Navigation ──────────────────────────────────────────────────────────
      # ACF field group: fg_navigation
      # navLinks is a REPEATER field — it returns an array of objects, each
      # with nlLabel (display text) and nlAnchor (the #section-id to scroll to).
      fgNavigation {
        navLogoText
        navLogoImage { node { sourceUrl altText } }
        navLinks { nlLabel nlAnchor }
        navCtaLabel
      }

      # ── Global / site-wide settings ─────────────────────────────────────────
      # ACF field group: fg_global
      # These fields are used across multiple sections (phone in Contact AND Footer,
      # bookingUrl passed to every CTA button, analytics IDs, SEO overrides).
      fgGlobal {
        globalBookingUrl
        globalSitePhone
        globalSiteEmail
        globalSiteAddress
        globalSeoTitle
        globalSeoDescription
        # globalSeoOgImageUrl — add a Text field named "global_seo_og_image_url"
        # in WP ACF fg_global, then uncomment the line below to activate.
        # globalSeoOgImageUrl
        # Analytics IDs — hooks return immediately when these are empty strings.
        # Fill them in WP Admin → Pages → Home → Global Settings to activate.
        globalMetaPixelId
        globalGa4Id
      }

      # ── Hero (above the fold) ────────────────────────────────────────────────
      # ACF field group: fg_hero
      # heroHeadline contains HTML (<em> tags) — WordPress wraps it in <p> via
      # wpautop. Hero.jsx uses stripOuterP() to remove that outer <p> before
      # rendering inside an <h1> (nested block elements are invalid HTML).
      # heroPhoto is a WordPress Media field — WPGraphQL returns it as a nested
      # object: { node: { sourceUrl, altText } }
      fgHero {
        heroEyebrow
        heroHeadline
        heroSubtext
        heroSubtext2
        heroTrustRating
        heroTrustText
        heroCtaPrimaryLabel
        heroCtaSecondaryLabel
        heroPhoto { node { sourceUrl altText } }
      }

      # ── Benefits ────────────────────────────────────────────────────────────
      # ACF field group: fg_benefits
      # benefitsItems is a REPEATER — an array of { benNumber, benTitle, benDescription }
      fgBenefits {
        benefitsEyebrow
        benefitsTitle
        benefitsSubtitle
        benefitsItems { benNumber benTitle benDescription }
      }

      # ── Services ────────────────────────────────────────────────────────────
      # ACF field group: fg_services
      # svTechniqueTags is a plain text field — the component splits it by comma
      # or newline to render individual tag chips.
      fgServices {
        servicesEyebrow
        servicesTitle
        servicesSubtitle
        servicesNote
        servicesItems {
          svName svDescription svDuration svPrice svTechniqueTags svCtaLabel
        }
      }

      # ── Process (how it works) ───────────────────────────────────────────────
      # ACF field group: fg_process
      fgProcess {
        processEyebrow
        processTitle
        processSubtitle
        processSteps { psNumber psTitle psDescription }
      }

      # ── About ───────────────────────────────────────────────────────────────
      # ACF field group: fg_about
      # aboutDisciplinesList returns HTML <ul><li> — About.jsx uses parseListItems()
      # to extract the text from each <li> and render them as teal chip badges.
      # aboutLanguages is a repeater of flag emoji + label pairs.
      # aboutCertifications repeater: certTitle, certMeta, certBadge, certIcon.
      #   GOTCHA: certIcon is an ACF Select — WPGraphQL returns it as an ARRAY
      #   ["badge"], not a string "badge". CertIcon() in About.jsx unwraps it.
      # aboutFormations repeater: formationLabel (one pill per entry).
      fgAbout {
        aboutEyebrow
        aboutTitle
        aboutBody
        aboutDiffBody
        aboutDisciplinesList
        aboutCtaLabel
        aboutPhoto { node { sourceUrl altText } }
        aboutPhotoCaption
        aboutLanguages { langFlag langLabel }
        aboutCertifications { certTitle certMeta certBadge certIcon }
        aboutFormations { formationLabel }
      }

      # ── Testimonials ────────────────────────────────────────────────────────
      # ACF field group: fg_testimonials
      # tsOriginalLang stores the language the quote was written in (e.g. "fr").
      # Testimonials.jsx uses this to show a "Translated from French" label
      # when the site is being viewed in a different language.
      fgTestimonials {
        testimonialsEyebrow
        testimonialsTitle
        testimonialsSocialProof
        testimonialsItems { tsName tsQuote tsService tsDate tsOriginalLang }
        testimonialsFbLinkLabel
        testimonialsFbLinkUrl
      }

      # ── FAQ ─────────────────────────────────────────────────────────────────
      # ACF field group: fg_faq
      # NOTE: WPGraphQL lowercases letters after acronyms.
      # "fg_FAQ" → "fgFaq" (not "fgFAQ"). This catches many developers off guard.
      fgFaq {
        faqEyebrow
        faqTitle
        faqItems { fqQuestion fqAnswer }
      }

      # ── Contact ─────────────────────────────────────────────────────────────
      # ACF field group: fg_contact
      # contactScheduleItems is a repeater of day + hours pairs for the schedule table.
      # The form fields are label/placeholder text — content managed from WP.
      fgContact {
        contactEyebrow
        contactTitle
        contactSubtitle
        contactLabelAddress
        contactAddress
        contactLabelPhone
        contactPhone
        contactLabelEmail
        contactEmail
        contactScheduleTitle
        contactScheduleItems { scDay scHours }
        contactFormTitle
        contactFormLabelName
        contactFormPlaceholderName
        contactFormLabelEmail
        contactFormPlaceholderEmail
        contactFormLabelMessage
        contactFormPlaceholderMsg
        contactFormCtaLabel
      }

      # ── CTA Final ───────────────────────────────────────────────────────────
      # ACF field group: fg_cta_final
      # IMPORTANT: Only 3 fields exist in WP. Do NOT add fields here that
      # don't exist in WordPress — the entire query will fail with a GraphQL error.
      fgCtaFinal {
        ctaFinalTitle
        ctaFinalSubtitle
        ctaFinalCtaLabel
      }

      # ── Footer ──────────────────────────────────────────────────────────────
      # ACF field group: fg_footer
      # footerNavItems and footerSocialItems are repeaters.
      # Address and copyright come from fgGlobal, not from here — Footer.jsx
      # receives both data (fgFooter) and global (fgGlobal) as separate props.
      fgFooter {
        footerBrandName
        footerTagline
        footerNavTitle
        footerNavItems { fnLabel fnAnchor }
        footerSocialTitle
        footerSocialItems { fsName fsUrl }
        footerCopyright
      }
    }
  }
`
