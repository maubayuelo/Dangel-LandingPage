import { ImageWithFallback } from "./figma/ImageWithFallback";
import heroPhoto from "../../imports/hero.png";

export function DangelHero() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{ backgroundColor: "#F7F4EE", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Right — portrait (mobile first, desktop second via order) */}
        <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 lg:order-2">
          <div className="relative w-full lg:hidden" style={{ height: "280px" }}>
            <ImageWithFallback
              src={heroPhoto}
              alt="Dangel, thérapeute holistique"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center top", borderRadius: "20px" }}
            />
          </div>
          <div className="relative w-full hidden lg:block" style={{ aspectRatio: "3/4" }}>
            <ImageWithFallback
              src={heroPhoto}
              alt="Dangel, thérapeute holistique"
              className="w-full h-full object-cover"
              style={{ borderRadius: "20px" }}
            />
          </div>
        </div>

        {/* Left — content */}
        <div className="flex-1 min-w-0 lg:order-1">
          <p
            style={{ color: "#3D8E8A", letterSpacing: "0.14em" }}
            className="text-[10px] font-semibold uppercase mb-6"
          >
            Thérapeute Holistique et Facilitateur · Montréal
          </p>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#1C1C1A",
              lineHeight: 1.1,
              fontSize: "clamp(32px, 8vw, 68px)"
            }}
            className="font-bold mb-7"
          >
            Retrouvez l'équilibre<br />
            de votre corps,<br />
            de votre esprit<br />
            <em>et de vos émotions</em>
          </h1>

          <p style={{ color: "#6B6B6B" }} className="text-[16px] leading-relaxed mb-2 max-w-[520px]">
            Des soins holistiques personnalisés pour libérer les tensions, retrouver votre énergie et vous
            reconnecter à vous-même. En personne à Montréal ou en ligne.
          </p>
          <p style={{ color: "#9B9790" }} className="text-[12px] mb-10 max-w-[520px]">
            En français · English · Español
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={scrollToContact}
              style={{ backgroundColor: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
              className="text-white text-[15px] font-semibold px-7 py-3.5 rounded-[8px] hover:opacity-90 transition-opacity duration-200 border-none cursor-pointer"
            >
              → Réserver une séance
            </button>
            <button
              onClick={scrollToServices}
              style={{ border: "1.5px solid #3D8E8A", color: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[15px] font-semibold px-7 py-3.5 rounded-[8px] bg-transparent hover:bg-white/60 transition-colors duration-200 cursor-pointer"
            >
              Découvrir les soins ↓
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {[
              "★ 42 avis · 100% recommandé",
              "En ligne & en personne",
            ].map((tag) => (
              <span
                key={tag}
                style={{ backgroundColor: "#ffffff", color: "#3D8E8A", border: "1px solid #C2D4CF" }}
                className="text-[12px] font-medium px-4 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
