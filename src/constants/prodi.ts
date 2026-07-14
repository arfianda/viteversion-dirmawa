export interface StudyProgram {
  name: string;
  faculty: string;
}

export const LIST_PRODI_UPB: StudyProgram[] = [
  // Diploma (D3)
  { name: 'D3 - Akuntansi', faculty: 'Fakultas Ekonomi dan Bisnis' },

  // Sarjana (S1)
  { name: 'S1 - Pendidikan Guru Sekolah Dasar', faculty: 'Fakultas Keguruan dan Ilmu Pendidikan' },
  { name: 'S1 - Pendidikan Guru Pendidikan Anak Usia Dini', faculty: 'Fakultas Keguruan dan Ilmu Pendidikan' },
  { name: 'S1 - Pendidikan Ilmu Pengetahuan Alam', faculty: 'Fakultas Keguruan dan Ilmu Pendidikan' },
  { name: 'S1 - Bisnis Digital', faculty: 'Fakultas Ekonomi dan Bisnis' },
  { name: 'S1 - Kewirausahaan', faculty: 'Fakultas Ekonomi dan Bisnis' },
  { name: 'S1 - Manajemen', faculty: 'Fakultas Ekonomi dan Bisnis' },
  { name: 'S1 - Bimbingan Dan Konseling Pendidikan Islam', faculty: 'Fakultas Agama Islam' },
  { name: 'S1 - Manajemen Pendidikan Islam', faculty: 'Fakultas Agama Islam' },
  { name: 'S1 - Ekonomi Syariah', faculty: 'Fakultas Agama Islam' },
  { name: 'S1 - Hukum', faculty: 'Fakultas Hukum' },
  { name: 'S1 - Arsitektur', faculty: 'Fakultas Teknik' },
  { name: 'S1 - Teknik Informatika', faculty: 'Fakultas Teknik' },
  { name: 'S1 - Teknik Sipil', faculty: 'Fakultas Teknik' },
  { name: 'S1 - Teknik Lingkungan', faculty: 'Fakultas Teknik' },
  { name: 'S1 - Teknik Industri', faculty: 'Fakultas Teknik' },
  { name: 'S1 - Teknologi Hasil Pertanian', faculty: 'Fakultas Pertanian' },

  // Pascasarjana (S2)
  { name: 'S2 - Magister Manajemen', faculty: 'Pascasarjana' }
];
