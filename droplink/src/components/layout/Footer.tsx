"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Link2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-[2] border-t border-border/40 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600">
              <Link2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">
              Drop<span className="gradient-text">Link</span>
            </span>
          </Link>

          <p className="flex items-center gap-1 text-xs text-muted">
            Built with <Heart className="h-3 w-3 text-pink-400" /> by Satwinder
          </p>

          <motion.a
            href="https://github.com/satwinder777"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted hover:border-accent/40 hover:text-accent"
          >
            <Code2 className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
