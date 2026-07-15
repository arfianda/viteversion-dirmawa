import { createClient, SupportedStorage } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env file.');
}

const getSuffix = () => {
  const hash = window.location.hash || '';
  if (hash.includes('/admin')) return '_admin';
  if (hash.includes('/ormawa')) return '_ormawa';
  return '_mahasiswa';
};

const portalStorage: SupportedStorage = {
  getItem: (key: string) => {
    return localStorage.getItem(key + getSuffix());
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key + getSuffix(), value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key + getSuffix());
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: portalStorage
  }
});
