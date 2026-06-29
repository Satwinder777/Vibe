export interface SharedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  extension: string;
  uploadedAt: string;
  megaNodeId: string | null;
  storageType: "mega" | "local";
  sessionId: string | null;
}

export interface UploadResult {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  extension: string;
  uploadedAt: string;
  shareUrl: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
  result?: UploadResult;
}
