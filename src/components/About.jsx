import '../styles/about.css'

const PHOTO_FALLBACK = 'https://placehold.co/440x587/F7F4EE/9B9790?text=Photo'

/* Parse <li> items from WP HTML into text strings */
function parseListItems(html = '') {
  return [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map(m => m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim())
}

export default function About({ data: d, onBook }) {
  if (!d) return null

  const disciplines = parseListItems(d.aboutDisciplinesList || '')
  const langs = d.aboutLanguages || []
  const photoUrl = d.aboutPhoto?.node?.sourceUrl || PHOTO_FALLBACK
  const photoAlt = d.aboutPhoto?.node?.altText || 'Dangel en session'

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__inner">

          <div className="about__photo-col">
            <img src={photoUrl} alt={photoAlt} loading="lazy" />
          </div>

          <div className="about__content">
            <p className="eyebrow">{d.aboutEyebrow}</p>
            <h2 className="about__title">{d.aboutTitle}</h2>

            {d.aboutBody && <p className="about__body">{d.aboutBody}</p>}

            {d.aboutDiffBody && (
              <div className="about__diff">
                <p>{d.aboutDiffBody}</p>
              </div>
            )}

            {disciplines.length > 0 && (
              <div className="about__disciplines">
                <p className="about__disciplines-label">Mes disciplines</p>
                <div className="about__chips">
                  {disciplines.map(disc => (
                    <span key={disc} className="about__chip">{disc}</span>
                  ))}
                </div>
              </div>
            )}

            {langs.length > 0 && (
              <div className="about__langs">
                {langs.map(l => (
                  <span key={l.langLabel} className="about__lang-tag">
                    {l.langFlag} {l.langLabel}
                  </span>
                ))}
              </div>
            )}

            <button className="btn-primary about__cta" onClick={onBook}>
              → {d.aboutCtaLabel || 'Réserver une séance'}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
