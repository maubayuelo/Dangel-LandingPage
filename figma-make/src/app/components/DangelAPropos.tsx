import { ImageWithFallback } from "./figma/ImageWithFallback";
import aboutPhoto from "../../imports/about.png";

const disciplines = [
  "Massage Shiatsu Thérapeutique",
  "Thérapie Libération Émotionnelle",
  "Thérapie Psychosomatique",
  "Kinésiologie",
  "Chemin de vie",
  "Reiki",
  "Biomagnétisme",
  "Nettoyage Énergétique",
  "Conflits Transgénérationnels",
];

export function DangelAPropos() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="apropos"
      style={{ backgroundColor: "#F7F4EE", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

          {/* Photo left — 3:4 ratio, no border-radius */}
          <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
            <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
              <ImageWithFallback
                src={aboutPhoto}
                alt="Dangel en session Shiatsu"
                className="w-full h-full object-cover"
                style={{ borderRadius: "20px" }}
              />
            </div>
          </div>

          {/* Content right */}
          <div className="flex-1 min-w-0 pt-2">
            <p
              style={{ color: "#3D8E8A", letterSpacing: "0.14em" }}
              className="text-[10px] font-semibold uppercase mb-6"
            >
              — Thérapeute Holistique et Facilitateur —
            </p>
            <h2
              style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A", lineHeight: 1.15 }}
              className="text-[38px] lg:text-[44px] font-bold mb-8"
            >
              Un accompagnement<br />
              qui écoute au-delà des mots
            </h2>

            <p style={{ color: "#6B6B6B" }} className="text-[15px] leading-relaxed mb-6 max-w-[540px]">
              Depuis plus de 10 ans, j'accompagne mes clients vers un mieux-être durable avec empathie et professionnalisme.
            </p>

            {/* Differentiator block */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderLeft: "3px solid #3D8E8A",
              }}
              className="px-6 py-5 mb-6 max-w-[540px]"
            >
              <p style={{ color: "#1C1C1A" }} className="text-[14px] leading-relaxed">
                Ce qui distingue mon approche : J'utilise la canalisation, validée par un test musculaire, pour demander directement à l'inconscient de la personne quelle est la source du déséquilibre — et guider le soin vers l'harmonie du corps physique, mental et émotionnel.
              </p>
            </div>

            {/* Disciplines */}
            <div className="mb-4">
              <p style={{ color: "#1C1C1A" }} className="text-[13px] font-semibold mb-3">
                Mes disciplines
              </p>
              <div className="flex flex-wrap gap-2">
                {disciplines.map((d) => (
                  <span
                    key={d}
                    style={{ backgroundColor: "#ffffff", color: "#3D8E8A" }}
                    className="text-[11px] font-medium px-3 py-1 rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-4">
              {["Hypersensible · Canalisation", "En ligne & en personne", "Formation continue"].map((t) => (
                <span
                  key={t}
                  style={{ backgroundColor: "#ffffff", color: "#3D8E8A" }}
                  className="text-[11px] font-medium px-4 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["🇫🇷  Français", "🇬🇧  English", "🇪🇸  Español"].map((lang) => (
                <span
                  key={lang}
                  style={{ backgroundColor: "#F7F4EE", border: "1px solid #E4DFD3", color: "#6B6B6B" }}
                  className="text-[12px] px-3.5 py-1.5"
                >
                  {lang}
                </span>
              ))}
            </div>

            <button
              onClick={scrollToContact}
              style={{ backgroundColor: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
              className="text-white text-[15px] font-semibold px-7 py-3.5 rounded-[8px] hover:opacity-90 transition-opacity duration-200 border-none cursor-pointer"
            >
              → Réserver une séance
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
