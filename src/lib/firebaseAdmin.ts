import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function getFirebaseAdmin(): { app: App | null; firestore: Firestore | null } {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    const app = existingApps[0];
    return {
      app,
      firestore: getFirestore(app),
    };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    try {
      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return {
        app,
        firestore: getFirestore(app),
      };
    } catch (error) {
      console.warn('Firebase Admin cert initialization failed:', error);
    }
  }

  if (projectId) {
    try {
      const app = initializeApp({ projectId });
      return {
        app,
        firestore: getFirestore(app),
      };
    } catch (error) {
      console.warn('Firebase Admin projectId initialization failed:', error);
    }
  }

  return {
    app: null,
    firestore: null,
  };
}

export const { app: firebaseAdminApp, firestore: adminDb } = getFirebaseAdmin();
