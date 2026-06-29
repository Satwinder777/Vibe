"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/components/providers/CursorProvider";

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.4 });
  const { x, y, enabled } = useCursor();

  useEffect(() => {
    if (!enabled) return;
    const unsubX = x.on("change", (v) => {
      mouseRef.current.x = v / window.innerWidth;
    });
    const unsubY = y.on("change", (v) => {
      mouseRef.current.y = v / window.innerHeight;
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [x, y, enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.003;
      const { width, height } = canvas;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      ctx.clearRect(0, 0, width, height);

      const blobs = [
        { cx: 0.15, cy: 0.25, r: 0.45, color: "88, 28, 135" },
        { cx: 0.85, cy: 0.15, r: 0.35, color: "67, 56, 202" },
        { cx: 0.6, cy: 0.75, r: 0.4, color: "109, 40, 217" },
      ];

      blobs.forEach((b, i) => {
        const pull = enabled ? 0.06 : 0;
        const ox = Math.sin(t + i * 1.8) * 0.05 + (mx - b.cx) * pull;
        const oy = Math.cos(t + i * 1.4) * 0.04 + (my - b.cy) * pull;
        const bx = (b.cx + ox) * width;
        const by = (b.cy + oy) * height;
        const r = b.r * Math.min(width, height);
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        grad.addColorStop(0, `rgba(${b.color}, 0.16)`);
        grad.addColorStop(0.5, `rgba(${b.color}, 0.05)`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      if (enabled) {
        const cx = mx * width;
        const cy = my * height;
        const cursorGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 280);
        cursorGrad.addColorStop(0, "rgba(139, 92, 246, 0.08)");
        cursorGrad.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = cursorGrad;
        ctx.fillRect(0, 0, width, height);
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#07050f]" />
      <div className="absolute inset-0 bg-background opacity-0 dark:opacity-100" />
      <div className="absolute inset-0 bg-[#f8f6ff] opacity-100 dark:opacity-0" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.1),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
