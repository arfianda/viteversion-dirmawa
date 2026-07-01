export interface UserSession {
  id: string;
  username: string;
  role: 'mahasiswa' | 'admin';
  name: string;
  nimOrNip?: string;
  avatarUrl?: string;
  email?: string;
  major?: string;
  semester?: number;
}

export interface UKM {
  id: string;
  name: string;
  logo_url?: string;
  status: 'active' | 'inactive';
}

export interface Beasiswa {
  id: string;
  name: string;
  status: 'active' | 'inactive';
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
