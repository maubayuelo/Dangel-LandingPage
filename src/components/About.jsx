import '../styles/about.css'

const PHOTO_FALLBACK = 'https://placehold.co/440x587/F7F4EE/9B9790?text=Photo'

/* Parse <li> items from WP HTML into text strings */
function parseListItems(html = '') {
  return [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map(m => m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim())
}

/* ── Inline SVG icons for cert cards — no icon library, zero bundle cost ── */
const IconBadge = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
)

const IconCertificate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const IconGraduate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)

const IconFormationCheck = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"
    aria-hidden="true">
    <polyline points="1.5 5.5 3.5 7.5 8.5 2.5"/>
  </svg>
)

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

            {/* ── Certifications & Training — hardcoded; ACF fields connected in next pass ── */}
            <div className="certifications-block">
              <hr className="section-divider" />

              <p className="cert-eyebrow">Certifications &amp; Training</p>
              <div className="cert-grid">

                <div className="cert-card">
                  <div className="cert-icon"><IconBadge /></div>
                  <div className="cert-content">
                    <p className="cert-title">Massothérapeute Senior M-2360</p>
                    <p className="cert-meta">RMQ — Regroupement des Massothérapeutes du Québec</p>
                    <span className="cert-badge">Active 2026</span>
                  </div>
                </div>

                <div className="cert-card">
                  <div className="cert-icon"><IconCertificate /></div>
                  <div className="cert-content">
                    <p className="cert-title">Technicien en massage shiatsu — 480h</p>
                    <p className="cert-meta">Institut Kiné-Concept, Montréal · 2005</p>
                  </div>
                </div>

                <div className="cert-card">
                  <div className="cert-icon"><IconGraduate /></div>
                  <div className="cert-content">
                    <p className="cert-title">Méthode Lavín — Terapia Holística — 200h+</p>
                    <p className="cert-meta">Holoacademia, Universidad Holística · 2022–2023</p>
                  </div>
                </div>

              </div>

              <p className="cert-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Formations complémentaires</p>
              <div className="formations-pills">
                {[
                  'Shiatsu Masunaga 300h · 2006',
                  'Biomagnétisme',
                  'Psychobionique',
                  'Toucher & conscience · Niveau 1',
                ].map(label => (
                  <span key={label} className="formation-pill">
                    <IconFormationCheck />
                    {label}
                  </span>
                ))}
              </div>

              <hr className="section-divider" />
            </div>
            {/* ── End Certifications & Training ── */}

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
