# KONTRAK BASIS DATA & ARSITEKTUR SINKRONISASI
### THE SECRET OF SALT — HYDROLYSIS ADVENTURE
**Acuan**: PRD.md Bab 4 (Target Pengguna, Persona Siswa, Persona Guru, & User Stories), Bab 24 (Progress Belajar), Bab 28 (Spesifikasi Teknis), dan Bab 31 (Keamanan & Privasi).

---

## 1. Filosofi & Strategi Autentikasi "Guest-First"

Sesuai arahan pada **PRD Bab 4.1 & Bab 4.3**:
1. Siswa kelas XI SMA/MA harus dapat langsung mengakses materi dan mengerjakan kuis formatif tanpa hambatan registrasi di awal (*zero-friction guest onboarding*).
2. Seluruh interaksi kuis, draf jawaban, dan skor selama berstatus tamu disimpan secara lokal pada **ruang guest (`secret_of_salt_guest_m1_session`)** dengan ID sesi (`guestSessionId`) dan ID percobaan tetap (`attemptId`).
3. Saat siswa memutuskan untuk masuk (*login*) atau membuat akun resmi:
   - Sistem memicu kontrak migrasi **`Guest-to-User Account Migration`**.
   - Seluruh riwayat percobaan kuis dari ruang guest dimigrasikan secara utuh ke basis data server tanpa ada data yang hilang (*no progress loss*).
4. Guru mata pelajaran kimia (Bab 4.2) memiliki hak akses untuk memantau rekap skor agregat kelas, sebaran kesalahan konsep, dan mendeteksi miskonsepsi siswa.

---

## 2. Skema Relasional Basis Data (PostgreSQL / Supabase DDL)

Berikut adalah definisi skema DDL untuk PostgreSQL:

```sql
-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enum Tipe Peran Pengguna
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- 3. Tabel Pengguna (Siswa dan Guru)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'student',
    school_name VARCHAR(200),
    class_grade VARCHAR(50), -- Contoh: 'XI-MIPA-1'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Pelacakan Sesi Tamu (Guest Session Tracker)
CREATE TABLE guest_sessions (
    guest_session_id VARCHAR(64) PRIMARY KEY,
    device_fingerprint VARCHAR(255),
    migrated_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    migrated_at TIMESTAMP WITH TIME ZONE
);

-- 5. Tabel Percobaan Kuis (Quiz Attempts)
CREATE TABLE quiz_attempts (
    id VARCHAR(64) PRIMARY KEY, -- Format: 'att_m1_...'
    module_id VARCHAR(64) NOT NULL DEFAULT 'modul-1-konsep-dasar',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    guest_session_id VARCHAR(64) REFERENCES guest_sessions(guest_session_id) ON DELETE SET NULL,
    question_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    total_questions INT NOT NULL DEFAULT 10,
    correct_count INT NOT NULL DEFAULT 0,
    score NUMERIC(5, 2) NOT NULL, -- Rentang 0 - 100
    status VARCHAR(20) NOT NULL DEFAULT 'completed', -- 'in_progress' | 'completed'
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Respons Butir Soal (Per-Item Diagnostic Responses)
CREATE TABLE quiz_item_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id VARCHAR(64) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id VARCHAR(32) NOT NULL, -- Contoh: 'm1-q1', 'm1-q8'
    concept_tag VARCHAR(100) NOT NULL,
    selected_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    correct_option CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 7. Tabel Agregat Penguasaan Konsep & Miskonsepsi Siswa
CREATE TABLE concept_mastery_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    concept_tag VARCHAR(100) NOT NULL,
    total_answered INT DEFAULT 0,
    total_correct INT DEFAULT 0,
    mastery_percentage NUMERIC(5, 2) DEFAULT 0.00,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, concept_tag)
);

-- Indeks Kinerja
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_guest ON quiz_attempts(guest_session_id);
CREATE INDEX idx_quiz_items_attempt ON quiz_item_responses(attempt_id);
CREATE INDEX idx_concept_mastery_user ON concept_mastery_summaries(user_id);
```

