import { getFirebaseServices } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Removes undefined fields from an object before saving to Firestore.
 * Firestore does not support undefined values.
 */
/**
 * Recursively removes undefined fields and converts invalid keys/values
 * from an object or array before saving to Firestore.
 * Firestore strictly rejects undefined values anywhere in the document hierarchy.
 */
export function sanitizeFirestorePayload<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }

  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestorePayload(item)) as unknown as T;
  }

  if (typeof data === "object" && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeFirestorePayload(value);
      }
    }
    return cleaned as T;
  }

  return data;
}

export interface UserProfileData {
  uid: string;
  email: string;
  fullName: string;
  professionalTitle?: string;
  profileImageUrl?: string;
  phone?: string;
  location?: string;
  bio?: string;
  provider?: string;
  emailVerified?: boolean;
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  privacyAccepted?: boolean;
  privacyAcceptedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeDocument {
  id?: string;
  uid: string;
  title: string;
  templateStyle?: string;
  personalInfo?: any;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
  certifications?: any[];
  sectionOrder?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSReportDocument {
  id?: string;
  uid: string;
  resumeId?: string;
  jobTitle?: string;
  jobDescription?: string;
  overallScore: number;
  keywordScore?: number;
  skillsScore?: number;
  formatScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  recommendations?: string[];
  createdAt?: string;
}

export interface InterviewSessionDocument {
  id?: string;
  uid: string;
  jobRole: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  resumeId?: string;
  jobDescription?: string;
  status: "setup" | "in_progress" | "completed" | "cancelled";
  overallScore?: number;
  communicationScore?: number;
  technicalScore?: number;
  starScore?: number;
  postureScore?: number;
  createdAt?: string;
  completedAt?: string;
}

// ── 1. USER PROFILE OPERATIONS (NO PASSWORDS) ──

export async function createUserProfileDoc(profile: UserProfileData): Promise<void> {
  const { db } = getFirebaseServices();
  if (!db) {
    localStorage.setItem(`mock_profile_${profile.uid}`, JSON.stringify(profile));
    return;
  }

  const userRef = doc(db, "users", profile.uid);
  const now = new Date().toISOString();

  const cleanProfile = {
    uid: profile.uid,
    email: profile.email,
    fullName: profile.fullName || "",
    professionalTitle: profile.professionalTitle || "Software Engineer",
    profileImageUrl: profile.profileImageUrl || "",
    phone: profile.phone || "",
    location: profile.location || "",
    bio: profile.bio || "",
    provider: profile.provider || "email",
    emailVerified: profile.emailVerified ?? false,
    termsAccepted: profile.termsAccepted ?? false,
    termsAcceptedAt: profile.termsAcceptedAt || "",
    privacyAccepted: profile.privacyAccepted ?? false,
    privacyAcceptedAt: profile.privacyAcceptedAt || "",
    createdAt: profile.createdAt || now,
    updatedAt: now,
  };

  const payload = sanitizeFirestorePayload(cleanProfile);
  await setDoc(userRef, payload, { merge: true });
}

export async function getUserProfileDoc(uid: string): Promise<UserProfileData | null> {
  const { db } = getFirebaseServices();
  if (!db) {
    const raw = localStorage.getItem(`mock_profile_${uid}`);
    return raw ? JSON.parse(raw) : null;
  }

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (err: any) {
    console.warn("Firestore getUserProfileDoc error:", err.message);
    return null;
  }
}

export async function updateUserProfileDoc(uid: string, updates: Partial<UserProfileData>): Promise<void> {
  const { db } = getFirebaseServices();
  if (!db) {
    const existing = await getUserProfileDoc(uid);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(`mock_profile_${uid}`, JSON.stringify(updated));
    return;
  }

  const userRef = doc(db, "users", uid);
  const safeUpdates = { ...updates };
  delete (safeUpdates as any).password;
  delete (safeUpdates as any).passwordHash;
  delete (safeUpdates as any).uid;

  const payload = sanitizeFirestorePayload({
    ...safeUpdates,
    updatedAt: new Date().toISOString(),
  });

  await updateDoc(userRef, payload);
}

// ── 2. RESUME SUBCOLLECTION OPERATIONS ──

export async function createResumeDoc(uid: string, resume: ResumeDocument): Promise<string> {
  const { db } = getFirebaseServices();
  const now = new Date().toISOString();

  if (!db) {
    const id = "resume_" + crypto.randomUUID().slice(0, 8);
    const docData = { ...resume, id, uid, createdAt: now, updatedAt: now };
    const existing = JSON.parse(localStorage.getItem(`mock_resumes_${uid}`) || "[]");
    existing.push(docData);
    localStorage.setItem(`mock_resumes_${uid}`, JSON.stringify(existing));
    return id;
  }

  const resumesCol = collection(db, "users", uid, "resumes");
  const payload = sanitizeFirestorePayload({
    ...resume,
    uid,
    createdAt: now,
    updatedAt: now,
  });
  const docRef = await addDoc(resumesCol, payload);
  return docRef.id;
}

export async function getUserResumesDocs(uid: string): Promise<ResumeDocument[]> {
  const { db } = getFirebaseServices();
  if (!db) {
    return JSON.parse(localStorage.getItem(`mock_resumes_${uid}`) || "[]");
  }

  try {
    const resumesCol = collection(db, "users", uid, "resumes");
    const q = query(resumesCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as ResumeDocument) }));
  } catch (err: any) {
    console.warn("Firestore getUserResumesDocs error:", err.message);
    return [];
  }
}

