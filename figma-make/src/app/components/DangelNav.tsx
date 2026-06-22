import { useState } from "react";
import { DangelLogo } from "./DangelLogo";

const links = ["Bienfaits", "Services", "À propos", "Témoignages", "Contact"];

export function DangelNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const idMap: Record<string, string> = {
    "Bienfaits": "bienfaits",
    "Services": "services",
    "À propos": "apropos",
    "Témoignages": "temoignages",
    "Contact": "contact",
  };

  return (
    <nav
      style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#F7F4EE" }}
      className="sticky top-0 z-50 border-b border-[#E8E2D9]"
    >
      <div className="max-w-[1280px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <div
          className="cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <DangelLogo />
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(idMap[l])}
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[14px] hover:text-[#3D8E8A] transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              {l}
            </button>
          ))}

          {/* Language switcher */}
          <div className="flex items-center gap-2 border-l border-[#E8E2D9] pl-6">
            <button
              style={{ color: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[13px] font-semibold bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
            >
              FR
            </button>
            <span style={{ color: "#E8E2D9" }} className="text-[12px]">·</span>
            <button
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[13px] font-medium bg-transparent border-none cursor-pointer hover:text-[#3D8E8A] transition-colors"
            >
              EN
            </button>
            <span style={{ color: "#E8E2D9" }} className="text-[12px]">·</span>
            <button
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[13px] font-medium bg-transparent border-none cursor-pointer hover:text-[#3D8E8A] transition-colors"
            >
              ES
            </button>
          </div>

          <button
            onClick={() => scrollTo("contact")}
            style={{ backgroundColor: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
            className="text-white text-[13px] font-semibold px-5 py-2.5 rounded-[6px] hover:opacity-90 transition-opacity duration-200 border-none cursor-pointer"
          >
            Réserver →
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 border-none bg-transparent cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="w-5 h-0.5 bg-[#1C1C1A] mb-1" />
          <div className="w-5 h-0.5 bg-[#1C1C1A] mb-1" />
          <div className="w-5 h-0.5 bg-[#1C1C1A]" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ backgroundColor: "#F7F4EE" }} className="md:hidden border-t border-[#E8E2D9] px-8 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(idMap[l])}
              style={{ color: "#1C1C1A", fontFamily: "'DM Sans', sans-serif" }}
              className="text-left text-[15px] bg-transparent border-none cursor-pointer py-1"
            >
              {l}
            </button>
          ))}

          {/* Language switcher - mobile */}
          <div className="flex items-center gap-3 pt-2 border-t border-[#E8E2D9]">
            <span style={{ color: "#6B6B6B" }} className="text-[12px]">Langue:</span>
            <button
              style={{ color: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[13px] font-semibold bg-transparent border-none cursor-pointer"
            >
              FR
            </button>
            <span style={{ color: "#E8E2D9" }}>·</span>
            <button
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[13px] font-medium bg-transparent border-none cursor-pointer"
            >
              EN
            </button>
            <span style={{ color: "#E8E2D9" }}>·</span>
            <button
              style={{ color: "#6B6B6B", fontFamily: "'DM Sans', sans-serif" }}
              className="text-[13px] font-medium bg-transparent border-none cursor-pointer"
            >
              ES
            </button>
          </div>

          <button
            onClick={() => scrollTo("contact")}
            style={{ backgroundColor: "#3D8E8A", fontFamily: "'DM Sans', sans-serif" }}
            className="text-white text-[14px] font-semibold px-5 py-3 rounded-[6px] border-none cursor-pointer mt-2 text-center"
          >
            Réserver →
          </button>
        </div>
      )}
    </nav>
  );
}
