const MASTER_KEY = "droplink_master_unlock";

export function isAccessTokenConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_ACCESS_TOKEN;
}

export function isMasterUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MASTER_KEY) === "true";
}

export function setMasterUnlocked(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MASTER_KEY, "true");
}

export function clearMasterUnlock(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MASTER_KEY);
}

export function verifyAccessToken(token: string): boolean {
  const expected = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  if (!expected) return false;
  return token.trim() === expected;
}
