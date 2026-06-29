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
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FileIcon } from "@/components/ui/FileIcon";
import { useToast } from "@/components/providers/ToastProvider";
import { getOrCreateSessionId } from "@/lib/session";
import { getShareUrl } from "@/lib/utils";
import { uploadToMega, isMegaConfigured } from "@/lib/mega-client";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      if (!isMegaConfigured()) {
        showToast(
          "MEGA not configured. Add credentials to .env.local",
          "error"
        );
        return;
      }

      const sessionId = getOrCreateSessionId();

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
            sessionId,
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
    [onUploadComplete, showToast]
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

  return (
    <section id="upload" className="relative py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.005 }}
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300",
            isDragging
              ? "border-accent bg-accent/5 shadow-2xl shadow-violet-500/20"
              : "border-border hover:border-accent/50 hover:bg-surface/50"
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

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="relative flex flex-col items-center px-6 py-16 sm:py-20">
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-violet-500/30"
            >
              <CloudUpload className="h-10 w-10 text-accent" />
            </motion.div>

            <h2 className="text-xl font-semibold sm:text-2xl">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </h2>
            <p className="mt-2 text-center text-muted">
              or{" "}
              <span className="font-medium text-accent">click to browse</span>{" "}
              — stored securely on MEGA cloud
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-full bg-surface-elevated px-4 py-2 text-xs text-muted">
              <FileUp className="h-3.5 w-3.5" />
              Multiple files supported
            </div>
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
                  className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <FileIcon filename={upload.fileName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{upload.fileName}</p>
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
    </section>
  );
}
