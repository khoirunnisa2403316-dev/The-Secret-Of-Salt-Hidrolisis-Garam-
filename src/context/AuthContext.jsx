import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './useAuth';
import {
  getCurrentSession,
  loginUser,
  registerUser,
  logoutUser,
  requestPasswordReset,
  setSession,
  clearSession,
} from '../services/authService';
import {
  auth,
  db,
  isFirebaseConfigured,
  onAuthStateChanged,
  doc,
  getDoc,
} from '../services/firebase';

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getCurrentSession());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Real-time Firebase Authentication listener
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured() && auth) {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // If we already have a session matching this user, keep it
          const current = getCurrentSession();
          if (current?.user?.id === fbUser.uid || current?.user?.uid === fbUser.uid) {
            return;
          }

          // Fetch full profile from Firestore if available
          let profile = {
            uid: fbUser.uid,
            id: fbUser.uid,
            email: fbUser.email,
            fullName: fbUser.displayName || fbUser.email?.split('@')[0],
            role: 'student',
            classGrade: 'XI Fase F',
            schoolName: 'SMA / MA Laboratorium',
          };

          if (db) {
            try {
              const snap = await getDoc(doc(db, 'users', fbUser.uid));
              if (snap.exists()) {
                profile = { ...profile, ...snap.data() };
              }
            } catch (err) {
              console.warn('Firestore profile load notice:', err);
            }
          }

          const newSession = setSession(profile, true);
          setSessionState(newSession);
        } else {
          // User signed out in Firebase
          const current = getCurrentSession();
          if (current?.user?.authProvider === 'firebase') {
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
    register,
    logout,
    resetPassword,
    isFirebaseConfigured: isFirebaseConfigured(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
