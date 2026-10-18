// src/features/Auth/components/FeaturesAside.jsx
import { Car } from "lucide-react";
import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";

const FEATURES = [
  "Gestión completa de clientes y vehículos",
  "Control de inventario y repuestos",
  "Reportes y análisis en tiempo real",
];

export function FeaturesAside() {
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=85"
        alt="Mecánico trabajando en un taller"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 text-white text-center max-w-md">
        <Car className="w-32 h-32 mx-auto mb-8 opacity-90" />
        <h2 className="text-3xl font-bold mb-4">Únete a SeryPart</h2>
        <p className="text-lg opacity-90 mb-6">
          Moderniza la gestión de tu taller mecánico con nuestra plataforma profesional
        </p>
        <div className="space-y-3 text-left">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}