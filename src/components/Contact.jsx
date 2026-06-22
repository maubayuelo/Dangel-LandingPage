import { useState } from 'react'
import '../styles/contact.css'

export default function Contact({ data: d }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  if (!d) return null

  const schedule = d.contactScheduleItems || []

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{d.contactEyebrow}</p>
          <h2 className="contact__title">{d.contactTitle}</h2>
          {d.contactSubtitle && <p className="contact__subtitle">{d.contactSubtitle}</p>}
        </div>

        <div className="contact__inner">

          <aside className="contact__info">
            {d.contactAddress && (
              <div className="contact__info-item">
                <p className="contact__info-label">📍 {d.contactLabelAddress}</p>
                <p className="contact__info-value">{d.contactAddress}</p>
              </div>
            )}
            {d.contactPhone && (
              <div className="contact__info-item">
                <p className="contact__info-label">📞 {d.contactLabelPhone}</p>
                <p className="contact__info-value">{d.contactPhone}</p>
              </div>
            )}
            {d.contactEmail && (
              <div className="contact__info-item">
                <p className="contact__info-label">✉️ {d.contactLabelEmail}</p>
                <p className="contact__info-value">{d.contactEmail}</p>
              </div>
            )}
            {schedule.length > 0 && (
              <div className="contact__info-item">
                <p className="contact__info-label">🕐 {d.contactScheduleTitle}</p>
                {schedule.map((s, i) => (
                  <p key={i} className="contact__schedule-row">
                    <span>{s.scDay}</span>
                    <span>{s.scHours}</span>
                  </p>
                ))}
              </div>
            )}
          </aside>

          <div className="contact__form-wrap">
            {sent ? (
              <div className="contact__sent">
                <p className="contact__sent-title">Message envoyé ✓</p>
                <p className="contact__sent-sub">
                  Merci ! Je vous répondrai dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <>
                {d.contactFormTitle && (
                  <p className="contact__form-title">{d.contactFormTitle}</p>
                )}
                <form onSubmit={handleSubmit} className="contact__form" noValidate>
                  <div className="contact__field">
                    <label className="contact__label">{d.contactFormLabelName}</label>
                    <input
                      type="text"
                      placeholder={d.contactFormPlaceholderName}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      className="contact__input"
                    />
                  </div>
                  <div className="contact__field">
                    <label className="contact__label">{d.contactFormLabelEmail}</label>
                    <input
                      type="email"
                      placeholder={d.contactFormPlaceholderEmail}
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      className="contact__input"
                    />
                  </div>
                  <div className="contact__field">
                    <label className="contact__label">{d.contactFormLabelMessage}</label>
                    <textarea
                      placeholder={d.contactFormPlaceholderMsg}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                      rows={4}
                      className="contact__input contact__textarea"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    → {d.contactFormCtaLabel || 'Envoyer'}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
