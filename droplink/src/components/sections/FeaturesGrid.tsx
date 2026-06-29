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
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const liveFeatures = [
  {
    icon: Upload,
    title: "Instant Upload",
    desc: "Drag & drop any file. Get a shareable link in seconds.",
    color: "from-violet-500 to-purple-600",
    live: true,
  },
  {
    icon: Link2,
    title: "Public Share Links",
    desc: "Anyone with the link can view and download — no login needed.",
    color: "from-indigo-500 to-blue-600",
    live: true,
  },
  {
    icon: Sparkles,
    title: "1 Free Upload",
    desc: "Try without signing up. One file, one link — no history saved.",
    color: "from-emerald-500 to-teal-600",
    live: true,
  },
];

const memberFeatures = [
  {
    icon: Infinity,
    title: "Unlimited Uploads",
    desc: "Sign up and upload as many files as you want.",
    color: "from-fuchsia-500 to-pink-600",
    live: true,
  },
  {
    icon: History,
    title: "Upload Vault",
    desc: "Your personal file history — manage, copy, and delete anytime.",
    color: "from-violet-500 to-indigo-600",
    live: true,
  },
];

const comingSoon = [
  {
    icon: Lock,
    title: "Password Links",
    desc: "Protect files with a password before sharing.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Palette,
    title: "Custom Aliases",
    desc: "yourname.droplink/file instead of random IDs.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Link Expiry",
    desc: "Set auto-expiry — links vanish after your chosen time.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Users,
    title: "Team Workspaces",
    desc: "Shared folders for teams with role-based access.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: BarChart3,
    title: "Upload Analytics",
    desc: "Track views, downloads, and link performance.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Code2,
    title: "Developer API",
    desc: "Integrate DropLink uploads into your own apps.",
    color: "from-slate-500 to-zinc-600",
  },
  {
    icon: Shield,
    title: "End-to-End Encryption",
    desc: "Client-side encryption before upload — zero-knowledge storage.",
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
    <motion.div
      whileHover={{ y: -6 }}
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
      className={`bento-card group p-6 ${large ? "sm:col-span-2" : ""}`}
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
            Live
          </span>
        )}
        {soon && (
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
            Soon
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-bold transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
    </motion.div>
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
            Features
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            Built for now.{" "}
            <span className="gradient-text">Ready for tomorrow.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            {user
              ? "You have full access to all live features. More power coming soon."
              : "Start with 1 free upload. Unlock everything with a free account."}
          </p>
        </motion.div>

        <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          Available now
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
          Coming soon
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
