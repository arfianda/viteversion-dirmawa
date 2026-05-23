/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scholarship, UKM, Achievement, AlumniRecord, StudentNews } from './types';

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: '1',
    title: 'Beasiswa KIP-Kuliah',
    type: 'pemerintah',
    provider: 'Kemendikbudristek Republik Indonesia',
    description: 'Bantuan biaya pendidikan dari Pemerintah RI bagi lulusan SMA/sederajat yang memiliki potensi akademik baik tetapi memiliki keterbatasan ekonomi untuk melanjutkan kuliah di Perguruan Tinggi.',
    fundingAmount: 'Dana UKT Penuh + Uang Saku up to Rp 1.400.000 / Bulan',
    registrationDeadline: '20 Agustus 2024',
    requirements: [
      'Memiliki Kartu KIP-Kuliah atau terdaftar di DTKS Kementerian Sosial.',
      'Lulusan SMA/SMK/MA sederajat tahun berjalan atau maksimal 2 tahun sebelumnya.',
      'Diterima sebagai mahasiswa baru di program studi Universitas Pelita Bangsa.',
      'Mempertahankan IPK minimal 3.00 selama masa studi.'
    ],
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjB3iDbZ9vv1rebe4p26uVHMil7_aaz_8zAk7FwVEIlxksc8U0jDxNqhmZkmayH6OTpnXmJFGa5IDkWEWBnFQAivbQE11yK_IUvgan79gF-aMUaoKgDyqZtcKjGCe_C3j19RiqgDprYC3-WaRYe9lhNvD3KiRWt-y9lyqxL6g-caXCS5lzb2mO_ytLMjHp4ugWd8MJ8IaYCWhF1kqS0vPHEntECb_w4f6uyyAGhWNSCxRKWgFKn0ZN3ckZ7c7_xWuqiLDrCQ6JYpg',
    benefits: [
      'Pembebasan Uang Kuliah Tunggal (UKT) / biaya kuliah gratis 100% hingga lulus (maksimal 8 semester).',
      'Subsidi biaya hidup bulanan yang dikirimkan langsung ke rekening mahasiswa.',
      'Sertifikasi & pelatihan soft skills kepemimpinan reguler.'
    ]
  },
  {
    id: '2',
    title: 'Beasiswa Prestasi Akademik UPB',
    type: 'internal',
    provider: 'Universitas Pelita Bangsa',
    description: 'Beasiswa bergengsi bersumber dari yayasan internal UPB untuk mengapresiasi dan memfasilitasi mahasiswa aktif semester berjalan yang memperlihatkan prestasi prestasi akademik luar biasa.',
    fundingAmount: 'Diskon SPP Semester sebesar 50% - 100%',
    registrationDeadline: '15 September 2024',
    requirements: [
      'Terdaftar aktif sebagai mahasiswa Universitas Pelita Bangsa (min Semester 2).',
      'Memiliki IPK minimal 3.75 pada dua semester berturut-turut.',
      'Tidak sedang menerima beasiswa atau bantuan keuangan dari pihak lain.',
      'Bebas dari segala sanksi akademik atau pelanggaran tata tertib kampus.'
    ],
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzOdNl_P6NrVY9GhJeHvxch1eE4gT7F7DdF-bFLtkXSMt8fb4ebSzesJZQ2lGi0ajIYjjyhYRt5vMDyfbFV_bYoMjuHbWYBvCIlp2EXWYYXnZ8-zoAWxGHuCIouxYA-7dq9X79zGYaNQezjhJBY3WyKhAWn_pYDG7xM1oyRIb97SCpsDjzkedErfPsz3HbNCtb97QhUji2IGzUd1gHfWfS4Zly0SnSGCCLyVx2VXbvrW_ua1ZQ8Qt2YgQpb9wWZKsBTE__OjB2q4g',
    benefits: [
      'Potongan SPP / BPP variabel semester berjalan (bebas biaya kuliah kondisional).',
      'Kesempatan bergabung dalam VIP Mentoring & Network Direktorat Kemahasiswaan.',
      'Prioritas delegasi dalam program pertukaran mahasiswa nasional/global.'
    ]
  },
  {
    id: '3',
    title: 'Djarum Beasiswa Plus',
    type: 'swasta',
    provider: 'Djarum Foundation',
    description: 'Konsisten sejak 1984, Djarum Foundation memberikan dorongan materiil dan non-materiil dalam bentuk pelatihan soft-skills komprehensif untuk melahirkan generasi calon pemimpin bangsa.',
    fundingAmount: 'Dana beasiswa Rp 1.000.000 / Bulan (Selama 1 Tahun)',
    registrationDeadline: '30 Mei 2024',
    requirements: [
      'Sedang menempuh pendidikan program S1 semester 4.',
      'IPK minimum 3.20 pada semester 3 dan mampu mempertahankannya.',
      'Aktif mengikuti organisasi dalam/luar kampus dibuktikan dengan SK/sertifikat.',
      'Lulus tahapan seleksi administrasi, tes potensi akademik, dan wawancara.'
    ],
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBne0B_7IsUjMi3lb2tquFjlGVQMaJ9VZZaJrr5qwxW7sPTuedUbVR_2Vy9Ap2BgBtcU5YFrVq6E46_ff-IOpJE7pgbaUMURhSTw608SGCHE6dQZ3Cd7KMHZayL3XSYQ8e9uOzV2d9eK_x_vTZ4vNPv34HG8c-MfYYcW_hXO89l23mgaRXjfT76u9dAkdNeqIHz1rj-XZ52TTv_xs6pbOdK62q9r0i7F4HQ9DqSSyh0RPrhuosMWOqD_PRrOt3CfecUaW4AG03AiJo',
    benefits: [
      'Mendapatkan beasiswa uang saku langsung bulanan selama satu tahun penuh.',
      'Pelatihan Soft Skills: Character Building, Leadership Development, Nation Building.',
      'Jaringan Community Beswan Djarum dari 90+ perguruan tinggi se-Indonesia.'
    ]
  },
  {
    id: '4',
    title: 'Beasiswa Unggulan Kemendikbud',
    type: 'pemerintah',
    provider: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    description: 'Beasiswa unggulan nasional guna membiayai studi lanjutan anak bangsa berprestasi cemerlang di berbagai jenjang perguruan tinggi negeri maupun swasta terbaik.',
    fundingAmount: 'Pembiayaan Kuliah Penuh, Tunjangan Hidup & Tunjangan Buku',
    registrationDeadline: '10 Agustus 2024',
    requirements: [
      'Memiliki prestasi tingkat nasional atau internasional dalam 3 tahun terakhir.',
      'Diterima di Universitas Pelita Bangsa pada program studi akreditasi tinggi.',
      'Mendapatkan surat rekomendasi dari akademisi, instansi resmi, atau tokoh masyarakat.',
      'Menulis essay komitmen kontribusi terhadap pembangunan bangsa Indonesia.'
    ],
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9wYPIMIc_qiYU3C-15688jeMdfVlK87B4asI0M18sz3yWNVrHMEyVxjcQJnqzvms0c63JOEXxYFASsT7VgJBvG1AhvtsBAZ4Xnh4p9DjK0RI32SDqDdy775CL9xQAflWipUD3UTEXnJPHtnAP4e5bqKQFuVZ_j_3RJmz5qAkoF5YQYmj2JHgFbyAg8aREBaRRiov1yMkI-y8RBT9bGb6ZzexoWUwQmPqe3U1qT-PgrOJKsFskLHOFiZ12JmiiDQn3LZbbGdgf02E',
    benefits: [
      'Cover biaya SPP / UKT berkala 100% sampai batas waktu masa studi normal.',
      'Tunjangan dana hidup dan riset/penelitian skripsi yang dihitung per semester.',
      'Akses jaringan komunitas alumni elite Beasiswa Unggulan di kementerian.'
    ]
  }
];

