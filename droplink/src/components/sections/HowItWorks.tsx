"use client";

import { motion } from "framer-motion";
import { UserPlus, Upload, Link2, Share2 } from "lucide-react";
import { copy } from "@/lib/copy";

const stepMeta = [
  {
    icon: UserPlus,
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
  },
  {
    icon: Upload,
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/25",
  },
  {
    icon: Link2,
    color: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/25",
  },
  {
    icon: Share2,
    color: "from-fuchsia-500 to-pink-600",
    shadow: "shadow-fuchsia-500/25",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, type: "spring" as const, stiffness: 200 },
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            {copy.howItWorks.title}{" "}
            <span className="gradient-text">{copy.howItWorks.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            {copy.howItWorks.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {copy.howItWorks.steps.map((step, index) => {
            const meta = stepMeta[index];
            const Icon = meta.icon;
            return (
              <motion.div
                key={step.title}
                variants={item}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 400 },
                }}
                className="glass-card group relative cursor-default rounded-3xl p-6 text-center"
              >
                <motion.span
                  className="absolute right-4 top-4 text-xs font-bold text-muted/40"
                  whileHover={{ scale: 1.2, color: "var(--accent)" }}
                >
                  0{index + 1}
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} shadow-lg ${meta.shadow} transition-shadow group-hover:shadow-xl`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-base font-semibold transition-colors group-hover:text-accent">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/0 to-transparent transition-all group-hover:via-violet-500/50" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
