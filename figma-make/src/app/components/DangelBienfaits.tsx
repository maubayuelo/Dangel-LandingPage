const bienfaits = [
  { num: "01", title: "Stress & tensions physiques", desc: "Libérez les blocages énergétiques du corps" },
  { num: "02", title: "Émotions bloquées", desc: "Retrouvez la légèreté et la paix intérieure" },
  { num: "03", title: "Besoin de reconnexion à soi", desc: "Découvrez votre essence et vos pouvoirs" },
  { num: "04", title: "Croissance personnelle", desc: "Devenez la meilleure version de vous-même" },
  { num: "05", title: "Trauma & transgénérationnel", desc: "Libérez les schémas hérités et inconscients" },
];

export function DangelBienfaits() {
  return (
    <section
      id="bienfaits"
      style={{ backgroundColor: "#FDFCFA", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p style={{ color: "#3D8E8A", letterSpacing: "0.14em" }} className="text-[10px] font-semibold uppercase mb-4">
            — Les Bienfaits —
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A" }}
            className="text-[40px] font-bold mb-4"
          >
            Vous vous reconnaissez ?
          </h2>
          <p style={{ color: "#6B6B6B" }} className="text-[16px]">
            Si vous vous reconnaissez dans l'une de ces situations, je peux vous accompagner
          </p>
        </div>

        {/* 5-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {bienfaits.map((b, i) => (
            <div
              key={b.num}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E8E2D9",
                borderRadius: "16px",
              }}
              className="px-7 py-8 flex flex-col"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#E8E2D9",
                  lineHeight: 1,
                }}
                className="text-[56px] font-bold mb-5 block"
              >
                {b.num}
              </span>
              <p style={{ color: "#1C1C1A" }} className="text-[15px] font-semibold mb-2 leading-snug">
                {b.title}
              </p>
              <p style={{ color: "#6B6B6B" }} className="text-[13px] leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
