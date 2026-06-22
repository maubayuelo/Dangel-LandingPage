export function DangelCTAFinal() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{ backgroundColor: "#1C1C1A", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-28"
    >
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        <h2
          style={{ fontFamily: "'Playfair Display', serif", color: "#FDFCFA", lineHeight: 1.15 }}
          className="text-[44px] sm:text-[52px] font-bold mb-6"
        >
          Votre corps sait ce dont il a besoin.
        </h2>
        <p style={{ color: "#A8A8A0" }} className="text-[16px] mb-10 max-w-[480px] mx-auto leading-relaxed">
          Offrez-lui l'espace pour guérir. Prenez rendez-vous dès aujourd'hui.
        </p>
        <button
          onClick={scrollToContact}
          style={{
            backgroundColor: "#ffffff",
            color: "#3D8E8A",
            fontFamily: "'DM Sans', sans-serif",
          }}
          className="text-[16px] font-semibold px-8 py-4 rounded-[8px] hover:opacity-90 transition-opacity duration-200 border-none cursor-pointer"
        >
          → Réserver ma séance
        </button>
      </div>
    </section>
  );
}
