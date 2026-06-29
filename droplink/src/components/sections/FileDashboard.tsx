"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, ExternalLink, FolderOpen, LogIn } from "lucide-react";
import { FileIcon } from "@/components/ui/FileIcon";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  formatFileSize,
  formatDate,
  getFileCategory,
  getShareUrl,
} from "@/lib/utils";
import {
  deleteMegaFile,
  downloadFileBlob,
  getFileById,
  isMegaConfigured,
} from "@/lib/mega-client";
import {
  getUserUploads,
  deleteUserUpload,
} from "@/lib/user-uploads";
import type { UploadResult } from "@/lib/types";

interface FileDashboardProps {
  refreshTrigger: number;
}

export function FileDashboard({ refreshTrigger }: FileDashboardProps) {
  const [files, setFiles] = useState<
    (UploadResult & { shareUrl: string; previewUrl?: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const fetchFiles = useCallback(async () => {
    if (!user || !isMegaConfigured()) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const uploads = await getUserUploads(user.uid);
      const mapped = await Promise.all(
        uploads.map(async (f) => {
          const shareUrl = getShareUrl(f.id);
          let previewUrl: string | undefined;
          if (getFileCategory(f.name) === "image") {
            try {
              const megaFile = await getFileById(f.id);
              if (megaFile) {
                const blob = await downloadFileBlob(megaFile);
                previewUrl = URL.createObjectURL(blob);
              }
            } catch {
              /* preview optional */
            }
          }
          return { ...f, shareUrl, previewUrl };
        })
      );
      setFiles(mapped);
    } catch {
      showToast("Failed to load your uploads", "error");
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    if (authLoading) return;
    fetchFiles();
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFiles, refreshTrigger, authLoading, user]);

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  const deleteFile = async (id: string) => {
    if (!user) return;
    try {
      await deleteMegaFile(id);
      await deleteUserUpload(user.uid, id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      showToast("File deleted");
    } catch {
      showToast("Failed to delete file", "error");
    }
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <section id="history" className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 text-center transition-all hover:shadow-xl hover:shadow-violet-500/10">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15"
            >
              <FolderOpen className="h-7 w-7 text-accent" />
            </motion.div>
            <h2 className="text-xl font-bold">Your Upload History</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Sign in to see all files you&apos;ve uploaded and manage your
              share links in one place.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAuthOpen(true)}
              className="btn-glow mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
            >
              <LogIn className="h-4 w-4" />
              Sign in to view history
            </motion.button>
          </div>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded-lg bg-surface-elevated" />
            <div className="h-24 rounded-2xl bg-surface-elevated" />
            <div className="h-24 rounded-2xl bg-surface-elevated" />
          </div>
        </div>
      </section>
    );
  }

  if (files.length === 0) {
    return (
      <section id="history" className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-violet-500/30">
              <FolderOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your Uploads</h2>
              <p className="text-sm text-muted">No files yet — upload your first!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="history" className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-violet-500/30">
            <FolderOpen className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Your Uploads</h2>
            <p className="text-sm text-muted">
              {files.length} file{files.length !== 1 ? "s" : ""} in your account
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
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group glass-card rounded-2xl p-4"
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
                        <span className="uppercase">
                          {file.extension || "file"}
                        </span>
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
