"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, Menu, X, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

const navLinks = [{ href: "#how-it-works", label: "How it works" }];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const { user, loading, logOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border/60 bg-background/70 backdrop-blur-2xl shadow-lg shadow-violet-500/8"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30"
            >
              <Link2 className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-lg font-bold tracking-tight transition-colors group-hover:text-accent">
              Drop<span className="gradient-text">Link</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {!loading && (
              <>
                {user ? (
                  <div className="hidden items-center gap-2 sm:flex">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-1.5 text-sm transition-shadow hover:shadow-md hover:shadow-violet-500/10"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-indigo-500/30">
                        <User className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <span className="max-w-[120px] truncate text-xs text-muted">
                        {user.email}
                      </span>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => logOut()}
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted transition-all hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </motion.button>
                  </div>
                ) : (
                  <div className="hidden items-center gap-2 sm:flex">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuth("signin")}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                      Sign in
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openAuth("signup")}
                      className="btn-glow rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
                    >
                      Get Started
                    </motion.button>
                  </div>
                )}
              </>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:border-accent/40 hover:bg-violet-500/5 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </nav>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-violet-500/10 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              {user ? (
                <>
                  <p className="px-3 py-2 text-xs text-muted">{user.email}</p>
                  <button
                    onClick={() => {
                      logOut();
                      setMobileOpen(false);
                    }}
                    className="mt-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-red-500/30 hover:text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("signin")}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => openAuth("signup")}
                    className="btn-glow mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}
