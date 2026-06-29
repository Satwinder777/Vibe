"use client";

import { motion } from "framer-motion";
import { Gift, Zap, ArrowRight, Shield, Cloud } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { hasUsedFreeUpload } from "@/lib/free-upload";
import { useEffect, useState } from "react";
import { HeroShowcase } from "./HeroShowcase";

export function Hero() {
  const { user } = useAuth();
  const [freeUsed, setFreeUsed] = useState(false);

  useEffect(() => {
    setFreeUsed(hasUsedFreeUpload());
  }, []);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      {/* Soft spotlight — no circles */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(124,58,237,0.15)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-violet-200 backdrop-blur-xl"
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
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]"
            >
              File sharing,{" "}
              <span className="gradient-text">reimagined.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
            >
              {user
                ? "Upload unlimited files, manage your vault, and share secure links in one click."
                : "Drop a file, get a link instantly. No signup for your first upload — create an account when you're ready for more."}
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
                    ? "Create Free Account"
                    : "Try Free Upload"}
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                See Features
                <ArrowRight className="h-4 w-4 opacity-60" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-wrap gap-6"
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="h-3.5 w-3.5 text-violet-400" />
                  </span>
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Product mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="hidden sm:block"
          >
            <HeroShowcase />
          </motion.div>
        </div>

        {/* Trust strip — clean, not marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-16 rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-4 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted sm:text-sm">
            <span className="font-medium text-foreground/70">
              Powered by MEGA Cloud
            </span>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <span>Password links — coming soon</span>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <span>Team workspaces — coming soon</span>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <span>Developer API — coming soon</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
