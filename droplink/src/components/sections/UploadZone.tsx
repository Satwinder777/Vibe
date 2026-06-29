"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customAlphabet } from "nanoid";
import {
  CloudUpload,
  FileUp,
  CheckCircle2,
  Copy,
  Link2,
  X,
  Lock,
  Sparkles,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FileIcon } from "@/components/ui/FileIcon";
import { AuthModal } from "@/components/auth/AuthModal";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { getShareUrl } from "@/lib/utils";
import { uploadToMega, isMegaConfigured } from "@/lib/mega-client";
import { saveUserUpload } from "@/lib/user-uploads";
import type { UploadProgress, UploadResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const generateId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  8
);

interface UploadZoneProps {
  onUploadComplete: (result: UploadResult) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      if (!user) {
        setAuthOpen(true);
        showToast("Sign up or sign in to upload files", "error");
        return;
      }

      if (!isMegaConfigured()) {
        showToast(
          "MEGA not configured. Add credentials to .env.local",
          "error"
        );
        return;
      }

      const userId = user.uid;

      const newUploads: UploadProgress[] = fileArray.map((file) => ({
        fileId: crypto.randomUUID(),
        fileName: file.name,
        progress: 0,
        status: "pending" as const,
      }));

      setUploads((prev) => [...newUploads, ...prev]);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const uploadId = newUploads[i].fileId;
        const shareId = generateId();

        setUploads((prev) =>
          prev.map((u) =>
            u.fileId === uploadId ? { ...u, status: "uploading" } : u
          )
        );

        try {
          const shared = await uploadToMega(
            shareId,
            file,
            userId,
            (percent) => {
              setUploads((prev) =>
                prev.map((u) =>
                  u.fileId === uploadId ? { ...u, progress: percent } : u
                )
              );
            }
          );

          const result: UploadResult = {
            id: shared.id,
            name: shared.name,
            size: shared.size,
            mimeType: shared.mimeType,
            extension: shared.extension,
            uploadedAt: shared.uploadedAt,
            shareUrl: getShareUrl(shared.id),
          };

          await saveUserUpload(userId, result);

          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === uploadId
                ? { ...u, status: "complete", progress: 100, result }
                : u
            )
          );

          onUploadComplete(result);
        } catch (error) {
          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === uploadId
                ? {
                    ...u,
                    status: "error",
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : u
            )
          );
          showToast(`Failed to upload ${file.name}`, "error");
        }
      }
    },
    [onUploadComplete, showToast, user]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast("Link copied to clipboard!");
  };

  const removeUpload = (fileId: string) => {
    setUploads((prev) => prev.filter((u) => u.fileId !== fileId));
  };

  const locked = !authLoading && !user;

  return (
    <section id="upload" className="relative py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          onDragOver={(e) => {
            if (locked) return;
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => {
            if (locked) {
              setAuthOpen(true);
              return;
            }
            inputRef.current?.click();
          }}
          whileHover={locked ? { scale: 1.01 } : { scale: 1.02, y: -4 }}
          whileTap={locked ? {} : { scale: 0.99 }}
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 glass-card glow-ring shimmer-border",
            locked
              ? "border-violet-500/20"
              : isDragging
                ? "border-accent bg-accent/5 shadow-2xl shadow-violet-500/25"
                : "border-border hover:border-accent/40"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) processFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-indigo-500/8 transition-opacity group-hover:from-violet-500/15 group-hover:to-indigo-500/12" />
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity group-hover:opacity-100"
            animate={{ opacity: isDragging ? 0.6 : 0 }}
            style={{
              background:
                "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,58,237,0.15), transparent 40%)",
            }}
          />

          <div className="relative flex flex-col items-center px-6 py-16 sm:py-20">
            {locked ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-violet-500/30"
                >
                  <Lock className="h-10 w-10 text-accent" />
                </motion.div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Sign in to upload
                </h2>
                <p className="mt-2 max-w-sm text-center text-muted">
                  Create a free account to upload files and keep track of your
                  share links
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAuthOpen(true);
                  }}
                  className="btn-glow pointer-events-auto mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  animate={
                    isDragging
                      ? { scale: 1.15, y: -8, rotate: 5 }
                      : { scale: 1, y: 0, rotate: 0 }
                  }
                  whileHover={{ scale: 1.1, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-indigo-500/25 ring-1 ring-violet-500/40 shadow-lg shadow-violet-500/20"
                >
                  <motion.div
                    animate={isDragging ? { y: [0, -4, 0] } : {}}
                    transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                  >
                    <CloudUpload className="h-10 w-10 text-accent" />
                  </motion.div>
                </motion.div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {isDragging ? "Drop files here" : "Drag & drop files here"}
                </h2>
                <p className="mt-2 text-center text-muted">
                  or{" "}
                  <span className="font-semibold text-accent">
                    click to browse
                  </span>{" "}
                  — stored securely on MEGA
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface-elevated/80 px-4 py-2 text-xs text-muted backdrop-blur-sm transition-colors hover:border-accent/30 hover:text-foreground"
                >
                  <FileUp className="h-3.5 w-3.5" />
                  Multiple files · Instant share links
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {uploads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 space-y-3"
            >
              {uploads.map((upload) => (
                <motion.div
                  key={upload.fileId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <FileIcon filename={upload.fileName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {upload.fileName}
                          </p>
                          {upload.status === "uploading" && (
                            <ProgressBar
                              progress={upload.progress}
                              className="mt-2"
                            />
                          )}
                          {upload.status === "error" && (
                            <p className="mt-1 text-sm text-red-400">
                              {upload.error}
                            </p>
                          )}
                          {upload.status === "complete" && upload.result && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-3"
                            >
                              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 ring-1 ring-emerald-500/20">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                <div className="min-w-0 flex-1">
                                  <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                    <Link2 className="h-3 w-3" />
                                    Link ready
                                  </p>
                                  <p className="truncate font-mono text-xs text-muted">
                                    {upload.result.shareUrl}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyLink(upload.result!.shareUrl);
                                  }}
                                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
                                >
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        {(upload.status === "complete" ||
                          upload.status === "error") && (
                          <button
                            onClick={() => removeUpload(upload.fileId)}
                            className="shrink-0 rounded-lg p-1 text-muted hover:bg-surface-elevated hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
