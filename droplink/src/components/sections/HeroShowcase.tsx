"use client";

import { motion } from "framer-motion";
import { FileImage, Link2, Check, Upload, Copy } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

const float = (delay: number) => ({
  y: [0, -12, 0],
  transition: {
    duration: 5 + delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-8 rounded-full bg-violet-600/20 blur-[80px]" />

      <div className="relative space-y-4">
        <TiltCard className="ml-0 mr-8 sm:mr-16" intensity={10}>
          <motion.div animate={float(0)} className="showcase-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20">
                <Upload className="h-5 w-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">design-mockup.fig</p>
                <p className="text-xs text-muted">Uploading to MEGA…</p>
              </div>
              <span className="text-xs font-medium text-violet-400">78%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: "78%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </TiltCard>

        <TiltCard className="ml-8 sm:ml-16 mr-0" intensity={14}>
          <motion.div animate={float(0.6)} className="showcase-card">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                <Link2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-emerald-400">
                  Link generated
                </p>
                <p className="mt-1 truncate font-mono text-xs text-muted">
                  droplink.io/share/xK9m2pLq
                </p>
              </div>
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </TiltCard>

        <TiltCard className="ml-4 mr-4" intensity={8}>
          <motion.div animate={float(1.2)} className="showcase-card">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/15">
                <FileImage className="h-5 w-5 text-fuchsia-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">photo-vacation.jpg</p>
                <p className="text-xs text-muted">2.4 MB · Shared 3 times</p>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}
