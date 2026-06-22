import '../styles/hero.css'

const PHOTO_FALLBACK = 'https://placehold.co/440x587/F7F4EE/9B9790?text=Photo'

function stripOuterP(html = '') {
  return html.replace(/^<p>([\s\S]*?)<\/p>\s*$/, '$1').trim()
}

export default function Hero({ data: h }) {
  if (!h) return null

  const photoUrl = h.heroPhoto?.node?.sourceUrl || PHOTO_FALLBACK
  const photoAlt = h.heroPhoto?.node?.altText || 'Dangel, thérapeute holistique'

  return (
    <section className="hero">
      <div className="hero__container">

        <div className="hero__photo">
          <img src={photoUrl} alt={photoAlt} loading="eager" fetchPriority="high" />
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">{h.heroEyebrow}</p>

          <h1
            className="hero__headline"
            dangerouslySetInnerHTML={{ __html: stripOuterP(h.heroHeadline) }}
          />

          <p className="hero__subtext">{h.heroSubtext}</p>
          <p className="hero__lang">{h.heroSubtext2}</p>

          <div className="hero__ctas">
            <button className="btn-primary">→ {h.heroCtaPrimaryLabel}</button>
            <button className="btn-outline">{h.heroCtaSecondaryLabel} ↓</button>
          </div>

          <div className="hero__trust">
            {h.heroTrustRating && (
              <span className="hero__trust-badge">{h.heroTrustRating}</span>
            )}
            {h.heroTrustText && (
              <span className="hero__trust-badge">{h.heroTrustText}</span>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
