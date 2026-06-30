import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "archive"
  | "code"
  | "other";

const EXT_MAP: Record<string, FileCategory> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  ico: "image",
  mp4: "video",
  webm: "video",
  mov: "video",
  avi: "video",
  mkv: "video",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
  pdf: "pdf",
  doc: "document",
  docx: "document",
  txt: "document",
  rtf: "document",
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  csv: "spreadsheet",
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
  js: "code",
  ts: "code",
  jsx: "code",
  tsx: "code",
  py: "code",
  html: "code",
  css: "code",
  json: "code",
};

export function getFileCategory(filename: string): FileCategory {
  const ext = getFileExtension(filename);
  return EXT_MAP[ext] ?? "other";
}

export function getShareUrl(id: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    return `${origin}${basePath}/share/?id=${id}`;
  }
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    `https://satwinder777.github.io/Vibe${basePath}`;
  return `${base}/share/?id=${id}`;
}

export function inferMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    txt: "text/plain",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    zip: "application/zip",
    json: "application/json",
  };
  return map[ext] ?? "application/octet-stream";
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