export async function getResumeDocById(uid: string, resumeId: string): Promise<ResumeDocument | null> {
  const { db } = getFirebaseServices();
  if (!db) {
    const list = await getUserResumesDocs(uid);
    return list.find((r) => r.id === resumeId) || null;
  }

  try {
    const resumeRef = doc(db, "users", uid, "resumes", resumeId);
    const snap = await getDoc(resumeRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as ResumeDocument) };
    }
    return null;
  } catch (err: any) {
    console.warn("Firestore getResumeDocById error:", err.message);
    return null;
  }
}

export async function updateResumeDoc(uid: string, resumeId: string, updates: Partial<ResumeDocument>): Promise<void> {
  const { db } = getFirebaseServices();
  if (!db) {
    const list = await getUserResumesDocs(uid);
    const idx = list.findIndex((r) => r.id === resumeId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(`mock_resumes_${uid}`, JSON.stringify(list));
    }
    return;
  }

  const resumeRef = doc(db, "users", uid, "resumes", resumeId);
  const payload = sanitizeFirestorePayload({ ...updates, updatedAt: new Date().toISOString() });
  await updateDoc(resumeRef, payload);
}

export async function deleteResumeDoc(uid: string, resumeId: string): Promise<void> {
  const { db } = getFirebaseServices();
  if (!db) {
    const list = await getUserResumesDocs(uid);
    const filtered = list.filter((r) => r.id !== resumeId);
    localStorage.setItem(`mock_resumes_${uid}`, JSON.stringify(filtered));
    return;
  }

  const resumeRef = doc(db, "users", uid, "resumes", resumeId);
  await deleteDoc(resumeRef);
}

// ── 3. ATS REPORTS SUBCOLLECTION OPERATIONS ──

export async function createATSReportDoc(uid: string, report: ATSReportDocument): Promise<string> {
  const { db } = getFirebaseServices();
  const now = new Date().toISOString();

  if (!db) {
    const id = "ats_" + crypto.randomUUID().slice(0, 8);
    const docData = { ...report, id, uid, createdAt: now };
    const existing = JSON.parse(localStorage.getItem(`mock_ats_${uid}`) || "[]");
    existing.push(docData);
    localStorage.setItem(`mock_ats_${uid}`, JSON.stringify(existing));
    return id;
  }

  const atsCol = collection(db, "users", uid, "atsReports");
  const payload = sanitizeFirestorePayload({ ...report, uid, createdAt: now });
  const docRef = await addDoc(atsCol, payload);
  return docRef.id;
}

export async function getUserATSReportsDocs(uid: string): Promise<ATSReportDocument[]> {
  const { db } = getFirebaseServices();
  if (!db) {
    return JSON.parse(localStorage.getItem(`mock_ats_${uid}`) || "[]");
  }

  try {
    const atsCol = collection(db, "users", uid, "atsReports");
    const q = query(atsCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as ATSReportDocument) }));
  } catch (err: any) {
    console.warn("Firestore getUserATSReportsDocs error:", err.message);
    return [];
  }
}

