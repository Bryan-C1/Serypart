import { useEffect, useRef, useState } from "react";

const MIN_THUMB_HEIGHT = 32;
const MAX_THUMB_RATIO = 0.4;

export function CustomScrollbar({ containerRef }) {
  const trackRef = useRef(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(MIN_THUMB_HEIGHT);
  const [trackHeight, setTrackHeight] = useState(0);
  const [visible, setVisible] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const th = trackRef.current ? trackRef.current.clientHeight : clientHeight;
      setTrackHeight(th);
      const canScroll = scrollHeight > clientHeight + 1;
      setVisible(canScroll);
      if (!canScroll) return;
      const proportional = (clientHeight / scrollHeight) * th;
      const maxThumbHeight = Math.max(MIN_THUMB_HEIGHT, th * MAX_THUMB_RATIO);
      const thumbH = Math.min(th, maxThumbHeight, Math.max(MIN_THUMB_HEIGHT, proportional));
      setThumbHeight(thumbH);
      const maxThumbTop = Math.max(0, th - thumbH);
      const scrollable = scrollHeight - clientHeight;
      const ratio = scrollable > 0 ? scrollTop / scrollable : 0;
      setThumbTop(Math.max(0, Math.min(maxThumbTop, ratio * maxThumbTop)));
    };

    update();
    el.addEventListener("scroll", update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  const handleThumbMouseDown = (event) => {
    event.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    dragRef.current = { startY: event.clientY, startScrollTop: el.scrollTop };

    const onMove = (moveEvent) => {
      const current = containerRef.current;
      if (!current || !dragRef.current) return;
      const maxThumbTop = trackHeight - thumbHeight;
      if (maxThumbTop <= 0) return;
      const deltaY = moveEvent.clientY - dragRef.current.startY;
      const scrollable = current.scrollHeight - current.clientHeight;
      current.scrollTop = dragRef.current.startScrollTop + (deltaY / maxThumbTop) * scrollable;
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleTrackClick = (event) => {
    if (event.target !== trackRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const maxThumbTop = trackHeight - thumbHeight;
    const targetTop = Math.max(0, Math.min(maxThumbTop, clickY - thumbHeight / 2));
    const ratio = maxThumbTop > 0 ? targetTop / maxThumbTop : 0;
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  };

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      className="absolute top-0 right-0 bottom-0 w-3 z-20"
    >
      {visible && (
        <div
          onMouseDown={handleThumbMouseDown}
          style={{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }}
          className="w-1.5 mx-auto rounded-full bg-muted-foreground/50 hover:bg-muted-foreground active:bg-muted-foreground cursor-pointer transition-colors"
        />
      )}
    </div>
  );
}
