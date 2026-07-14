# Rancangan Flow Admin Ormawa & Integrasi Sistem

**Status Pelaksanaan:**
- [ ] Belum Dilaksanakan
- [x] Sudah Dilaksanakan

---

## 1. Flow Pemberian Akun Admin Ormawa
*Harus matching sama flow pengajuan ormawa baru.*

* **Pemicu (Trigger):** Staf Dirmawa menyetujui pengajuan pendirian Ormawa baru di halaman `OrmawaApplicationsQueue`.
* **Proses Sistem:**
  1. Data pengajuan dipindahkan menjadi entitas resmi di tabel `ukms`.
  2. Sistem *Supabase Auth* membuat satu entitas akun khusus dengan role `admin_ormawa`.
  3. Kredensial default dibuat otomatis (misalnya Email: `admin.[nama_ukm]@upb.ac.id`, Password acak/terstandar).
  4. Akun tersebut langsung ditautkan ke UKM menggunakan tabel perantara `ormawa_admin_profiles`.
* **Serah Terima:** Setelah di-_approve_, staf akan melihat _prompt_ pop-up berisi Kredensial Login Admin Ormawa yang baru saja dibuat, yang kemudian dapat diberikan secara manual (via WhatsApp/Email) kepada mahasiswa pengaju (Ketua).

## 2. Flow Integrasi Admin Ormawa dengan Direktori UKM
*Edit khusus untuk organisasi mereka sendiri.*

* **Routing Khusus:** Saat user dengan role `admin_ormawa` login, mereka diarahkan ke rute `/ormawa-dashboard` (bukan `/admin-dashboard` milik Dirmawa).
* **Menu Profil UKM:**
  * Admin Ormawa memiliki akses ke menu **"Kelola Profil Organisasi"**.
  * Aplikasi akan menarik data dari database hanya dengan kondisi `WHERE id = [ukm_id_milik_admin_ormawa]`.
  * RLS (Row Level Security) Supabase akan dikonfigurasi agar operasi `UPDATE` pada tabel `ukms` hanya diizinkan jika `user_id` pengubah ada dalam tabel `ormawa_admin_profiles` untuk `ukm_id` terkait.
* **Batas Akses:** Mereka bebas mengubah Deskripsi, Logo, Cover, Visi Misi, Narahubung, dan Jadwal Latihan, namun **tidak bisa** mengubah nama organisasi dan status keaktifan UKM tanpa izin Dirmawa.

## 3. Flow Pengajuan Proposal & LPJ (Pemberkasan)
*Sejalan dengan administrasi Staf Dirmawa.*

* **Dashboard Admin Ormawa:**
  * Tersedia form **"Buat Pengajuan Proposal"** dan **"Buat LPJ"**.
  * Semua form akan secara otomatis mengunci `ukm_id` milik Admin Ormawa sehingga mereka tidak bisa mengirim atas nama organisasi lain.
* **Alur Persetujuan (State Machine):**
  1. **Upload Draft/Kirim (Oleh Ormawa):** Admin Ormawa mengunggah dokumen (PDF), status berubah menjadi `submitted_dirmawa`.
  2. **Review Administratif (Oleh Staf Dirmawa):** Muncul di halaman *Ormawa Proposals Queue* milik Staf Dirmawa. Staf dapat:
     * *Tolak/Revisi:* Status kembali ke `draft` dengan catatan perbaikan untuk dikerjakan ulang oleh Admin Ormawa.
     * *Setujui:* Status naik ke step selanjutnya (`approved_dirmawa_staff` atau menunggu _approval_ Direktur Dirmawa).
  3. **Persetujuan Final & TTD Digital:** Jika di-_approve_ sepenuhnya, status menjadi `waiting_for_scan`. Admin Ormawa mendapat notifikasi untuk mengeprint lembar pengesahan, memberi tanda tangan basah, dan mengunggah ulang pindaian dokumen tersebut.
  4. **Selesai:** Setelah scan diunggah, status berubah menjadi `completed` dan diarsipkan.

## 4. Flow Pendataan Anggota Ormawa (Mahasiswa)
*Mendata keanggotaan.*

* **Skema Database Tambahan:** Pembuatan tabel baru bernama `ormawa_members` dengan kolom: `id`, `ukm_id`, `student_id` (NIM/User ID Mahasiswa), `role_in_ukm` (Ketua, Bendahara, Anggota Aktif), `status` (Aktif / Nonaktif / Menunggu Persetujuan).
* **Fitur Manajemen Anggota (Admin Ormawa):**
  * Di Dashboard Admin Ormawa, terdapat menu **"Daftar Anggota"**.
  * Admin Ormawa bisa menambahkan mahasiswa secara manual menggunakan **NIM** (Sistem memverifikasi nama mahasiswa secara otomatis dari tabel `users`).
  * Admin Ormawa dapat menandai anggota lama sebagai "Alumni UKM" atau "Nonaktif".
* **Fitur Pendaftaran Terbuka (Public):**
  * Mahasiswa umum bisa mengakses profil publik UKM dan menekan tombol **"Daftar Anggota"**.
  * Aksi ini akan membuat status `Menunggu Persetujuan`.
  * Admin Ormawa mendapat notifikasi di dashboard mereka untuk **Approve** atau **Reject** pelamar baru tersebut.
