import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Star, Calendar } from "lucide-react";
import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";
import { useCarousel } from "../hooks/useCarousel";

const HERO_SLIDES = [
  {
    badge: "Taller certificado · Más de 10 años de experiencia",
    title: "Mantenemos tu vehículo en",
    highlight: "óptimas condiciones",
    desc: "Servicio automotriz profesional con técnicos especializados, equipos modernos y atención garantizada. Tu seguridad y satisfacción son nuestra prioridad.",
    stats: [
      { value: "+10", label: "Años de experiencia" },
      { value: "+5.000", label: "Vehículos atendidos" },
      { value: "100%", label: "Garantía en servicios" },
    ],
    img: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    imgAlt: "Mecánico profesional SeryPart",
  },
  {
    badge: "Diagnóstico computarizado · Tecnología de punta",
    title: "Detectamos cualquier falla con",
    highlight: "precisión electrónica",
    desc: "Contamos con equipos de diagnóstico de última generación que identifican problemas antes de que se conviertan en averías costosas.",
    stats: [
      { value: "100+", label: "Marcas compatibles" },
      { value: "30 min", label: "Diagnóstico express" },
      { value: "0 sorpresas", label: "Presupuesto previo" },
    ],
    img: "https://images.unsplash.com/photo-1770656506122-99bc73ac9d66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    imgAlt: "Diagnóstico computarizado de motor",
  },
  {
    badge: "Sistema de frenos · Tu seguridad primero",
    title: "Frenamos a tiempo para",
    highlight: "proteger tu vida",
    desc: "Revisión completa de pastillas, discos, líquido y sistema ABS. Trabajamos con repuestos originales y ofrecemos garantía por escrito en cada servicio.",
    stats: [
      { value: "+8.000", label: "Frenos revisados" },
      { value: "2 hrs", label: "Tiempo promedio" },
      { value: "1 año", label: "Garantía del trabajo" },
    ],
    img: "https://images.unsplash.com/photo-1696494561430-de087dd0bd69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    imgAlt: "Sistema de frenos profesional",
  },
  {
    badge: "Repuestos originales · Calidad garantizada",
    title: "Reparamos con los mejores",
    highlight: "repuestos del mercado",
    desc: "Solo utilizamos repuestos originales y de marcas certificadas. Tu vehículo merece lo mejor, y nosotros nos aseguramos de que así sea.",
    stats: [
      { value: "+500", label: "Repuestos en stock" },
      { value: "48 hrs", label: "Entrega de repuestos" },
      { value: "Top 10", label: "Marcas disponibles" },
    ],
    img: "https://images.unsplash.com/photo-1770656505784-3fad3cd41fcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80",
    imgAlt: "Repuestos de calidad SeryPart",
  },
];

export default function Hero() {
  const { index, animating, goTo, next, prev } = useCarousel(HERO_SLIDES.length, {
    interval: 6000,
    duration: 300,
  });

  const slide = HERO_SLIDES[index];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden"
      style={{ backgroundColor: "#111111" }}
    >
      {/* Patrón de fondo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Acento rojo */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        style={{ background: "radial-gradient(ellipse at 80% 50%, #2563EB 0%, transparent 70%)" }}
      />

      {/* Contenido del slide */}
      <div
        className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full transition-opacity duration-300"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {/* Izquierda — texto */}
        <div>
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-8"
            style={{
              backgroundColor: "rgba(37,99,235,0.15)",
              color: "#F87171",
              border: "1px solid rgba(37,99,235,0.3)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#2563EB" }}
            />
            {slide.badge}
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {slide.title} <span style={{ color: "#2563EB" }}>{slide.highlight}</span>
          </h1>

          <p className="text-lg mb-10 leading-relaxed" style={{ color: "#9CA3AF" }}>
            {slide.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: "#2563EB", boxShadow: "0 8px 30px rgba(37,99,235,0.35)" }}
            >
              <Calendar className="w-5 h-5" />
              Agendar Cita
            </Link>
            <a
              href="#servicios"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:bg-white/10 border"
              style={{ color: "#FFFFFF", borderColor: "rgba(255,255,255,0.25)" }}
            >
              Ver Servicios
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-6">
            {slide.stats.map((badge) => (
              <div key={badge.label}>
                <p className="text-3xl font-bold text-white">{badge.value}</p>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Derecha — imagen */}
        <div className="relative hidden lg:block">
          <div className="relative rounded-3xl overflow-hidden" style={{ height: 520 }}>
            <ImageWithFallback
              src={slide.img}
              alt={slide.imgAlt}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, transparent 60%)" }}
            />
          </div>

          {/* Tarjeta flotante — calificación */}
          <div
            className="absolute -bottom-6 -left-8 rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", minWidth: 220 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
            >
              <Star className="w-6 h-6" style={{ color: "#2563EB" }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#111111" }}>
                4.9 / 5.0
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                +500 reseñas positivas
              </p>
            </div>
          </div>

          {/* Tarjeta flotante — disponibilidad */}
          <div
            className="absolute -top-4 -right-4 rounded-2xl p-4"
            style={{ backgroundColor: "#2563EB", boxShadow: "0 16px 40px rgba(37,99,235,0.4)", minWidth: 180 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-medium">Disponible hoy</span>
            </div>
            <p className="text-white font-bold text-sm">Lun – Sáb</p>
            <p className="text-white/70 text-xs">8:00 am – 6:00 pm</p>
          </div>

          <div
            className="absolute -bottom-3 -right-3 w-32 h-32 rounded-3xl -z-10"
            style={{ backgroundColor: "#2563EB", opacity: 0.2 }}
          />
        </div>
      </div>

      {/* Controles del carrusel */}
      <div className="relative max-w-7xl mx-auto px-6 pb-12 w-full flex items-center justify-between">
        {/* Puntos */}
        <div className="flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              aria-label={`Ir al slide ${i + 1}`}
              style={{
                width: i === index ? 32 : 8,
                height: 8,
                backgroundColor: i === index ? "#2563EB" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        {/* Flechas */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            aria-label="Slide anterior"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={next}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            aria-label="Slide siguiente"
            style={{ backgroundColor: "#2563EB" }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Onda inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}