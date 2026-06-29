"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for quick file sharing",
    features: [
      "500MB per file",
      "Unlimited links",
      "7-day link expiry",
      "MEGA cloud storage",
      "No signup required",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users and teams",
    features: [
      "5GB per file",
      "Custom link aliases",
      "Never-expiring links",
      "Password protection",
      "Upload analytics",
      "Priority support",
    ],
    cta: "Coming Soon",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "Enterprise-grade sharing",
    features: [
      "20GB per file",
      "Team workspaces",
      "SSO integration",
      "API access",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Coming Soon",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Start free. Upgrade when you need more power.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-3xl border p-8 transition-all",
                plan.highlighted
                  ? "border-accent/50 bg-gradient-to-b from-violet-500/10 to-transparent shadow-2xl shadow-violet-500/10 scale-[1.02]"
                  : "border-border bg-surface/50 hover:border-accent/20"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </div>
              )}

              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.name === "Free" ? "#upload" : "#"}
                className={cn(
                  "mt-8 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                  plan.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:brightness-110"
                    : "border border-border bg-surface hover:border-accent/40 hover:text-accent"
                )}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
