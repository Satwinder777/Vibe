"use client";

import { useEffect, useRef, useState } from "react";

export function Background() {
  const [mouse, setMouse] = useState({ x: 50, y: 40 });
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
      t += 0.003;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const blobs = [
        { cx: 0.15, cy: 0.25, r: 0.45, color: "88, 28, 135" },
        { cx: 0.85, cy: 0.15, r: 0.35, color: "67, 56, 202" },
        { cx: 0.6, cy: 0.75, r: 0.4, color: "109, 40, 217" },
      ];

      blobs.forEach((b, i) => {
        const ox = Math.sin(t + i * 1.8) * 0.05;
        const oy = Math.cos(t + i * 1.4) * 0.04;
        const x = (b.cx + ox) * width;
        const y = (b.cy + oy) * height;
        const r = b.r * Math.min(width, height);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${b.color}, 0.14)`);
        grad.addColorStop(0.5, `rgba(${b.color}, 0.04)`);
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
      <div className="absolute inset-0 bg-[#07050f]" />
      <div className="absolute inset-0 bg-background opacity-0 dark:opacity-100" />
      <div className="absolute inset-0 bg-[#f8f6ff] opacity-100 dark:opacity-0" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse 50% 40% at ${mouse.x}% ${mouse.y}%, rgba(139,92,246,0.1), transparent 70%)`,
        }}
      />
      {/* Top vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,58,237,0.12),transparent)]" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
