"use client";

import type { SharedFile } from "./types";
import { getFileExtension, inferMimeType } from "./utils";

const SHARE_PREFIX = "dl_";

type MegaStorage = import("megajs").Storage;
type MutableFile = import("megajs").MutableFile;
type MegaBuffer = import("buffer").Buffer;

let storagePromise: Promise<MegaStorage> | null = null;

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
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
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

function resetStorage() {
  storagePromise = null;
}

async function getStorage(): Promise<MegaStorage> {
  if (!storagePromise) {
    const { Storage } = await import("megajs");
    const { email, password } = getCredentials();
    storagePromise = new Storage({ email, password }).ready;
  }
  return storagePromise;
}

async function getReadyStorage(): Promise<MegaStorage> {
  const storage = await getStorage();
  await storage.reload();
  if (storage.status !== "ready") {
    resetStorage();
    throw new Error("MEGA storage is not ready. Try again in a moment.");
  }
  return storage;
}

function toMegaPayload(data: Uint8Array): MegaBuffer {
  // Copy into a plain ArrayBuffer-backed Uint8Array for megajs stream handling.
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy as unknown as MegaBuffer;
}

async function uploadOnFolder(
  folder: MutableFile,
  name: string,
  data: Uint8Array
): Promise<MutableFile> {
  const payload = toMegaPayload(data);
  const size = payload.byteLength;

  if (size <= 0) {
    throw new Error("Cannot upload an empty file.");
  }

  return folder
    .upload(
      {
        name,
        size,
        allowUploadBuffering: true,
      } as Parameters<MutableFile["upload"]>[0] & {
        allowUploadBuffering: boolean;
      },
      payload
    )
    .complete;
}

async function resolveUploadFolder(storage: MegaStorage): Promise<MutableFile> {
  const folderName =
    process.env.NEXT_PUBLIC_MEGA_FOLDER_NAME ?? "droplink";

  let folder = storage.root.children?.find(
    (child) => child.directory && child.name === folderName
  );

  if (!folder) {
    folder = await storage.root.mkdir(folderName);
    await storage.reload();
    const nodeId = folder.nodeId;
    if (nodeId && storage.files[nodeId]) {
      return storage.files[nodeId];
    }
    return folder;
  }

  const nodeId = folder.nodeId;
  if (nodeId && storage.files[nodeId]) {
    return storage.files[nodeId];
  }

  return folder;
}

async function performUpload(
  storage: MegaStorage,
  name: string,
  data: Uint8Array
): Promise<MutableFile> {
  const folder = await resolveUploadFolder(storage);

  try {
    return await uploadOnFolder(folder, name, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isArgsError = message.includes("EARGS") || message.includes("(-2)");

    if (!isArgsError) {
      throw error;
    }

    // Legacy/corrupt folder targets can trigger EARGS — retry on account root.
    return uploadOnFolder(storage.root, name, data);
  }
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
  const storage = await getReadyStorage();
  const data = new Uint8Array(await file.arrayBuffer());
  const storageName = getMegaStorageName(shareId, file.name, sessionId);

  onProgress?.(20);

  let uploadedFile: MutableFile;
  try {
    uploadedFile = await performUpload(storage, storageName, data);
  } catch (error) {
    resetStorage();
    throw error;
  }

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
  const storage = await getReadyStorage();

  return (
    storage.find((child) => {
      if (child.directory || !child.name?.startsWith(SHARE_PREFIX)) return false;
      const parsed = parseMegaStorageName(child.name);
      return parsed?.shareId === shareId;
    }, true) ?? null
  );
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
  const storage = await getReadyStorage();
  const sessionTag = sessionId.replace(/-/g, "").slice(0, 8);
  const files: SharedFile[] = [];

  for (const child of storage.filter(
    (node) => !node.directory && !!node.name?.startsWith(SHARE_PREFIX),
    true
  )) {
    const parsed = parseMegaStorageName(child.name ?? "");
    if (!parsed || parsed.sessionTag !== sessionTag) continue;
    files.push(getMegaFileMetadata(child, parsed.shareId));
  }

  return files.sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function downloadFileBlob(file: SharedFile): Promise<Blob> {
  const storage = await getReadyStorage();

  if (!file.megaNodeId) throw new Error("File not found");

  const megaFile = storage.files[file.megaNodeId];
  if (!megaFile) throw new Error("File not found on MEGA");

  const buffer = await megaFile.downloadBuffer({});
  return new Blob([new Uint8Array(buffer)], { type: file.mimeType });
}

export async function deleteMegaFile(shareId: string): Promise<boolean> {
  const file = await findMegaFileByShareId(shareId);
  if (!file?.nodeId) return false;

  const storage = await getReadyStorage();
  const megaFile = storage.files[file.nodeId];
  if (megaFile) await megaFile.delete();
  return true;
}
