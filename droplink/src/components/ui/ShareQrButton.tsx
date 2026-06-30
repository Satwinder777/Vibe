"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { QrCode, X, Download, Copy } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface ShareQrButtonProps {
  url: string;
  className?: string;
  label?: string;
}

export function ShareQrButton({ url, className, label }: ShareQrButtonProps) {
  const [open, setOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    showToast(copy.qr.toastCopied);
  };

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const padding = 32;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);
      const a = document.createElement("a");
      a.download = "droplink-qr.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast(copy.qr.toastDownloaded);
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title={copy.qr.show}
        aria-label={copy.qr.show}
        className={cn(
          "flex items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent",
          label ? "gap-1.5 px-2.5 py-1.5 text-xs font-medium" : "h-9 w-9",
          className
        )}
      >
        <QrCode className={label ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-violet-500/20 bg-surface/95 p-6 shadow-2xl shadow-violet-500/10 backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-surface-elevated hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-5 text-center">
                <h3 className="text-lg font-bold">{copy.qr.title}</h3>
                <p className="mt-1 text-sm text-muted">{copy.qr.subtitle}</p>
              </div>

              <div
                ref={qrRef}
                className="mx-auto w-fit rounded-2xl border border-white/10 bg-white p-4"
              >
                <QRCode
                  value={url}
                  size={200}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0f0f12"
                />
              </div>

              <p className="mt-4 truncate text-center font-mono text-xs text-muted">
                {url}
              </p>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <Copy className="h-4 w-4" />
                  {copy.upload.copy}
                </button>
                <button
                  type="button"
                  onClick={downloadQr}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white"
                >
                  <Download className="h-4 w-4" />
                  {copy.qr.download}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ShareQrCardProps {
  url: string;
  className?: string;
}

export function ShareQrCard({ url, className }: ShareQrCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const padding = 32;
      canvas.width = img.width + padding * 2;
      canvas.height = img.height + padding * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);
      const a = document.createElement("a");
      a.download = "droplink-qr.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast(copy.qr.toastDownloaded);
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
        {copy.qr.scanTitle}
      </p>
      <p className="mt-1 text-sm text-muted">{copy.qr.scanSubtitle}</p>
      <div
        ref={qrRef}
        className="mx-auto mt-4 w-fit rounded-2xl border border-white/10 bg-white p-3"
      >
        <QRCode
          value={url}
          size={160}
          level="M"
          bgColor="#ffffff"
          fgColor="#0f0f12"
        />
      </div>
      <button
        type="button"
        onClick={downloadQr}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
      >
        <Download className="h-4 w-4" />
        {copy.qr.download}
      </button>
    </div>
  );
}
