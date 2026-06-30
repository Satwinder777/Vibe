"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { copy } from "@/lib/copy";

interface MasterUnlockModalProps {
  open: boolean;
  onClose: () => void;
}

export function MasterUnlockModal({ open, onClose }: MasterUnlockModalProps) {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const { unlockWithToken, isAccessTokenConfigured } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setBusy(true);
    try {
      await unlockWithToken(token.trim());
      showToast(copy.master.unlocked);
      setToken("");
      onClose();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : copy.master.invalid,
        "error"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/25 bg-surface/95 shadow-2xl shadow-amber-500/10 backdrop-blur-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-surface-elevated hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
                  <KeyRound className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{copy.master.title}</h2>
                  <p className="text-sm text-muted">{copy.master.subtitle}</p>
                </div>
              </div>

              {!isAccessTokenConfigured && (
                <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {copy.master.notConfigured}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    {copy.master.tokenLabel}
                  </label>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    autoComplete="off"
                    placeholder={copy.master.tokenPlaceholder}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={busy || !isAccessTokenConfigured}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {copy.master.unlockCta}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
