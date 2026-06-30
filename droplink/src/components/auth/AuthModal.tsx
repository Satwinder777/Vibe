"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { copy } from "@/lib/copy";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export function AuthModal({
  open,
  onClose,
  defaultMode = "signup",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp, signIn, isConfigured } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setError(null);
    }
  }, [open, defaultMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      setError(copy.auth.passwordMin);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") {
        await signUp(email, password);
        showToast(copy.auth.accountCreated);
      } else {
        await signIn(email, password);
        showToast(copy.auth.welcomeBack);
      }
      onClose();
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Authentication failed"
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
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-violet-500/20 bg-surface/95 shadow-2xl shadow-violet-500/10 backdrop-blur-xl"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-surface-elevated hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {mode === "signup" ? copy.auth.createTitle : copy.auth.signInTitle}
                  </h2>
                  <p className="text-sm text-muted">
                    {mode === "signup"
                      ? copy.auth.createDesc
                      : copy.auth.signInDesc}
                  </p>
                </div>
              </div>

              {!isConfigured && (
                <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  {copy.auth.notConfigured}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    {copy.auth.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                      placeholder={copy.auth.emailPlaceholder}
                      className="w-full rounded-xl border border-border bg-background/50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    {copy.auth.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background/50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={busy || !isConfigured}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "signup" ? copy.auth.createCta : copy.auth.signInCta}
                </motion.button>
              </form>

              <p className="mt-5 text-center text-sm text-muted">
                {mode === "signup" ? copy.auth.hasAccount : copy.auth.newHere}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "signup" ? "signin" : "signup")
                  }
                  className="font-medium text-accent hover:underline"
                >
                  {mode === "signup" ? copy.auth.switchSignIn : copy.auth.switchSignUp}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
