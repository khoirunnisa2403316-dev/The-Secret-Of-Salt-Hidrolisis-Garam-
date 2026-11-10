import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './useAuth';
import {
  getCurrentSession,
  loginUser,
  registerUser,
  clearSession,
  requestPasswordReset,
  isSupabaseConfigured,
} from '../services/authService';

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getCurrentSession());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Cross-tab session synchronization listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chem_auth_session_token') {
        setSessionState(getCurrentSession());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  const logout = () => {
    clearSession();
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
    isSupabaseConfigured: isSupabaseConfigured(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
