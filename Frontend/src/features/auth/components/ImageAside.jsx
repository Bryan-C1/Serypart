import { ImageWithFallback } from "../../../shared/figma/ImageWithFallback";

/** Panel derecho del Login. */
export function ImageAside() {
  return (
    <div className="hidden lg:block relative flex-1 overflow-hidden">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1682795735660-a789079d5623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=85"
        alt="Taller SeryPart"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
