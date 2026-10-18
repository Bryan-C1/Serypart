import { useState, useEffect } from "react";

/**
 * Devuelve true cuando la página se ha desplazado más allá del offset indicado.
 */
export function useScrolled(offset = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}