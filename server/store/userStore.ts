import { getFirestore } from '../lib/firebaseAdmin';

export interface UserTrack {
  email: string;
  name: string;
  photo: string;
  loginCount: number;
  lastLogin: any; // Firestore timestamp or string
  createdAt: any;
}

class UserStore {
  private collectionName = 'users';

  async trackLogin(email: string, name: string, photo: string) {
    if (!email) return;
    const db = getFirestore();
    const userRef = db.collection(this.collectionName).doc(email);
    const doc = await userRef.get();
    
    const now = new Date();
    if (doc.exists) {
      const data = doc.data() as UserTrack;
      const updatedUser = {
        ...data,
        loginCount: (data.loginCount || 0) + 1,
        lastLogin: now,
        name: name || data.name,
        photo: photo || data.photo,
      };
      await userRef.update(updatedUser);
      return updatedUser;
    } else {
      const newUser: UserTrack = {
        email,
        name: name || 'Aarav Sharma',
        photo: photo || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
        loginCount: 1,
        lastLogin: now,
        createdAt: now,
      };
      await userRef.set(newUser);
      return newUser;
    }
  }

  async getUsers(): Promise<UserTrack[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => doc.data() as UserTrack);
  }

  async getUser(email: string): Promise<UserTrack | undefined> {
    const db = getFirestore();
    const doc = await db.collection(this.collectionName).doc(email).get();
    return doc.exists ? (doc.data() as UserTrack) : undefined;
  }
}

export const userStore = new UserStore();
