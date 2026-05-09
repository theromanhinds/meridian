import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  storageKey: string;
  initial: number;
  min: number;
  max: number;
  /** "left" = handle on right edge of element (drag right grows); "right" = handle on left edge (drag left grows). */
  edge: "left" | "right";
}

/** Persist a panel width and provide drag-handle pointer handlers. */
export function usePanelResize({ storageKey, initial, min, max, edge }: Options) {
  const [width, setWidth] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const n = Number(raw);
        if (!Number.isNaN(n)) return clamp(n, min, max);
      }
    } catch {
      // ignore
    }
    return initial;
  });
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef<{ x: number; w: number } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(width));
    } catch {
      // ignore
    }
  }, [storageKey, width]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startRef.current = { x: e.clientX, w: width };
      setIsDragging(true);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!startRef.current) return;
      const delta = e.clientX - startRef.current.x;
      const next = edge === "left" ? startRef.current.w + delta : startRef.current.w - delta;
      setWidth(clamp(next, min, max));
    },
    [edge, min, max],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    startRef.current = null;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  return { width, isDragging, onPointerDown, onPointerMove, onPointerUp };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
