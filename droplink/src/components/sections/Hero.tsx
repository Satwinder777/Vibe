"use client";

import { motion } from "framer-motion";
import { Upload, Link2, Share2, Zap, Shield, Cloud } from "lucide-react";

const features = [
  { icon: Zap, label: "Instant links" },
  { icon: Shield, label: "Secure transfers" },
  { icon: Cloud, label: "MEGA storage" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36 sm:pb-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[250px] w-[350px] rounded-full bg-purple-600/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
          Free · No signup required
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Share files{" "}
          <span className="gradient-text">instantly</span>
          <br />
          with a single link
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl"
        >
          Drop any file, get a public shareable link in seconds. Powered by
          MEGA&apos;s generous cloud storage — fast, secure, and beautifully simple.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          {features.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-elevated">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              {label}
              {i < features.length - 1 && (
                <span className="hidden sm:inline text-border">·</span>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-8 text-muted/60"
        >
          <div className="flex items-center gap-2 text-xs">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <Link2 className="h-4 w-4" />
            <span>Get Link</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className="flex items-center gap-2 text-xs">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
