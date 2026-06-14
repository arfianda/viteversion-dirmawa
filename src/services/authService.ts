import { supabase } from './supabaseClient';
import { UserRole, User } from '../types';

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

  /**
   * Get current user's role from database
   */
  async getUserRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.role as UserRole;
  },

  /**
   * Check if user is admin or superadmin
   */
  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'admin' || role === 'superadmin';
  },

  /**
   * Check if user is superadmin
   */
  async isSuperadmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'superadmin';
  },

  /**
   * Check if user can access action based on role
   */
  async canAccess(userId: string, requiredRole: UserRole): Promise<boolean> {
    const role = await this.getUserRole(userId);
    if (!role) return false;

    const roleHierarchy: Record<UserRole, number> = {
      operator: 1,
      admin: 2,
      superadmin: 3,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  },

  /**
   * Update user role (superadmin only)
   */
  async updateUserRole(targetUserId: string, newRole: UserRole, currentUserId: string): Promise<{ success: boolean; error?: string }> {
    // Verify current user is superadmin
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return { success: false, error: 'Only superadmin can change roles' };
    }

    const { error } = await supabase
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  /**
   * Get all users (superadmin only)
   */
  async getAllUsers(currentUserId: string): Promise<User[] | null> {
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }

    return data as unknown as User[];
  },

  /**
   * Add new user (superadmin only)
   */
  async addUser(
    currentUserId: string,
    userData: { email: string; name: string; role: UserRole }
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return { success: false, error: 'Only superadmin can add users' };
    }

    // Note: This requires Supabase Admin API for creating auth users
    // For now, we'll use an Edge Function approach or RPC
    const { data, error } = await supabase.rpc('create_user_with_role', {
      p_email: userData.email,
      p_name: userData.name,
      p_role: userData.role,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data as unknown as User,
    };
  },

  /**
   * Delete user (superadmin only)
   */
  async deleteUser(
    targetUserId: string,
    currentUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return { success: false, error: 'Only superadmin can delete users' };
    }

    // Protect against self-deletion
    if (targetUserId === currentUserId) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    // Delete from users table (auth user should be handled separately via Admin API or trigger)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  /**
   * Update user role (superadmin only) - extended version
   */
  async updateUserRoleWithEmail(
    targetUserId: string,
    newRole: UserRole,
    currentUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return { success: false, error: 'Only superadmin can change roles' };
    }

    const { error } = await supabase
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },
};