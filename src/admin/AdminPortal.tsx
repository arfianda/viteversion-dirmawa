import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  Users,
  Award,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  Bell,
  HelpCircle,
  Menu,
  CheckCircle,
  MessageSquare,
  User,
  Camera,
  Upload,
  UserPlus,
  ExternalLink,
  X,
  Trash2,
  ClipboardList
} from 'lucide-react';

import { UserSession, AlumniRecord, UkmRecord, ScholarshipRecord, NewsArticle, AdminRecord } from './types';
import { INITIAL_ALUMNI, INITIAL_UKMS, INITIAL_SCHOLARSHIPS, INITIAL_NEWS, INITIAL_ADMINS } from './data';
import { SupabaseService } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';
import { AuthService } from '../services/authService';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

import LoginView from './components/LoginView';
import DashboardOverview from './components/DashboardOverview';
import AlumniManagement from './components/AlumniManagement';
import UkmDirectory from './components/UkmDirectory';
import ScholarshipsManagement from './components/ScholarshipsManagement';
import NewsEditor from './components/NewsEditor';
import AdminManagement from './components/AdminManagement';
import RegistrationQueue from './components/RegistrationQueue';
import OrmawaApplicationsQueue from './components/OrmawaApplicationsQueue';
import OrmawaProposalsQueue from './components/OrmawaProposalsQueue';
import ScholarshipApplicationsQueue from './components/ScholarshipApplicationsQueue';
import MemberReportsQueue from './components/MemberReportsQueue';
import AppointmentScheduler from './components/AppointmentScheduler';
import { Calendar } from 'lucide-react';

