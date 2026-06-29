"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Cloud, ArrowDown } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const features = [
  { icon: Zap, label: "Instant links", delay: 0 },
  { icon: Shield, label: "Encrypted storage", delay: 0.1 },
  { icon: Cloud, label: "MEGA powered", delay: 0.2 },
];

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.03, duration: 0.5 },
  }),
};

export function Hero() {
  const { user } = useAuth();
  const titleBefore = "Share files at ";
  const titleHighlight = "lightning speed";

  return (
    <section className="relative overflow-hidden pt-28 pb-4 sm:pt-36 sm:pb-8">
      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.03 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-5 py-2 text-sm font-medium backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-violet-500/20"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
          </motion.div>
          <span className="text-violet-300 dark:text-violet-200">
            {user
              ? `Welcome back — upload & share instantly`
              : `Sign up free · Track all your uploads`}
          </span>
        </motion.div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
          {titleBefore.split("").map((char, i) => (
            <motion.span
              key={`b-${i}`}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={letterVariants}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <span className="gradient-text">
            {titleHighlight.split("").map((char, i) => (
              <motion.span
                key={`h-${i}`}
                custom={titleBefore.length + i}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                className="inline-block"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Drop any file, get a shareable link in seconds. Your upload history
          stays tied to your account — always accessible, always organized.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {features.map(({ icon: Icon, label, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + delay }}
              whileHover={{
                scale: 1.06,
                y: -6,
                transition: { type: "spring", stiffness: 400 },
              }}
              className="glass-card flex cursor-default items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20"
              >
                <Icon className="h-4 w-4 text-accent" />
              </motion.div>
              <span className="font-medium">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          href="#upload"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="mt-12 inline-flex flex-col items-center gap-2 text-muted transition-colors hover:text-accent"
        >
          <span className="text-xs font-medium uppercase tracking-widest">
            Start uploading
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}
