import '../styles/benefits.css'

export default function Benefits({ data: d }) {
  if (!d) return null
  const items = d.benefitsItems || []

  return (
    <section className="benefits" id="benefits">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{d.benefitsEyebrow}</p>
          <h2 className="benefits__title">{d.benefitsTitle}</h2>
          {d.benefitsSubtitle && <p className="benefits__subtitle">{d.benefitsSubtitle}</p>}
        </div>
        {items.length > 0 && (
          <div className="benefits__grid">
            {items.map((b, i) => (
              <div key={i} className="benefits__card">
                <span className="benefits__num">{b.benNumber}</span>
                <p className="benefits__card-title">{b.benTitle}</p>
                <p className="benefits__card-desc">{b.benDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
