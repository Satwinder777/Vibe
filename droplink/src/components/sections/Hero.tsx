"use client";

import { motion } from "framer-motion";
import { Gift, Zap, ArrowRight, Shield, Cloud } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { hasUsedFreeUpload } from "@/lib/free-upload";
import { useEffect, useState } from "react";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const { user } = useAuth();
  const [freeUsed, setFreeUsed] = useState(false);

  useEffect(() => {
    setFreeUsed(hasUsedFreeUpload());
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-violet-200/90 backdrop-blur-md"
            >
              <Gift className="h-3.5 w-3.5 text-violet-400" />
              {user
                ? "Pro member · Unlimited uploads"
                : freeUsed
                  ? "Free trial used"
                  : "1 free upload — no account needed"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Share files in a{" "}
              <span className="gradient-text">flow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted/90 sm:text-lg"
            >
              {user
                ? "Upload unlimited files, manage your vault, and share secure links instantly."
                : "Drop a file, get a link. One free try without signup — then unlock your full file vault."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#upload"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
              >
                <Zap className="h-4 w-4" />
                {user
                  ? "Upload Now"
                  : freeUsed
                    ? "Create Account"
                    : "Try Free Upload"}
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/[0.08]"
              >
                Features
                <ArrowRight className="h-4 w-4 opacity-50" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-5"
            >
              {[
                { icon: Zap, label: "Instant links" },
                { icon: Shield, label: "MEGA encrypted" },
                { icon: Cloud, label: "Cloud storage" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-xs text-muted sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-violet-400/80" />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hidden sm:block"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
