import SectionHeading from "./SectionHeading";

const TESTIMONIALS = [
  {
    name: "Carlos Mendoza",
    role: "Cliente desde 2021",
    text: "Excelente servicio. El diagnóstico fue preciso y el trabajo quedó perfecto. Definitivamente regreso.",
  },
  {
    name: "Laura Jiménez",
    role: "Cliente desde 2022",
    text: "Profesionales, rápidos y honestos con los precios. Mi carro quedó como nuevo después del servicio de frenos.",
  },
  {
    name: "Diego Torres",
    role: "Cliente desde 2020",
    text: "Llevan mi flota de vehículos hace 4 años. Siempre puntuales, con garantía y excelente atención.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-24 px-6" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Lo que dicen"
          title="Testimonios de Clientes"
          subtitle="La confianza de nuestros clientes es nuestro mayor logro."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => {
            const featured = i === 1;
            return (
              <div
                key={testimonial.name}
                className="rounded-2xl p-8 relative"
                style={{
                  backgroundColor: featured ? "#123B5D" : "#F9FAFB",
                  border: featured ? "none" : "1px solid #F3F4F6",
                }}
              >
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: featured ? "rgba(255,255,255,0.85)" : "#6B7280" }}
                >
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: featured ? "rgba(255,255,255,0.2)" : "rgba(37,99,235,0.1)",
                      color: featured ? "#FFFFFF" : "#2563EB",
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: featured ? "#FFFFFF" : "#111111" }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: featured ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}
                    >
                      {testimonial.role}
                    </p>
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