import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './useAuth';
import {
  getCurrentSession,
  loginUser,
  loginWithGoogle as authLoginWithGoogle,
  checkGoogleRedirectResult,
  processGoogleAuthUser,
  registerUser,
  logoutUser,
  requestPasswordReset,
  switchDemoAccount,
  clearSession,
} from '../services/authService';
import {
  auth,
  isFirebaseConfigured,
  onAuthStateChanged,
} from '../services/firebase';

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getCurrentSession());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Real-time Firebase Authentication listener & Google redirect verification
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured() && auth) {
      // Check redirect result if returning from signInWithRedirect
      checkGoogleRedirectResult()
        .then((redirectSession) => {
          if (redirectSession?.user) {
            setSessionState(redirectSession);
          }
        })
        .catch((err) => {
          console.warn('[AuthProvider] checkGoogleRedirectResult notice:', err);
        });

      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // If we already have a session matching this user, keep it
          const current = getCurrentSession();
          if (current?.user?.id === fbUser.uid || current?.user?.uid === fbUser.uid) {
            return;
          }

          try {
            const userSession = await processGoogleAuthUser(fbUser);
            setSessionState(userSession);
          } catch (err) {
            console.warn('[AuthProvider] onAuthStateChanged user sync notice:', err);
          }
        } else {
          // User signed out in Firebase
          const current = getCurrentSession();
          if (current?.user?.authProvider === 'firebase' || current?.user?.authProvider === 'google') {
            clearSession();
            setSessionState(null);
          }
        }
      });
    }

    // Cross-tab storage synchronization listener
    const handleStorageChange = (e) => {
      if (e.key === 'chem_auth_session_token') {
        setSessionState(getCurrentSession());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const login = async ({ email, password, rememberMe = true }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const newSession = await loginUser({ email, password, rememberMe });
      setSessionState(newSession);
      return { success: true, user: newSession.user };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login gagal.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authLoginWithGoogle();
      if (res?.redirecting) {
        return { success: false, redirecting: true };
      }
      setSessionState(res);
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Masuk dengan Google gagal.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoRole = (targetKey = 'student1') => {
    const newSession = switchDemoAccount(targetKey);
    setSessionState(newSession);
    return newSession.user;
  };

  const register = async ({ fullName, email, password, confirmPassword }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const newSession = await registerUser({ fullName, email, password, confirmPassword });
      setSessionState(newSession);
      return { success: true, user: newSession.user };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registrasi gagal.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setSessionState(null);
  };

  const resetPassword = async (email) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await requestPasswordReset(email);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Permintaan reset gagal.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user: session?.user || null,
    session,
    isAuthenticated: Boolean(session?.user),
    isLoading,
    authError,
    clearError,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    switchDemoRole,
    isFirebaseConfigured: isFirebaseConfigured(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
