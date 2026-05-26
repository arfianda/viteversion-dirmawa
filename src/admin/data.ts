import { AlumniRecord, UkmRecord, ScholarshipRecord, NewsArticle, AdminRecord } from './types';

export const INITIAL_ALUMNI: AlumniRecord[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    nim: '1122334455',
    prodi: 'Teknik Informatika',
    graduationYear: 2023,
    status: 'Valid',
    email: 'budi.santoso@alumni.pelitabangsa.ac.id',
  },
  {
    id: '2',
    name: 'Siti Aminah',
    nim: '1122334456',
    prodi: 'Sistem Informasi',
    graduationYear: 2023,
    status: 'Valid',
    email: 'siti.aminah@alumni.pelitabangsa.ac.id',
  },
  {
    id: '3',
    name: 'Andi Wijaya',
    nim: '11223344', // Too short (NIM typical check: 10 chars)
    prodi: 'Manajemen',
    graduationYear: 2022,
    status: 'Invalid NIM',
    email: 'andi.wijaya@alumni.pelitabangsa.ac.id',
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    nim: '1122334458',
    prodi: 'Akuntansi',
    graduationYear: 2021,
    status: 'Valid',
    email: 'dewi.lestari@alumni.pelitabangsa.ac.id',
  },
  {
    id: '5',
    name: 'Reza Rahardian',
    nim: '1122334459',
    prodi: 'Teknik Sipil',
    graduationYear: 2023,
    status: 'Valid',
    email: 'reza.rahardian@alumni.pelitabangsa.ac.id',
  },
  {
    id: '6',
    name: 'Anisa Bahar',
    nim: '1122334460',
    prodi: 'Teknik Industri',
    graduationYear: 2022,
    status: 'Valid',
    email: 'anisa.bahar@alumni.pelitabangsa.ac.id',
  },
  {
    id: '7',
    name: 'Hendra Wijaya',
    nim: '0098762', // Error NIM
    prodi: 'Manajemen',
    graduationYear: 2023,
    status: 'Invalid NIM',
    email: 'hendra.wijaya@alumni.pelitabangsa.ac.id',
  }
];

export const INITIAL_UKMS: UkmRecord[] = [
  {
    id: '1',
    name: 'Computer Science Club',
    category: 'Academic',
    type: 'Academic & Tech',
    status: 'Active',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-v9_LDM8eZKn-_xzycrpBiJnqQIcQmFl_2K4z3chFIjxlP60nIuc38cKx40Q97aVT35B2atleFyFYbZnKzr_wsFrwemlZyOO6k_ftyLJD30iQaCqOyuNaMufKNSY_2O4AiKZ6K647Z5lr3iMtmCKtepS0brVN-F3WM5yLSOMjuhYASIfvyKPy-4a2afSUq_j6A-4bimd_tzkD6t3h8ysVr9L9QnCT7V_GimqO1x2NzldDWelaEwOeGcd_K277EPyrtYYHdilZvIs',
    updatedAt: 'Oct 24, 2023',
    description: 'A place for students to learn programming, cyber security, mobile app development, and participate in hackathons.',
    leaderName: 'Aris Maulana',
  },
  {
    id: '2',
    name: 'Varsity E-Sports',
    category: 'Sports',
    type: 'Sports & Recreation',
    status: 'Active',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKm5znh_KB_mBV_IKSCdEaYJ1mOsq4eYtwWfbAm-UHEDRznPRdsNKTjpeI6Gl74m-9RUOLeU_3_WXC49JqK4ByqVrfWohIWI2vPUJGS42hnVyb-3X-QCD59AlgJEbXn7LtZGn4iXMiJSApSAu7jmp4VzK1w6rz1J8T4T3E8RKZQkk7k9riFbFjx8_LI7dAuLyXxO10MRm0ZLEchNNrRTSzCj5WtRqVshssD5toBZpaocgbUoboPus9aPe8PzMQmD9xxo3q-1gvv9I',
    updatedAt: 'Oct 20, 2023',
    description: 'Promoting healthy competitive gaming and representing Universitas Pelita Bangsa in national inter-varsity tournaments.',
    leaderName: 'Doni Christian',
  },
  {
    id: '3',
    name: 'Photography Society',
    category: 'Arts & Culture',
    type: 'Arts & Culture',
    status: 'Inactive',
    updatedAt: 'Jan 15, 2023',
    description: 'Capturing moments of life, learning camera mechanics, lighting setups, and organizing internal campus exhibitions.',
    leaderName: 'Saskia Putri',
  },
  {
    id: '4',
    name: 'UPB English Club',
    category: 'Academic',
    type: 'Academic & Language',
    status: 'Active',
    updatedAt: 'Nov 12, 2023',
    description: 'Practicing English speech, debate, spelling bees, and academic writing simulations to build self-confidence in global communication.',
    leaderName: 'Clara Bella',
  },
  {
    id: '5',
    name: 'Badminton Club',
    category: 'Sports',
    type: 'Sports & Athletics',
    status: 'Active',
    updatedAt: 'Dec 01, 2023',
    description: 'Providing professional training drills and hosting local tournaments for students interested in competitive badminton.',
    leaderName: 'Taufik Hidayatullah',
  }
];

