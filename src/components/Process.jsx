import '../styles/process.css'

export default function Process({ data: d }) {
  if (!d) return null
  const steps = d.processSteps || []

  return (
    <section className="process">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{d.processEyebrow}</p>
          <h2 className="process__title">{d.processTitle}</h2>
          {d.processSubtitle && <p className="process__subtitle">{d.processSubtitle}</p>}
        </div>
        {steps.length > 0 && (
          <div className="process__grid">
            {steps.map((s, i) => (
              <div key={i} className="process__card">
                <span className="process__num">{s.psNumber}</span>
                <p className="process__step-title">{s.psTitle}</p>
                <p className="process__step-desc">{s.psDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