export const UKMS: UKM[] = [
  {
    id: '1',
    name: 'UKM SENI',
    category: 'Seni & Budaya',
    description: 'Unit Kegiatan Mahasiswa Seni Universitas Pelita Bangsa adalah payung besar dari kreativitas mahasiswa di bidang musik, tari tradisional/modern, seni rupa, teater, hingga standup comedy. Kami berkomitmen melestarikan nilai-nilai kebudayaan lokal sekaligus mengeksplorasi ekspresi modern secara selaras.',
    shortDescription: 'Pusat eksplorasi kreativitas tari, musik, seni peran, rupa, dan vokal mahasiswa UPB.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9djpF7T_W2a2nzD_pc1SW2EDvT4juTNUwcX-5ZgOGqrmW2ZIG-O1pgnX9GGMMzWTUudfTp8WGBXmoqGgCYwu1IjlLciAIy8UvH16ao0lKwBdd8kSadg3OLei9caW8UW8iYXAJoGxlu4uCA68J_Wv-FMww2ilmYTWA_tL1MDh2TI-7NPHxrbW8BSiGyboVVa_srQ37lUiKVFXWZ5MztXfE71mFqP_gtUE-cVy7Cl3jgwjtxwoi3ZJ2rUUSnCpXGLiHLrZJ83PfzVg',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApt2ZbfS5X7iZXy8q-4C6bJEmf0TLfJSDCFP2eUstasvtpYz-2_qVb0Zr4E2FBI9ijeOcM1DvCDNXHqFc9gtBkkDzVcu1QUwTO5oocOIngIpI8YH9pKSrHz1uDtehmjm9edUdS7OlArR3wilvqhhv-aVFjNoZKce2AnRAXpx4ayZBiELc7vizQ_I4Qc-pOkMgIrxl_KxbTasm3UCgR-7RIIIYBfhPrBK6Z-SKL-8mWZsC2tNKJjEFrlGj14l7VZDniPgtqrTgGXKg',
    vision: 'Mewujudkan UKM Seni UPB sebagai pusat kebudayaan dan pelopor inovasi seni mahasiswa yang adaptif, edukatif, dan mengharumkan nama universitas di kancah nasional.',
    mission: [
      'Menyelenggarakan pelatihan rutin terstruktur di bidang musik, vokal, tari, dan teater.',
      'Berpartisipasi aktif dalam festival-festival seni tingkat nasional maupun internasional.',
      'Menyelenggarakan kegiatan pentas apresiasi berkala serta pameran seni kampus.',
      'Membangun jejaring kolaborasi dengan komunitas kesenian luar kampus.'
    ],
    schedule: [
      { day: 'Senin & Kamis', time: '16.00 - 18.00 WIB', activity: 'Latihan Paduan Suara & Teater (Studio Seni)' },
      { day: 'Selasa & Jumat', time: '16.00 - 18.30 WIB', activity: 'Latihan Seni Tari Tradisional & Musik Modern (Lantai 3 GOR)' },
      { day: 'Rabu', time: '15.30 - 17.30 WIB', activity: 'Kreativitas Seni Rupa & Workshop Kriya (Aula Tengah)' }
    ],
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9djpF7T_W2a2nzD_pc1SW2EDvT4juTNUwcX-5ZgOGqrmW2ZIG-O1pgnX9GGMMzWTUudfTp8WGBXmoqGgCYwu1IjlLciAIy8UvH16ao0lKwBdd8kSadg3OLei9caW8UW8iYXAJoGxlu4uCA68J_Wv-FMww2ilmYTWA_tL1MDh2TI-7NPHxrbW8BSiGyboVVa_srQ37lUiKVFXWZ5MztXfE71mFqP_gtUE-cVy7Cl3jgwjtxwoi3ZJ2rUUSnCpXGLiHLrZJ83PfzVg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApt2ZbfS5X7iZXy8q-4C6bJEmf0TLfJSDCFP2eUstasvtpYz-2_qVb0Zr4E2FBI9ijeOcM1DvCDNXHqFc9gtBkkDzVcu1QUwTO5oocOIngIpI8YH9pKSrHz1uDtehmjm9edUdS7OlArR3wilvqhhv-aVFjNoZKce2AnRAXpx4ayZBiELc7vizQ_I4Qc-pOkMgIrxl_KxbTasm3UCgR-7RIIIYBfhPrBK6Z-SKL-8mWZsC2tNKJjEFrlGj14l7VZDniPgtqrTgGXKg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VbU7BR1auLTd-zHBbf8RHgQHgy3y9RiaOz-kNvJH8WLywP4FvcDxuMPYLDiRpeA4WwygaA67UJyyYFUUaYNqv-8sXVa-niBx5P1YSiuTAygWbWhin7--KSAcAoGML7brjmdoFKm2ir8hk0cWNxxIn69xQ97YDeY1NDd8o0B8WduERJD_YHyl6480L154tk1JmLswGeuFHvgTlrvwg5o1B03iZxACsO-CmQ10YNzYlMMel4_Sq3gFlY5I4P4AjhmufV5WbJuA3lU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBne0B_7IsUjMi3lb2tquFjlGVQMaJ9VZZaJrr5qwxW7sPTuedUbVR_2Vy9Ap2BgBtcU5YFrVq6E46_ff-IOpJE7pgbaUMURhSTw608SGCHE6dQZ3Cd7KMHZayL3XSYQ8e9uOzV2d9eK_x_vTZ4vNPv34HG8c-MfYYcW_hXO89l23mgaRXjfT76u9dAkdNeqIHz1rj-XZ52TTv_xs6pbOdK62q9r0i7F4HQ9DqSSyh0RPrhuosMWOqD_PRrOt3CfecUaW4AG03AiJo'
    ],
    contacts: [
      { role: 'Ketua Umum', name: 'Dewandaru Wicaksono', contact: '0812-3456-7890' },
      { role: 'Sekretaris', name: 'Almira Shani', contact: '0812-9876-5432' },
      { role: 'Humas / Sponsor', name: 'Devano Rizky', contact: '0857-4444-5555' }
    ],
    requirements: [
      'Mahasiswa aktif Universitas Pelita Bangsa angkatan berapapun.',
      'Memiliki minat dalam salah satu cabang seni (tari, vokal/musik, teater, seni rupa).',
      'Memiliki komitmen tinggi mengikuti latihan rutin dan agenda pertunjukan.',
      'Sanggup mematuhi tata tertib berorganisasi UKM Seni.'
    ],
    activeMembers: 120
  },
  {
    id: '2',
    name: 'UKM BASKET ULTRA',
    category: 'Olahraga',
    description: 'UKM Basket UPB melatih dan mengasah teknik bermain basket dasar hingga professional. Kami aktif bertanding di ajang universitas regional serta liga nasional (LIMA).',
    shortDescription: 'Latihan basket semi profesional, turnamen antar kampus dan pembinaan fisik prima.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN-pfkVy3IKWGY2iSZwKYnAnsXp_FBsHXJrzosltyBbe9eu-mEL-mJ0yX2dK6jp6Q8-jbLXJp0aQqXee_CZ4eSHYb_ubLcyl1WNo-yeR5Zrmx9uJ6v-5H_OIGecyiC-vC7VskzPhhsyRhri8sa65L3LEZgK5KlL_iIugyMS785mn40n4VnsjwGad3flH0ZFzvUjmPYuj3_z-sm6PVUs6iPZNr79ojsB6J-nDnMcI0D6z0qTfdISjYfwR-np9dIr0UzqlAxP1ZPX1A',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN-pfkVy3IKWGY2iSZwKYnAnsXp_FBsHXJrzosltyBbe9eu-mEL-mJ0yX2dK6jp6Q8-jbLXJp0aQqXee_CZ4eSHYb_ubLcyl1WNo-yeR5Zrmx9uJ6v-5H_OIGecyiC-vC7VskzPhhsyRhri8sa65L3LEZgK5KlL_iIugyMS785mn40n4VnsjwGad3flH0ZFzvUjmPYuj3_z-sm6PVUs6iPZNr79ojsB6J-nDnMcI0D6z0qTfdISjYfwR-np9dIr0UzqlAxP1ZPX1A',
    vision: 'Menjadi wadah pembinaan atlet basket mahasiswa berorientasi prestasi tinggi dan berjiwa ksatria.',
    mission: [
      'Menyelenggarakan latihan teknik dasar dan taktis berkala di lapangan utama.',
      'Mengikuti turnamen lokal, regional, hingga kancah mahasiswa nasional.'
    ],
    schedule: [
      { day: 'Selasa & Jumat', time: '18.00 - 21.00 WIB', activity: 'Latihan fisik & Taktik (GOR UPB)' }
    ],
    gallery: [],
    contacts: [
      { role: 'Kapten Tim', name: 'Andhi Gunawan', contact: '0812-1111-2222' }
    ],
    requirements: [
      'Mahasiswa aktif Universitas Pelita Bangsa.',
      'Suka olahraga basket, disiplin berolahraga dan bekerjasama dalam tim.'
    ],
    activeMembers: 75
  },
  {
    id: '3',
    name: 'PRISMA (Pusat Riset Mahasiswa)',
    category: 'Akademik',
    description: 'Pusat Riset Mahasiswa (PRISMA) menumbuhkembangkan kebiasaan riset sains ilmiah, penulisan esai ilmiah, perumusan ide teknologi, inovasi, dan kewirausahaan berbasis scientific.',
    shortDescription: 'Inkubator penulisan ilmiah, karya tulis ilmiah nasional (KTIN), dan inovasi sains.',
    coverImage: 'https://lh3.googleusercontent.com/aida/ADBb0uiak9KRFY_XUnW2cBPg7PWZ80AduIR9FsHt1mvtmWyt5SZDlB21xj9B8sD2qBahxbDWGgeTQrRPnc2C5OQTnWweTqwerdBDl8j-4WsqiqPE6m7N4dXc5DoOujrD-IjMXm2nxyJSohvbIZicIF0HxE3_Ik5NgDzZ95eDvo0RDDDid15HdFZ_8PMcaweUk6aFQli6mjZAOlkHYLTM5YlyBK2FrcVUpF-5a_gWfdRIwazJnAOH8C7_ouKRLYc',
    logoImage: 'https://lh3.googleusercontent.com/aida/ADBb0uiak9KRFY_XUnW2cBPg7PWZ80AduIR9FsHt1mvtmWyt5SZDlB21xj9B8sD2qBahxbDWGgeTQrRPnc2C5OQTnWweTqwerdBDl8j-4WsqiqPE6m7N4dXc5DoOujrD-IjMXm2nxyJSohvbIZicIF0HxE3_Ik5NgDzZ95eDvo0RDDDid15HdFZ_8PMcaweUk6aFQli6mjZAOlkHYLTM5YlyBK2FrcVUpF-5a_gWfdRIwazJnAOH8C7_ouKRLYc',
    vision: 'Menciptakan ekosistem intelektual muda berdaya saing global demi kemaslahatan masyarakat.',
    mission: [
      'Pelatihan penulisan proposal PKM (Program Kreativitas Mahasiswa).',
      'Mengirim delegasi lomba karya tulis tingkat nasional dan konferensi.'
    ],
    schedule: [
      { day: 'Sabtu', time: '10.00 - 12.00 WIB', activity: 'Kajian Ilmiah & Bedah Jurnal (Aula PRISMA)' }
    ],
    gallery: [],
    contacts: [
      { role: 'Ketua Umum', name: 'Rian Hidayat', contact: '0812-4455-6677' }
    ],
    requirements: [
      'IPK minimal 3.25',
      'Tertarik riset dan analisis data sains.'
    ],
    activeMembers: 45
  },
  {
    id: '4',
    name: 'KSR PMI (Korps Sukarela)',
    category: 'Sosial',
    description: 'Lembaga pertolongan kemanusiaan di tingkat unit universitas yang melatih kesiapsiagaan bencana, pertolongan pertama pada kecelakaan (PPPK), donor darah, dan pengabdian masyarakat.',
    shortDescription: 'Aktif menggalang kerelawanan pertolongan pertama, donor darah dan kemanusiaan.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsU-6WEAImZtD2w4O4fA8Y6GjrPYxDoafXq_HoAD6sxKYk_ASUuRSUuTAZuhkp1GViq0CmuZtlpF0499lvzRRdnetzLXrJWt5-Gfmholjjpp7T9aSSKAKjw03zUDkZ6sgBYokQd1c8UizRTOrcFUKJhsq0Bm-fp2OFTwLYSEUpBbhkfvYljYFPq3wJJQuPrjCZQMLOyJuDd4mqpLrlW4SE_6LhtXY0AMSlwBoRtdM5OVBlJnaoj_ror65nF96oiWWnKmkwVvw-hTM',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsU-6WEAImZtD2w4O4fA8Y6GjrPYxDoafXq_HoAD6sxKYk_ASUuRSUuTAZuhkp1GViq0CmuZtlpF0499lvzRRdnetzLXrJWt5-Gfmholjjpp7T9aSSKAKjw03zUDkZ6sgBYokQd1c8UizRTOrcFUKJhsq0Bm-fp2OFTwLYSEUpBbhkfvYljYFPq3wJJQuPrjCZQMLOyJuDd4mqpLrlW4SE_6LhtXY0AMSlwBoRtdM5OVBlJnaoj_ror65nF96oiWWnKmkwVvw-hTM',
    vision: 'Mewujudkan korps relawan tanggap bencana, beretika kemanusiaan, dan siap mengabdi.',
    mission: [
      'Menyelenggarakan simulasi tanggap bencana berkala.',
      'Operasional pos P3K di setiap agenda resmi kampus.'
    ],
    schedule: [
      { day: 'Rabu', time: '16.00 - 18.00 WIB', activity: 'Latihan Medis & Penyelamatan (Halaman Depan GOR)' }
    ],
    gallery: [],
    contacts: [
      { role: 'Komandan KSR', name: 'Nita Safitri', contact: '0813-2222-3333' }
    ],
    requirements: [
      'Sehat jasmani rohani',
      'Siap diturunkan saat tanggap darurat bencana.'
    ],
    activeMembers: 95
  },
  {
    id: '5',
    name: 'LDK Al-Hurriyah',
    category: 'Kerohanian',
    description: 'Lembaga Dakwah Kampus yang membidangi pembinaan karakter spiritual islami, kajian rutin khazanah keislaman, aksi sosial dhuafa, serta syiar kebaikan yang berkeseimbangan.',
    shortDescription: 'Pembinaan keagamaan islam, bakti sosial, dan dakwah moderat kampus.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VbU7BR1auLTd-zHBbf8RHgQHgy3y9RiaOz-kNvJH8WLywP4FvcDxuMPYLDiRpeA4WwygaA67UJyyYFUUaYNqv-8sXVa-niBx5P1YSiuTAygWbWhin7--KSAcAoGML7brjmdoFKm2ir8hk0cWNxxIn69xQ97YDeY1NDd8o0B8WduERJD_YHyl6480L154tk1JmLswGeuFHvgTlrvwg5o1B03iZxACsO-CmQ10YNzYlMMel4_Sq3gFlY5I4P4AjhmufV5WbJuA3lU',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VbU7BR1auLTd-zHBbf8RHgQHgy3y9RiaOz-kNvJH8WLywP4FvcDxuMPYLDiRpeA4WwygaA67UJyyYFUUaYNqv-8sXVa-niBx5P1YSiuTAygWbWhin7--KSAcAoGML7brjmdoFKm2ir8hk0cWNxxIn69xQ97YDeY1NDd8o0B8WduERJD_YHyl6480L154tk1JmLswGeuFHvgTlrvwg5o1B03iZxACsO-CmQ10YNzYlMMel4_Sq3gFlY5I4P4AjhmufV5WbJuA3lU',
    vision: 'Melahirkan intelektual muslim berkarakter agung, inklusif, dan berpikiran maju.',
    mission: [
      'Menyelenggarakan taklim mingguan santun bagi mahasiswa.',
      'Bakti sosial pembagian sembako ke panti asuhan yatim.'
    ],
    schedule: [
      { day: 'Kamis', time: '17.30 - 19.30 WIB', activity: 'Kajian Senja Hikmah & Yasinan (Masjid Kampus)' }
    ],
    gallery: [],
    contacts: [
      { role: 'Ketua Umum', name: 'Zulham Efendi', contact: '0852-5555-6666' }
    ],
    requirements: [
      'Mahasiswa muslim Universitas Pelita Bangsa S1/D3.'
    ],
    activeMembers: 150
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Juara 1 Lomba Karya Tulis Ilmiah Nasional (KTIN) 2024',
    studentName: 'Rian Hidayat & Tim',
    major: 'Teknik Informatika',
    level: 'Nasional',
    rank: 'Juara 1',
    category: 'Akademik',
    year: 2024,
    description: 'Inovasi pengembangan platform Internet of Things (IoT) berbasis Smart Grid untuk hemat energi rumah tangga pascabayar berhasil memperoleh peringkat pertama nasional di Universitas Indonesia.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDWiZdr7RMMupZWWOtu_F-EAgZ2XtpGEpF_ckrdoxlaW2WqLB3ufAubiNbZB6R-ULSyg2dke5E7PBwrn-A0AJsvZwXa6He5rOs0EtBZXewVJTFW2oL287uldZ7zhL30vPT4MmvrDwe-DlF9GpY3hUg-Swzs1qhX8JmoDWpggjjtS7woa0HiL1KACskNsVYkSRzpLCMZnk3ZrZz6irMYLO4PncX-rB1CL_TOdLISdxRUcdgktmO2Lp2bfXAuV4DFiYQw3WWb2awWAI'
  },
  {
    id: '2',
    title: 'Medali Emas Kejuaraan Atletik Mahasiswa ASEAN 2024',
    studentName: 'Ahmad Gunawan',
    major: 'Sistem Informasi',
    level: 'Internasional',
    rank: 'Medali Emas',
    category: 'Olahraga',
    year: 2024,
    description: 'Mewakili Indonesia di ajang ASEAN University Games cabang lari sprint 100m, menyumbang medali emas penting dengan catatan waktu rekor pribadi 10.35 detik.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN-pfkVy3IKWGY2iSZwKYnAnsXp_FBsHXJrzosltyBbe9eu-mEL-mJ0yX2dK6jp6Q8-jbLXJp0aQqXee_CZ4eSHYb_ubLcyl1WNo-yeR5Zrmx9uJ6v-5H_OIGecyiC-vC7VskzPhhsyRhri8sa65L3LEZgK5KlL_iIugyMS785mn40n4VnsjwGad3flH0ZFzvUjmPYuj3_z-sm6PVUs6iPZNr79ojsB6J-nDnMcI0D6z0qTfdISjYfwR-np9dIr0UzqlAxP1ZPX1A'
  },
  {
    id: '3',
    title: 'Juara Umum Festival Seni Tari Nusantara 2023',
    studentName: 'UKM Seni Tari UPB',
    major: 'Manajemen (Kolektif)',
    level: 'Regional',
    rank: 'Juara Umum',
    category: 'Seni & Budaya',
    year: 2023,
    description: 'Menampilkan harmoni Tari Ronggeng Sunda-Betawi moderen berpadu teatrikal dramatik, menyabet lima piala sekaligus termasuk Penata Tari Terbaik dan Desain Busana Terbaik.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApt2ZbfS5X7iZXy8q-4C6bJEmf0TLfJSDCFP2eUstasvtpYz-2_qVb0Zr4E2FBI9ijeOcM1DvCDNXHqFc9gtBkkDzVcu1QUwTO5oocOIngIpI8YH9pKSrHz1uDtehmjm9edUdS7OlArR3wilvqhhv-aVFjNoZKce2AnRAXpx4ayZBiELc7vizQ_I4Qc-pOkMgIrxl_KxbTasm3UCgR-7RIIIYBfhPrBK6Z-SKL-8mWZsC2tNKJjEFrlGj14l7VZDniPgtqrTgGXKg'
  },
  {
    id: '4',
    title: 'Gold Medal - International Innovation & Gadget Fair',
    studentName: 'Siti Rahma & Tim',
    major: 'Teknik Industri',
    level: 'Internasional',
    rank: 'Gold Medal',
    category: 'Akademik',
    year: 2024,
    description: 'Memperkenalkan prototipe "UltraShep" kemasan produk organik mudah urai berbasis pati rumput laut cokelat tropis dalam panel juri internasional di Tokyo, Jepang.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uiak9KRFY_XUnW2cBPg7PWZ80AduIR9FsHt1mvtmWyt5SZDlB21xj9B8sD2qBahxbDWGgeTQrRPnc2C5OQTnWweTqwerdBDl8j-4WsqiqPE6m7N4dXc5DoOujrD-IjMXm2nxyJSohvbIZicIF0HxE3_Ik5NgDzZ95eDvo0RDDDid15HdFZ_8PMcaweUk6aFQli6mjZAOlkHYLTM5YlyBK2FrcVUpF-5a_gWfdRIwazJnAOH8C7_ouKRLYc'
  }
];

