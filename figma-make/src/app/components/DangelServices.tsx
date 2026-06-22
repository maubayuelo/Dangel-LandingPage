const services = [
  {
    name: "Alignement Énergétique",
    price: "160 $",
    tags: [
      "Shiatsu",
      "Reiki",
      "PNL",
      "Thérapie Psychosomatique",
    ],
    desc: "Séance intégrative de 2 heures combinant Shiatsu, Reiki, PNL et Thérapie Psychosomatique. Dangel utilise son intuition pour percevoir où l'énergie est bloquée et guider le soin vers la source du déséquilibre — physique, émotionnel ou énergétique.",
    duration: "2 heures",
  },
  {
    name: "Chemin de vie — Kin Maya",
    price: "80 $",
    tags: ["Sagesse ancestrale maya", "Connaissance de soi"],
    desc: "Lecture de votre énergie de naissance selon le calendrier maya (Tzolk'in). Découvrez votre mission de vie, vos forces naturelles, vos défis et les cycles énergétiques qui vous influencent. Un outil puissant de connaissance de soi.",
    duration: "1 heure",
  },
  {
    name: "Thérapie Libération Émotionnelle",
    price: "90 $",
    tags: [
      "EFT",
      "Tapping",
      "Méridiens",
      "Canalisation intuitive",
    ],
    desc: "Approche combinant le Tapping (EFT), le travail sur les méridiens énergétiques et la canalisation intuitive. Permet d'identifier et de libérer les émotions bloquées à leur source — souvent là où les mots ne parviennent pas encore.",
    duration: "1h30",
  },
  {
    name: "Massage Shiatsu Thérapeutique",
    price: "90 $",
    tags: ["Soin énergétique", "Corps habillé", "Au sol"],
    desc: "Soin sur le sol, corps habillé. Le Shiatsu agit sur les méridiens pour rétablir la circulation de l'énergie vitale (Ki) et libérer les tensions accumulées dans le corps physique. Doux et profond à la fois — un soin de reconnexion corps-esprit.",
    duration: "1 heure",
  },
  {
    name: "Thérapie Psychosomatique",
    price: "120 $",
    tags: [
      "Corps",
      "Émotions",
      "Causes profondes",
      "Bio-psycho-social",
    ],
    desc: "Explore le lien entre vos symptômes physiques et leur origine émotionnelle ou mentale. Particulièrement indiqué pour les douleurs récurrentes, malaises sans explication médicale claire ou états de fatigue chronique. L'approche bio-psycho-sociale traite la personne dans sa globalité.",
    duration: "1h30",
  },
];

type Service = (typeof services)[number];

function ServiceCard({
  s,
  colSpan,
  onReserve,
}: {
  s: Service;
  colSpan?: string;
  onReserve: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #3D8E8A",
        borderLeft: "1px solid #E8E2D9",
        borderRight: "1px solid #E8E2D9",
        borderBottom: "1px solid #E8E2D9",
        borderRadius: "16px",
      }}
      className={`p-7 flex flex-col ${colSpan ?? ""}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3
          style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A" }}
          className="text-[20px] font-bold leading-snug"
        >
          {s.name}
        </h3>
        <span
          style={{ backgroundColor: "#ffffff", border: "1px solid #C2D4CF", color: "#3D8E8A" }}
          className="text-[13px] font-semibold px-3 py-1 rounded-[4px] shrink-0 mt-0.5"
        >
          {s.price}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
        {s.tags.map((t) => (
          <span
            key={t}
            style={{ color: "#6B6B6B", letterSpacing: "0.06em" }}
            className="text-[10px] font-semibold uppercase"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ backgroundColor: "#E8E2D9" }} className="h-px w-16 mb-4" />

      {/* Description */}
      <p style={{ color: "#6B6B6B" }} className="text-[13px] leading-relaxed flex-1 mb-6">
        {s.desc}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span style={{ color: "#6B6B6B" }} className="text-[12px]">
          {s.duration} · {s.price}
        </span>
        <button
          onClick={onReserve}
          style={{ color: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
          className="text-[13px] font-semibold bg-transparent border-none cursor-pointer hover:underline"
        >
          Réserver →
        </button>
      </div>
    </div>
  );
}

export function DangelServices() {
  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      style={{
        backgroundColor: "#F7F4EE",
        fontFamily: "'DM Sans', sans-serif",
      }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            style={{
              color: "#3D8E8A",
              letterSpacing: "0.14em",
            }}
            className="text-[10px] font-semibold uppercase mb-4"
          >
            — Les Soins —
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#1C1C1A",
            }}
            className="text-[40px] font-bold mb-4"
          >
            Mes Services
          </h2>
          <p
            style={{ color: "#6B6B6B" }}
            className="text-[16px]"
          >
            Des soins holistiques certifiés, guidés par
            l'intuition et adaptés à vos besoins du moment
          </p>
        </div>

        {/* Bento grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Row 1 — flagship wide + one tall */}
          <ServiceCard s={services[0]} colSpan="md:col-span-2" onReserve={scrollToContact} />
          <ServiceCard s={services[1]} colSpan="md:col-span-1" onReserve={scrollToContact} />

          {/* Row 2 — three equal */}
          <ServiceCard s={services[2]} colSpan="md:col-span-1" onReserve={scrollToContact} />
          <ServiceCard s={services[3]} colSpan="md:col-span-1" onReserve={scrollToContact} />
          <ServiceCard s={services[4]} colSpan="md:col-span-1" onReserve={scrollToContact} />

        </div>
      </div>
    </section>
  );
}