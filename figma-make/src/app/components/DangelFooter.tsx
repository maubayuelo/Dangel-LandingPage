const navLinks = ["Bienfaits", "Services", "À propos", "Témoignages", "Contact"];
const socials = ["Facebook"];

const idMap: Record<string, string> = {
  "Bienfaits": "bienfaits",
  "Services": "services",
  "À propos": "apropos",
  "Témoignages": "temoignages",
  "Contact": "contact",
};

export function DangelFooter() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{ backgroundColor: "#1C1C1A", fontFamily: "'DM Sans', sans-serif" }}
      className="w-full pt-14 pb-10"
    >
      <div className="max-w-[1280px] mx-auto px-8">

        {/* 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <p
              style={{ fontFamily: "'Playfair Display', serif", color: "#F7F4EE" }}
              className="text-[22px] font-bold mb-1"
            >
              Dangel
            </p>
            <p style={{ color: "#A8A8A0" }} className="text-[13px] mb-5">Thérapeute Holistique</p>
            <div style={{ color: "#6B8B8A" }} className="text-[13px] space-y-1">
              <p>Montréal, Québec</p>
              <p>dangel358@gmail.com</p>
              <p>(514) 585-2224</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ color: "#F7F4EE" }} className="text-[12px] font-semibold uppercase tracking-wider mb-5">
              Navigation
            </p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l}>
                  <button
                    onClick={() => scrollTo(idMap[l])}
                    style={{ color: "#A8A8A0", fontFamily: "'DM Sans', sans-serif" }}
                    className="text-[13px] bg-transparent border-none cursor-pointer hover:text-[#3D8E8A] transition-colors duration-200 p-0"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p style={{ color: "#F7F4EE" }} className="text-[12px] font-semibold uppercase tracking-wider mb-5">
              Réseaux sociaux
            </p>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s}>
                  <span style={{ color: "#A8A8A0" }} className="text-[13px]">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div style={{ borderTop: "1px solid #2E2E2C" }} className="pt-8">
          <p style={{ color: "#6B6B6B" }} className="text-[11px] text-center">
            © 2025 Dangel Thérapeute Holistique · Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
