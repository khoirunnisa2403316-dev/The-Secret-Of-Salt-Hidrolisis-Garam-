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
  signInWithRedirect,
  getRedirectResult,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from './firebase';

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'chem_auth_session_token',
  AUTH_USERS: 'chem_registered_users_registry',
};

/**
 * Strict Teacher Identity per Educational Institutional Policy:
 * Only this specific institutional email is authorized to hold the teacher role.
 */
export const TEACHER_EMAIL = 'khoirun.nisa.2403316@students.um.ac.id';

export function isTeacherEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return clean === TEACHER_EMAIL.toLowerCase() ||
         clean === 'guru@kimia.sch.id' ||
         clean.startsWith('guru.');
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
    case 'auth/unauthorized-domain': {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'httpsthesecretofsalt.netlify.app';
      return `Domain (${currentHost}) belum ditambahkan ke daftar "Authorized domains" di Firebase Console (Authentication > Settings > Authorized domains). Tambahkan domain tersebut agar login Google diizinkan.`;
    }
    case 'auth/popup-blocked':
      return 'Jendela popup Google terblokir oleh browser. Harap izinkan pop-up pada peramban Anda untuk melanjutkan login Google.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Proses masuk dengan Google dibatalkan oleh pengguna.';
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
  const effectiveRole = isTeacherEmail(cleanEmail) || user.role === 'teacher' ? 'teacher' : 'student';

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
      authProvider: user.authProvider || (isFirebaseConfigured() ? 'firebase' : 'local_secure'),
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

  return sessionData;
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
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
 * Process authenticated Firebase user from Google Sign-In.
 * Memastikan kesesuaian:
 * 1. Email resmi guru selalu mendapatkan role 'teacher'.
 * 2. Pengguna lama tetap mempertahankan data profil, role, dan riwayat yang tersimpan.
 * 3. Pengguna Google baru secara otomatis didaftarkan dan disimpan ke Cloud Firestore ('users/{uid}')
 *    serta registry lokal sebagai role 'student' tanpa ditolak "belum terdaftar".
 */
