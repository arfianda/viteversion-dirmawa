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
  ExternalLink
} from 'lucide-react';

import { UserSession, AlumniRecord, UkmRecord, ScholarshipRecord, NewsArticle, AdminRecord } from './types';
import { INITIAL_ALUMNI, INITIAL_UKMS, INITIAL_SCHOLARSHIPS, INITIAL_NEWS, INITIAL_ADMINS } from './data';
import { SupabaseService } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';

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

export default function AdminPortal() {
  const [session, setSession] = useState<UserSession | null>(null);
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
  
  // News Editor helper
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Load data from Supabase
  useEffect(() => {
    async function loadDbData() {
      try {
        const [dbNews, dbUkms, dbScholarships, dbAlumni] = await Promise.all([
          SupabaseService.getAdminNewsArticles(),
          SupabaseService.getAdminUkmRecords(),
          SupabaseService.getAdminScholarshipRecords(),
          SupabaseService.getAdminAlumniRecords()
        ]);
        setNews(dbNews);
        setUkms(dbUkms);
        setScholarships(dbScholarships);
        setAlumni(dbAlumni);
      } catch (err) {
        console.error("AdminPortal failed to load Supabase data, using local mockup fallback:", err);
      }
    }
    loadDbData();
  }, []);

  // Try parsing session from localStorage if desired
  useEffect(() => {
    const saved = localStorage.getItem('upb_affairs_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('upb_affairs_session');
      }
    }
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
      
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: editName,
          avatar_url: editAvatarUrl || null
        }
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
      updatedAt: dateStr,
      logoUrl: undefined
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

  const handleAddAdmin = (newAdmin: Omit<AdminRecord, 'id' | 'avatarInitials' | 'lastActive'>) => {
    const initials = newAdmin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const admin: AdminRecord = {
      ...newAdmin,
      id: String(Date.now()),
      lastActive: 'Just now',
      avatarInitials: initials
    };
    setAdmins([...admins, admin]);
  };

  const handleRemoveAdmin = (id: string) => {
    setAdmins(admins.filter(item => item.id !== id));
  };

  const handleUpdateAdminRole = (id: string, role: 'Super Admin' | 'Admin' | 'Editor') => {
    setAdmins(admins.map(item => item.id === id ? { ...item, role } : item));
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
        id: String(Date.now()),
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
        id: String(Date.now()),
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'news', label: 'News & Announcements', icon: Newspaper },
    { id: 'alumni', label: 'Alumni Data Hub', icon: Award },
    { id: 'ukm', label: 'UKM & Ormawa', icon: Users },
    { id: 'scholarships', label: 'Scholarships Portal', icon: BookOpen },
    { id: 'settings', label: 'Access Control', icon: Shield },
    { id: 'registrations', label: 'Registrations', icon: UserPlus },
  ];

  if (!session) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Active view content distribution
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            studentsCount={14250}
            ukmsCount={ukms.length}
            scholarshipsCount={scholarships.length}
            alumniCount={alumni.length}
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
          />
        );
      case 'ukm':
        return (
          <UkmDirectory
            ukms={ukms}
            onAddUkm={handleAddUkm}
            onUpdateUkmStatus={handleUpdateUkmStatus}
            onEditUkm={handleEditUkm}
          />
        );
      case 'scholarships':
        return (
          <ScholarshipsManagement
            scholarships={scholarships}
            onAddScholarship={handleAddScholarship}
            onEditScholarship={handleEditScholarship}
          />
        );
      case 'news':
        if (editingArticle) {
          return (
            <NewsEditor
              article={editingArticle}
              onBack={() => setEditingArticle(null)}
              onSave={handleSaveNewsArticle}
            />
          );
        }
        return (
          <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-headline font-bold text-3xl text-[#191c1e]">Communications Portal</h2>
                <p className="text-sm text-[#43474f] font-medium">Draft, manage, and distribute newsletters or official announcements.</p>
              </div>
              <button
                onClick={() =>
                  setEditingArticle({
                    id: String(Date.now()),
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
                Draft New Article
              </button>
            </div>

            {/* Existing News List Grid */}
            <div className="bg-white rounded-2xl border border-[#c3c6d1]/40 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#eceef1] bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Announcement Library</span>
                <span className="text-xs font-semibold text-[#001e40]">{news.length} total write-ups</span>
              </div>
              <div className="divide-y divide-[#eceef1]">
                {news.map((item) => (
                  <div key={item.id} className="p-5 hover:bg-[#f2f4f7]/30 transition-all flex justify-between items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#feb234]/15 text-[#6d4700] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#feb234]/20">
                          {item.category}
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
                        Edit / Publish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <AdminManagement
            admins={admins}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onUpdateAdminRole={handleUpdateAdminRole}
          />
        );
      case 'registrations':
        return <RegistrationQueue />;
      default:
        return <div className="p-12 text-center text-[#737780] font-bold">In development...</div>;
    }
  };

  const unreadNotificationCount = notifications.filter(n => n.unread).length;

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
              Student Affairs
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
            Create New
          </button>
        </div>

        {/* Dynamic Navigation lists */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
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
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer items */}
        <div className="px-2 mt-auto border-t border-white/10 pt-4 flex flex-col gap-1">
          <button
            onClick={() => {
              setActiveTab('settings');
              setMobileMenuOpen(false);
            }}
            className="text-white/70 hover:text-white flex items-center gap-3 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
          >
            <SettingsIcon size={16} />
            System Control
          </button>
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
            Sign Out
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
                placeholder="Search across portal..."
                className="bg-transparent border-none text-xs font-medium focus:ring-0 placeholder-[#737780]/80 text-[#191c1e] w-48 outline-none"
              />
            </div>

            {/* Notification bell and unread badge */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-[#43474f] hover:bg-[#eceef1] rounded-full p-2 transition-all relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#c3c6d1]/50 p-4 z-50 animate-fade-in text-left">
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
                      <div key={n.id} className={`p-2 rounded-xl text-xs font-medium leading-normal border ${n.unread ? 'bg-slate-55 border-[#feb234]/15 font-semibold' : 'text-[#737780] border-transparent'}`}>
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
                <img
                  alt="Administrator Headshot"
                  className="w-8 h-8 rounded-full border border-[#c3c6d1] object-cover"
                  src={session.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDk50HzYys7OGAA-TewCZjPixQ6ZVicRUtWnJs_hQdagpxmcbEBVUy7V5q3X0MDjPCA3qkhDRfYPbSbJz6lnP_DFPgyF0UfuaRNlhU7zlyJpwDqLifJ5a1q4sFUzl33KuAg6_iI98SJc7HPMcCA0bs7pGyTcsrSsHE8KF1xEG6Z8cLuHFiYBuhhRCU_s_wmTv4yBftmEWExjh63mPAx_7ixdOe5OshrJ_omvjYZp1hCYSugL1CdsnmAgqu7uCNcSweCyBwY_IY-zWg"}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-[#c3c6d1]/50 p-4 z-50 animate-fade-in text-left">
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
                      Access Control
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSignOut();
                      }}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      Sign Out
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
                  <h4 className="font-headline font-bold text-sm">UPB Staff Portal</h4>
                </div>
              </div>

              <div className="flex-1 space-y-2 mt-4">
                {NAVIGATION_ITEMS.map((item) => {
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
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-2">
                <button
                  onClick={() => { window.location.hash = ''; }}
                  className="text-white/70 hover:text-white flex items-center gap-3 py-2 text-xs font-bold text-left cursor-pointer"
                >
                  <ExternalLink size={16} />
                  Kembali ke Beranda
                </button>
                <button onClick={handleSignOut} className="text-white/70 hover:text-red-300 flex items-center gap-3 py-2 text-xs font-bold text-left cursor-pointer">
                  <LogOut size={16} />
                  Sign Out
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

    </div>
  );
}
