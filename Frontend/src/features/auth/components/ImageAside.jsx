import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";

/** Panel derecho del Login. */
export function ImageAside() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#dfe5ee]">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
        alt="Coche deportivo SeryPart"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#dfe5ee]/15 via-transparent to-[#dfe5ee]/5" />
    </div>
  );
}
