"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, Menu, X, LogOut, User, Gift } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { hasUsedFreeUpload } from "@/lib/free-upload";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#upload", label: "Upload" },
  { href: "#features", label: "Features" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [freeUsed, setFreeUsed] = useState(false);
  const { user, loading, logOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    setFreeUsed(hasUsedFreeUpload());
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
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border/50 bg-background/60 backdrop-blur-2xl shadow-lg shadow-violet-500/5"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 8 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30"
            >
              <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-lg font-black tracking-tight">
              Drop<span className="gradient-text">Link</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            {!user && !loading && (
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <Gift className="h-3 w-3" />
                {freeUsed ? "Free used" : "1 free upload"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="hidden items-center gap-2 sm:flex">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-1.5 text-xs backdrop-blur-md">
                      <User className="h-3.5 w-3.5 text-accent" />
                      <span className="max-w-[100px] truncate text-muted">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => logOut()}
                      className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted hover:border-red-500/30 hover:text-red-400"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="hidden items-center gap-2 sm:flex">
                    <button
                      onClick={() => openAuth("signin")}
                      className="px-3 py-2 text-sm text-muted hover:text-foreground"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => openAuth("signup")}
                      className="btn-neon rounded-xl px-4 py-2 text-sm font-bold text-white"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </>
            )}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-b border-border bg-background/95 backdrop-blur-xl px-4 py-4 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            {!user && (
              <button
                onClick={() => openAuth("signup")}
                className="btn-neon mt-2 w-full rounded-xl py-2.5 text-sm font-bold text-white"
              >
                Sign Up Free
              </button>
            )}
          </div>
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
