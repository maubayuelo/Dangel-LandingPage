import { useState } from 'react'
import emailjs from '@emailjs/browser'
import '../styles/contact.css'

const EJS_SERVICE       = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EJS_TEMPLATE      = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EJS_NOTIF         = import.meta.env.VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID
const EJS_KEY           = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function Contact({ data: d }) {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [sent, setSent]       = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState(null)
  if (!d) return null

  const schedule = d.contactScheduleItems || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    const params = {
      from_name:  form.name,
      from_email: form.email,
      message:    form.message,
      reply_to:   form.email,
      phone:      d.contactPhone || '',
      name:       form.name,
    }
    try {
      await Promise.all([
        // Notification to contact@dangelwellness.ca
        emailjs.send(EJS_SERVICE, EJS_NOTIF, params, EJS_KEY),
        // Auto-reply to the visitor
        emailjs.send(EJS_SERVICE, EJS_TEMPLATE, params, EJS_KEY),
      ])
      setSent(true)
    } catch (err) {
      console.error('EmailJS error:', err)
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSending(false)
    }
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
                  <button type="submit" className="btn-primary" disabled={sending}>
                    {sending ? '…' : `→ ${d.contactFormCtaLabel || 'Envoyer'}`}
                  </button>
                  {error && <p className="contact__error">{error}</p>}
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
