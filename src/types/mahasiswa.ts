export interface UserSession {
  username: string;
  role: 'mahasiswa' | 'admin';
  name: string;
  nimOrNip?: string;
  avatarUrl?: string;
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