"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, ExternalLink, FolderOpen } from "lucide-react";
import { FileIcon } from "@/components/ui/FileIcon";
import { useToast } from "@/components/providers/ToastProvider";
import { getOrCreateSessionId } from "@/lib/session";
import { formatFileSize, formatDate, getFileCategory, getShareUrl } from "@/lib/utils";
import {
  listMegaFilesBySession,
  deleteMegaFile,
  downloadFileBlob,
  isMegaConfigured,
} from "@/lib/mega-client";
import type { UploadResult } from "@/lib/types";

interface FileDashboardProps {
  refreshTrigger: number;
}

export function FileDashboard({ refreshTrigger }: FileDashboardProps) {
  const [files, setFiles] = useState<
    (UploadResult & { shareUrl: string; previewUrl?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const fetchFiles = useCallback(async () => {
    if (!isMegaConfigured()) {
      setLoading(false);
      return;
    }

    const sessionId = getOrCreateSessionId();
    try {
      const megaFiles = await listMegaFilesBySession(sessionId);
      const mapped = await Promise.all(
        megaFiles.map(async (f) => {
          let previewUrl: string | undefined;
          if (getFileCategory(f.name) === "image") {
            try {
              const blob = await downloadFileBlob(f);
              previewUrl = URL.createObjectURL(blob);
            } catch {
              /* preview optional */
            }
          }
          return {
            id: f.id,
            name: f.name,
            size: f.size,
            mimeType: f.mimeType,
            extension: f.extension,
            uploadedAt: f.uploadedAt,
            shareUrl: getShareUrl(f.id),
            previewUrl,
          };
        })
      );
      setFiles(mapped);
    } catch {
      showToast("Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFiles();
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFiles, refreshTrigger]);

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  const deleteFile = async (id: string) => {
    try {
      const ok = await deleteMegaFile(id);
      if (ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        showToast("File deleted");
      } else {
        showToast("Failed to delete file", "error");
      }
    } catch {
      showToast("Failed to delete file", "error");
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-lg bg-surface-elevated" />
            <div className="h-24 rounded-2xl bg-surface-elevated" />
          </div>
        </div>
      </section>
    );
  }

  if (files.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <FolderOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Session History</h2>
            <p className="text-sm text-muted">
              {files.length} file{files.length !== 1 ? "s" : ""} uploaded this
              session
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {files.map((file, index) => {
              const isImage = !!file.previewUrl;
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur-sm transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-violet-500/5"
                >
                  <div className="flex items-center gap-4">
                    {isImage && file.previewUrl ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <FileIcon filename={file.name} size="lg" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{file.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                        <span>{formatFileSize(file.size)}</span>
                        <span>·</span>
                        <span className="uppercase">{file.extension || "file"}</span>
                        <span>·</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                      <p className="mt-1.5 truncate font-mono text-xs text-accent/80">
                        {file.shareUrl}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyLink(file.shareUrl)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
                        title="Copy link"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                      <a
                        href={`${basePath}/share/?id=${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
                        title="Open link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteFile(file.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