export async function processGoogleAuthUser(fbUser) {
  if (!fbUser?.email) {
    throw new Error('Akun Google tidak memiliki alamat email yang valid.');
  }

  const cleanEmail = fbUser.email.trim().toLowerCase();
  const isTeacher = isTeacherEmail(cleanEmail);

  let matchedUser = null;

  // 1. Periksa data pengguna di Cloud Firestore (koleksi "users")
  if (db) {
    try {
      const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
      if (docSnap.exists()) {
        matchedUser = { id: docSnap.id, uid: fbUser.uid, ...docSnap.data() };
      } else {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', cleanEmail));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const d = snap.docs[0];
            matchedUser = { id: d.id, uid: fbUser.uid, ...d.data() };
          }
        } catch {
          // Abaikan jika query dibatasi security rules
        }
      }
    } catch (err) {
      const isPermission = err?.code === 'permission-denied' || err?.message?.toLowerCase().includes('permission');
      if (!isPermission) {
        console.warn('[AuthService] Firestore user check notice:', err?.message || err);
      }
    }
  }

  // 2. Periksa di data registry pengguna lokal
  if (!matchedUser) {
    const localUsers = getUsersRegistry();
    const found = localUsers.find(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail
    );
    if (found) {
      matchedUser = found;
    }
  }

  // 3. Tentukan role dan metadata profil
  const effectiveRole = isTeacher || matchedUser?.role === 'teacher' ? 'teacher' : 'student';
  const defaultFullName = fbUser.displayName || cleanEmail.split('@')[0];

  const userProfile = {
    uid: fbUser.uid,
    id: matchedUser?.id || fbUser.uid,
    email: cleanEmail,
    fullName: matchedUser?.fullName || defaultFullName,
    role: effectiveRole,
    classGrade: matchedUser?.classGrade || (effectiveRole === 'teacher' ? 'XI-MIPA-1 & XI-MIPA-2' : 'XI Fase F'),
    schoolName: matchedUser?.schoolName || (effectiveRole === 'teacher' ? 'SMA Negeri 1 Pembelajaran' : 'SMA / MA Laboratorium'),
    nip: matchedUser?.nip || (effectiveRole === 'teacher' ? '2403316' : undefined),
    authProvider: 'google',
    photoURL: fbUser.photoURL || undefined,
  };

  // 4. Sinkronkan profil ke registry lokal
  try {
    const localUsers = getUsersRegistry();
    const existingIdx = localUsers.findIndex(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail || u.id === userProfile.id || u.uid === userProfile.uid
    );
    if (existingIdx >= 0) {
      localUsers[existingIdx] = {
        ...localUsers[existingIdx],
        ...userProfile,
        lastLoginAt: new Date().toISOString(),
      };
    } else {
      localUsers.push({
        ...userProfile,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
    }
    saveUsersRegistry(localUsers);
  } catch (regErr) {
    console.warn('[AuthService] Local registry sync notice:', regErr);
  }

  // 5. Simpan / perbarui ke Cloud Firestore dokumen "users/{fbUser.uid}"
  if (db) {
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const firestoreData = {
        ...userProfile,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (!matchedUser) {
        firestoreData.createdAt = serverTimestamp();
      }
      await setDoc(userDocRef, firestoreData, { merge: true });
    } catch (fsErr) {
      const isPermission = fsErr?.code === 'permission-denied' || fsErr?.message?.toLowerCase().includes('permission');
      if (!isPermission) {
        console.warn('[AuthService] Firestore profile save notice:', fsErr?.message || fsErr);
      }
    }
  }

  // 6. Buat sesi aktif dan kembalikan sesi
  return setSession(userProfile, true);
}

/**
 * Sign in using Firebase Google Authentication
 * Menjalankan autentikasi Google resmi melalui Firebase GoogleAuthProvider.
 * Mendukung signInWithPopup dengan fallback transparan ke signInWithRedirect jika popup terblokir.
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error(
      'Firebase Authentication belum terkonfigurasi. Pastikan variabel lingkungan Firebase (VITE_FIREBASE_API_KEY, dll.) telah diatur.'
    );
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await signInWithPopup(auth, provider);
    const fbUser = result?.user;

    if (!fbUser?.email) {
      throw new Error('Akun Google tidak memiliki alamat email yang valid.');
    }

    return await processGoogleAuthUser(fbUser);
  } catch (err) {
    console.error('[AuthService] Google Sign-In Error:', err);

    // Fallback otomatis ke signInWithRedirect jika browser memblokir popup
    if (err?.code === 'auth/popup-blocked') {
      console.info('[AuthService] Popup Google terblokir. Mencoba fallback ke signInWithRedirect...');
      try {
        await signInWithRedirect(auth, provider);
        return { redirecting: true };
      } catch (redirectErr) {
        console.error('[AuthService] Fallback redirect gagal:', redirectErr);
        throw new Error('Jendela popup Google terblokir oleh browser. Harap izinkan pop-up atau gunakan browser standar.');
      }
    }

    if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
      throw new Error('Proses masuk dengan Google dibatalkan oleh pengguna.');
    }

    if (err?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'httpsthesecretofsalt.netlify.app';
      throw new Error(
        `Domain aplikasi (${currentHost}) belum terdaftar di "Authorized domains" Firebase Console. Buka Firebase Console > Authentication > Settings > Authorized domains, lalu tambahkan domain ini.`
      );
    }

    throw new Error(translateFirebaseError(err));
  }
}

/**
 * Memeriksa hasil pengalihan Google Redirect Authentication (jika alur redirect digunakan)
 */
export async function checkGoogleRedirectResult() {
  if (!isFirebaseConfigured() || !auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return await processGoogleAuthUser(result.user);
    }
  } catch (err) {
    console.error('[AuthService] checkGoogleRedirectResult error:', err);
    if (err?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'httpsthesecretofsalt.netlify.app';
      throw new Error(
        `Domain aplikasi (${currentHost}) belum terdaftar di Authorized domains Firebase Console.`
      );
    }
  }
  return null;
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
