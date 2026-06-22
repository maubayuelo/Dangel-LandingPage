const testimonials = [
  {
    quote: "J'ai récemment eu le privilège de travailler avec Dangel qui m'a guidée à travers la technique de libération émotionnelle. Dès le début, j'ai été frappée par sa capacité à créer un espace sûr et accueillant — un environnement où je me sentais libre d'être authentique. J'ai pu libérer de nombreuses émotions refoulées et expérimenter un profond sentiment de lâcher-prise. Je recommande fortement Dangel à la personne curieuse de découvrir l'approche holistique.",
    name: "Natacha Mdawar",
    service: "Libération émotionnelle · févr. 2024",
  },
  {
    quote: "Je suis très impressionnée par les soins que j'ai reçus de Dangel. Je l'ai consulté car j'étais tellement tendue que je me sentais comme une barre de ciment. Grâce aux points de shiatsu, j'ai recommencé à respirer normalement et l'énergie a recommencé à circuler en moi. Je me sens maintenant calme, en paix, à ma place et j'ai retrouvé espoir. Dangel est quelqu'un d'intègre, consciencieux, à l'écoute. Expérience à refaire. Merci d'être là.",
    name: "Nathalie Deschênes",
    service: "Shiatsu · mai 2022",
  },
  {
    quote: "OMG… je recommande la médecine de Dangel à TOUT LE MONDE. On devrait tous avoir la chance de croiser Dangel sur notre route. Ses soins de Shiatsu sont tellement profonds — ils nous rebalancent et nous reconnectent à notre énergie vitale en allant à la source. Les bienfaits physiques et psychiques sur notre système nerveux sont notables immédiatement. C'est une reconnexion à SOI ! Un vrai ANGE, facilitateur de bien-être sur cette terre.",
    name: "Reg Ina Reichherzer",
    service: "Shiatsu · août 2021",
  },
  {
    quote: "J'ai tant de gratitude d'avoir été interpellée par les soins de Dangel. Avec ses soins en libération émotionnelle, c'était comme si mon corps lui parlait pour m'aider à trouver les bons outils pour guérir. La conversation au cours d'une séance avec lui a souvent l'effet d'allumer des lumières dans ma conscience. Et ses soins de shiatsu font incroyablement de bien — un soin calme et profond à la fois, je sors de là toute légère et revitalisée. Il a tant de bien et de sagesse à apporter.",
    name: "Anik Delage Leduc",
    service: "Libération émotionnelle · mai 2021",
  },
  {
    quote: "J'ai été à deux séances pour des raisons différentes, et je suis sortie de chaque fois avec une grande paix et une belle énergie. Dangel m'a aidée à libérer des émotions bloquées en allant directement à la source du problème. Tout ce qu'il m'a enseigné vibrait totalement avec mon être. C'est un humain formidable, professionnel et bienveillant — je me sens en totale confiance auprès de lui. Je le recommande définitivement.",
    name: "Ki Mi",
    service: "Chemin de vie Maya & Libération émotionnelle · mars 2019",
  },
];

/* Initials avatar */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      style={{ backgroundColor: "#3D8E8A", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
      className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
    >
      {initials}
    </div>
  );
}

function TestiCard({
  quote,
  name,
  service,
  colSpan,
  size = "normal",
}: {
  quote: string;
  name: string;
  service: string;
  colSpan?: string;
  size?: "normal" | "large" | "wide";
}) {
  const isLarge = size === "large";
  const isWide = size === "wide";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #E8E2D9",
        fontFamily: "'DM Sans', sans-serif",
        borderRadius: "16px",
      }}
      className={`p-7 flex flex-col ${colSpan ?? ""}`}
    >
      {/* Stars */}
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: "#3D8E8A" }} className="text-[13px] tracking-wider">★★★★★</span>
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "#1C1C1A",
          lineHeight: 1.65,
        }}
        className={`italic flex-1 mb-6 ${isLarge || isWide ? "text-[17px]" : "text-[14px]"}`}
      >
        « {quote} »
      </p>

      {/* Divider */}
      <div style={{ backgroundColor: "#E8E2D9" }} className="h-px w-full mb-5" />

      {/* Author row */}
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div>
          <p style={{ color: "#1C1C1A" }} className="text-[13px] font-semibold leading-tight">{name}</p>
          <p style={{ color: "#6B6B6B" }} className="text-[11px] mt-0.5">{service}</p>
        </div>
      </div>
    </div>
  );
}

export function DangelTestimonials() {
  return (
    <section
      id="temoignages"
      style={{ backgroundColor: "#F7F4EE", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p style={{ color: "#3D8E8A", letterSpacing: "0.14em" }} className="text-[10px] font-semibold uppercase mb-4">
            — Témoignages —
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A" }}
            className="text-[40px] font-bold mb-4"
          >
            Ce que disent mes clients
          </h2>
          <p style={{ color: "#6B6B6B" }} className="text-[16px]">
            Recommandé par 100 % · 42 avis Facebook ★★★★★
          </p>
        </div>

        {/* Bento grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Row 1: 1col | 2col */}
          <TestiCard {...testimonials[0]} colSpan="md:col-span-1" size="normal" />
          <TestiCard {...testimonials[1]} colSpan="md:col-span-2" size="large" />

          {/* Row 2: 2col | 1col */}
          <TestiCard {...testimonials[2]} colSpan="md:col-span-2" size="large" />
          <TestiCard {...testimonials[3]} colSpan="md:col-span-1" size="normal" />

          {/* Row 3: full-width */}
          <TestiCard {...testimonials[4]} colSpan="md:col-span-3" size="wide" />
        </div>

        <div className="text-center">
          <p style={{ color: "#3D8E8A" }} className="text-[13px] font-medium cursor-pointer hover:underline">
            f &nbsp; Voir tous les 42 avis sur Facebook →
          </p>
        </div>
      </div>
    </section>
  );
}
