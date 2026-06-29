"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  ArrowLeft,
  Calendar,
  HardDrive,
  FileType,
  Link2,
  Loader2,
} from "lucide-react";
import { FileIcon } from "@/components/ui/FileIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useToast } from "@/components/providers/ToastProvider";
import { formatFileSize, formatDate, getFileCategory } from "@/lib/utils";
import { getFileById, downloadFileBlob } from "@/lib/mega-client";
import type { SharedFile } from "@/lib/types";
import { getShareUrl } from "@/lib/utils";

function ShareContent() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("id");
  const [file, setFile] = useState<SharedFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!fileId) {
      setError("No file ID provided.");
      setLoading(false);
      return;
    }

    getFileById(fileId)
      .then(async (data) => {
        if (!data) throw new Error("not found");
        setFile(data);
        if (getFileCategory(data.name) === "image") {
          const blob = await downloadFileBlob(data);
          setPreviewUrl(URL.createObjectURL(blob));
        }
      })
      .catch(() =>
        setError("This file doesn't exist or has been removed.")
      )
      .finally(() => setLoading(false));

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  const shareUrl = file ? getShareUrl(file.id) : "";

  const copyLink = async () => {
    if (!file) return;
    await navigator.clipboard.writeText(shareUrl);
    showToast("Link copied!");
  };

  const handleDownload = async () => {
    if (!file) return;
    setDownloading(true);
    try {
      const blob = await downloadFileBlob(file);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Download started!");
    } catch {
      showToast("Download failed", "error");
    } finally {
      setDownloading(false);
    }
  };

  const isImage = file && getFileCategory(file.name) === "image";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href={`${basePath}/`}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to DropLink
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="mt-4 text-muted">Loading file...</p>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-surface/50 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <Link2 className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold">File Not Found</h1>
            <p className="mt-2 text-muted">{error}</p>
            <Link
              href={`${basePath}/`}
              className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Upload a new file
            </Link>
          </motion.div>
        )}

        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-hidden rounded-3xl border border-border bg-surface/60 shadow-2xl shadow-violet-500/5 backdrop-blur-sm">
              {isImage && previewUrl && (
                <div className="relative aspect-video w-full overflow-hidden bg-surface-elevated">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  {!isImage && <FileIcon filename={file.name} size="lg" />}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold break-all sm:text-2xl">
                      {file.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted">Shared via DropLink</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-surface-elevated p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <HardDrive className="h-3.5 w-3.5" />
                      Size
                    </div>
                    <p className="mt-1 text-sm font-semibold">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-elevated p-3">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <FileType className="h-3.5 w-3.5" />
                      Type
                    </div>
                    <p className="mt-1 text-sm font-semibold uppercase">
                      {file.extension || "file"}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl bg-surface-elevated p-3 sm:col-span-1">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      Uploaded
                    </div>
                    <p className="mt-1 text-sm font-semibold">
                      {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:brightness-110 disabled:opacity-60"
                  >
                    {downloading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download File
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyLink}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </motion.button>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-muted">
              Powered by{" "}
              <Link href={`${basePath}/`} className="text-accent hover:underline">
                DropLink
              </Link>{" "}
              · Secure file sharing
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
