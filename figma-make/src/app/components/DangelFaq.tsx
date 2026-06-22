import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Qu'est-ce que le Shiatsu et comment se déroule une séance ?",
    a: "Le Shiatsu est une technique japonaise de massage thérapeutique pratiquée sur le sol, corps habillé. La séance consiste en des pressions et étirements sur les méridiens énergétiques pour libérer les blocages et rétablir la circulation du Ki (énergie vitale). Comptez environ 1 heure, dans un espace calme et bienveillant.",
  },
  {
    q: "Dois-je me déshabiller pour une séance de Shiatsu ?",
    a: "Non, le Shiatsu se pratique entièrement habillé. Portez des vêtements confortables et souples qui permettent de bouger librement — un vêtement de sport ou de yoga est idéal.",
  },
  {
    q: "Les séances sont-elles disponibles en ligne ?",
    a: "Oui, plusieurs soins sont disponibles en ligne via Zoom : la Thérapie Libération Émotionnelle, le Chemin de vie Kin Maya et la Thérapie Psychosomatique. L'Alignement Énergétique et le Shiatsu nécessitent une présence en personne à Montréal.",
  },
  {
    q: "Comment me préparer à ma première séance ?",
    a: "Arrivez hydraté(e) et évitez un repas copieux dans les 2 heures précédant la séance. Portez des vêtements confortables. Il n'y a pas d'autre préparation requise — venez simplement avec une intention d'ouverture.",
  },
  {
    q: "Acceptez-vous les assurances ou les remboursements ?",
    a: "Certaines assurances couvrent le Shiatsu thérapeutique. Contactez-nous directement pour vérifier si votre régime d'assurance est couvert. Un reçu officiel peut être fourni sur demande.",
  },
];

export function DangelFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{ backgroundColor: "#FDFCFA", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full py-24"
    >
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p style={{ color: "#3D8E8A", letterSpacing: "0.14em" }} className="text-[10px] font-semibold uppercase mb-4">
            — FAQ —
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1A" }}
            className="text-[40px] font-bold"
          >
            Questions fréquentes
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-[860px] mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #E8E2D9" }}
              className={i === 0 ? "border-t border-[#E8E2D9]" : ""}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left bg-transparent border-none cursor-pointer gap-6"
              >
                <span style={{ color: "#1C1C1A" }} className="text-[15px] leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  style={{
                    color: "#3D8E8A",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              </button>
              {open === i && (
                <div className="pb-5">
                  <p style={{ color: "#6B6B6B" }} className="text-[14px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
