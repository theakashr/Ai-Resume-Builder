import { getFirebaseServices } from "./config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads a profile image file for a user under users/{uid}/profile/*
 */
export async function uploadProfileImageFile(uid: string, file: File): Promise<string> {
  const { storage } = getFirebaseServices();
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const storageRef = ref(storage, `users/${uid}/profile/${fileName}`);
  
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

/**
 * Uploads a generated PDF file under users/{uid}/pdfs/*
 */
export async function uploadResumePdfFile(uid: string, pdfBlob: Blob, filename: string): Promise<string> {
  const { storage } = getFirebaseServices();
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const storageRef = ref(storage, `users/${uid}/pdfs/${filename}`);
  await uploadBytes(storageRef, pdfBlob, { contentType: "application/pdf" });
  return await getDownloadURL(storageRef);
}
