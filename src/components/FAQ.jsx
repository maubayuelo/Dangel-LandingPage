import { useState } from 'react'
import '../styles/faq.css'

const ChevronIcon = () => (
  <svg className="faq__chevron" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function FAQ({ data: d }) {
  const [open, setOpen] = useState(null)
  if (!d) return null
  const items = d.faqItems || []

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{d.faqEyebrow}</p>
          <h2 className="faq__title">{d.faqTitle}</h2>
        </div>

        {items.length > 0 && (
          <div className="faq__list">
            {items.map((item, i) => (
              <div key={i} className={`faq__item${open === i ? ' faq__item--open' : ''}`}>
                <button
                  className="faq__question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{item.fqQuestion}</span>
                  <ChevronIcon />
                </button>
                {open === i && (
                  <div className="faq__answer">
                    <p>{item.fqAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
