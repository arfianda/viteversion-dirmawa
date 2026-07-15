import { supabase } from './supabaseClient';
import { UserRole, User } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'administrator' | 'superadmin' | 'admin' | 'mahasiswa' | 'alumni' | 'admin_ormawa' | 'direktur' | 'staf_beasiswa' | 'staf_ormawa' | 'staf_alumni' | 'staf_depan';
  roles?: string[];
  isApproved?: boolean;
  nim?: string;
  avatarUrl?: string;
  major?: string;
  semester?: number;
}

export const AuthService = {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const resolvedEmail = email.includes('@') ? email : `${email.trim()}@upb.ac.id`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
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
        .select('id, email, name, role, roles, is_approved, phone, avatar_url')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        // If no profile exists, create a basic one from auth metadata
        const userName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
        const userRole = data.user.user_metadata?.role || 'mahasiswa';
        const userRoles = data.user.user_metadata?.roles || [userRole];

        return {
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: userName,
            role: userRole as AuthUser['role'],
            roles: userRoles,
            isApproved: false,
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
          roles: profile.roles || [profile.role],
          isApproved: profile.is_approved,
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
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("AuthService.signOut: Supabase API signout failed:", e);
    }
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
        .select('id, email, name, role, roles, is_approved, phone, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        return {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          role: session.user.user_metadata?.role || 'mahasiswa',
          roles: session.user.user_metadata?.roles || [session.user.user_metadata?.role || 'mahasiswa'],
          isApproved: false,
          nim: session.user.user_metadata?.nim,
        };
      }

      // Fetch NIM details
      let nim: string | undefined = undefined;
      let major: string | undefined = undefined;
      let semester: number | undefined = undefined;
      if (profile.role === 'mahasiswa') {
        const { data: mhs } = await supabase
          .from('mahasiswa_profiles')
          .select('nim, major, semester')
          .eq('user_id', profile.id)
          .single();
        if (mhs) {
          nim = mhs.nim;
          major = mhs.major;
          semester = mhs.semester;
        }
      } else if (profile.role === 'alumni') {
        const { data: alu } = await supabase
          .from('alumni_profiles')
          .select('nim')
          .eq('user_id', profile.id)
          .single();
        if (alu) {
          nim = alu.nim;
        }
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as AuthUser['role'],
        roles: profile.roles || [profile.role],
        isApproved: profile.is_approved,
        avatarUrl: profile.avatar_url || undefined,
        nim: nim,
        major: major,
        semester: semester,
      };
    } catch (e) {
      console.error('Error fetching auth session:', e);
      return null;
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change in AuthService:', event, session?.user?.email);

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
        // Fetch profile on sign in or token refresh
        const { data: profile } = await supabase
          .from('users')
          .select('id, email, name, role, roles, is_approved, phone, avatar_url')
          .eq('id', session.user.id)
          .single();

        let nim: string | undefined = undefined;
        let major: string | undefined = undefined;
        let semester: number | undefined = undefined;
        if (profile) {
          if (profile.role === 'mahasiswa') {
            const { data: mhs } = await supabase
              .from('mahasiswa_profiles')
              .select('nim, major, semester')
              .eq('user_id', profile.id)
              .single();
            if (mhs) {
              nim = mhs.nim;
              major = mhs.major;
              semester = mhs.semester;
            }
          } else if (profile.role === 'alumni') {
            const { data: alu } = await supabase
              .from('alumni_profiles')
              .select('nim')
              .eq('user_id', profile.id)
              .single();
            if (alu) {
              nim = alu.nim;
            }
          }

          callback({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role as AuthUser['role'],
            roles: profile.roles || [profile.role],
            isApproved: profile.is_approved,
            avatarUrl: profile.avatar_url || undefined,
            nim: nim,
            major: major,
            semester: semester,
          });
        } else {
          callback({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'User',
            role: session.user.user_metadata?.role || 'mahasiswa',
            roles: session.user.user_metadata?.roles || [session.user.user_metadata?.role || 'mahasiswa'],
            isApproved: false,
            nim: session.user.user_metadata?.nim,
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

    const roleHierarchy: Record<string, number> = {
      operator: 1,
      admin: 2,
      superadmin: 3,
    };

    return (roleHierarchy[role] || 0) >= (roleHierarchy[requiredRole] || 0);
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
   * Update user roles array (superadmin only)
   */
  async updateUserRoles(targetUserId: string, newRoles: UserRole[], currentUserId: string): Promise<{ success: boolean; error?: string }> {
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return { success: false, error: 'Only superadmin can change roles' };
    }

    const primaryRole = newRoles.length > 0 ? newRoles[0] : 'operator';
    const { error } = await supabase
      .from('users')
      .update({
        roles: newRoles,
        role: primaryRole,
        updated_at: new Date().toISOString()
      })
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
      .select('id, email, name, role, roles, created_at, updated_at')
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