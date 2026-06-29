import '../styles/cta-final.css'

export default function CtaFinal({ data: d, onBook }) {
  if (!d) return null

  return (
    <section className="cta-final">
      <div className="container">
        <div className="cta-final__inner">
          <div className="cta-final__text">
            <h2 className="cta-final__title">{d.ctaFinalTitle}</h2>
            {d.ctaFinalSubtitle && <p className="cta-final__sub">{d.ctaFinalSubtitle}</p>}
          </div>
          <div className="cta-final__actions">
            <button className="cta-final__btn-primary" onClick={onBook}>
              → {d.ctaFinalCtaLabel || 'Réserver une séance'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
