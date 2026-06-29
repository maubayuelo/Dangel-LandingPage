import { gql } from '@apollo/client'

export const GET_PAGE = gql`
  query GetPage($pageId: ID!) {
    page(id: $pageId, idType: URI) {
      fgNavigation {
        navLogoText
        navLogoImage { node { sourceUrl altText } }
        navLinks { nlLabel nlAnchor }
        navCtaLabel
      }
      fgGlobal {
        globalBookingUrl
        globalSitePhone
        globalSiteEmail
        globalSiteAddress
        # Add globalMetaPixelId + globalGa4Id here once fields exist in WP ACF fg_global
      }
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
      fgBenefits {
        benefitsEyebrow
        benefitsTitle
        benefitsSubtitle
        benefitsItems { benNumber benTitle benDescription }
      }
      fgServices {
        servicesEyebrow
        servicesTitle
        servicesSubtitle
        servicesNote
        servicesItems {
          svName svDescription svDuration svPrice svTechniqueTags svCtaLabel
        }
      }
      fgProcess {
        processEyebrow
        processTitle
        processSubtitle
        processSteps { psNumber psTitle psDescription }
      }
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
      }
      fgTestimonials {
        testimonialsEyebrow
        testimonialsTitle
        testimonialsSocialProof
        testimonialsItems { tsName tsQuote tsService tsDate tsOriginalLang }
        testimonialsFbLinkLabel
        testimonialsFbLinkUrl
      }
      fgFaq {
        faqEyebrow
        faqTitle
        faqItems { fqQuestion fqAnswer }
      }
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
      fgCtaFinal {
        ctaFinalTitle
        ctaFinalSubtitle
        ctaFinalCtaLabel
      }
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

/* Keep for isolated testing */
export const GET_HERO = gql`
  query GetHero {
    page(id: "home", idType: URI) {
      fgHero {
        heroEyebrow heroHeadline heroSubtext heroSubtext2
        heroTrustRating heroTrustText heroCtaPrimaryLabel heroCtaSecondaryLabel
        heroPhoto { node { sourceUrl altText } }
      }
    }
  }
`
