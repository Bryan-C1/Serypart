import {
   Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Clock,
} from "lucide-react";
import logo from "../../../assets/LogoSeryN.png"

const SOCIALS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: MessageCircle, label: "WhatsApp" },
];

const COMPANY_LINKS = [
  "Sobre Nosotros",
  "Nuestro Equipo",
  "Certificaciones",
  "Blog Automotriz",
  "Trabaja con Nosotros",
];

const SERVICE_LINKS = [
  "Cambio de Aceite",
  "Sistema de Frenos",
  "Alineación",
  "Diagnóstico",
  "Suspensión",
  "Neumáticos",
];

const CONTACT_ITEMS = [
  { icon: Phone, text: "319 5951527" },
  { icon: MessageCircle, text: "WhatsApp Disponible" },
  { icon: Mail, text: "info@serypart.com" },
  { icon: MapPin, text: "Carrera 49 #67-06" },
];

const LEGAL_LINKS = ["Privacidad", "Términos", "Cookies"];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                >
                <img src={logo} alt="SeryPart" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-white text-xl font-bold">SeryPart</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#9CA3AF" }}>
              Comercio de autopartes y mantenimiento preventivo y correctivo de vehículos livianos y semi pesados
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")
                  }
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-white font-semibold mb-5">Empresa</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-white font-semibold mb-5">Servicios</h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((item) => (
                <li key={item}>
                  <a
                    href="#servicios"
                    className="text-sm transition-colors"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contacto</h4>
            <ul className="space-y-4 mb-6">
              {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: "#2563EB" }} />
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" style={{ color: "#2563EB" }} />
                <span className="text-white text-sm font-medium">Horarios</span>
              </div>
              <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>
                Lunes – Viernes: 8:00 am – 5:00 pm
              </p>
              <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                Sábados: 8:00 am – 2:00 pm
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm" style={{ color: "#6B7280" }}>
            SeryPart © {new Date().getFullYear()}. Todos los derechos reservados.
          </p>
          <div className="flex gap-5">
            {LEGAL_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#2563EB")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}