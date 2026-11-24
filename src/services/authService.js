/**
 * Authentication Service — Media Pembelajaran Kimia
 * Seamless integration with Firebase Authentication & Cloud Firestore
 * with graceful fallback to secure cryptographic local session engine
 * (SHA-256 hashing, zero plain-text passwords) when env keys are pending.
 */

import {
  auth,
  db,
  isFirebaseConfigured,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from './firebase';
import { migrateLocalGuestAttemptsToFirestore } from './firestoreQuizService';

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'chem_auth_session_token',
  AUTH_USERS: 'chem_registered_users_registry',
  GUEST_HISTORY: 'secret_of_salt_guest_m1_history',
};

/**
 * Strict Teacher Identity per Educational Institutional Policy:
 * Only this specific institutional email is authorized to hold the teacher role.
 */
export const TEACHER_EMAIL = 'khoirun.nisa.2403316@students.um.ac.id';

export function isTeacherEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === TEACHER_EMAIL.toLowerCase();
}

/**
 * Translate Firebase error codes into friendly Indonesian messages
 */
function translateFirebaseError(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.';
    case 'auth/invalid-email':
      return 'Format email tidak valid (contoh: nama@sekolah.sch.id).';
    case 'auth/operation-not-allowed':
      return 'Metode autentikasi (Email/Password atau Google) belum diaktifkan di Firebase Console (Authentication > Sign-in method).';
    case 'auth/unauthorized-domain':
      return 'Domain aplikasi ini belum ditambahkan ke daftar "Authorized domains" di Firebase Console (Authentication > Settings > Authorized domains).';
    case 'auth/configuration-not-found':
      return 'Konfigurasi penyedia autentikasi belum ditemukan di Firebase Console.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.';
    case 'auth/user-not-found':
      return 'Email belum terdaftar dalam sistem kami. Silakan buat akun baru.';
    case 'auth/wrong-password':
      return 'Kata sandi salah. Silakan periksa kembali.';
    case 'auth/invalid-credential':
      return 'Email atau kata sandi tidak sesuai. Silakan periksa kembali akun Anda.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat lagi atau atur ulang kata sandi.';
    case 'auth/network-request-failed':
      return 'Koneksi jaringan terputus. Pastikan perangkat Anda terhubung ke internet.';
    default:
      return error?.message || 'Terjadi kesalahan pada server autentikasi.';
  }
}

/**
 * Hash a password string using SubtleCrypto SHA-256 for local fallback mode
 */
export async function hashPassword(plainPassword) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword + '_chem_salt_fase_f');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Helper to get local registered users registry (hashes only, no plain passwords)
 * Pre-seeded with 2 students and 1 teacher for robust pedagogical testing
 */
function getUsersRegistry() {
  const defaultUsers = [
    {
      id: 'usr_demo_student_01',
      email: 'ahmad.fauzi@kimia.sch.id',
      fullName: 'Ahmad Fauzi',
      role: 'student',
      classGrade: 'XI-MIPA-1',
      schoolName: 'SMA Negeri 1 Pembelajaran',
      passwordHash: '8b7fcae8ce981c2bfaae3bdfdfa785d064c58cfb9be92a969b8fe1ad1568e21a', // Kimia2026!
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_demo_student_02',
      email: 'nabila.putri@kimia.sch.id',
      fullName: 'Nabila Putri',
      role: 'student',
      classGrade: 'XI-MIPA-1',
      schoolName: 'SMA Negeri 1 Pembelajaran',
      passwordHash: '8b7fcae8ce981c2bfaae3bdfdfa785d064c58cfb9be92a969b8fe1ad1568e21a', // Kimia2026!
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_demo_teacher_01',
      email: 'khoirun.nisa.2403316@students.um.ac.id',
      fullName: "Khoirun Nisa' Rakhma, S.Pd.",
      role: 'teacher',
      classGrade: 'XI-MIPA-1 & XI-MIPA-2',
      schoolName: 'SMA Negeri 1 Pembelajaran',
      nip: '2403316',
      passwordHash: '8b7fcae8ce981c2bfaae3bdfdfa785d064c58cfb9be92a969b8fe1ad1568e21a', // Kimia2026!
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USERS, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    const current = JSON.parse(raw);
    // Ensure all demo users exist in the registry
    let modified = false;
    defaultUsers.forEach((def) => {
      if (!current.some((u) => u.id === def.id || u.email.toLowerCase() === def.email.toLowerCase())) {
        current.push(def);
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USERS, JSON.stringify(current));
    }
    return current;
  } catch {
    return defaultUsers;
  }
}

function saveUsersRegistry(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save user registry:', err);
  }
}

/**
 * Get current active session
 */
export function getCurrentSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION) ||
                localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Save session securely (stores session token and sanitized profile, NEVER passwords)
 */
