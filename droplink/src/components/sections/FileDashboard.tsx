"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, ExternalLink, FolderOpen } from "lucide-react";
import { ShareQrButton } from "@/components/ui/ShareQrButton";
import { FileIcon } from "@/components/ui/FileIcon";
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
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { getUserUploads, deleteUserUpload } from "@/lib/user-uploads";
import { copy } from "@/lib/copy";
import type { UploadResult } from "@/lib/types";

interface FileDashboardProps {
  refreshTrigger: number;
}

export function FileDashboard({ refreshTrigger }: FileDashboardProps) {
  const [files, setFiles] = useState<
    (UploadResult & { shareUrl: string; previewUrl?: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const previewUrlsRef = useRef<string[]>([]);
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
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
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
              /* optional */
            }
          }
          return { ...f, shareUrl, previewUrl };
        })
      );
      previewUrlsRef.current = mapped
        .map((f) => f.previewUrl)
        .filter((url): url is string => !!url);
      setFiles(mapped);
    } catch (err) {
      showToast(getAuthErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchFiles();
  }, [fetchFiles, refreshTrigger, authLoading, user]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast(copy.vault.toastCopied);
  };

  const deleteFile = async (id: string) => {
    if (!user) return;
    try {
      await deleteMegaFile(id);
      await deleteUserUpload(user.uid, id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      showToast(copy.vault.toastDeleted);
    } catch {
      showToast(copy.vault.toastDeleteFail, "error");
    }
  };

  if (authLoading || !user) return null;

  return (
    <section id="history" className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15">
            <FolderOpen className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{copy.vault.title}</h2>
            <p className="text-sm text-muted">
              {loading
                ? copy.vault.loading
                : files.length === 0
                  ? copy.vault.empty
                  : copy.vault.count(files.length)}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-surface-elevated"
              />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="bento-card p-10 text-center">
            <p className="text-muted">{copy.vault.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.04 }}
                  className="bento-card p-4"
                >
                  <div className="flex items-center gap-4">
                    {file.previewUrl ? (
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
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
                      <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.extension?.toUpperCase() || "FILE"}</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-accent/70">
                        {file.shareUrl}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <ShareQrButton url={file.shareUrl} />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyLink(file.shareUrl)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted hover:border-accent/40 hover:text-accent"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                      <a
                        href={`${basePath}/share/?id=${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted hover:border-accent/40 hover:text-accent"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteFile(file.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted hover:border-red-500/40 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
