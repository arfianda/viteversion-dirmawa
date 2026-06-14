export interface UserSession {
  username: string;
  role: 'mahasiswa' | 'admin' | 'superadmin';
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
}

export interface UkmRecord {
  id: string;
  name: string;
  category: string;
  type: string; // e.g. "Academic & Tech", "Sports & Recreation", "Arts & Culture"
  status: 'Active' | 'Inactive';
  logoUrl?: string;
  updatedAt: string;
  description: string;
  leaderName?: string;
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
  lastActive: string;
  avatarInitials: string;
}