export const NEWS: StudentNews[] = [
  {
    id: '1',
    title: 'UPB Meraih Kenaikan Pemeringkatan SIMKATMAWA 2024',
    summary: 'Universitas Pelita Bangsa menembus posisi klaster utama nasional dalam rilis resmi penilaian prestasi kegiatan kemahasiswaan Kemendikbudristek RI.',
    description: 'Prestasi gemilang diraih oleh Universitas Pelita Bangsa (UPB) yang berhasil mencetak lompatan luar biasa dalam Pemeringkatan Manajemen Kemahasiswaan (SIMKATMAWA) tahun 2024. Peringkat ini dihitung berdasarkan keaktifan organisasi, capaian prestasi mahasiswa mandiri maupun kementerian, serta ketaatan administrasi kepengurusan kemahasiswaan. Peningkatan kelas ini membuktikan bahwa Direktorat Kemahasiswaan telah memberi iklim suportif bagi seluruh mahasiswa untuk berkembang positif berkarya nyata.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpqazPVbPBtcdNokRE_Io84mKJQ3xncyQFaN3_G-JRJBPpYpkpw4Ke88XqA9F5vMxhGP8Rb2VnS6iDdYuKyYJw1Gx1ucEDRMS8mP3FGHD-1vFfzFbYeVrAunKEmnZ-xJZDVEmO6SboNXl4U1ky_cMWdHh57MGLpStlZT-q6bdnqA9xdBrRS902Lht7UH6kIw_VxirWxPEzAP8ubKQpbGDpD9p-YF4tEbIA-QkyBZCJzFyeDcBsZaQV9ChCTiujAQcdK_7Wd8JD6K4',
    date: '18 Mei 2024',
    category: 'Berita'
  },
  {
    id: '2',
    title: 'Kegiatan Pembinaan Komsos Cegah Tangkal Radikalisme',
    summary: 'Komunikasi Sosial (Komsos) bertema penanaman nilai Pancasila dan cegah-tangkal pengaruh radikalisme di lingkungan perguruan tinggi.',
    description: 'Direktorat Kemahasiswaan & Hubungan Alumni UPB menyelenggarakan kuliah umum interaktif bekerjasama Komando Kewilayahan Militer setempat. Diikuti perwakilan seluruh pengurus ormawa dan UKM, kegiatan ini bertujuan membendung penetrasi radikalisme ekstrem dengan merevitalisasi pemahaman butir-butir ketahanan ideologi Pancasila serta kesantunan toleransi bersosial media.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsU-6WEAImZtD2w4O4fA8Y6GjrPYxDoafXq_HoAD6sxKYk_ASUuRSUuTAZuhkp1GViq0CmuZtlpF0499lvzRRdnetzLXrJWt5-Gfmholjjpp7T9aSSKAKjw03zUDkZ6sgBYokQd1c8UizRTOrcFUKJhsq0Bm-fp2OFTwLYSEUpBbhkfvYljYFPq3wJJQuPrjCZQMLOyJuDd4mqpLrlW4SE_6LhtXY0AMSlwBoRtdM5OVBlJnaoj_ror65nF96oiWWnKmkwVvw-hTM',
    date: '10 Mei 2024',
    category: 'Agenda'
  },
  {
    id: '3',
    title: 'Sosialisasi Revitalisasi Manajemen & Prasarana Ormawa',
    summary: 'Langkah strategis Direktorat Kemahasiswaan memperbarui regulasi sistem pelaporan kegiatan serta standarisasi prasarana ormawa UPB.',
    description: 'Guna menyelaraskan langkah ormawa dengan adaptasi sistem SIMKATMAWA modern, Direktorat Kemahasiswaan mengadakan sesi dialog tatap muka sosialisasi pedoman operasional baru. Disinggung pula revitalisasi pendanaan, hibah inventaris ormawa, serta tata berkas digital pertanggungjawaban hibah keuangan agar tidak mengganggu fokus mahasiswa berprestasi.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf5BU2LLZpct60_2qMHCTmMBJcr_nkaaEqE4NfmdwgXa2_T39DFqVR4UTXgcdZ-PE8NrxMwy5kJAZ0G3oj4itAiykiqXXuKZfJ2wCGhcaNlncWR1uUbrHTs6dp7amqGYTK4BMuUQgkjslrhteuuXM0HeMNU8Kk8qqGm3APZBwJD6Yw_0XBg0QsGfGyrW3JcENrwfcNNT_LpgVR0HGNeL0MHe_PElmJE8nPMF_uV0Rv_TbXpOzlpYJf17pmsJoy9DDG06xGVoewxkc',
    date: '05 Mei 2024',
    category: 'Pengumuman'
  },
  {
    id: '4',
    title: 'Pelantikan Presidium Pengurus BEM & DPM Periode Baru',
    summary: 'Rektor secara resmi melantik jajaran fungsionaris ormawa pusat untuk mempercepat akselerasi program kemahasiswaan terpadu.',
    description: 'Bertempat di Auditorium Utama, prosesi sakral sumpah pelantikan pengurus BEM dan DPM UPB masa bakti 2024/2025 telah tuntas dilaksanakan. Rektor memotivasi pengurus terpilih untuk melahirkan gagasan advokasi progresif, merangkul dialog asertif, dan menjunjung keharmonisan kolaborasi lintas UKM.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VbU7BR1auLTd-zHBbf8RHgQHgy3y9RiaOz-kNvJH8WLywP4FvcDxuMPYLDiRpeA4WwygaA67UJyyYFUUaYNqv-8sXVa-niBx5P1YSiuTAygWbWhin7--KSAcAoGML7brjmdoFKm2ir8hk0cWNxxIn69xQ97YDeY1NDd8o0B8WduERJD_YHyl6480L154tk1JmLswGeuFHvgTlrvwg5o1B03iZxACsO-CmQ10YNzYlMMel4_Sq3gFlY5I4P4AjhmufV5WbJuA3lU',
    date: '01 Mei 2024',
    category: 'Berita'
  }
];