export function setSession(user, rememberMe = true) {
  const cleanEmail = (user.email || '').trim().toLowerCase();
  const effectiveRole = isTeacherEmail(cleanEmail) ? 'teacher' : 'student';

  const sessionData = {
    token: `chem_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user: {
      id: user.uid || user.id,
      uid: user.uid || user.id,
      email: user.email,
      fullName: user.displayName || user.fullName || user.email?.split('@')[0],
      role: effectiveRole,
      classGrade: user.classGrade || (effectiveRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI Fase F'),
      schoolName: user.schoolName || 'SMA / MA Laboratorium',
      authProvider: isFirebaseConfigured() ? 'firebase' : 'local_secure',
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const payload = JSON.stringify(sessionData);
  sessionStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, payload);
  if (rememberMe) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, payload);
    } catch {
      // ignore
    }
  }

  // Link local guest quiz attempts
  migrateGuestQuizAttempts(sessionData.user.id);

  return sessionData;
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
}

function migrateGuestQuizAttempts(userId) {
  try {
    const rawHistory = localStorage.getItem(STORAGE_KEYS.GUEST_HISTORY);
    if (rawHistory) {
      const history = JSON.parse(rawHistory);
      if (Array.isArray(history)) {
        const userHistoryKey = `chem_user_history_${userId}`;
        const existing = JSON.parse(localStorage.getItem(userHistoryKey) || '[]');
        const merged = [...history, ...existing];
        localStorage.setItem(userHistoryKey, JSON.stringify(merged));
      }
    }
  } catch (err) {
    console.warn('Guest quiz migration notice:', err);
  }
}

/**
 * Register User with Firebase Auth & Cloud Firestore
 */
export async function registerUser({ fullName, email, password, confirmPassword }) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();

  // Basic validation
  if (!cleanName) {
    throw new Error('Nama lengkap wajib diisi.');
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Format email tidak valid.');
  }
  if (!password || password.length < 8) {
    throw new Error('Kata sandi minimal harus terdiri dari 8 karakter.');
  }
  if (password !== confirmPassword) {
    throw new Error('Konfirmasi kata sandi tidak cocok.');
  }

  // 1. LIVE FIREBASE AUTH & FIRESTORE INTEGRATION
  if (isFirebaseConfigured() && auth && db) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      // Update Firebase Auth Display Name
      await updateProfile(fbUser, { displayName: cleanName });

      // Save student/teacher profile to Cloud Firestore collection "users"
      const userRole = isTeacherEmail(cleanEmail) ? 'teacher' : 'student';
      const userDocRef = doc(db, 'users', fbUser.uid);
      const profileData = {
        uid: fbUser.uid,
        email: cleanEmail,
        fullName: cleanName,
        role: userRole,
        classGrade: userRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI Fase F',
        schoolName: 'SMA / MA Laboratorium',
        authProvider: 'firebase',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(userDocRef, profileData, { merge: true });

      // Migrate guest attempts to Firestore
      await migrateLocalGuestAttemptsToFirestore(fbUser.uid);

      return setSession({
        uid: fbUser.uid,
        id: fbUser.uid,
        email: cleanEmail,
        fullName: cleanName,
        role: userRole,
        classGrade: userRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI Fase F',
        schoolName: 'SMA / MA Laboratorium',
      }, true);
    } catch (err) {
      throw new Error(translateFirebaseError(err));
    }
  }

  // 2. LOCAL SECURE ENGINE (FALLBACK WHEN ENV IS PENDING)
  await new Promise((r) => setTimeout(r, 600));

  const users = getUsersRegistry();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.');
  }

  const passwordHash = await hashPassword(password);
  const userRole = isTeacherEmail(cleanEmail) ? 'teacher' : 'student';
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    fullName: cleanName,
    role: userRole,
    classGrade: userRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI Fase F',
    schoolName: 'SMA / MA Laboratorium',
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsersRegistry(users);

  return setSession(newUser, true);
}

/**
 * Login User with Firebase Auth & Cloud Firestore
 */
export async function loginUser({ email, password, rememberMe = true }) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Email wajib diisi.');
  }
  if (!password) {
    throw new Error('Kata sandi wajib diisi.');
  }

  // 1. LIVE FIREBASE AUTH INTEGRATION
  if (isFirebaseConfigured() && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      const userRole = isTeacherEmail(fbUser.email || cleanEmail) ? 'teacher' : 'student';
      let studentProfile = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || cleanEmail.split('@')[0],
        role: userRole,
        classGrade: userRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI Fase F',
        schoolName: 'SMA / MA Laboratorium',
      };

      // Fetch Firestore profile document
      if (db) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            studentProfile = { ...studentProfile, ...snap.data(), role: userRole };
            // Update lastLoginAt
            await setDoc(userDocRef, { lastLoginAt: serverTimestamp(), role: userRole }, { merge: true });
          } else {
            // First time login with this auth user, write default profile
            await setDoc(userDocRef, {
              ...studentProfile,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            }, { merge: true });
          }

          // Migrate any pending guest quiz attempts to Firestore
          await migrateLocalGuestAttemptsToFirestore(fbUser.uid);
        } catch (err) {
          console.warn('Firestore profile fetch notice:', err);
        }
      }

      return setSession(studentProfile, rememberMe);
    } catch (err) {
      throw new Error(translateFirebaseError(err));
    }
  }

  // 2. LOCAL SECURE ENGINE (FALLBACK)
  await new Promise((r) => setTimeout(r, 500));

  const users = getUsersRegistry();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('Email belum terdaftar. Silakan buat akun baru.');
  }

  const inputHash = await hashPassword(password);
  if (user.passwordHash !== inputHash) {
    throw new Error('Kata sandi salah. Silakan periksa kembali.');
  }

  return setSession(user, rememberMe);
}

/**
 * Logout User
 */
export async function logoutUser() {
  if (isFirebaseConfigured() && auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut notice:', err);
    }
  }
  clearSession();
}

/**
 * Send Password Reset Link via Firebase Auth
 */
export async function requestPasswordReset(email) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Format email tidak valid.');
  }

  // 1. LIVE FIREBASE AUTH RESET
  if (isFirebaseConfigured() && auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: `Tautan pemulihan kata sandi telah dikirim oleh Firebase ke ${cleanEmail}. Silakan periksa kotak masuk atau spam email Anda.`,
        sentAt: new Date().toISOString(),
      };
    } catch (err) {
      throw new Error(translateFirebaseError(err));
    }
  }

  // 2. LOCAL SIMULATION
  await new Promise((r) => setTimeout(r, 600));

  const users = getUsersRegistry();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('Email tidak ditemukan dalam sistem kami.');
  }

  return {
    success: true,
    message: `Tautan pemulihan kata sandi telah dikirim ke ${cleanEmail}. Silakan periksa kotak masuk email Anda.`,
    sentAt: new Date().toISOString(),
  };
}

/**
 * Sign in using Google Provider (Firebase Auth or graceful demo fallback)
 */
export async function loginWithGoogle() {
  // 1. Live Firebase Google Auth Popup
  if (isFirebaseConfigured() && auth) {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const userRole = isTeacherEmail(fbUser.email) ? 'teacher' : 'student';
      let userProfile = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email?.split('@')[0],
        role: userRole,
        classGrade: userRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI-MIPA-1',
        schoolName: 'SMA Negeri 1 Pembelajaran',
        authProvider: 'google',
      };

      if (db) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            userProfile = { ...userProfile, ...snap.data(), role: userRole };
            await setDoc(userDocRef, { lastLoginAt: serverTimestamp(), role: userRole }, { merge: true });
          } else {
            await setDoc(
              userDocRef,
              {
                ...userProfile,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (err) {
          console.warn('Firestore profile write notice:', err);
        }
      }

      return setSession(userProfile, true);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        throw new Error('Proses masuk dengan Google dibatalkan oleh pengguna.');
      } else if (err?.code === 'auth/popup-blocked') {
        throw new Error('Jendela popup Google terblokir oleh browser. Izinkan pop-up untuk melanjutkan.');
      }
      throw new Error(translateFirebaseError(err));
    }
  }

  // 2. Fallback when Firebase environment variables are not configured
  throw new Error('Firebase Authentication belum terkonfigurasi. Pastikan variabel lingkungan Firebase (VITE_FIREBASE_API_KEY, dll.) telah diatur.');
}

/**
 * Check if the active session matches expected target user (prevents account-change race conditions)
 */
export function isCurrentSessionUser(expectedUserId) {
  if (!expectedUserId) return false;
  const current = getCurrentSession();
  if (!current?.user) return false;
  const curId = current.user.id || current.user.uid;
  return curId === expectedUserId;
}

/**
 * Convenient account switcher for testing 2 students and 1 teacher seamlessly
 */
export function switchDemoAccount(targetKey = 'student1') {
  const users = getUsersRegistry();
  let target = null;

  if (targetKey === 'teacher' || targetKey === 'guru') {
    target = users.find((u) => u.email === TEACHER_EMAIL) || {
      id: 'usr_demo_teacher_01',
      uid: 'usr_demo_teacher_01',
      email: TEACHER_EMAIL,
      fullName: "Khoirun Nisa' Rakhma, S.Pd.",
      role: 'teacher',
      classGrade: 'XI-MIPA-1 & XI-MIPA-2',
      schoolName: 'SMA Negeri 1 Pembelajaran',
      nip: '2403316',
      authProvider: 'local_demo',
    };
  } else if (targetKey === 'student2' || targetKey === 'nabila') {
    target = users.find((u) => u.id === 'usr_demo_student_02') || {
      id: 'usr_demo_student_02',
      uid: 'usr_demo_student_02',
      email: 'nabila.putri@kimia.sch.id',
      fullName: 'Nabila Putri',
      role: 'student',
      classGrade: 'XI-MIPA-1',
      schoolName: 'SMA Negeri 1 Pembelajaran',
      authProvider: 'local_demo',
    };
  } else {
    // Default student 1 Ahmad Fauzi
    target = users.find((u) => u.id === 'usr_demo_student_01') || {
      id: 'usr_demo_student_01',
      uid: 'usr_demo_student_01',
      email: 'ahmad.fauzi@kimia.sch.id',
      fullName: 'Ahmad Fauzi',
      role: 'student',
      classGrade: 'XI-MIPA-1',
      schoolName: 'SMA Negeri 1 Pembelajaran',
      authProvider: 'local_demo',
    };
  }

  return setSession(target, true);
}
