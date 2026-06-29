"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

interface CursorContextValue {
  x: MotionValue<number>;
  y: MotionValue<number>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  springXSlow: MotionValue<number>;
  springYSlow: MotionValue<number>;
  enabled: boolean;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 280, damping: 28, mass: 0.5 });
  const springXSlow = useSpring(x, { stiffness: 60, damping: 20, mass: 1.2 });
  const springYSlow = useSpring(y, { stiffness: 60, damping: 20, mass: 1.2 });

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <CursorContext.Provider
      value={{ x, y, springX, springY, springXSlow, springYSlow, enabled }}
    >
      {children}
    </CursorContext.Provider>
  );
}
