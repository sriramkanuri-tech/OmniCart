export interface UserTrack {
  email: string;
  name: string;
  photo: string;
  loginCount: number;
  lastLogin: Date;
  createdAt: Date;
}

class UserStore {
  private users: Map<string, UserTrack> = new Map();

  trackLogin(email: string, name: string, photo: string) {
    if (!email) return;
    const existing = this.users.get(email);
    const now = new Date();
    if (existing) {
      existing.loginCount += 1;
      existing.lastLogin = now;
      existing.name = name || existing.name;
      existing.photo = photo || existing.photo;
      this.users.set(email, existing);
    } else {
      const newUser: UserTrack = {
        email,
        name: name || 'Aarav Sharma',
        photo: photo || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
        loginCount: 1,
        lastLogin: now,
        createdAt: now,
      };
      this.users.set(email, newUser);
    }
    return this.users.get(email);
  }

  getUsers(): UserTrack[] {
    return Array.from(this.users.values());
  }

  getUser(email: string): UserTrack | undefined {
    return this.users.get(email);
  }
}

export const userStore = new UserStore();
