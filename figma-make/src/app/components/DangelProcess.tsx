const steps = [
  {
    num: "/01",
    title: "Choisissez votre soin",
    desc: "Explorez les soins disponibles et trouvez celui qui vous correspond",
  },
  {
    num: "/02",
    title: "Réservez votre séance",
    desc: "Consultez les disponibilités et confirmez votre créneau en ligne",
  },
  {
    num: "/03",
    title: "Profitez de votre séance",
    desc: "En personne à Montréal ou en ligne via Zoom",
  },
];

export function DangelProcess() {
  return (
    <section
      style={{ backgroundColor: "#FDFCFA", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h2
            style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A" }}
            className="text-[40px] font-bold mb-4"
          >
            Comment ça se passe ?
          </h2>
          <p style={{ color: "#6B6B6B" }} className="text-[16px]">
            Un processus simple pour votre bien-être
          </p>
        </div>

        {/* 3-column bordered grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div
              key={s.num}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E8E2D9",
                borderRadius: "16px",
              }}
              className="px-10 py-12 flex flex-col"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#E8E2D9",
                  lineHeight: 1,
                }}
                className="text-[72px] font-bold mb-8 block"
              >
                {s.num}
              </span>
              <p style={{ color: "#1C1C1A" }} className="text-[17px] font-semibold mb-3 leading-snug">
                {s.title}
              </p>
              <p style={{ color: "#6B6B6B" }} className="text-[14px] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
