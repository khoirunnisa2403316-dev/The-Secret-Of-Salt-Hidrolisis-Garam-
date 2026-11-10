import { createContext, useContext } from 'react';

export interface AuthUser {
  id: string;
  uid?: string;
  email: string;
  fullName: string;
  role?: string;
  classGrade?: string;
  schoolName?: string;
  authProvider?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: unknown;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearError: () => void;
  login: (params: { email: string; password: string; rememberMe?: boolean }) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  register: (params: { fullName: string; email: string; password: string; confirmPassword: string }) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  isFirebaseConfigured: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

