import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Controla un carrusel con autoplay y una transición de fundido.
 */
export function useCarousel(length, { interval = 6000, duration = 300 } = {}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const lockRef = useRef(false);
  const timeoutRef = useRef(null);

  const goTo = useCallback(
    (target) => {
      if (lockRef.current || length === 0) return;
      lockRef.current = true;
      setAnimating(true);

      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => {
          const next = typeof target === "function" ? target(prev) : target;
          return ((next % length) + length) % length;
        });
        setAnimating(false);
        lockRef.current = false;
      }, duration);
    },
    [length, duration]
  );

  const next = useCallback(() => goTo((prev) => prev + 1), [goTo]);
  const prev = useCallback(() => goTo((prevIndex) => prevIndex - 1), [goTo]);

  useEffect(() => {
    if (length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, length, index]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return { index, animating, goTo, next, prev };
}