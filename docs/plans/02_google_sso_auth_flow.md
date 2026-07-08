# Rancangan Flow Autentikasi Google SSO & Verifikasi Mahasiswa

**Status Pelaksanaan:**
- [ ] Belum Dilaksanakan
- [ ] Sudah Dilaksanakan

---

## 1. Konfigurasi Sistem SSO (Google Cloud & Supabase)
*Tahap persiapan teknis sebelum implementasi di kode.*

* **Google Cloud Console:**
  1. Membuat *OAuth 2.0 Client IDs* di Google Cloud.
  2. Menentukan *Authorized JavaScript origins* (misal: `http://localhost:5173` untuk lokal, dan URL domain asli untuk *production*).
  3. Menentukan *Authorized redirect URIs* (mengarah ke URL otentikasi Supabase).
* **Supabase:**
  1. Mengaktifkan *Google Provider* di menu **Authentication > Providers**.
  2. Memasukkan `Client ID` dan `Client Secret` dari Google ke Supabase (Untuk environment lokal, nilai ini dimasukkan ke file `supabase/config.toml`).

## 2. Alur Pendaftaran & Login (Frontend)
*Pengalaman pengguna (UX) yang lebih fleksibel namun tetap aman.*

* **Mempertahankan Form Konvensional (Hybrid):**
  * Tetap menyediakan form input manual (Email & Password), namun dilengkapi dengan proteksi Bot/Spam (seperti validasi *hCaptcha/reCAPTCHA*, atau mengaktifkan fitur Wajib Verifikasi Email via OTP/Link dari Supabase).
  * Menambahkan tombol opsional **"Masuk dengan Akun Google Kampus"** sebagai jalur login yang lebih cepat.
* **Proses Autentikasi SSO:**
  * Saat tombol Google diklik, Frontend memanggil `supabase.auth.signInWithOAuth({ provider: 'google' })`.
  * Pengguna diarahkan ke otorisasi Google, lalu dialihkan (Redirect) kembali ke aplikasi kita.

## 3. Alur Kelengkapan Data Mahasiswa (Onboarding)
*Memastikan data profil tetap lengkap tanpa mengorbankan kenyamanan login.*

* **Halaman "Lengkapi Data Diri" (Wajib):**
  * Walaupun mahasiswa sukses login (baik via Email manual maupun Google SSO), sistem akan memeriksa *record* mereka di tabel `users`.
  * Jika atribut wajib seperti **NIM, Program Studi, Fakultas, atau Nomor Telepon** masih kosong, akses mereka akan dibatasi dan langsung diarahkan ke halaman `/complete-profile`.
  * Mereka **wajib** melengkapi data profil tersebut sebelum diizinkan masuk ke Dashboard Utama mahasiswa.
* **Mekanisme Anti-Spam Berbasis Jalur Pendaftaran:**
  * **Via Google SSO:** Email sudah terverifikasi otomatis oleh Google (`email_confirmed_at` terisi). Sistem dapat membatasi pendaftaran hanya untuk domain `@upb.ac.id`.
  * **Via Pendaftaran Manual:** Sistem mewajibkan klik link verifikasi email (atau OTP) yang dikirimkan oleh Supabase sebelum akun diaktifkan, mencegah eksploitasi oleh bot.

## 4. Integrasi Lanjutan dengan Hak Akses Admin Ormawa
*Meniadakan pengelolaan kredensial palsu secara manual.*

* **Pengajuan UKM:** Mahasiswa (Ketua) login menggunakan akun Google SSO pribadi dan mengajukan proposal pendirian UKM.
* **Pemberian Wewenang Seamless:** Saat Staf Dirmawa menyetujui pendirian UKM, sistem **TIDAK** membuatkan akun _dummy_ (misal `admin@ukm.ac.id`).
* **Pengikatan Profil:** Sistem akan mengambil `user_id` Google milik sang Ketua tersebut dan memetakannya langsung ke tabel `ormawa_admin_profiles`.
* **Akses Langsung:** Pada login berikutnya, sang Ketua (yang statusnya `mahasiswa`) akan mendapati tampilan menunya bertambah dengan akses **Dashboard Admin Ormawa**. Ini jauh lebih aman karena wewenang melekat kuat pada identitas SSO yang sah dari Google, dan mencegah kasus *lupa password*.
