"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { customAlphabet } from "nanoid";
import {
  CloudUpload,
  CheckCircle2,
  Copy,
  Link2,
  X,
  Lock,
  Sparkles,
  Gift,
  AlertCircle,
} from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FileIcon } from "@/components/ui/FileIcon";
import { AuthModal } from "@/components/auth/AuthModal";
import { ShareQrButton } from "@/components/ui/ShareQrButton";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { getShareUrl } from "@/lib/utils";
import { uploadToMega, isMegaConfigured } from "@/lib/mega-client";
import { saveUserUpload } from "@/lib/user-uploads";
import { hasUsedFreeUpload, markFreeUploadUsed } from "@/lib/free-upload";
import { copy } from "@/lib/copy";
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
  const [freeUsed, setFreeUsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    setFreeUsed(hasUsedFreeUpload());
  }, []);

  const locked = !authLoading && !user && freeUsed;
  const isGuest = !user && !freeUsed;

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = zoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
  };

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      let fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      if (!user && freeUsed) {
        setAuthOpen(true);
        showToast(copy.upload.toastFreeUsed, "error");
        return;
      }

      if (!user && fileArray.length > 1) {
        showToast(copy.upload.toastGuestLimit, "error");
        fileArray = [fileArray[0]];
      }

      if (!isMegaConfigured()) {
        showToast(copy.upload.toastMegaMissing, "error");
        return;
      }

      const ownerId = user?.uid ?? null;

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
            ownerId,
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

          if (user) {
            try {
              await saveUserUpload(user.uid, result);
            } catch (vaultErr) {
              showToast(
                copy.upload.toastVaultFail(
                  vaultErr instanceof Error ? vaultErr.message : "check Firestore rules"
                ),
                "error"
              );
            }
          } else {
            markFreeUploadUsed();
            setFreeUsed(true);
          }

          setUploads((prev) =>
            prev.map((u) =>
              u.fileId === uploadId
                ? { ...u, status: "complete", progress: 100, result }
                : u
            )
          );

          onUploadComplete(result);

          if (!user) {
            showToast(copy.upload.toastGuestDone);
          }
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
    [onUploadComplete, showToast, user, freeUsed]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (locked) {
        setAuthOpen(true);
        return;
      }
      processFiles(e.dataTransfer.files);
    },
    [processFiles, locked]
  );

  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast(copy.upload.toastLinkCopied);
  };

  return (
    <section id="upload" className="relative py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Free tier banner */}
        {!user && !authLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-5 flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-md",
              freeUsed
                ? "border-amber-500/30 bg-amber-500/8"
                : "border-emerald-500/30 bg-emerald-500/8"
            )}
          >
            {freeUsed ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            ) : (
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            )}
            <div>
              <p className="text-sm font-semibold">
                {freeUsed ? copy.upload.bannerUsedTitle : copy.upload.bannerGuestTitle}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {freeUsed
                  ? copy.upload.bannerUsedDesc
                  : copy.upload.bannerGuestDesc}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          ref={zoneRef}
          onMouseMove={handleMouseMove}
          onDragOver={(e) => {
            if (locked) return;
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (locked) {
              setAuthOpen(true);
              return;
            }
            inputRef.current?.click();
          }}
          whileHover={locked ? {} : { scale: 1.01 }}
          whileTap={locked ? {} : { scale: 0.995 }}
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 upload-zone-glow",
            isDragging && "scale-[1.01] border-violet-500/30"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={!!user}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) processFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-fuchsia-600/5" />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(139,92,246,0.15), transparent 50%)",
            }}
          />

          <div className="relative flex flex-col items-center px-6 py-16 sm:py-24">
            {locked ? (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-500/30 bg-amber-500/10"
                >
                  <Lock className="h-12 w-12 text-amber-400" />
                </motion.div>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {copy.upload.lockedTitle}
                </h2>
                <p className="mt-3 max-w-sm text-center text-muted">
                  {copy.upload.lockedDesc}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAuthOpen(true);
                  }}
                  className="btn-neon pointer-events-auto mt-8 flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  {copy.upload.lockedCta}
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  animate={
                    isDragging
                      ? { scale: 1.2, rotate: 8, y: -10 }
                      : { scale: 1, rotate: 0, y: 0 }
                  }
                  transition={{ type: "spring", stiffness: 260 }}
                  className="relative mb-8"
                >
                  <div className="absolute inset-0 scale-150 rounded-full bg-violet-500/20 blur-2xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-500/40 bg-violet-500/15 backdrop-blur-sm">
                    <CloudUpload className="h-12 w-12 text-accent" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  {isDragging
                    ? copy.upload.dragRelease
                    : isGuest
                      ? copy.upload.dragGuest
                      : copy.upload.dragMember}
                </h2>
                <p className="mt-3 text-center text-muted">
                  {copy.upload.dragOr}{" "}
                  <span className="font-semibold text-accent">
                    {copy.upload.dragBrowse}
                  </span>
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted backdrop-blur-sm">
                    {isGuest ? copy.upload.pillOneFile : copy.upload.pillMulti}
                  </span>
                  <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted backdrop-blur-sm">
                    {copy.upload.pillMega}
                  </span>
                  <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted backdrop-blur-sm">
                    {copy.upload.pillInstant}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {uploads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-3"
            >
              {uploads.map((upload) => (
                <motion.div
                  key={upload.fileId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bento-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <FileIcon filename={upload.fileName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{upload.fileName}</p>
                      {upload.status === "uploading" && (
                        <ProgressBar progress={upload.progress} className="mt-2" />
                      )}
                      {upload.status === "error" && (
                        <p className="mt-1 text-sm text-red-400">{upload.error}</p>
                      )}
                      {upload.status === "complete" && upload.result && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                              <Link2 className="h-3 w-3" />
                              {copy.upload.linkReady}
                            </p>
                            <p className="truncate font-mono text-xs text-muted">
                              {upload.result.shareUrl}
                            </p>
                          </div>
                          <ShareQrButton
                            url={upload.result.shareUrl}
                            label={copy.upload.qr}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLink(upload.result!.shareUrl);
                            }}
                            className="flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30"
                          >
                            <Copy className="h-3 w-3" />
                            {copy.upload.copy}
                          </button>
                        </div>
                      )}
                    </div>
                    {(upload.status === "complete" ||
                      upload.status === "error") && (
                      <button
                        onClick={() =>
                          setUploads((p) =>
                            p.filter((u) => u.fileId !== upload.fileId)
                          )
                        }
                        className="shrink-0 rounded-lg p-1 text-muted hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
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
