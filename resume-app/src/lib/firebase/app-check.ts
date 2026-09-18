import { getFirebaseServices } from "./config";
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from "firebase/app-check";

let appCheckInstance: AppCheck | null = null;

/**
 * Initializes Firebase App Check in the browser using ReCAPTCHA v3 or custom provider.
 */
export function initAppCheck(siteKey?: string): AppCheck | null {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  const key = siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key) return null;

  try {
    const { app } = getFirebaseServices();
    if (app) {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(key),
        isTokenAutoRefreshEnabled: true,
      });
      return appCheckInstance;
    }
  } catch (err: any) {
    console.warn("App Check initialization notice:", err.message);
  }
  return null;
}
