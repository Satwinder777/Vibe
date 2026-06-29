"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20"
            >
              <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-base font-bold transition-colors group-hover:text-accent">
              Drop<span className="gradient-text">Link</span>
            </span>
          </Link>

          <p className="text-center text-sm text-muted">
            Secure file sharing powered by MEGA cloud storage
          </p>

          <motion.a
            href="https://github.com/satwinder777"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-all hover:border-accent/40 hover:text-accent hover:shadow-lg hover:shadow-violet-500/15"
          >
            <Code2 className="h-4.5 w-4.5" />
          </motion.a>
        </div>

        <p className="mt-8 text-center text-xs text-muted/70">
          © {new Date().getFullYear()} DropLink · Built by Satwinder Singh
        </p>
      </div>
    </footer>
  );
}
