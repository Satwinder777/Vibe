"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function Background() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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
      t += 0.004;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const blobs = [
        { cx: 0.2, cy: 0.3, r: 0.35, color: "124, 58, 237" },
        { cx: 0.8, cy: 0.2, r: 0.3, color: "99, 102, 241" },
        { cx: 0.5, cy: 0.7, r: 0.4, color: "192, 132, 252" },
        { cx: 0.1, cy: 0.8, r: 0.25, color: "236, 72, 153" },
      ];

      blobs.forEach((b, i) => {
        const ox = Math.sin(t + i * 1.5) * 0.08;
        const oy = Math.cos(t + i * 1.2) * 0.06;
        const x = (b.cx + ox) * width;
        const y = (b.cy + oy) * height;
        const r = b.r * Math.min(width, height);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${b.color}, 0.2)`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70 dark:opacity-90" />
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 45% 35% at ${mouse.x}% ${mouse.y}%, rgba(139,92,246,0.18), transparent 65%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, black 10%, transparent 75%)",
        }}
      />
    </div>
  );
}
