export interface UserSession {
  id: string;
  username: string;
  role: 'mahasiswa' | 'admin' | 'superadmin';
  roles?: string[];
  name: string;
  nimOrNip?: string;
  avatarUrl?: string;
}

export interface AlumniRecord {
  id: string;
  name: string;
  nim: string;
  prodi: string;
  graduationYear: number;
  status: 'Valid' | 'Invalid NIM';
  email?: string;
  employmentStatus?: 'Bekerja' | 'Wirausaha' | 'Melanjutkan Studi' | 'Belum Bekerja';
  company?: string;
  position?: string;
}

export interface UkmRecord {
  id: string;
  name: string;
  category: string;
  type: string; // e.g. "Academic & Tech", "Sports & Recreation", "Arts & Culture"
  status: 'Active' | 'Inactive';
  logoUrl?: string;
  coverUrl?: string;
  updatedAt: string;
  description: string;
  leaderName?: string;
  instagramUrl?: string;
}

export interface ScholarshipRecord {
  id: string;
  name: string;
  provider: string;
  deadline: string;
  applicants: number;
  status: 'Open' | 'Soon' | 'Closed';
  type: 'Internal' | 'External' | 'Government';
  description: string;
  category: string; // e.g., "Internal University", "External Corporate", "Government"
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  status: 'Draft' | 'Published' | 'Archived';
  visibility: 'Public' | 'Students Only' | 'Alumni Only';
  publishDate: string;
  category: string;
  tags: string[];
  coverImageUrl?: string;
  wordCount?: number;
}

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Editor';
  roles?: string[];
  lastActive: string;
  avatarInitials: string;
}

export interface RegistrationRequest {
  id: string;
  nim: string;
  name: string;
  email: string;
  major: string;
  faculty: string;
  semester: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
}
