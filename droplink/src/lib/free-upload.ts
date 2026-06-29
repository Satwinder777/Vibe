const FREE_USED_KEY = "droplink_free_upload_used";

export function hasUsedFreeUpload(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(FREE_USED_KEY) === "true";
}

export function markFreeUploadUsed(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FREE_USED_KEY, "true");
}
