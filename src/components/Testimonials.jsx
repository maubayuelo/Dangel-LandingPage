import '../styles/testimonials.css'

/* 6-col grid spans — 3 rows of 2: [1/3+2/3, 1/2+1/2, 2/3+1/3] */
const SPANS = [2, 4, 3, 3, 4, 2]

function Avatar({ name }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return <div className="testi__avatar" aria-hidden="true">{initials}</div>
}

const TRANSLATED_FROM = {
  en: { fr: 'Translated from French', es: 'Translated from Spanish' },
  fr: { en: 'Traduit de l\'anglais', es: 'Traduit de l\'espagnol' },
  es: { en: 'Traducido del inglés', fr: 'Traducido del francés' },
}

function TestiCard({ item, span, lang }) {
  const service = [item.tsService, item.tsDate].filter(Boolean).join(' · ')
  const translatedFrom = item.tsOriginalLang && item.tsOriginalLang !== lang
    ? TRANSLATED_FROM[lang]?.[item.tsOriginalLang]
    : null
  return (
    <article className="testi__card" style={{ '--span': span }}>
      <span className="testi__stars" aria-label="5 étoiles">★★★★★</span>
      <blockquote className={`testi__quote${span >= 3 ? ' testi__quote--lg' : ''}`}>
        {item.tsQuote}
      </blockquote>
      {translatedFrom && (
        <p className="testi__translated">{translatedFrom}</p>
      )}
      <div className="testi__divider" />
      <div className="testi__author">
        <Avatar name={item.tsName} />
        <div>
          <p className="testi__name">{item.tsName}</p>
          <p className="testi__service">{service}</p>
        </div>
      </div>
    </article>
  )
}

export default function Testimonials({ data: d, lang = 'fr' }) {
  if (!d) return null
  const items = d.testimonialsItems || []

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{d.testimonialsEyebrow}</p>
          <h2 className="testimonials__title">{d.testimonialsTitle}</h2>
          {d.testimonialsSocialProof && (
            <p className="testimonials__proof">{d.testimonialsSocialProof}</p>
          )}
        </div>

        {items.length > 0 && (
          <div className="testimonials__grid">
            {items.map((item, i) => (
              <TestiCard key={i} item={item} span={SPANS[i] ?? 1} lang={lang} />
            ))}
          </div>
        )}

        {d.testimonialsFbLinkUrl && (
          <div className="testimonials__fb">
            <a
              href={d.testimonialsFbLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="testimonials__fb-link"
            >
              {d.testimonialsFbLinkLabel || 'Voir tous les avis sur Facebook'} →
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