---

## 3. Kontrak Spesifikasi API (RESTful JSON Endpoints)

### 3.1 Autentikasi & Registrasi
- **Endpoint**: `POST /api/v1/auth/login`
- **Tujuan**: Autentikasi akun siswa / guru.
- **Request Body**:
  ```json
  {
    "email": "siswa.fasef@sekolah.sch.id",
    "password": "PasswordAman123!"
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "d8f349c2...",
    "user": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "email": "siswa.fasef@sekolah.sch.id",
      "fullName": "Ahmad Fauzi",
      "role": "student",
      "classGrade": "XI-MIPA-2",
      "schoolName": "SMA Negeri 1 Pembelajaran"
    }
  }
  ```

---

### 3.2 Migrasi Sesi Tamu ke Akun Pengguna (`Guest Migration`)
- **Endpoint**: `POST /api/v1/sync/guest-migration`
- **Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "guestSessionId": "guest_m1_xyz890",
    "targetUserId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "attempts": [
      {
        "attemptId": "att_m1_171000000_abc1",
        "guestSessionId": "guest_m1_xyz890",
        "questionVersion": "1.0.0",
        "totalQuestions": 10,
        "correctCount": 9,
        "score": 90,
        "startedAt": "2026-11-03T09:00:00Z",
        "completedAt": "2026-11-03T09:08:30Z",
        "answers": {
          "m1-q1": {
            "questionId": "m1-q1",
            "selectedOption": "B",
            "isCorrect": true,
            "answeredAt": "2026-11-03T09:01:00Z"
          }
        }
      }
    ]
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "success": true,
    "migratedAttemptsCount": 1,
    "syncedAttemptIds": ["att_m1_171000000_abc1"],
    "message": "1 riwayat kuis dari sesi guest berhasil ditautkan ke akun Anda."
  }
  ```

---

### 3.3 Sinkronisasi Percobaan Kuis Real-Time
- **Endpoint**: `POST /api/v1/assessment/sync-attempts`
- **Header**: `Authorization: Bearer <JWT_TOKEN>` (opsional untuk guest dengan menyertakan `guestSessionId`)
- **Request Body**:
  ```json
  {
    "attemptId": "att_m1_171000000_abc1",
    "moduleId": "modul-1-konsep-dasar",
    "questionVersion": "1.0.0",
    "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "guestSessionId": "guest_m1_xyz890",
    "score": 100,
    "totalQuestions": 10,
    "correctCount": 10,
    "startedAt": "2026-11-03T09:00:00Z",
    "completedAt": "2026-11-03T09:08:30Z",
    "itemResponses": [
      {
        "questionId": "m1-q1",
        "conceptTag": "konsep-hidrolisis-garam",
        "selectedOption": "B",
        "correctOption": "B",
        "isCorrect": true,
        "answeredAt": "2026-11-03T09:01:00Z"
      }
    ]
  }
  ```
- **Response 200 OK**:
  ```json
  {
    "success": true,
    "attemptId": "att_m1_171000000_abc1",
    "syncedAt": "2026-11-03T09:08:32Z",
    "serverMasterySummary": {
      "conceptStrengths": ["konsep-hidrolisis-garam", "tetapan-hidrolisis"],
      "conceptWeaknesses": []
    }
  }
  ```

---

### 3.4 Laporan Analitik Kelas untuk Guru (Persona Guru Bab 4.2)
- **Endpoint**: `GET /api/v1/teacher/class-reports?classGrade=XI-MIPA-2&moduleId=modul-1-konsep-dasar`
- **Header**: `Authorization: Bearer <TEACHER_JWT_TOKEN>`
- **Response 200 OK**:
  ```json
  {
    "classGrade": "XI-MIPA-2",
    "totalStudents": 32,
    "quizAttemptCount": 48,
    "averageScore": 84.5,
    "misconceptionsByConcept": {
      "perhitungan-ph-garam": {
        "conceptName": "Perhitungan pH Garam Terhidrolisis",
        "errorRatePercentage": 28.1,
        "commonWrongOption": "A"
      },
      "reaksi-hidrolisis-anion": {
        "conceptName": "Reaksi Hidrolisis Anion Karbonat",
        "errorRatePercentage": 12.5,
        "commonWrongOption": "D"
      }
    }
  }
  ```

---

## 4. Penanganan Toleransi Kegagalan & Mode Offline (Offline-First Resiliency)

Sesuai ketentuan **PRD Bab 24.3, Bab 28.2, dan Bab 33 (Keandalan & Privasi)**:
1. **Fallback Saat Offline**: Jika koneksi jaringan terputus atau server backend tidak merespons, aplikasi tetap berjalan 100% menggunakan `localStorage` adaptor.
2. **Tanpa Klaim Palsu**: Sistem tidak akan pernah menampilkan status "Tersinkronisasi ke Server" sebelum mendapat status HTTP 200 dari endpoint.
3. **Penyimpanan Lokal Aman**: Data sensitif (kata sandi, token kedaluwarsa) tidak pernah diletakkan di `localStorage`.
4. **Idempoten**: Endpoint `sync-attempts` bersifat idempoten menggunakan `attemptId` sebagai *unique key*, sehingga pengiriman ulang tidak akan menggandakan skor kuis.

---

## 5. Integrasi Firebase Authentication & Cloud Firestore Database

Sistem telah terhubung dengan SDK resmi **Firebase v13** (`firebase/auth` dan `firebase/firestore`).

### 5.1 Struktur Koleksi Firestore (NoSQL Document Structure)

#### 1. Koleksi: `users`
- **Path**: `users/{uid}`
- **Struktur Dokumen**:
  ```json
  {
    "uid": "aB1cD2eF3gH4...",
    "email": "siswa.fasef@kimia.sch.id",
    "fullName": "Ahmad Fauzi",
    "role": "student",
    "classGrade": "XI Fase F",
    "schoolName": "SMA / MA Laboratorium",
    "authProvider": "firebase",
    "createdAt": "TIMESTAMP",
    "lastLoginAt": "TIMESTAMP"
  }
  ```

#### 2. Koleksi: `quiz_attempts`
- **Path**: `quiz_attempts/{attemptId}`
- **Struktur Dokumen**:
  ```json
  {
    "attemptId": "att_m1_171000_abc1",
    "userId": "aB1cD2eF3gH4...",
    "guestSessionId": "guest_171000_xyz9",
    "moduleId": "modul-1-konsep-dasar",
    "questionVersion": "1.0.0",
    "totalQuestions": 10,
    "correctCount": 9,
    "score": 90,
    "startedAt": "2026-11-10T09:00:00.000Z",
    "completedAt": "2026-11-10T09:08:30.000Z",
    "syncedAt": "TIMESTAMP",
    "answers": {
      "m1-q1": {
        "questionId": "m1-q1",
        "selectedOption": "B",
        "isCorrect": true,
        "answeredAt": "2026-11-10T09:01:00.000Z"
      }
    }
  }
  ```

### 5.2 Aturan Keamanan Firestore (Security Rules)

Tempelkan aturan berikut di tab **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Profil pengguna hanya dapat dibaca dan ditulis oleh pemilik akun
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Riwayat percobaan kuis siswa
    match /quiz_attempts/{attemptId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid || 
        request.auth.token.role == 'teacher'
      );
      allow create, update: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if false; // Riwayat evaluasi tidak boleh dihapus sembarangan
    }
  }
}
```

### 5.3 Konfigurasi Variabel Lingkungan (`.env.local`)
Kredensial dari Firebase Console diinjeksikan melalui file `.env.local`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=proyek-kimia.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyek-kimia
VITE_FIREBASE_STORAGE_BUCKET=proyek-kimia.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```


