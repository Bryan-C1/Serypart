import { Zap, Droplets, Disc, Gauge, RotateCcw, Cpu, CircleDot, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";
import SectionHeading from "./SectionHeading";

const SERVICES = [
  {
    icon: Droplets,
    title: "Cambio de Aceite",
    desc: "Aceites sintéticos y convencionales para prolongar la vida de tu motor.",
    img: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  },
  {
    icon: Disc,
    title: "Sistema de Frenos",
    desc: "Revisión, ajuste y cambio de pastillas, discos y líquido de frenos.",
    img: "https://images.unsplash.com/photo-1613214150384-14921ff659b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  },
  {
    icon: Gauge,
    title: "Suspensión",
    desc: "Diagnóstico y reparación de amortiguadores, resortes y rótulas.",
    img: "https://images.unsplash.com/photo-1599082267768-4815b2ea6bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  },
  {
    icon: RotateCcw,
    title: "Alineación y Balanceo",
    desc: "Precisión milimétrica para mayor estabilidad, seguridad y menor desgaste.",
    img: "https://images.unsplash.com/photo-1645445522156-9ac06bc7a767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  },
  {
  icon: Zap,
  title: "Sistemas Eléctricos",
  desc: "Revisión de baterías, alternador e iluminación del vehículo.",
  img: "https://images.unsplash.com/photo-1764122623556-90a7d480df53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  },
  {
    icon: CircleDot,
    title: "Cambio de Neumáticos",
    desc: "Montaje, desmontaje y balanceo con todas las marcas disponibles.",
    img: "https://images.unsplash.com/photo-1656232976683-7b688560e427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-6" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Lo que hacemos"
          title="Nuestros Servicios"
          subtitle="Ofrecemos soluciones completas para el mantenimiento y reparación de tu vehículo."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #F3F4F6" }}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to bottom, transparent 30%, rgba(17,17,17,0.7) 100%)",
                    }}
                  />
                  <div
                    className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#111111" }}>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>
                    {service.desc}
                  </p>
                  <div
                    className="flex items-center gap-1 text-sm font-semibold transition-colors"
                    style={{ color: "#2563EB" }}
                  >
                    Saber más <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}