import '../styles/footer.css'
import { navigate } from '../lib/router'
import { policyPathFor } from '../lib/routes'
import { clearConsent } from '../lib/consent'
import { t } from '../lib/i18n'

export default function Footer({ data: d, global: g, lang }) {
  if (!d) return null
  const navItems = d.footerNavItems || []
  const socialItems = d.footerSocialItems || []
  const strings = t(lang).footer
  const policyPath = policyPathFor(lang)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">

          <div className="footer__brand">
            <p className="footer__logo">{d.footerBrandName}</p>
            {d.footerTagline && <p className="footer__tagline">{d.footerTagline}</p>}
            {(g?.globalSiteAddress || g?.globalSiteEmail || g?.globalSitePhone) && (
              <div className="footer__contact-info">
                {g.globalSiteAddress && <p>{g.globalSiteAddress}</p>}
                {g.globalSiteEmail && <p>{g.globalSiteEmail}</p>}
                {g.globalSitePhone && <p>{g.globalSitePhone}</p>}
              </div>
            )}
          </div>

          {navItems.length > 0 && (
            <nav className="footer__nav" aria-label="Liens du pied de page">
              {d.footerNavTitle && <p className="footer__col-title">{d.footerNavTitle}</p>}
              {navItems.map((item, i) => (
                <button
                  key={i}
                  className="footer__nav-link"
                  onClick={() => {
                    const id = item.fnAnchor?.replace('#', '')
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {item.fnLabel}
                </button>
              ))}
            </nav>
          )}

          {socialItems.length > 0 && (
            <div className="footer__social">
              {d.footerSocialTitle && <p className="footer__col-title">{d.footerSocialTitle}</p>}
              {socialItems.map((item, i) => (
                <a
                  key={i}
                  href={item.fsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={item.fsName}
                >
                  {item.fsName}
                </a>
              ))}
            </div>
          )}

        </div>

        <div className="footer__bottom">
          {d.medicalDisclaimer && (
            <p className="footer__disclaimer" role="note">{d.medicalDisclaimer}</p>
          )}
          <div className="footer-bottom-row">
            <p className="footer__copy">
              {d.footerCopyright || `© ${new Date().getFullYear()} Dangel. Tous droits réservés.`}
            </p>
            <span className="footer-bottom-sep" aria-hidden="true"> · </span>
            {/* Real, crawlable href — Meta and Google need an actual public
                URL to point ad/analytics disclosures at, not a JS-only modal.
                preventDefault + navigate() still gives real visitors an SPA
                transition instead of a full reload. */}
            <a
              href={policyPath}
              className="footer-policy-btn"
              onClick={(e) => { e.preventDefault(); navigate(policyPath) }}
            >
              {strings.policyLink}
            </a>
            <span className="footer-bottom-sep" aria-hidden="true"> · </span>
            <button
              type="button"
              className="footer-policy-btn"
              onClick={() => clearConsent()}
            >
              {strings.manageCookies}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
