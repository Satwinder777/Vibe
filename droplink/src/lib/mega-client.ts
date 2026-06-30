"use client";

import type { SharedFile } from "./types";
import { getFileExtension, inferMimeType } from "./utils";

const SHARE_PREFIX = "dl_";

type MegaStorage = import("megajs").Storage;
type MutableFile = import("megajs").MutableFile;

let storagePromise: Promise<MegaStorage> | null = null;
let uploadFolder: MutableFile | null = null;

function getCredentials() {
  const email = process.env.NEXT_PUBLIC_MEGA_EMAIL;
  const password = process.env.NEXT_PUBLIC_MEGA_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "MEGA not configured. Add NEXT_PUBLIC_MEGA_EMAIL and NEXT_PUBLIC_MEGA_PASSWORD."
    );
  }
  return { email, password };
}

export function isMegaConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_MEGA_EMAIL &&
    process.env.NEXT_PUBLIC_MEGA_PASSWORD
  );
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

export function getMegaStorageName(
  shareId: string,
  originalName: string,
  sessionId?: string | null
): string {
  const sessionTag = sessionId
    ? sessionId.replace(/-/g, "").slice(0, 8)
    : "anon";
  const safeName = sanitizeFileName(originalName);
  return `${SHARE_PREFIX}${shareId}_${sessionTag}__${safeName}`;
}

export function parseMegaStorageName(
  storageName: string
): { shareId: string; sessionTag: string; originalName: string } | null {
  if (!storageName.startsWith(SHARE_PREFIX)) return null;
  const rest = storageName.slice(SHARE_PREFIX.length);
  const nameSep = rest.indexOf("__");
  if (nameSep === -1) return null;

  const idPart = rest.slice(0, nameSep);
  const originalName = rest.slice(nameSep + 2);
  const lastUnderscore = idPart.lastIndexOf("_");
  if (lastUnderscore === -1) return null;

  return {
    shareId: idPart.slice(0, lastUnderscore),
    sessionTag: idPart.slice(lastUnderscore + 1),
    originalName,
  };
}

async function getStorage(): Promise<MegaStorage> {
  if (!storagePromise) {
    const { Storage } = await import("megajs");
    const { email, password } = getCredentials();
    storagePromise = new Storage({ email, password }).ready;
  }
  return storagePromise;
}

async function getUploadFolder(): Promise<MutableFile> {
  const storage = await getStorage();
  await storage.reload();

  const folderName =
    process.env.NEXT_PUBLIC_MEGA_FOLDER_NAME ?? "vibe";

  let folder = storage.root.children?.find(
    (child) => child.directory && child.name === folderName
  );

  if (!folder) {
    folder = await storage.root.mkdir(folderName);
    await storage.reload();
  }

  const nodeId = folder?.nodeId;
  if (!nodeId) {
    throw new Error("MEGA upload folder could not be resolved.");
  }

  const uploadTarget = storage.files[nodeId] ?? folder;
  if (!uploadTarget.directory) {
    throw new Error("MEGA upload target is not a folder.");
  }

  uploadFolder = uploadTarget;
  return uploadTarget;
}

async function refreshFolder(): Promise<MutableFile> {
  const storage = await getStorage();
  await storage.reload();
  uploadFolder = null;
  return getUploadFolder();
}

export function getMegaFileMetadata(
  megaFile: MutableFile,
  shareId: string,
  mimeType?: string
): SharedFile {
  const parsed = parseMegaStorageName(megaFile.name ?? "");
  const name = parsed?.originalName ?? megaFile.name ?? "unknown";

  return {
    id: shareId,
    name,
    size: megaFile.size ?? 0,
    mimeType: mimeType ?? inferMimeType(name),
    extension: getFileExtension(name),
    uploadedAt: megaFile.createdAt
      ? new Date(megaFile.createdAt).toISOString()
      : new Date().toISOString(),
    megaNodeId: megaFile.nodeId ?? null,
    storageType: "mega",
    sessionId: parsed?.sessionTag === "anon" ? null : parsed?.sessionTag ?? null,
  };
}

export async function uploadToMega(
  shareId: string,
  file: File,
  sessionId: string | null,
  onProgress?: (percent: number) => void
): Promise<SharedFile> {
  uploadFolder = null;
  const folder = await getUploadFolder();
  const data = new Uint8Array(await file.arrayBuffer());
  const storageName = getMegaStorageName(shareId, file.name, sessionId);
  const size = file.size > 0 ? file.size : data.byteLength;

  if (size <= 0) {
    throw new Error("Cannot upload an empty file.");
  }

  onProgress?.(20);

  const uploadedFile = await folder
    .upload(
      {
        name: storageName,
        size,
      },
      data
    )
    .complete;

  onProgress?.(100);

  const uploadedAt = new Date().toISOString();

  return {
    id: shareId,
    name: file.name,
    size: file.size,
    mimeType: file.type || inferMimeType(file.name),
    extension: getFileExtension(file.name),
    uploadedAt,
    megaNodeId: uploadedFile.nodeId ?? null,
    storageType: "mega",
    sessionId,
  };
}

export async function findMegaFileByShareId(
  shareId: string
): Promise<MutableFile | null> {
  const folder = await refreshFolder();

  const match = folder.children?.find((child) => {
    if (child.directory || !child.name?.startsWith(SHARE_PREFIX)) return false;
    const parsed = parseMegaStorageName(child.name);
    return parsed?.shareId === shareId;
  });

  return match ?? null;
}

export async function getFileById(id: string): Promise<SharedFile | null> {
  const megaFile = await findMegaFileByShareId(id);
  if (!megaFile) return null;
  const parsed = parseMegaStorageName(megaFile.name ?? "");
  const name = parsed?.originalName ?? megaFile.name ?? "unknown";
  return getMegaFileMetadata(megaFile, id, inferMimeType(name));
}

export async function listMegaFilesBySession(
  sessionId: string
): Promise<SharedFile[]> {
  const folder = await refreshFolder();
  const sessionTag = sessionId.replace(/-/g, "").slice(0, 8);
  const files: SharedFile[] = [];

  for (const child of folder.children ?? []) {
    if (child.directory || !child.name?.startsWith(SHARE_PREFIX)) continue;
    const parsed = parseMegaStorageName(child.name);
    if (!parsed || parsed.sessionTag !== sessionTag) continue;
    files.push(getMegaFileMetadata(child, parsed.shareId));
  }

  return files.sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function downloadFileBlob(file: SharedFile): Promise<Blob> {
  const storage = await getStorage();
  await storage.reload();

  if (!file.megaNodeId) throw new Error("File not found");

  const megaFile = storage.files[file.megaNodeId];
  if (!megaFile) throw new Error("File not found on MEGA");

  const buffer = await megaFile.downloadBuffer({});
  return new Blob([new Uint8Array(buffer)], { type: file.mimeType });
}

export async function deleteMegaFile(shareId: string): Promise<boolean> {
  const file = await findMegaFileByShareId(shareId);
  if (!file?.nodeId) return false;

  const storage = await getStorage();
  await storage.reload();
  const megaFile = storage.files[file.nodeId];
  if (megaFile) await megaFile.delete();
  return true;
}
