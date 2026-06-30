"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useCursor } from "@/components/providers/CursorProvider";

function auraSizeForWidth(width: number): number {
  if (width >= 1920) return 560;
  if (width >= 1536) return 480;
  if (width >= 1280) return 400;
  return 320;
}

export function CursorEffects() {
  const { springX, springY, springXSlow, springYSlow, x, y, enabled } =
    useCursor();
  const [clicking, setClicking] = useState(false);
  const [auraSize, setAuraSize] = useState(320);
  const dotScale = useMotionValue(1);

  useEffect(() => {
    const onResize = () => setAuraSize(auraSizeForWidth(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("cursor-custom");
    const down = () => {
      setClicking(true);
      dotScale.set(0.5);
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
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{ x: springXSlow, y: springYSlow }}
      >
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: auraSize,
            height: auraSize,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(99,102,241,0.08) 42%, transparent 72%)",
          }}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{ scale: clicking ? 0.7 : 1, opacity: clicking ? 1 : 0.35 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="h-8 w-8 rounded-full border border-violet-300/50"
        />
      </motion.div>

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
        <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(200,180,255,0.9)]" />
      </motion.div>
    </>
  );
}
