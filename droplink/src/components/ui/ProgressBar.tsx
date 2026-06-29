"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  progress,
  className,
  showLabel = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2 overflow-hidden rounded-full bg-surface-elevated">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-white/20"
          animate={{ width: `${clamped}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-right text-xs font-medium text-muted">
          {Math.round(clamped)}%
        </p>
      )}
    </div>
  );
}
