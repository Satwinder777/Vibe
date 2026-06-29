"use client";

import { motion } from "framer-motion";
import { Gift, Zap, Link2, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { hasUsedFreeUpload } from "@/lib/free-upload";
import { useEffect, useState } from "react";

const marqueeItems = [
  "Instant Share Links",
  "MEGA Cloud Storage",
  "1 Free Upload",
  "End-to-End Soon",
  "Password Links Soon",
  "Team Workspaces Soon",
  "Custom Aliases Soon",
  "Upload Analytics Soon",
];

export function Hero() {
  const { user } = useAuth();
  const [freeUsed, setFreeUsed] = useState(false);

  useEffect(() => {
    setFreeUsed(hasUsedFreeUpload());
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-6 sm:pt-32 sm:pb-10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Floating rings */}
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="h-64 w-64 rounded-full border border-violet-500/10 sm:h-96 sm:w-96"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-indigo-500/15 sm:inset-12"
          />
          <motion.div
            className="pulse-ring absolute inset-16 rounded-full bg-violet-500/5 sm:inset-24"
          />
        </div>

        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300 backdrop-blur-md sm:text-sm"
          >
            <Gift className="h-3.5 w-3.5" />
            {user
              ? "Unlimited uploads · Full history"
              : freeUsed
                ? "Free upload used · Sign up for more"
                : "1 free upload · No signup needed"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mx-auto max-w-5xl text-[2.5rem] font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl"
          >
            Drop.{" "}
            <span className="gradient-text">Share.</span>
            <br />
            Done in seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {user
              ? "Upload unlimited files, track your history, and share links instantly."
              : "Try once for free — get a share link instantly. Sign up to unlock unlimited uploads and your personal file vault."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#upload"
              className="btn-neon inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white"
            >
              <Zap className="h-4 w-4" />
              {user ? "Upload Now" : freeUsed ? "Sign Up to Upload" : "Try Free Upload"}
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-6 py-3 text-sm font-semibold backdrop-blur-md transition-all hover:border-accent/40 hover:bg-surface"
            >
              Explore Features
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-6 text-xs text-muted sm:text-sm"
          >
            <span className="flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-accent" />
              Instant links
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>MEGA encrypted</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>No install</span>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative mt-14 overflow-hidden">
          <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />
          <div className="marquee-track gap-8 opacity-50">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