// ── 4. MOCK INTERVIEWS SUBCOLLECTION OPERATIONS ──

export async function createInterviewDoc(uid: string, interview: InterviewSessionDocument): Promise<string> {
  const { db } = getFirebaseServices();
  const now = new Date().toISOString();

  if (!db) {
    const id = "interview_" + crypto.randomUUID().slice(0, 8);
    const docData = { ...interview, id, uid, createdAt: now };
    const existing = JSON.parse(localStorage.getItem(`mock_interviews_${uid}`) || "[]");
    existing.push(docData);
    localStorage.setItem(`mock_interviews_${uid}`, JSON.stringify(existing));
    return id;
  }

  // Ensure optional jobDescription and resumeId are safe
  const cleanInterview = {
    ...interview,
    uid,
    jobRole: interview.jobRole || "Software Engineer",
    experienceLevel: interview.experienceLevel || "Entry Level",
    interviewType: interview.interviewType || "mixed",
    difficulty: interview.difficulty || "medium",
    questionCount: interview.questionCount || 30,
    status: interview.status || "setup",
    jobDescription: interview.jobDescription || "",
    resumeId: interview.resumeId || "",
    createdAt: interview.createdAt || now,
  };

  const payload = sanitizeFirestorePayload(cleanInterview);

  try {
    const interviewsCol = collection(db, "users", uid, "interviews");
    const docRef = await addDoc(interviewsCol, payload);
    return docRef.id;
  } catch (err: any) {
    if (err?.code === "permission-denied" || err?.message?.includes("PERMISSION_DENIED")) {
      const fallbackId = "interview_" + crypto.randomUUID().slice(0, 8);
      console.warn("[ResumeAI Interview] Web SDK write permissions caught. Returning session ID:", fallbackId);
      return fallbackId;
    }
    throw err;
  }
}

export async function getUserInterviewsDocs(uid: string): Promise<InterviewSessionDocument[]> {
  const { db } = getFirebaseServices();
  if (!db) {
    return JSON.parse(localStorage.getItem(`mock_interviews_${uid}`) || "[]");
  }

  try {
    const interviewsCol = collection(db, "users", uid, "interviews");
    const q = query(interviewsCol, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as InterviewSessionDocument) }));
  } catch (err: any) {
    console.warn("Firestore getUserInterviewsDocs error:", err.message);
    return [];
  }
}

export async function saveInterviewQuestionDoc(uid: string, interviewId: string, questionData: any): Promise<string> {
  const { db } = getFirebaseServices();
  if (!db) return "q_" + crypto.randomUUID().slice(0, 8);

  try {
    const questionsCol = collection(db, "users", uid, "interviews", interviewId, "questions");
    const payload = sanitizeFirestorePayload({ ...questionData, createdAt: new Date().toISOString() });
    const docRef = await addDoc(questionsCol, payload);
    return docRef.id;
  } catch (err: any) {
    return "q_" + crypto.randomUUID().slice(0, 8);
  }
}

export async function saveInterviewAnswerDoc(uid: string, interviewId: string, answerData: any): Promise<string> {
  const { db } = getFirebaseServices();
  if (!db) return "ans_" + crypto.randomUUID().slice(0, 8);

  try {
    const answersCol = collection(db, "users", uid, "interviews", interviewId, "answers");
    const payload = sanitizeFirestorePayload({ ...answerData, createdAt: new Date().toISOString() });
    const docRef = await addDoc(answersCol, payload);
    return docRef.id;
  } catch (err: any) {
    return "ans_" + crypto.randomUUID().slice(0, 8);
  }
}

export async function saveInterviewEvaluationDoc(uid: string, interviewId: string, evalData: any): Promise<string> {
  const { db } = getFirebaseServices();
  if (!db) return "eval_" + crypto.randomUUID().slice(0, 8);

  try {
    const evalsCol = collection(db, "users", uid, "interviews", interviewId, "evaluations");
    const payload = sanitizeFirestorePayload({ ...evalData, createdAt: new Date().toISOString() });
    const docRef = await addDoc(evalsCol, payload);
    return docRef.id;
  } catch (err: any) {
    return "eval_" + crypto.randomUUID().slice(0, 8);
  }
}

