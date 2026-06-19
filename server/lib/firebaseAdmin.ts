import admin from 'firebase-admin';

// Lazy initialization of Firebase Admin
let db: admin.firestore.Firestore | null = null;
let auth: admin.auth.Auth | null = null;

export function getFirestore(): admin.firestore.Firestore {
  if (!db) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'speedy-dryad-0rtgb'
      });
    }
    db = admin.firestore();
  }
  return db;
}

export function getAuth(): admin.auth.Auth {
  if (!auth) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'speedy-dryad-0rtgb'
      });
    }
    auth = admin.auth();
  }
  return auth;
}
