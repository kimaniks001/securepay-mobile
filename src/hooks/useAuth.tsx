import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  getStoredSession,
  loginWithDemoCredentials,
  loginWithStagingCredentials,
  logout as authLogout,
} from '../api/authApi';
import { isMockMode } from '../api/config';
import {
  getAuthToken,
  getUserProfile,
} from '../services/secureStorage';
import type { UserProfile } from '../types/auth';

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const [token, profileJson, session] = await Promise.all([
          getAuthToken(),
          getUserProfile(),
          getStoredSession(),
        ]);
        if (!mounted || !token || !profileJson) {
          return;
        }
        const profile = JSON.parse(profileJson) as UserProfile;
        if (session?.email) {
          profile.email = session.email;
        }
        if (session?.ksNumber) {
          profile.ksNumber = session.ksNumber;
        }
        setUser(profile);
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
    const result = isMockMode()
      ? await loginWithDemoCredentials({ email, pin })
      : await loginWithStagingCredentials({ email, pin });
    setUser(result.user);
  }, []);

  const signOut = useCallback(async () => {
    await authLogout();
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
