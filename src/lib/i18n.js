// ─────────────────────────────────────────────────────────────────────────────
// lib/i18n.js — HARDCODED UI STRINGS, PER LANGUAGE
//
// Used where no ACF field group exists yet: cookie banner, footer's policy/
// consent links, contact form consent copy, policy page/modal chrome. Kept
// in one place so migrating any of these to WordPress later (e.g. a future
// fg_cookie_banner field group) is a one-file change.
// ─────────────────────────────────────────────────────────────────────────────

export const STRINGS = {
  en: {
    backToTop: 'Back to top',
    cookieBanner: {
      message: 'This site uses cookies to analyze traffic and improve your experience.',
      policyLink: 'Privacy Policy →',
      decline: 'Decline',
      accept: 'Accept',
      ariaLabel: 'Cookie consent',
    },
    footer: {
      policyLink: 'Privacy Policy',
      manageCookies: 'Manage cookies',
    },
    contact: {
      consentPrefix: 'I have read and accept the',
      consentLink: 'privacy policy',
      consentError: 'Please accept the privacy policy to continue.',
      healthNote: 'Please avoid including detailed health information in this form — a short message is enough to arrange next steps.',
    },
    policyModal: {
      title: 'Privacy Policy',
      close: 'Close',
      manageCookies: 'Manage cookies',
    },
    policyPage: {
      updated: 'Last updated',
      contact: 'Questions? Contact',
      fallbackNotice: 'This page is not yet available in this language — showing the French version.',
      emptyTitle: 'Privacy Policy',
      emptyBody: 'This content is being updated. For any question about the use of your personal information, contact us at',
      metaDescription: 'How Dangel Wellness collects, uses, and protects your personal information, in accordance with Quebec Law 25.',
    },
  },
  fr: {
    backToTop: 'Retour en haut',
    cookieBanner: {
      message: 'Ce site utilise des cookies pour analyser le trafic et améliorer votre expérience.',
      policyLink: 'Politique de confidentialité →',
      decline: 'Refuser',
      accept: 'Accepter',
      ariaLabel: 'Gestion des cookies',
    },
    footer: {
      policyLink: 'Politique de confidentialité',
      manageCookies: 'Gérer les témoins',
    },
    contact: {
      consentPrefix: "J'ai lu et j'accepte la",
      consentLink: 'politique de confidentialité',
      consentError: 'Veuillez accepter la politique de confidentialité pour continuer.',
      healthNote: "Merci d'éviter d'inclure des renseignements de santé détaillés dans ce formulaire — un court message suffit pour convenir de la suite.",
    },
    policyModal: {
      title: 'Politique de confidentialité',
      close: 'Fermer',
      manageCookies: 'Gérer les témoins',
    },
    policyPage: {
      updated: 'Dernière mise à jour',
      contact: 'Des questions ? Contactez',
      fallbackNotice: "Cette page n'est pas encore disponible dans cette langue — affichage de la version française.",
      emptyTitle: 'Politique de confidentialité',
      emptyBody: 'Ce contenu est en cours de mise à jour. Pour toute question sur l’utilisation de vos renseignements personnels, contactez-nous à',
      metaDescription: 'Comment Dangel Wellness recueille, utilise et protège vos renseignements personnels, conformément à la Loi 25 du Québec.',
    },
  },
  es: {
    backToTop: 'Volver arriba',
    cookieBanner: {
      message: 'Este sitio utiliza cookies para analizar el tráfico y mejorar su experiencia.',
      policyLink: 'Política de privacidad →',
      decline: 'Rechazar',
      accept: 'Aceptar',
      ariaLabel: 'Gestión de cookies',
    },
    footer: {
      policyLink: 'Política de privacidad',
      manageCookies: 'Gestionar cookies',
    },
    contact: {
      consentPrefix: 'He leído y acepto la',
      consentLink: 'política de privacidad',
      consentError: 'Por favor acepte la política de privacidad para continuar.',
      healthNote: 'Le recomendamos no incluir información de salud detallada en este formulario — un mensaje breve basta para acordar los próximos pasos.',
    },
    policyModal: {
      title: 'Política de privacidad',
      close: 'Cerrar',
      manageCookies: 'Gestionar cookies',
    },
    policyPage: {
      updated: 'Última actualización',
      contact: '¿Preguntas? Contacte a',
      fallbackNotice: 'Esta página aún no está disponible en este idioma — se muestra la versión en francés.',
      emptyTitle: 'Política de privacidad',
      emptyBody: 'Este contenido está siendo actualizado. Para cualquier pregunta sobre el uso de su información personal, contáctenos en',
      metaDescription: 'Cómo Dangel Wellness recoge, utiliza y protege su información personal, conforme a la Ley 25 de Quebec.',
    },
  },
}

export function t(lang) {
  return STRINGS[lang] || STRINGS.en
}
