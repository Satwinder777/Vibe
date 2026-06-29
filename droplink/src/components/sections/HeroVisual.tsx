"use client";

import { motion } from "framer-motion";
import { Upload, Link2, CheckCircle2 } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { copy } from "@/lib/copy";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 rounded-full bg-violet-600/25 blur-[70px]" />

      <TiltCard intensity={6}>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-violet-900/30 backdrop-blur-sm">
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt={copy.heroVisual.imageAlt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04020e] via-[#04020e]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-transparent to-indigo-900/20 mix-blend-overlay" />
          </div>

          <div className="relative space-y-3 p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20">
                <Upload className="h-4 w-4 text-violet-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold">{copy.heroVisual.fileName}</p>
                <p className="text-[10px] text-muted">{copy.heroVisual.fileMeta}</p>
              </div>
              <span className="text-[10px] font-medium text-violet-300">
                {copy.heroVisual.fileStatus}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
                <Link2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-emerald-400">
                  {copy.heroVisual.linkTitle}
                </p>
                <p className="truncate font-mono text-[10px] text-muted">
                  {copy.heroVisual.linkUrl}
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            </motion.div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
