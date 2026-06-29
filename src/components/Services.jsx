import '../styles/services.css'

function ServiceCard({ s, wide, onBook }) {
  const tags = s.svTechniqueTags
    ? s.svTechniqueTags.split(/[,\n]/).map(t => t.trim()).filter(Boolean)
    : []

  return (
    <article className={`services__card${wide ? ' services__card--wide' : ''}`}>
      <div className="services__card-header">
        <h3 className="services__name">{s.svName}</h3>
        {s.svPrice && <span className="services__price">{s.svPrice}</span>}
      </div>

      {tags.length > 0 && (
        <div className="services__tags">
          {tags.map(t => <span key={t} className="services__tag">{t}</span>)}
        </div>
      )}

      <div className="services__divider" />
      <p className="services__desc">{s.svDescription}</p>

      <div className="services__footer">
        <span className="services__meta">
          {[s.svDuration, s.svPrice].filter(Boolean).join(' · ')}
        </span>
        <button className="services__book" onClick={onBook}>
          {s.svCtaLabel || 'Réserver'} →
        </button>
      </div>
    </article>
  )
}

export default function Services({ data: d, onBook }) {
  if (!d) return null
  const items = d.servicesItems || []

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{d.servicesEyebrow}</p>
          <h2 className="services__title">{d.servicesTitle}</h2>
          {d.servicesSubtitle && <p className="services__subtitle">{d.servicesSubtitle}</p>}
        </div>

        {items.length > 0 && (
          <div className="services__grid">
            {items.map((s, i) => (
              <ServiceCard key={i} s={s} wide={i === 0} onBook={onBook} />
            ))}
          </div>
        )}

        {d.servicesNote && <p className="services__note">{d.servicesNote}</p>}
      </div>
    </section>
  )
}
