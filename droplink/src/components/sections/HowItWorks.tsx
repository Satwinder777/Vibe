"use client";

import { motion } from "framer-motion";
import { Upload, Link2, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description:
      "Drag and drop any file or click to browse. Multiple files at once — no account needed.",
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
  },
  {
    icon: Link2,
    title: "Get Link",
    description:
      "We instantly generate a unique public link for each file, stored securely on MEGA cloud.",
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/25",
  },
  {
    icon: Share2,
    title: "Share",
    description:
      "Send the link to anyone. They can view file details and download — no login required.",
    color: "from-purple-500 to-pink-600",
    shadow: "shadow-purple-500/25",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Three simple steps to share any file with the world
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="relative mt-16 grid gap-8 md:grid-cols-3"
        >
          <div className="pointer-events-none absolute top-24 left-[16.67%] right-[16.67%] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={item}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg ${step.shadow}`}
                >
                  <step.icon className="h-7 w-7 text-white" />
                </motion.div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated text-xs font-bold ring-2 ring-background md:left-1/2 md:-translate-x-1/2 md:-top-4">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