export const INITIAL_SCHOLARSHIPS: ScholarshipRecord[] = [
  {
    id: '1',
    name: 'Beasiswa Prestasi Akademik 2024',
    provider: 'Dir. Kemahasiswaan',
    deadline: '2024-10-15',
    applicants: 1245,
    status: 'Open',
    type: 'Internal',
    description: 'Full/partial tuition coverage for outstanding students maintaining a cumulative GPA above 3.75.',
    category: 'Internal University',
  },
  {
    id: '2',
    name: 'Djarum Foundation Plus',
    provider: 'Djarum Foundation',
    deadline: '2024-11-01',
    applicants: 890,
    status: 'Soon',
    type: 'External',
    description: 'Leadership training, monthly stipends, and networking opportunities funded by key external corporate partners.',
    category: 'External Corporate',
  },
  {
    id: '3',
    name: 'KIP Kuliah Merdeka',
    provider: 'Kemdikbudristek',
    deadline: '2024-08-30',
    applicants: 3450,
    status: 'Closed',
    type: 'Government',
    description: 'Government assistance program for underprivileged college students providing full tuition waiver and living stipends.',
    category: 'Government',
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Universitas Pelita Bangsa Launches New Tech Incubator',
    content: `<p>Universitas Pelita Bangsa is proud to announce the launch of its new Technology Innovation Incubator, aimed at supporting student-led startups and research initiatives. The state-of-the-art facility, located in the newly renovated East Wing, will provide resources, mentorship, and funding opportunities for aspiring entrepreneurs.</p>
<p>"This initiative represents a significant step forward in our commitment to fostering practical innovation," said Dr. Budi Santoso, Director of Student Affairs. "We want to equip our students not just with theoretical knowledge, but with the tools to build real-world solutions."</p>
<h3>Key Features of the Incubator</h3>
<ul>
<li>24/7 access to collaborative workspaces and high-performance computing clusters.</li>
<li>Direct mentorship from industry professionals and successful alumni.</li>
<li>Seed funding grants up to IDR 50,000,000 for qualifying projects.</li>
</ul>`,
    status: 'Draft',
    visibility: 'Public',
    publishDate: '2026-05-26',
    category: 'News',
    tags: ['Technology', 'Innovation'],
  },
  {
    id: '2',
    title: 'National Debate Championship Winners',
    content: '<p>The parliamentary debate team of Universitas Pelita Bangsa won gold medal in the prestigious National Debate Championship with outstanding performances by students.</p>',
    status: 'Published',
    visibility: 'Public',
    publishDate: '2026-05-25',
    category: 'Achievement',
    tags: ['Debate', 'Gold Medal', 'Students'],
  },
  {
    id: '3',
    title: 'UKM Futsal Tournament Registration',
    content: '<p>Registration is now open for the annual internal campus futsal cup. Team submissions must be completed before next Friday.</p>',
    status: 'Published',
    visibility: 'Students Only',
    publishDate: '2023-10-24',
    category: 'News',
    tags: ['Futsal', 'Sports', 'Event'],
  },
  {
    id: '4',
    title: 'Alumni Gathering Event 2023',
    content: '<p>Our annual alumni grand gathering celebrating the 15th anniversary of Universitas Pelita Bangsa was held successfully in ballroom C.</p>',
    status: 'Archived',
    visibility: 'Alumni Only',
    publishDate: '2023-10-20',
    category: 'Alumni',
    tags: ['Alumni', 'Gathering', 'Community'],
  }
];

export const INITIAL_ADMINS: AdminRecord[] = [
  {
    id: '1',
    name: 'Dr. ABCD',
    email: 'abcd@upb.ac.id',
    role: 'Super Admin',
    lastActive: 'Just now',
    avatarInitials: 'DR',
  },
  {
    id: '2',
    name: 'EFGH, M.Kom',
    email: 'EFGH@upb.ac.id',
    role: 'Admin',
    lastActive: '2 hours ago',
    avatarInitials: 'EF',
  },
  {
    id: '3',
    name: 'ASDF',
    email: 'ASDF@upb.ac.id',
    role: 'Editor',
    lastActive: 'Yesterday, 14:30',
    avatarInitials: 'AS',
  }
];
