"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "@/components/providers/CursorProvider";

const PARTICLE_COUNT_DESKTOP = 2800;
const PARTICLE_COUNT_MOBILE = 900;

interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  speed: number;
  hue: number;
}

function noise2D(x: number, y: number): number {
  const s = Math.sin(x * 1.7 + y * 1.3) + Math.sin(x * 0.6 - y * 2.1);
  const c = Math.cos(x * 1.1 + y * 0.8) * 0.5;
  return (s + c) / 2.5;
}

export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const { x, y, enabled } = useCursor();

  useEffect(() => {
    if (!enabled) {
      mouseRef.current.active = false;
      return;
    }
    const unsubX = x.on("change", (v) => {
      mouseRef.current.x = v;
      mouseRef.current.active = true;
    });
    const unsubY = y.on("change", (v) => {
      mouseRef.current.y = v;
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

    let animId: number;
    let time = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        px: 0,
        py: 0,
        speed: 0.4 + Math.random() * 1.2,
        hue: 240 + Math.random() * 80,
      }));
      particles.forEach((p) => {
        p.px = p.x;
        p.py = p.y;
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 1;
      ctx.fillStyle = "rgba(4, 2, 14, 0.12)";
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseOn = mouseRef.current.active;
      const t = time * 0.002;

      for (const p of particles) {
        const nx = p.x * 0.0025;
        const ny = p.y * 0.0025;

        let angle =
          noise2D(nx + t * 0.4, ny + t * 0.3) * Math.PI * 3 +
          noise2D(nx * 2 - t, ny * 2) * Math.PI;

        if (mouseOn) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 180;
          if (dist < radius && dist > 0) {
            const force = (1 - dist / radius) * 2.5;
            angle += Math.atan2(dy, dx) + Math.PI * 0.5 * force;
          }
        }

        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const speed = Math.hypot(p.x - p.px, p.y - p.py);
        const alpha = Math.min(0.55, 0.08 + speed * 0.12);
        const hue = p.hue + speed * 8;

        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${hue}, 75%, 68%, ${alpha})`;
        ctx.lineWidth = Math.min(1.4, 0.4 + speed * 0.3);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
