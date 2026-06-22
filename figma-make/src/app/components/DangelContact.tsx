import { useState } from "react";

export function DangelContact() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      style={{ backgroundColor: "#F7F4EE", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p style={{ color: "#3D8E8A", letterSpacing: "0.14em" }} className="text-[10px] font-semibold uppercase mb-4">
            — Contact —
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A" }}
            className="text-[40px] font-bold mb-4"
          >
            Informations pratiques
          </h2>
          <p style={{ color: "#6B6B6B" }} className="text-[16px]">
            Posez-nous vos questions ou prenez rendez-vous directement en ligne
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Left — info */}
          <div className="lg:w-[320px] shrink-0 space-y-8">
            <div>
              <p style={{ color: "#1C1C1A" }} className="text-[13px] font-semibold mb-1">📍 Adresse</p>
              <p style={{ color: "#6B6B6B" }} className="text-[14px] leading-relaxed">5155 Bourbonnière, Apt. 1<br />H1X 2M7 — Montréal, Qc</p>
            </div>
            <div>
              <p style={{ color: "#1C1C1A" }} className="text-[13px] font-semibold mb-1">📞 Téléphone</p>
              <p style={{ color: "#6B6B6B" }} className="text-[14px]">(514) 585-2224</p>
            </div>
            <div>
              <p style={{ color: "#1C1C1A" }} className="text-[13px] font-semibold mb-1">✉️ Email</p>
              <p style={{ color: "#6B6B6B" }} className="text-[14px]">dangel358@gmail.com</p>
            </div>
            <div>
              <p style={{ color: "#1C1C1A" }} className="text-[13px] font-semibold mb-2">🕐 Horaires</p>
              <p style={{ color: "#6B6B6B" }} className="text-[14px] leading-relaxed">
                Lun – Jeu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10 h 00 – 20 h 00<br />
                Vendredi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10 h 00 – 17 h 00
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1 min-w-0">
            <div
              style={{ backgroundColor: "#ffffff", border: "1px solid #E8E2D9" }}
              className="rounded-[16px] p-8 lg:p-10"
            >
              {sent ? (
                <div className="text-center py-10">
                  <p
                    style={{ fontFamily: "'Playfair Display', serif", color: "#3D8E8A" }}
                    className="text-[28px] font-bold mb-3"
                  >
                    Message envoyé ✓
                  </p>
                  <p style={{ color: "#6B6B6B" }} className="text-[15px]">
                    Merci ! Je vous répondrai dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ color: "#1C1C1A" }} className="text-[16px] font-semibold mb-8">
                    Envoyez-nous un message
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label style={{ color: "#1C1C1A" }} className="text-[13px] font-medium block mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        placeholder="Votre nom complet"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        required
                        style={{
                          backgroundColor: "#F7F4EE",
                          border: "1px solid #C2D4CF",
                          color: "#1C1C1A",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        className="w-full h-11 px-4 rounded-[6px] text-[14px] outline-none focus:border-[#3D8E8A] transition-colors"
                      />
                    </div>
                    <div>
                      <label style={{ color: "#1C1C1A" }} className="text-[13px] font-medium block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        style={{
                          backgroundColor: "#F7F4EE",
                          border: "1px solid #C2D4CF",
                          color: "#1C1C1A",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                        className="w-full h-11 px-4 rounded-[6px] text-[14px] outline-none focus:border-[#3D8E8A] transition-colors"
                      />
                    </div>
                    <div>
                      <label style={{ color: "#1C1C1A" }} className="text-[13px] font-medium block mb-2">
                        Message
                      </label>
                      <textarea
                        placeholder="Votre question ou demande…"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        rows={4}
                        style={{
                          backgroundColor: "#F7F4EE",
                          border: "1px solid #C2D4CF",
                          color: "#1C1C1A",
                          fontFamily: "'DM Sans', sans-serif",
                          resize: "vertical",
                        }}
                        className="w-full px-4 py-3 rounded-[6px] text-[14px] outline-none focus:border-[#3D8E8A] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      style={{ backgroundColor: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
                      className="text-white text-[15px] font-semibold px-7 py-3.5 rounded-[8px] hover:opacity-90 transition-opacity duration-200 border-none cursor-pointer"
                    >
                      → Envoyer le message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