export default function AdminPortal() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('upb_affairs_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('upb_affairs_session');
      }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchGlobalQuery, setSearchGlobalQuery] = useState('');

  // Notifications dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  // Profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Profile editing states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState([
    { id: '1', text: 'New Alumni upload spreadsheet parsed successfully.', unread: true },
    { id: '2', text: 'Critical scholarship "Beasiswa Prestasi Akademik" closes soon!', unread: true },
    { id: '3', text: 'System-wide SIA database sync triggered successfully.', unread: false }
  ]);

  // Main interactive state tables
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);
  const [ukms, setUkms] = useState<UkmRecord[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [newStudentsCount, setNewStudentsCount] = useState<number>(0);
  const [pendingRegistrationsCount, setPendingRegistrationsCount] = useState<number>(0);
  const [pendingMemberReportsCount, setPendingMemberReportsCount] = useState<number>(0);
  const [pendingScholarshipAppsCount, setPendingScholarshipAppsCount] = useState<number>(0);
  const [pendingOrmawaAppsCount, setPendingOrmawaAppsCount] = useState<number>(0);
  const [pendingOrmawaPropsCount, setPendingOrmawaPropsCount] = useState<number>(0);
  const [pendingAdminsCount, setPendingAdminsCount] = useState<number>(0);
  const [alumniCount, setAlumniCount] = useState<number>(0);
  const [verifiedAlumniCount, setVerifiedAlumniCount] = useState<number>(0);
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean>(false);
  
  // News Editor helper
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Load data from Supabase
  const loadDbData = async () => {
    try {
      const [
        dbNews,
        dbUkms,
        dbScholarships,
        dbAlumni,
        dbStudentsCount,
        dbNewStudentsCount,
        dbPendingRegistrations,
        dbAlumniStats,
        mrCountRes,
        saCountRes,
        oaCountRes,
        propCountRes,
        lpjCountRes,
        adminCountRes
      ] = await Promise.all([
        SupabaseService.getAdminNewsArticles(),
        SupabaseService.getAdminUkmRecords(),
        SupabaseService.getAdminScholarshipRecords(),
        SupabaseService.getAdminAlumniRecords(),
        SupabaseService.getStudentsCount(),
        SupabaseService.getNewStudentsCountThisMonth(),
        SupabaseService.getPendingRegistrationsCount(),
        SupabaseService.getAlumniStats(),
        supabase.from('member_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('scholarship_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ormawa_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ormawa_proposals').select('id', { count: 'exact', head: true }).not('status', 'eq', 'completed').not('status', 'eq', 'rejected'),
        supabase.from('ormawa_lpjs').select('id', { count: 'exact', head: true }).not('status', 'eq', 'completed').not('status', 'eq', 'rejected'),
        supabase.from('users')
          .select('id', { count: 'exact', head: true })
          .eq('is_approved', false)
          .in('role', ['superadmin', 'admin', 'administrator', 'operator', 'direktur', 'staf_beasiswa', 'staf_ormawa', 'staf_alumni', 'staf_depan'])
      ]);
      setNews(dbNews);
      setUkms(dbUkms);
      setScholarships(dbScholarships);
      setAlumni(dbAlumni);
      setStudentsCount(dbStudentsCount);
      setNewStudentsCount(dbNewStudentsCount);
      setPendingRegistrationsCount(dbPendingRegistrations);
      setAlumniCount(dbAlumniStats.total);
      setVerifiedAlumniCount(dbAlumniStats.verified);

      setPendingMemberReportsCount(mrCountRes.count || 0);
      setPendingScholarshipAppsCount(saCountRes.count || 0);
      setPendingOrmawaAppsCount(oaCountRes.count || 0);
      setPendingOrmawaPropsCount((propCountRes.count || 0) + (lpjCountRes.count || 0));
      setPendingAdminsCount(adminCountRes.count || 0);

      // Load administrators list from Supabase
      const { data: dbUsers, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, role, roles, is_approved, created_at')
        .in('role', ['superadmin', 'admin', 'administrator', 'operator', 'direktur', 'staf_beasiswa', 'staf_ormawa', 'staf_alumni', 'staf_depan']);
      
      if (!usersError && dbUsers) {
        const dbAdmins: AdminRecord[] = dbUsers.map((u: any) => {
          let displayRole: 'Super Admin' | 'Admin' | 'Editor' = 'Admin';
          if (u.role === 'superadmin') displayRole = 'Super Admin';
          else if (u.role === 'operator') displayRole = 'Editor';
          
          const initials = u.name ? u.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: displayRole,
            roles: u.roles || [u.role],
            isApproved: u.is_approved,
            avatarInitials: initials,
            lastActive: u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : 'Today'
          };
        });
        setAdmins(dbAdmins);
      }

      // Load under_construction status from Supabase
      try {
        const dbUc = await SupabaseService.getSystemSetting('under_construction');
        setIsUnderConstruction(dbUc === 'true');
      } catch (ucErr) {
        console.error("Failed to load under_construction setting:", ucErr);
      }
    } catch (err) {
      console.error("AdminPortal failed to load Supabase data, using local mockup fallback:", err);
    }
  };

  useEffect(() => {
    loadDbData();
  }, []);

  // Verify Supabase session asynchronously in the background on mount
  useEffect(() => {
    async function verifySession() {
      try {
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        if (!sbSession) {
          handleSignOut();
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('role, roles')
          .eq('id', sbSession.user.id)
          .single();

        const allowedRoles = ['superadmin', 'direktur', 'staf_beasiswa', 'staf_ormawa', 'staf_alumni', 'staf_depan', 'admin', 'administrator'];
        if (!profile || !allowedRoles.includes(profile.role)) {
          handleSignOut();
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      }
    }
    verifySession();
  }, []);

  // Click outside handler to dismiss dropdown menus and avoid flickering during native confirm dialogs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const isNotificationClick = target.closest('#notification-bell') || target.closest('#notification-dropdown');
      const isProfileClick = target.closest('#profile-menu-button') || target.closest('#profile-menu-dropdown');
      
      if (!isNotificationClick) {
        setShowNotifications(false);
      }
      if (!isProfileClick) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setActiveTab('dashboard');
    localStorage.setItem('upb_affairs_session', JSON.stringify(userSession));
  };

  const handleSignOut = () => {
    setSession(null);
    localStorage.removeItem('upb_affairs_session');
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setProfileError('File size is too large (maximum 2MB)');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditAvatarUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setProfileError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSavingProfile(true);
    setProfileError(null);
    
    try {
      // 1. If password is provided, update it via Auth API
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        if (newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (passwordError) {
          throw new Error(`Auth Error (Password): ${passwordError.message}`);
        }
      }

      // 2. Update profile name & avatar in public.users table
      const { error: dbError } = await supabase
        .from('users')
        .update({
          name: editName,
          avatar_url: editAvatarUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.id);
        
      if (dbError) {
        throw new Error(`Database Error: ${dbError.message}`);
      }
      
      // If the avatar is a base64 Data URL, clear it from Auth metadata to prevent bloating the JWT.
      // The full base64 image remains stored and retrieved from the public.users database table.
      const authMetadata: any = { name: editName };
      if (editAvatarUrl && !editAvatarUrl.startsWith('data:')) {
        authMetadata.avatar_url = editAvatarUrl;
      } else {
        authMetadata.avatar_url = null;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: authMetadata
      });
      
      if (authError) {
        throw new Error(`Auth Error: ${authError.message}`);
      }
      
      const updatedSession: UserSession = {
        ...session,
        name: editName,
        avatarUrl: editAvatarUrl || undefined
      };
      
      setSession(updatedSession);
      localStorage.setItem('upb_affairs_session', JSON.stringify(updatedSession));
      setShowEditProfileModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setProfileError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // State modification mutations
  const handleAddAlumni = async (newRecord: Omit<AlumniRecord, 'id'>) => {
    const record: AlumniRecord = {
      ...newRecord,
      id: crypto.randomUUID()
    };
    try {
      await SupabaseService.saveAdminAlumniRecord(record, true);
      setAlumni([record, ...alumni]);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan alumni ke database');
    }
  };

  const handleBulkAddAlumni = async (records: Omit<AlumniRecord, 'id'>[]) => {
    try {
      await SupabaseService.saveAdminAlumniRecordsBulk(records);
      const newRecords = records.map(r => ({
        ...r,
        id: crypto.randomUUID()
      }));
      setAlumni([...newRecords, ...alumni]);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah data alumni bulk ke database');
    }
  };

  const handleAddUkm = async (newRecord: Omit<UkmRecord, 'id' | 'updatedAt'>) => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const record: UkmRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
      updatedAt: dateStr
    };
    try {
      await SupabaseService.saveAdminUkmRecord(record, true);
      setUkms([record, ...ukms]);
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan UKM ke database');
    }
  };

  const handleUpdateUkmStatus = async (id: string, status: 'Active' | 'Inactive') => {
    const item = ukms.find(u => u.id === id);
    if (!item) return;
    const updated = { ...item, status };
    try {
      await SupabaseService.saveAdminUkmRecord(updated, false);
      setUkms(ukms.map(item => item.id === id ? updated : item));
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status UKM di database');
    }
  };

  const handleEditUkm = async (edited: UkmRecord) => {
    try {
      await SupabaseService.saveAdminUkmRecord(edited, false);
      setUkms(ukms.map(item => item.id === edited.id ? edited : item));
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan UKM di database');
    }
  };

  const handleAddScholarship = async (newRecord: Omit<ScholarshipRecord, 'id' | 'applicants'>) => {
    const record: ScholarshipRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
      applicants: 0
    };
    try {
      await SupabaseService.saveAdminScholarshipRecord(record, true);
      setScholarships([record, ...scholarships]);
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan beasiswa ke database');
    }
  };

  const handleEditScholarship = async (edited: ScholarshipRecord) => {
    try {
      await SupabaseService.saveAdminScholarshipRecord(edited, false);
      setScholarships(scholarships.map(item => item.id === edited.id ? edited : item));
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan beasiswa di database');
    }
  };

  const handleSaveNewsArticle = async (edited: NewsArticle) => {
    const exists = news.some(item => item.id === edited.id);
    try {
      await SupabaseService.saveNewsArticle(edited);
      if (exists) {
        setNews(news.map(item => item.id === edited.id ? edited : item));
      } else {
        setNews([edited, ...news]);
      }
      setEditingArticle(null);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan berita ke database');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      await SupabaseService.deleteNewsArticle(id);
      setNews(news.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus berita dari database: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteUkm = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus UKM ini?')) return;
    try {
      await SupabaseService.deleteUkm(id);
      setUkms(ukms.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus UKM dari database: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus beasiswa ini?')) return;
    try {
      await SupabaseService.deleteScholarship(id);
      setScholarships(scholarships.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus beasiswa dari database: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) return;
    try {
      await SupabaseService.deleteAlumni(id);
      setAlumni(alumni.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus data alumni dari database: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleAddAdmin = async (newAdmin: Omit<AdminRecord, 'id' | 'avatarInitials' | 'lastActive'>) => {
    if (!session) return;
    try {
      let mappedRole: 'superadmin' | 'admin' | 'operator' = 'admin';
      if (newAdmin.role === 'Super Admin') mappedRole = 'superadmin';
      else if (newAdmin.role === 'Editor') mappedRole = 'operator';

      const result = await AuthService.addUser(session.id, {
        email: newAdmin.email,
        name: newAdmin.name,
        role: mappedRole
      });

      if (!result.success || !result.user) {
        throw new Error(result.error || 'Failed to create user');
      }

      const initials = newAdmin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const admin: AdminRecord = {
        ...newAdmin,
        id: result.user.id,
        lastActive: 'Just now',
        avatarInitials: initials
      };
      setAdmins([...admins, admin]);
      alert(`Success: Admin user created with default password "password123"!`);
    } catch (err: any) {
      console.error(err);
      alert('Gagal menambah admin ke database: ' + (err.message || String(err)));
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!session) return;
    if (!confirm('Apakah Anda yakin ingin menghapus administrator ini?')) return;
    try {
      const result = await AuthService.deleteUser(id, session.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
      setAdmins(admins.filter(item => item.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus admin dari database: ' + (err.message || String(err)));
    }
  };

  const handleUpdateAdminRole = async (id: string, role: 'Super Admin' | 'Admin' | 'Editor') => {
    if (!session) return;
    try {
      let mappedRole: 'superadmin' | 'admin' | 'operator' = 'admin';
      if (role === 'Super Admin') mappedRole = 'superadmin';
      else if (role === 'Editor') mappedRole = 'operator';

      const result = await AuthService.updateUserRole(id, mappedRole, session.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update role');
      }
      setAdmins(admins.map(item => item.id === id ? { ...item, role } : item));
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui peran admin di database: ' + (err.message || String(err)));
    }
  };

  const handleUpdateAdminRoles = async (id: string, roles: string[]) => {
    if (!session) return;
    try {
      const result = await AuthService.updateUserRoles(id, roles as any, session.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update roles');
      }
      setAdmins(admins.map(item => item.id === id ? { ...item, roles } : item));
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui peran admin di database: ' + (err.message || String(err)));
    }
  };

  const handleUpdateAdminApproval = async (id: string, isApproved: boolean) => {
    if (!session) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_approved: isApproved })
        .eq('id', id);
      if (error) throw error;
      setAdmins(admins.map(item => item.id === id ? { ...item, isApproved } : item));
      setPendingAdminsCount(prev => isApproved ? Math.max(0, prev - 1) : prev + 1);
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui status persetujuan admin: ' + (err.message || String(err)));
    }
  };

  // Dynamic quick creation from Sidebar Header
  const handleCreateNewClick = () => {
    if (activeTab === 'alumni') {
      alert("Please trigger 'Add Record' or upload files in the Alumni portal grid dashboard.");
    } else if (activeTab === 'ukm') {
      alert("Opening New Student Group registration dialog...");
    } else if (activeTab === 'scholarships') {
      alert("Opening Scholarship publication modal.");
    } else if (activeTab === 'news') {
      setEditingArticle({
        id: generateUUID(),
        title: 'New Announcement Title',
        content: '<p>Start drafting news content...</p>',
        status: 'Draft',
        visibility: 'Public',
        publishDate: '2026-05-26',
        category: 'News',
        tags: []
      });
    } else {
      alert(`Quick Add feature is fully optimized inside specific context tabs on student affairs.`);
    }
  };

  // Triggers action tabs from dashboard quick action links
  const handleQuickAction = (actionType: 'news' | 'alumni' | 'scholarship') => {
    if (actionType === 'news') {
      setEditingArticle({
        id: generateUUID(),
        title: 'New Announcement Title',
        content: '<p>Write your university announcement content here...</p>',
        status: 'Draft',
        visibility: 'Public',
        publishDate: '2026-05-26',
        category: 'News',
        tags: []
      });
      setActiveTab('news');
    } else if (actionType === 'alumni') {
      setActiveTab('alumni');
    } else if (actionType === 'scholarship') {
      setActiveTab('scholarships');
    }
  };

  // Nav categories representation
  const NAVIGATION_ITEMS = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'news', label: 'Berita & Pengumuman', icon: Newspaper },
    { id: 'alumni', label: 'Hub Data Alumni', icon: Award },
    { id: 'ukm', label: 'UKM & Ormawa', icon: Users },
    { id: 'member-reports', label: 'Verifikasi Anggota', icon: ClipboardList },
    { id: 'scholarships', label: 'Portal Beasiswa', icon: BookOpen },
    { id: 'scholarship-apps', label: 'Antrian Beasiswa', icon: BookOpen },
    { id: 'ormawa-apps', label: 'Antrian Pengajuan Ormawa', icon: UserPlus },
    { id: 'ormawa-props', label: 'Proposal & LPJ Ormawa', icon: Newspaper },
    { id: 'appointments', label: 'Janji Temu Direktur', icon: Calendar },
    { id: 'settings', label: 'Kontrol Akses & Staf', icon: Shield },
    { id: 'registrations', label: 'Registrasi Mahasiswa', icon: UserPlus },
  ];

  const visibleNavItems = NAVIGATION_ITEMS.filter(item => {
    if (!session) return false;
    
    // Superadmin has access to everything
    const rolesList = session.roles || [session.role];
    if (rolesList.includes('superadmin')) {
      return true;
    }

    if (item.id === 'settings' || item.id === 'registrations') {
      return false; // Only superadmin can access access control and registration queue
    }

    if (rolesList.includes('direktur')) {
      // Direktur sees news, alumni, ukm, scholarships, and appointments
      return ['dashboard', 'news', 'alumni', 'ukm', 'scholarships', 'appointments'].includes(item.id);
    }

    // Otherwise check specific staff roles
    const allowedTabs: string[] = ['dashboard'];
    if (rolesList.includes('staf_beasiswa')) {
      allowedTabs.push('scholarships', 'scholarship-apps');
    }
    if (rolesList.includes('staf_ormawa')) {
      allowedTabs.push('ukm', 'member-reports', 'ormawa-apps', 'ormawa-props');
    }
    if (rolesList.includes('staf_alumni')) {
      allowedTabs.push('alumni');
    }
    if (rolesList.includes('staf_depan')) {
      allowedTabs.push('appointments', 'ukm', 'ormawa-props');
    }

    return allowedTabs.includes(item.id);
  });

  if (!session) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const isReadOnly = (session.roles || [session.role]).includes('direktur') && !(session.roles || [session.role]).includes('superadmin');

  // Active view content distribution
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            studentsCount={studentsCount}
            newStudentsCount={newStudentsCount}
            ukmsCount={ukms.length}
            activeUkmsCount={ukms.filter(u => u.status === 'Active').length}
            scholarshipsCount={scholarships.length}
            openScholarshipsCount={scholarships.filter(s => s.status === 'Open').length}
            alumniCount={alumniCount}
            verifiedAlumniCount={verifiedAlumniCount}
            news={news}
            onNavigate={(tab) => setActiveTab(tab)}
            onQuickAction={handleQuickAction}
          />
        );
      case 'alumni':
        return (
          <AlumniManagement
            alumni={alumni}
            onAddAlumni={handleAddAlumni}
            onBulkAddAlumni={handleBulkAddAlumni}
            onDeleteAlumni={handleDeleteAlumni}
            readOnly={isReadOnly}
          />
        );
      case 'ukm':
        return (
          <UkmDirectory
            ukms={ukms}
            onAddUkm={handleAddUkm}
            onUpdateUkmStatus={handleUpdateUkmStatus}
            onEditUkm={handleEditUkm}
            onDeleteUkm={handleDeleteUkm}
            readOnly={isReadOnly}
          />
        );
      case 'scholarships':
        return (
          <ScholarshipsManagement
            scholarships={scholarships}
            onAddScholarship={handleAddScholarship}
            onEditScholarship={handleEditScholarship}
            onDeleteScholarship={handleDeleteScholarship}
            readOnly={isReadOnly}
          />
        );
      case 'news':
        if (editingArticle) {
          return (
            <NewsEditor
              article={editingArticle}
              onBack={() => setEditingArticle(null)}
              onSave={handleSaveNewsArticle}
              readOnly={isReadOnly}
            />
          );
        }
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
              <div>
                <h2 className="font-sans font-black text-3xl text-[#001e40]">Portal Komunikasi</h2>
                <p className="text-sm text-[#43474f] font-medium">Tulis, kelola, dan distribusikan buletin atau pengumuman resmi.</p>
              </div>
              {!isReadOnly && (
                <button
                  onClick={() =>
                    setEditingArticle({
                      id: generateUUID(),
                      title: '',
                      content: '',
                      status: 'Draft',
                      visibility: 'Public',
                      publishDate: '2026-05-26',
                      category: 'News',
                      tags: []
                    })
                  }
                  className="bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  Tulis Artikel Baru
                </button>
              )}
            </div>

            {/* Existing News List Grid */}
            <div className="bg-white rounded-2xl border border-[#c3c6d1]/40 shadow-sm overflow-hidden text-left">
              <div className="p-5 border-b border-[#eceef1] bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Perpustakaan Pengumuman</span>
                <span className="text-xs font-semibold text-[#001e40]">{news.length} total tulisan</span>
              </div>
              <div className="divide-y divide-[#eceef1]">
                {news.map((item) => (
                  <div key={item.id} className="p-5 hover:bg-[#f2f4f7]/30 transition-all flex justify-between items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#feb234]/15 text-[#6d4700] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#feb234]/20">
                          {item.category === 'News' ? 'Berita' : item.category === 'Announcement' ? 'Pengumuman' : item.category === 'Agenda' ? 'Agenda' : item.category}
                        </span>
                        <span className="text-xs text-[#737780] font-semibold">{item.publishDate}</span>
                      </div>
                      <h4 className="font-headline font-bold text-base text-[#191c1e] mt-1.5 truncate pr-8">{item.title}</h4>
                      <p className="text-xs text-[#43474f] font-semibold mt-1 flex gap-1.5 flex-wrap">
                        {item.tags.map(t => (
                          <span key={t} className="bg-slate-100 text-[#43474f] px-2 py-0.5 rounded text-[10px]">#{t}</span>
                        ))}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingArticle(item)}
                        className="bg-[#001e40]/5 hover:bg-[#001e40]/10 text-[#001e40] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        {isReadOnly ? 'Lihat Artikel' : 'Edit / Terbitkan'}
                      </button>
                      {!isReadOnly && (
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':
        if (session.role !== 'superadmin') {
          return <div className="p-12 text-center text-red-500 font-bold">Access Denied: Super Admin only.</div>;
        }
        return (
          <AdminManagement
            admins={admins}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onUpdateAdminRole={handleUpdateAdminRole}
            onUpdateAdminRoles={handleUpdateAdminRoles}
            onUpdateAdminApproval={handleUpdateAdminApproval}
          />
        );
      case 'appointments':
        return <AppointmentScheduler userRoles={session.roles || [session.role]} />;
      case 'registrations':
        return <RegistrationQueue onRefresh={loadDbData} />;
      case 'ormawa-apps':
        return <OrmawaApplicationsQueue reviewerId={session.id} onRefresh={loadDbData} />;
      case 'ormawa-props':
        return <OrmawaProposalsQueue onRefresh={loadDbData} />;
      case 'scholarship-apps':
        return <ScholarshipApplicationsQueue onRefresh={loadDbData} />;
      case 'member-reports':
        return <MemberReportsQueue onRefresh={loadDbData} />;
      case 'system-control':
        return (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-6 shadow-sm max-w-2xl font-sans text-left">
            <div>
              <h2 className="font-sans font-black text-2xl text-[#001e40]">System Control Panel</h2>
              <p className="text-xs text-[#737780] font-semibold mt-1">
                Kelola status global website dan konfigurasi sistem kemahasiswaan Universitas Pelita Bangsa.
              </p>
            </div>

            <div className="border-t border-[#eceef1] pt-6 space-y-6">
              {/* Under Construction Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f2f4f7]/40 border border-slate-200/60 p-5 rounded-2xl">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-800 block">Mode Perbaikan (Under Construction)</span>
                  <p className="text-xs text-slate-500 max-w-md font-semibold leading-relaxed">
                    Bila diaktifkan, pengunjung umum akan diarahkan ke halaman Under Construction. Admin tetap dapat mengakses Admin Portal untuk mengelola data.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  onClick={async () => {
                    const nextVal = !isUnderConstruction;
                    try {
                      await SupabaseService.setSystemSetting('under_construction', nextVal ? 'true' : 'false');
                      setIsUnderConstruction(nextVal);
                    } catch (e: any) {
                      alert('Gagal memperbarui status: ' + (e.message || e));
                    }
                  }}
                  className={`w-14 h-8 rounded-full transition-colors flex items-center p-1 cursor-pointer shrink-0 ${
                    isUnderConstruction ? 'bg-[#feb234]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                      isUnderConstruction ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-12 text-center text-[#737780] font-bold">In development...</div>;
    }
  };

  const getItemBadgeCount = (itemId: string) => {
    switch (itemId) {
      case 'registrations':
        return pendingRegistrationsCount;
      case 'member-reports':
        return pendingMemberReportsCount;
      case 'scholarship-apps':
        return pendingScholarshipAppsCount;
      case 'ormawa-apps':
        return pendingOrmawaAppsCount;
      case 'ormawa-props':
        return pendingOrmawaPropsCount;
      case 'settings':
        return pendingAdminsCount;
      default:
        return 0;
    }
  };

  const unreadNotificationCount = notifications.filter(n => n.unread).length;
  const totalNotificationsCount = unreadNotificationCount;

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#191c1e] font-sans flex relative overflow-x-hidden w-full">
      
      {/* SideNavBar Component - Desktop view */}
      <nav id="sidebar" className="bg-[#001e40] text-[#799dd6] font-medium shadow-xl shadow-[#001e40]/10 fixed left-0 top-0 h-screen w-64 flex flex-col py-6 z-[60] shrink-0 hidden md:flex transition-all duration-300">
        
        {/* Header Branding UPB */}
        <div className="px-6 mb-8 flex items-center gap-4">
          <img
            alt="Universitas Pelita Bangsa Logo"
            className="w-10 h-10 rounded-full bg-white p-1"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA53r5C5uZeYiR8TGIWbzuUSXAUlfE6L70SCfAA8cV-XGHpZBTcig38onXkxohVqxK77Madf71cV0BRf9LP2QezTiwjuxJqltB1Q1WlVI9_A8-IB_tb1v4F2bmfQVfF36nplyaXmd5Msv3BJTZ3Q6NpIhgee-2Zz4NudZm12Sn6ttF_oPYa6fnG7P8bsFWTDmRQ_WV8dGGfR4DoyqKBKiAtdye8SrDpNT6mYLk18hDlt65ezFR25ZP8zmx0KmWJacqfh6sibMRea3Y"
          />
          <div>
            <h1 className="font-headline font-bold text-white text-sm leading-tight leading-none truncate max-w-[140px]">
              DIRMAWA
            </h1>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Admin Portal</p>
          </div>
        </div>

        {/* CTA "Create New" Button left */}
        <div className="px-4 mb-6">
          <button
            onClick={handleCreateNewClick}
            className="w-full bg-[#feb234] hover:bg-[#feb234]/90 text-[#291800] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            Buat Baru
          </button>
        </div>

        {/* Dynamic Navigation lists */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setEditingArticle(null);
                  setMobileMenuOpen(false);
                }}
                className={`w-[calc(100%-16px)] text-left mx-2 my-0.5 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#feb234] text-[#291800] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#291800]' : 'text-white/60'} />
                <span className="flex-1">{item.label}</span>
                {getItemBadgeCount(item.id) > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${
                    isActive ? 'bg-[#291800] text-[#feb234]' : 'bg-red-500 text-white'
                  }`}>
                    {getItemBadgeCount(item.id)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer items */}
        <div className="px-2 mt-auto border-t border-white/10 pt-4 flex flex-col gap-1">
          {session?.role === 'superadmin' && (
            <button
              onClick={() => {
                setActiveTab('system-control');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 text-xs font-bold transition-colors cursor-pointer rounded-xl ${
                activeTab === 'system-control' ? 'bg-white/15 text-white font-black' : 'text-white/70 hover:text-white'
              }`}
            >
              <SettingsIcon size={16} />
              Kontrol Sistem
            </button>
          )}
          <button
            onClick={() => { window.location.hash = ''; }}
            className="text-white/70 hover:text-white flex items-center gap-3 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <ExternalLink size={16} />
            Kembali ke Beranda
          </button>
          <button
            onClick={handleSignOut}
            className="text-white/70 hover:text-red-300 flex items-center gap-3 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </nav>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full relative">
        
        {/* TopNavBar Header Component */}
        <header className="bg-white text-[#001e40] border-b border-[#c3c6d1]/40 shadow-sm fixed top-0 right-0 left-0 md:left-64 h-16 px-6 flex justify-between items-center z-50">
          
          {/* Brand/Hamburger toggle on Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#001e40] hover:bg-[#eceef1] rounded-xl transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="font-headline font-bold text-[#001e40] text-base md:text-lg leading-tight">
              Direktorat Kemahasiswaan
            </div>
          </div>

          {/* Right Header Options */}
          <div className="flex items-center gap-4">
            
            {/* Global simulated searching Bar wrapper */}
            <div className="hidden lg:flex items-center bg-[#f2f4f7] rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-[#001e40]/20 transition-all border border-[#c3c6d1]/40">
              <Search size={16} className="text-[#737780] mr-2" />
              <input
                type="text"
                value={searchGlobalQuery}
                onChange={(e) => setSearchGlobalQuery(e.target.value)}
                placeholder="Cari di portal..."
                className="bg-transparent border-none text-xs font-medium focus:ring-0 placeholder-[#737780]/80 text-[#191c1e] w-48 outline-none"
              />
            </div>

            {/* Notification bell and unread badge */}
            <div className="relative">
              <button
                id="notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-[#43474f] hover:bg-[#eceef1] rounded-full p-2 transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={18} />
                {totalNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1.5 bg-red-600 rounded-full border border-white flex items-center justify-center text-[8px] font-black text-white leading-none">
                    {totalNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div 
                  id="notification-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#c3c6d1]/50 p-4 z-50 animate-fade-in text-left"
                >
                  <div className="flex justify-between items-center border-b border-[#eceef1] pb-2 mb-2">
                    <span className="text-xs font-bold text-[#001e40]">Campus Alerts</span>
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                      className="text-[10px] font-semibold text-[#737780] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.unread) {
                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                          }
                        }}
                        className={`p-2 rounded-xl text-xs font-medium leading-normal border transition-colors cursor-pointer hover:bg-slate-100/80 ${
                          n.unread
                            ? 'bg-slate-50 border-[#feb234]/15 font-semibold text-[#191c1e]'
                            : 'text-[#737780] border-transparent'
                        }`}
                      >
                        {n.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Help Support button */}
            <button
              onClick={() => alert("Student Affairs Knowledge Base: Access system guidelines in directory.")}
              className="text-[#43474f] hover:bg-[#eceef1] rounded-full p-2 transition-all cursor-pointer"
              title="Help center"
            >
              <HelpCircle size={18} />
            </button>

            {/* Profile trigger block */}
            <div className="pl-4 border-l border-[#c3c6d1]/40 flex items-center gap-3 relative">
              <button 
                id="profile-menu-button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false); // Close notifications if open
                }}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer text-left"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-bold text-[#191c1e]">{session.name}</p>
                  <p className="text-[10px] text-[#737780] uppercase tracking-wider font-semibold">
                    {session.role === 'superadmin' ? 'Super Admin' : session.role === 'admin' ? 'Admin' : 'Student'}
                  </p>
                </div>
                {session.avatarUrl ? (
                  <img
                    alt="Administrator Headshot"
                    className="w-8 h-8 rounded-full border border-[#c3c6d1] object-cover"
                    src={session.avatarUrl}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-[#c3c6d1] bg-[#f2f4f7] text-[#5c606a] flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  id="profile-menu-dropdown"
                  className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-[#c3c6d1]/50 p-4 z-50 animate-fade-in text-left"
                >
                  <div className="border-b border-[#eceef1] pb-2 mb-2">
                    <p className="text-xs font-bold text-[#001e40] truncate">{session.name}</p>
                    <p className="text-[10px] text-[#737780] truncate font-medium">{session.username}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      session.role === 'superadmin' 
                        ? 'bg-red-100 text-red-800 border border-red-200/50' 
                        : session.role === 'admin' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200/50' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200/50'
                    }`}>
                      {session.role === 'superadmin' ? 'Super Admin' : session.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setEditName(session.name);
                        setEditAvatarUrl(session.avatarUrl || '');
                        setNewPassword('');
                        setConfirmPassword('');
                        setProfileError(null);
                        setShowEditProfileModal(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-[#43474f] hover:bg-[#f2f4f7] rounded-lg transition-colors cursor-pointer"
                    >
                      <User size={14} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-[#43474f] hover:bg-[#f2f4f7] rounded-lg transition-colors cursor-pointer"
                    >
                      <SettingsIcon size={14} />
                      Kontrol Akses
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSignOut();
                      }}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Mobile Sliding Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-xs z-[70] md:hidden animate-fade-inAndOut" onClick={() => setMobileMenuOpen(false)}>
            <div className="bg-[#001e40] text-white w-64 h-full p-6 flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex gap-3 items-center mb-8 border-b border-white/10 pb-4">
                <img
                  alt="UPB Logo"
                  className="w-8 h-8 rounded-full bg-white p-1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA53r5C5uZeYiR8TGIWbzuUSXAUlfE6L70SCfAA8cV-XGHpZBTcig38onXkxohVqxK77Madf71cV0BRf9LP2QezTiwjuxJqltB1Q1WlVI9_A8-IB_tb1v4F2bmfQVfF36nplyaXmd5Msv3BJTZ3Q6NpIhgee-2Zz4NudZm12Sn6ttF_oPYa6fnG7P8bsFWTDmRQ_WV8dGGfR4DoyqKBKiAtdye8SrDpNT6mYLk18hDlt65ezFR25ZP8zmx0KmWJacqfh6sibMRea3Y"
                />
                <div>
                  <h4 className="font-headline font-bold text-sm">DIRMAWA Admin Portal</h4>
                </div>
              </div>

              <div className="flex-1 space-y-2 mt-4">
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setEditingArticle(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#feb234] text-[#291800]'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{item.label}</span>
                      {getItemBadgeCount(item.id) > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black leading-none ${
                          isActive ? 'bg-[#291800] text-[#feb234]' : 'bg-red-500 text-white'
                        }`}>
                          {getItemBadgeCount(item.id)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-2">
                {session?.role === 'superadmin' && (
                  <button
                    onClick={() => {
                      setActiveTab('system-control');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 py-2 text-xs font-bold text-left cursor-pointer ${
                      activeTab === 'system-control' ? 'text-white font-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <SettingsIcon size={16} />
                    Kontrol Sistem
                  </button>
                )}
                <button
                  onClick={() => { window.location.hash = ''; }}
                  className="text-white/70 hover:text-white flex items-center gap-3 py-2 text-xs font-bold text-left cursor-pointer"
                >
                  <ExternalLink size={16} />
                  Kembali ke Beranda
                </button>
                <button onClick={handleSignOut} className="text-white/70 hover:text-red-300 flex items-center gap-3 py-2 text-xs font-bold text-left cursor-pointer">
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTAINER CANVAS */}
        <main className="flex-1 pt-24 px-6 md:px-8 py-6 w-full max-w-[1280px] mx-auto min-h-screen">
          {renderTabContent()}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40">
            <div className="flex justify-between items-center border-b border-[#eceef1] pb-3 mb-4">
              <h3 className="font-headline font-bold text-lg text-[#001e40]">Edit Admin Profile</h3>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="text-[#737780] hover:bg-[#f2f4f7] p-1 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            {profileError && (
              <div className="mb-4 bg-red-50 text-red-650 text-xs p-3 rounded-lg border border-red-200 font-semibold">
                {profileError}
              </div>
            )}
            
            <form onSubmit={handleSaveProfile} className="space-y-4" autoComplete="off">
              {/* Dummy input to catch browser password manager autofill */}
              <input type="password" style={{ display: 'none' }} autoComplete="new-password" />
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="relative group">
                  {editAvatarUrl ? (
                    <img
                      alt="Current Profile Avatar"
                      className="w-20 h-20 rounded-full border-2 border-[#001e40] object-cover"
                      src={editAvatarUrl}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-[#001e40] bg-[#f2f4f7] text-[#001e40] flex items-center justify-center">
                      <User size={36} />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                    <Camera size={14} className="mr-1" />
                    Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <span className="text-[10px] text-[#737780] font-semibold">Allowed formats: JPG, PNG. Max 2MB.</span>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Administrator"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={session.username}
                  className="w-full bg-slate-100 border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm text-[#737780] font-medium cursor-not-allowed"
                />
              </div>

               <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>
              
              {newPassword && (
                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40] animate-fade-in"
                  />
                </div>
              )}
              
              <div className="flex gap-3 justify-end pt-4 border-t border-[#eceef1] mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2.5 border border-[#c3c6d1] text-[#43474f] text-sm font-bold rounded-xl hover:bg-[#f2f4f7] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-75"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
