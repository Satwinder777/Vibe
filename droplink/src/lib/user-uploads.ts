import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "./firebase";
import type { UploadResult } from "./types";

export async function saveUserUpload(
  userId: string,
  upload: UploadResult
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb();
  await addDoc(collection(db, "uploads"), {
    userId,
    id: upload.id,
    name: upload.name,
    size: upload.size,
    mimeType: upload.mimeType,
    extension: upload.extension,
    uploadedAt: upload.uploadedAt,
    createdAt: serverTimestamp(),
  });
}

export async function getUserUploads(userId: string): Promise<UploadResult[]> {
  if (!isFirebaseConfigured()) return [];
  const db = getFirebaseDb();
  const q = query(collection(db, "uploads"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: data.id as string,
        name: data.name as string,
        size: data.size as number,
        mimeType: data.mimeType as string,
        extension: data.extension as string,
        uploadedAt: data.uploadedAt as string,
        shareUrl: "",
      };
    })
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
}

export async function deleteUserUpload(
  userId: string,
  shareId: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getFirebaseDb();
  const q = query(
    collection(db, "uploads"),
    where("userId", "==", userId),
    where("id", "==", shareId)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "uploads", d.id))));
}
