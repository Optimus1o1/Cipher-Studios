import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cipher-studios";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const privateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, "\n") : undefined;

let adminApp: App | null = null;

export function getFirebaseAdminApp(): App | null {
  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    return existingApps[0];
  }

  if (clientEmail && privateKey && projectId) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return adminApp;
    } catch (err) {
      console.warn("Firebase Admin cert initialization warning:", err);
    }
  }

  if (projectId) {
    try {
      adminApp = initializeApp({ projectId });
      return adminApp;
    } catch (err) {
      console.warn("Firebase Admin project initialization warning:", err);
    }
  }

  return null;
}

export interface VerifiedSessionUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  role?: string;
  isAdmin?: boolean;
}

/**
 * Verifies Firebase ID Token on server side with Firebase Admin SDK,
 * extracting verified custom claims and security roles.
 */
export async function verifyIdToken(idToken: string): Promise<VerifiedSessionUser | null> {
  const app = getFirebaseAdminApp();

  if (app) {
    try {
      const decoded = await getAuth(app).verifyIdToken(idToken);
      const isAdmin =
        decoded.role === "admin" ||
        decoded.admin === true ||
        decoded.email === "aniket@cipherstudios.dev";

      return {
        uid: decoded.uid,
        email: decoded.email,
        name: (decoded.name as string) || (decoded.email ? decoded.email.split("@")[0] : "Client User"),
        picture: decoded.picture,
        role: isAdmin ? "admin" : "client",
        isAdmin,
      };
    } catch (err) {
      console.warn("Firebase Admin verifyIdToken error:", err);
    }
  }

  // Development fallback for local environments without deployed Service Account credentials
  if (process.env.NODE_ENV !== "production") {
    try {
      const parts = idToken.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        const email = payload.email || "client@cipherstudios.dev";
        const isAdmin = email.includes("admin") || email === "aniket@cipherstudios.dev";
        return {
          uid: payload.user_id || payload.sub || "dev-client-uid",
          email,
          name: payload.name || (email ? email.split("@")[0] : "Client User"),
          role: isAdmin ? "admin" : "client",
          isAdmin,
        };
      }
    } catch (e) {
      // ignore
    }
  }

  return null;
}