export const INITIAL_ALUMNI: AlumniRecord[] = [
  { id: '1', name: 'Dewi Lestari', graduationYear: 2022, major: 'Teknik Informatika', status: 'Bekerja', company: 'PT GoTo Indonesia', position: 'Software Engineer' },
  { id: '2', name: 'Adit Pratama', graduationYear: 2021, major: 'Sistem Informasi', status: 'Bekerja', company: 'BCA Digital', position: 'Data Analyst' },
  { id: '3', name: 'Zahra Amalia', graduationYear: 2023, major: 'Manajemen', status: 'Wirausaha', company: 'Kopi Kenangan Baru (Franchise)', position: 'Founder / Owner' },
  { id: '4', name: 'Irfan Fauzi', graduationYear: 2022, major: 'Teknik Industri', status: 'Lanjut Studi', company: 'Bandung Institute of Technology', position: 'S2 Magister Teknik Logistik' },
  { id: '5', name: 'Hendra Wijaya', graduationYear: 2021, major: 'Teknik Informatika', status: 'Bekerja', company: 'PT Telkom Indonesia', position: 'DevOps Specialist' },
  { id: '6', name: 'Siti Rahayu', graduationYear: 2023, major: 'Akuntansi', status: 'Bekerja', company: 'PwC Indonesia', position: 'Junior Auditor' },
  { id: '7', name: 'Rahmat Hidayat', graduationYear: 2020, major: 'Teknik Informatika', status: 'Bekerja', company: 'Shopee Singapore', position: 'Senior Backend Dev' },
  { id: '8', name: 'Sarah Amanda', graduationYear: 2022, major: 'Manajemen', status: 'Bekerja', company: 'Unilever Indonesia', position: 'Brand Manager' },
  { id: '9', name: 'Bimo Wicaksono', graduationYear: 2020, major: 'Sistem Informasi', status: 'Wirausaha', company: 'Digital Agency Solusindo', position: 'Managing Director' },
  { id: '10', name: 'Lani Triana', graduationYear: 2023, major: 'Teknik Industri', status: 'Mencari Kerja', company: '-', position: 'Job Seeker (Fresh Graduate)' }
];
