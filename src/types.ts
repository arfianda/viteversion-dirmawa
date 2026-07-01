/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Scholarship {
  id: string;
  title: string;
  type: 'internal' | 'pemerintah' | 'swasta';
  provider: string;
  description: string;
  fundingAmount: string;
  registrationDeadline: string;
  requirements: string[];
  bannerImage: string;
  benefits: string[];
}

export interface UKM {
  id: string;
  name: string;
  category: 'Seni & Budaya' | 'Olahraga' | 'Akademik' | 'Sosial' | 'Kerohanian' | 'Minat Khusus';
  description: string;
  shortDescription: string;
  coverImage: string;
  logoImage: string;
  vision: string;
  mission: string[];
  schedule: { day: string; time: string; activity: string }[];
  gallery: string[];
  contacts: { role: string; name: string; contact: string }[];
  requirements: string[];
  activeMembers: number;
  instagramUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  studentName: string;
  major: string;
  level: 'Nasional' | 'Internasional' | 'Regional';
  rank: string;
  category: 'Akademik' | 'Seni & Budaya' | 'Olahraga' | 'Sosial & Kemanusiaan';
  year: number;
  description: string;
  image: string;
}

export interface AlumniRecord {
  id: string;
  name: string;
  graduationYear: number;
  major: string;
  status: 'Bekerja' | 'Wirausaha' | 'Lanjut Studi' | 'Mencari Kerja';
  company: string;
  position: string;
}

export interface StudentNews {
  id: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  date: string;
  category: 'Berita' | 'Agenda' | 'Pengumuman';
}

export type UserRole = 'superadmin' | 'admin' | 'operator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScholarshipApplication {
  id: string;
  user_id: string;
  scholarship_id: string;
  nim: string;
  name: string;
  major: string;
  gpa: number;
  phone: string;
  document_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  scholarships?: Scholarship;
}

