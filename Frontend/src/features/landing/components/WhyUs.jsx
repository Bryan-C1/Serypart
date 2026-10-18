import { Award, Cpu, Wrench, Zap, Shield, DollarSign } from "lucide-react";
import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";

const FEATURES = [
  {
    icon: Award,
    label: "Técnicos certificados",
    desc: "Con más de 10 años de experiencia en mecánica automotriz.",
  },
  { icon: Cpu, label: "Equipos modernos", desc: "Diagnóstico electrónico con tecnología de punta." },
  {
    icon: Wrench,
    label: "Repuestos de calidad",
    desc: "Solo usamos repuestos originales y de primeras marcas.",
  },
  { icon: Zap, label: "Atención rápida", desc: "Tiempos de entrega respetados al 100%." },
  {
    icon: Shield,
    label: "Garantía en trabajos",
    desc: "Todos nuestros servicios tienen garantía por escrito.",
  },
  {
    icon: DollarSign,
    label: "Precios transparentes",
    desc: "Presupuesto detallado antes de iniciar cualquier trabajo.",
  },
];

export default function WhyUs() {
  return (
    <section id="nosotros" className="py-24 px-6" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Imagen */}
        <div className="relative order-2 lg:order-1">
          <div className="rounded-3xl overflow-hidden" style={{ height: 540 }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1504222490345-c075b6008014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80"
              alt="Taller SeryPart"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Caja decorativa */}
          <div
            className="absolute -bottom-6 -right-6 rounded-2xl p-6 text-center"
            style={{ backgroundColor: "#2563EB", boxShadow: "0 16px 48px rgba(37,99,235,0.35)", minWidth: 160 }}
          >
            <p className="text-4xl font-bold text-white">10+</p>
            <p className="text-sm text-white/80 mt-1">
              Años de
              <br />
              experiencia
            </p>
          </div>
          {/* Acento */}
          <div
            className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl -z-10"
            style={{ backgroundColor: "#111111", opacity: 0.08 }}
          />
        </div>

        {/* Contenido */}
        <div className="order-1 lg:order-2">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#2563EB" }}
          >
            Por qué elegirnos
          </p>
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#111111" }}>
            Calidad y confianza en cada servicio
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: "#6B7280" }}>
            En SeryPart combinamos experiencia técnica, tecnología moderna y un compromiso genuino
            con la satisfacción de nuestros clientes.
          </p>
          <div className="space-y-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#2563EB" }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "#111111" }}>
                      {feature.label}
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}