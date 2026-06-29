import Link from "next/link";
import { Code2, Users, MessageCircle, Link2 } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/satwinder777", icon: Code2, label: "GitHub" },
  { href: "https://linkedin.com", icon: Users, label: "LinkedIn" },
  { href: "https://twitter.com", icon: MessageCircle, label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                <Link2 className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold">
                Drop<span className="gradient-text">Link</span>
              </span>
            </Link>
            <p className="max-w-xs text-center text-sm text-muted md:text-left">
              Secure, instant file sharing powered by MEGA cloud storage.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted transition-all hover:border-accent/40 hover:text-accent hover:shadow-lg hover:shadow-violet-500/10"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} DropLink. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
