import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'administrator' | 'mahasiswa' | 'alumni';
  nim?: string;
  avatarUrl?: string;
}

export const AuthService = {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'No user data returned' };
      }

      // Fetch user profile from public.users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, email, name, role, phone, avatar_url')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        // If no profile exists, create a basic one from auth metadata
        const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
        const userRole = data.user.user_metadata?.role || 'mahasiswa';

        return {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: userName,
            role: userRole as AuthUser['role'],
            nim: data.user.user_metadata?.nim,
            avatarUrl: data.user.user_metadata?.avatar_url,
          },
          error: null,
        };
      }

      return {
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as AuthUser['role'],
          nim: undefined, // Will be in mahasiswa_profiles or alumni_profiles
          avatarUrl: profile.avatar_url || undefined,
        },
        error: null,
      };
    } catch (e: any) {
      return { user: null, error: e.message || 'Authentication failed' };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  /**
   * Get current session user
   */
  async getSession(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        return null;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('id, email, name, role, phone, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        return {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          role: session.user.user_metadata?.role || 'mahasiswa',
        };
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as AuthUser['role'],
        avatarUrl: profile.avatar_url || undefined,
      };
    } catch {
      return null;
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch profile on sign in
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, name, role, phone, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          callback({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role as AuthUser['role'],
            avatarUrl: profile.avatar_url || undefined,
          });
        } else {
          callback({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: session.user.user_metadata?.role || 'mahasiswa',
          });
        }
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },

  /**
   * Get student profile (NIM, major, etc.)
   */
  async getMahasiswaProfile(userId: string): Promise<{ nim: string; major: string; faculty?: string; semester?: number } | null> {
    const { data, error } = await supabase
      .from('mahasiswa_profiles')
      .select('nim, major, faculty, semester')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      nim: data.nim,
      major: data.major || '',
      faculty: data.faculty || undefined,
      semester: data.semester || undefined,
    };
  },

  /**
   * Get alumni profile
   */
  async getAlumniProfile(userId: string): Promise<{ nim: string; graduationYear: number; major: string; company?: string; position?: string } | null> {
    const { data, error } = await supabase
      .from('alumni_profiles')
      .select('nim, graduation_year, major, company, position')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      nim: data.nim,
      graduationYear: data.graduation_year,
      major: data.major || '',
      company: data.company || undefined,
      position: data.position || undefined,
    };
  },
};