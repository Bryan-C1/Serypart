import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/LogoSeryN.png"
import { Menu, X } from "lucide-react";
import { useScrolled } from "../hooks/useScrolled";

const NAV_LINKS = ["Inicio", "Servicios", "Nosotros", "Contacto"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(20);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(17,17,17,0.97)" : "#111111",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.35)" : "none",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            // className="w-10 h-10 rounded-xl flex items-center justify-center"
            // style={{ backgroundColor: "#2563EB" }}
          >
            <img src={logo} alt="SeryPart" className="w-18 h-18 object-contain" />
          </div>
          <div>
            <span className="text-white text-xl font-bold tracking-tight">SeryPart</span>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Taller Mecánico
            </p>
          </div>
        </div>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium transition-colors"
              style={{ color: "#D1D5DB" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D1D5DB")}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: "#D1D5DB" }}
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#2563EB" }}
          >
            Agendar Cita
          </Link>
        </div>

        {/* Botón de menú móvil */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navegación móvil */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: "#111111", borderColor: "#222" }}>
          <div className="px-6 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block text-sm py-2 font-medium"
                style={{ color: "#D1D5DB" }}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <Link
              to="/login"
              className="block w-full text-center text-sm font-semibold px-5 py-3 rounded-xl text-white mt-4"
              style={{ backgroundColor: "#2563EB" }}
              onClick={() => setMenuOpen(false)}
            >
              Agendar Cita
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}