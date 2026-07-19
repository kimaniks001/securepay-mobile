import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  clearSecureSession,
  getAuthToken,
  getUserProfile,
  saveAuthToken,
  saveUserProfile,
} from '../services/secureStorage';
import type { UserProfile } from '../types';

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: UserProfile = {
  id: 'usr_demo_001',
  name: 'Kimani K.',
  email: 'demo@securepay.app',
  phone: '+254 700 000 000',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const [token, profileJson] = await Promise.all([getAuthToken(), getUserProfile()]);
        if (!mounted || !token || !profileJson) {
          return;
        }
        setUser(JSON.parse(profileJson) as UserProfile);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, pin: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const sessionUser: UserProfile = {
      ...DEMO_USER,
      email: normalizedEmail,
    };

    await Promise.all([
      saveAuthToken(`demo-token-${Date.now()}`),
      saveUserProfile(JSON.stringify(sessionUser)),
    ]);

    setUser(sessionUser);
  }, []);

  const signOut = useCallback(async () => {
    await clearSecureSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
