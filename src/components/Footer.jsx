import '../styles/footer.css'

export default function Footer({ data: d, global: g }) {
  if (!d) return null
  const navItems = d.footerNavItems || []
  const socialItems = d.footerSocialItems || []

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
                <a key={i} href={item.fnAnchor} className="footer__nav-link">
                  {item.fnLabel}
                </a>
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
          <p className="footer__copy">
            {d.footerCopyright || `© ${new Date().getFullYear()} Dangel. Tous droits réservés.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
