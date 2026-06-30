"use client";

import { motion } from "framer-motion";
import {
  Upload,
  History,
  Link2,
  Lock,
  Users,
  BarChart3,
  Code2,
  Clock,
  Palette,
  Shield,
  Sparkles,
  Infinity,
  QrCode,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { TiltCard } from "@/components/ui/TiltCard";
import { copy } from "@/lib/copy";

const liveFeatures = [
  {
    icon: Upload,
    title: copy.featureItems.instantUpload.title,
    desc: copy.featureItems.instantUpload.desc,
    color: "from-violet-500 to-purple-600",
    live: true,
  },
  {
    icon: Link2,
    title: copy.featureItems.publicLinks.title,
    desc: copy.featureItems.publicLinks.desc,
    color: "from-indigo-500 to-blue-600",
    live: true,
  },
  {
    icon: Sparkles,
    title: copy.featureItems.freeTransfer.title,
    desc: copy.featureItems.freeTransfer.desc,
    color: "from-emerald-500 to-teal-600",
    live: true,
  },
];

const memberFeatures = [
  {
    icon: Infinity,
    title: copy.featureItems.unlimited.title,
    desc: copy.featureItems.unlimited.desc,
    color: "from-fuchsia-500 to-pink-600",
    live: true,
  },
  {
    icon: History,
    title: copy.featureItems.vault.title,
    desc: copy.featureItems.vault.desc,
    color: "from-violet-500 to-indigo-600",
    live: true,
  },
  {
    icon: QrCode,
    title: copy.featureItems.qrShare.title,
    desc: copy.featureItems.qrShare.desc,
    color: "from-sky-500 to-cyan-600",
    live: true,
  },
];

const comingSoon = [
  {
    icon: Lock,
    title: copy.featureItems.passwordLinks.title,
    desc: copy.featureItems.passwordLinks.desc,
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Palette,
    title: copy.featureItems.aliases.title,
    desc: copy.featureItems.aliases.desc,
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Clock,
    title: copy.featureItems.expiry.title,
    desc: copy.featureItems.expiry.desc,
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Users,
    title: copy.featureItems.teams.title,
    desc: copy.featureItems.teams.desc,
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: BarChart3,
    title: copy.featureItems.analytics.title,
    desc: copy.featureItems.analytics.desc,
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Code2,
    title: copy.featureItems.api.title,
    desc: copy.featureItems.api.desc,
    color: "from-slate-500 to-zinc-600",
  },
  {
    icon: Shield,
    title: copy.featureItems.e2e.title,
    desc: copy.featureItems.e2e.desc,
    color: "from-blue-500 to-indigo-600",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  live,
  soon,
  large,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  live?: boolean;
  soon?: boolean;
  large?: boolean;
}) {
  return (
    <TiltCard intensity={8} className={large ? "sm:col-span-2" : ""}>
      <motion.div
        whileHover={{ y: -4 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            "--mx",
            `${((e.clientX - rect.left) / rect.width) * 100}%`
          );
          e.currentTarget.style.setProperty(
            "--my",
            `${((e.clientY - rect.top) / rect.height) * 100}%`
          );
        }}
        className="bento-card group h-full p-6"
      >
      <div className="flex items-start justify-between">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        {live && (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {copy.features.live}
          </span>
        )}
        {soon && (
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
            {copy.features.soon}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-bold transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
      </motion.div>
    </TiltCard>
  );
}

export function FeaturesGrid() {
  const { user } = useAuth();

  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {copy.features.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            {copy.features.title}{" "}
            <span className="gradient-text">{copy.features.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            {user ? copy.features.descMember : copy.features.descGuest}
          </p>
        </motion.div>

        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          {copy.features.available}
        </div>
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liveFeatures.map((f) => (
            <FeatureCard key={f.title} {...f} live />
          ))}
          {memberFeatures.map((f) => (
            <FeatureCard key={f.title} {...f} live />
          ))}
        </div>

        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          {copy.features.comingSoon}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map((f) => (
            <FeatureCard key={f.title} {...f} soon />
          ))}
        </div>
      </div>
    </section>
  );
}
