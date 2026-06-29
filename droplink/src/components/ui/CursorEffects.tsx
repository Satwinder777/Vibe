"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useCursor } from "@/components/providers/CursorProvider";

export function CursorEffects() {
  const { springX, springY, springXSlow, springYSlow, x, y, enabled } =
    useCursor();
  const [clicking, setClicking] = useState(false);

  const dotScale = useMotionValue(1);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("cursor-custom");
    const down = () => {
      setClicking(true);
      dotScale.set(0.6);
    };
    const up = () => {
      setClicking(false);
      dotScale.set(1);
    };
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      document.body.classList.remove("cursor-custom");
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [enabled, dotScale]);

  if (!enabled) return null;

  return (
    <>
      {/* Large ambient spotlight — slow follow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ x: springXSlow, y: springYSlow }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen dark:mix-blend-screen"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Medium glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{ x: springX, y: springY }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Cursor ring — medium lag */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: clicking ? 0.85 : 1,
            opacity: clicking ? 0.9 : 0.5,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="h-10 w-10 rounded-full border border-violet-400/40"
        />
      </motion.div>

      {/* Cursor dot — fast follow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          scale: dotScale,
        }}
      >
        <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />
      </motion.div>
    </>
  );
}

/** Spotlight mask for sections — place inside relative container */
export function CursorSpotlight({ className }: { className?: string }) {
  const { springXSlow, springYSlow, enabled } = useCursor();

  if (!enabled) return null;

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className ?? ""}`}
      style={{ x: springXSlow, y: springYSlow }}
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)",
        }}
      />
    </motion.div>
  );
}
