export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  clearanceLevel: number;
  avatarUrl?: string;
  loginTimestamp: string;
}

const AUTH_STORAGE_KEY = 'verishield_executive_user_session_v2';

export const EXECUTIVE_PROFILES: UserProfile[] = [
  {
    id: 'usr-exec-01',
    name: 'Krishna Dubey',
    email: 'krishna.dubey@verishield.ai',
    role: 'Chief Security Officer',
    clearanceLevel: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    loginTimestamp: new Date().toISOString()
  },
  {
    id: 'usr-exec-02',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@forensics.org',
    role: 'Lead Deepfake Forensics Director',
    clearanceLevel: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    loginTimestamp: new Date().toISOString()
  }
];

export const getCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (err) {
    console.error('Failed to load session:', err);
    return null;
  }
};

export const loginLocalUser = (profile: UserProfile): UserProfile => {
  const sessionUser = {
    ...profile,
    loginTimestamp: new Date().toISOString()
  };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
  } catch (err) {
    console.error('Failed to persist session:', err);
  }
  return sessionUser;
};

export const logoutLocalUser = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
};
