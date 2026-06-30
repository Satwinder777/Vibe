"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Link2, Menu, X, LogOut, User, KeyRound } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { MasterUnlockModal } from "@/components/auth/MasterUnlockModal";
import { useAuth } from "@/components/providers/AuthProvider";
import { hasUsedFreeUpload } from "@/lib/free-upload";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [freeUsed, setFreeUsed] = useState(false);
  const {
    user,
    loading,
    logOut,
    hasFullAccess,
    isMasterUnlocked,
    isAccessTokenConfigured,
  } = useAuth();

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

  const displayName =
    user?.email ?? (isMasterUnlocked ? copy.nav.proAccess : "");

  const navLinks = [
    { href: "#upload", label: copy.nav.upload },
    ...(hasFullAccess ? [{ href: "#history", label: copy.nav.vault }] : []),
    { href: "#how-it-works", label: copy.nav.howItWorks },
    { href: "#features", label: copy.nav.features },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/8 bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight">
              Drop<span className="gradient-text">Link</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {!hasFullAccess && !loading && (
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-muted sm:inline-block">
                {freeUsed ? copy.nav.trialUsed : copy.nav.freeUpload}
              </span>
            )}
            <ThemeToggle />
            {!loading && (
              <>
                {hasFullAccess ? (
                  <div className="hidden items-center gap-2 sm:flex">
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                        isMasterUnlocked
                          ? "border-amber-500/30 bg-amber-500/10"
                          : "border-white/10 bg-white/5"
                      )}
                    >
                      <User
                        className={cn(
                          "h-3.5 w-3.5",
                          isMasterUnlocked ? "text-amber-400" : "text-violet-400"
                        )}
                      />
                      <span className="max-w-[100px] truncate text-muted">
                        {displayName}
                      </span>
                    </div>
                    <button
                      onClick={() => logOut()}
                      className="rounded-lg p-2 text-muted hover:text-foreground"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="hidden items-center gap-2 sm:flex">
                    {isAccessTokenConfigured && (
                      <button
                        onClick={() => setUnlockOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/15"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        {copy.nav.unlock}
                      </button>
                    )}
                    <button
                      onClick={() => openAuth("signin")}
                      className="px-3 py-2 text-sm text-muted hover:text-foreground"
                    >
                      {copy.nav.signIn}
                    </button>
                    <button
                      onClick={() => openAuth("signup")}
                      className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    >
                      {copy.nav.signUp}
                    </button>
                  </div>
                )}
              </>
            )}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-b border-white/8 bg-background/95 px-4 py-4 backdrop-blur-xl md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm text-muted"
              >
                {link.label}
              </a>
            ))}
            {!hasFullAccess && (
              <div className="mt-2 flex flex-col gap-2">
                {isAccessTokenConfigured && (
                  <button
                    onClick={() => {
                      setUnlockOpen(true);
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 py-2.5 text-sm font-medium text-amber-300"
                  >
                    <KeyRound className="h-4 w-4" />
                    {copy.nav.unlock}
                  </button>
                )}
                <button
                  onClick={() => openAuth("signin")}
                  className="w-full rounded-lg border border-white/10 py-2.5 text-sm font-medium text-muted"
                >
                  {copy.nav.signIn}
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="btn-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white"
                >
                  {copy.nav.signUpFree}
                </button>
              </div>
            )}
            {hasFullAccess && (
              <button
                onClick={() => logOut()}
                className="mt-2 w-full rounded-lg border border-white/10 py-2.5 text-sm text-muted"
              >
                Sign out
              </button>
            )}
          </div>
        )}
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode={authMode}
      />
      <MasterUnlockModal
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
      />
    </>
  );
}
