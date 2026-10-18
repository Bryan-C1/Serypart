import { Link } from "react-router-dom";
import { Zap, Calendar, Phone } from "lucide-react";

export default function CallToAction() {
  return (
    <section id="contacto" className="py-24 px-6" style={{ backgroundColor: "#123B5D" }}>
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}
        >
          <Zap className="w-4 h-4" />
          Respuesta en menos de 24 horas
        </div>
        <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
          ¿Tu vehículo necesita mantenimiento?
        </h2>
        <p className="text-xl mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
          Agenda hoy mismo y recibe atención profesional con garantía en todos nuestros servicios.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#FFFFFF", color: "#123B5D", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
          >
            <Calendar className="w-5 h-5" />
            Solicitar Cita Ahora
          </Link>
          <a
            href="tel:+1234567890"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 transition-all"
          >
            <Phone className="w-5 h-5" />
            Llamar Ahora
          </a>
        </div>
      </div>
    </section>
  );
}