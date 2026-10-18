import { Calendar, Search, Settings, PackageCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

const PROCESS = [
  {
    icon: Calendar,
    step: "01",
    title: "Agenda tu cita",
    desc: "Reserva en línea o llámanos. Atendemos de lunes a sábado.",
  },
  {
    icon: Search,
    step: "02",
    title: "Diagnóstico del vehículo",
    desc: "Revisión completa con equipos de diagnóstico computarizado.",
  },
  {
    icon: Settings,
    step: "03",
    title: "Reparación o mantenimiento",
    desc: "Nuestros técnicos trabajan con precisión y repuestos de calidad.",
  },
  {
    icon: PackageCheck,
    step: "04",
    title: "Entrega garantizada",
    desc: "Tu vehículo listo, con garantía y reporte detallado del servicio.",
  },
];

export default function Process() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#111111" }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          dark
          eyebrow="Cómo trabajamos"
          title="Proceso de Atención"
          subtitle="Un proceso claro y transparente para darte la mejor experiencia."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Línea conectora */}
          <div
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{ backgroundColor: "rgba(37,99,235,0.3)" }}
          />
          {PROCESS.map((item, i) => {
            const Icon = item.icon;
            const isFirst = i === 0;
            return (
              <div key={item.step} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div
                    className="relative w-24 h-24 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                    style={{
                      backgroundColor: isFirst ? "#2563EB" : "rgba(37,99,235,0.1)",
                      border: isFirst ? "none" : "1px solid rgba(37,99,235,0.25)",
                    }}
                  >
                    <Icon className="w-9 h-9" style={{ color: isFirst ? "#FFFFFF" : "#2563EB" }} />
                    <span
                      className="absolute -top-3 -right-3 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
                      style={{                       backgroundColor: "#2563EB"  }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}