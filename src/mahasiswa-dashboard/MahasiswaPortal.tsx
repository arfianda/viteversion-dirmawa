import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  Search, 
  HelpCircle,
  X,
  User,
  ExternalLink,
  PlusCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { UserSession, UKM, Beasiswa } from '../types/mahasiswa';

import MahasiswaLogin from './components/MahasiswaLogin';
import MahasiswaRegister from './components/MahasiswaRegister';
import MahasiswaDashboardOverview from './components/MahasiswaDashboardOverview';
import MahasiswaCompleteProfile from './components/MahasiswaCompleteProfile';
import MahasiswaUkmSaya from './components/MahasiswaUkmSaya';
import MahasiswaBeasiswaSaya from './components/MahasiswaBeasiswaSaya';
import MahasiswaPengajuanPrestasi from './components/MahasiswaPengajuanPrestasi';
import MahasiswaSettings from './components/MahasiswaSettings';
import MahasiswaAjukanOrmawa from './components/MahasiswaAjukanOrmawa';
import { AuthService } from '../services/authService';
import { supabase } from '../services/supabaseClient';
import { SupabaseService } from '../services/supabaseService';

export default function MahasiswaPortal() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('upb_mahasiswa_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'mahasiswa') {
          return parsed;
        } else {
          localStorage.removeItem('upb_mahasiswa_session');
        }
      } catch (e) {
        localStorage.removeItem('upb_mahasiswa_session');
      }
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = sessionStorage.getItem('mahasiswa_active_tab');
    if (savedTab) {
      sessionStorage.removeItem('mahasiswa_active_tab');
      return savedTab;
    }
    return 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const handleBackToHome = () => {
    sessionStorage.removeItem('pending_portal');
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '#/home';
    window.location.href = url.toString();
  };

  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Batas akhir Laporan IPK Beasiswa adalah 15 Maret 2024.', unread: true },
    { id: '2', text: 'UKM Robotika menyetujui pendaftaran minat Anda.', unread: true },
    { id: '3', text: 'Pengajuan prestasi Gemastik XVII terkirim untuk verifikasi.', unread: false }
  ]);

  // Verify session validity with active auth in the background on mount
  useEffect(() => {
    const checkActiveAuth = async () => {
      try {
        const activeUser = await AuthService.getSession();
        const { data: { session: sbSession } } = await supabase.auth.getSession();

        if (activeUser && activeUser.role === 'mahasiswa') {
          // If the student doesn't have a profile yet (SSO onboarding), check if they have a pending/rejected request
          if (!activeUser.nim) {
            const { data: reqData } = await supabase
              .rpc('get_registration_status', { p_query: activeUser.email });

            const firstReq = reqData && reqData.length > 0 ? reqData[0] : null;

            if (firstReq) {
              setRegistrationStatus(firstReq.status);
              setRejectionReason(firstReq.rejection_reason);
            }
          } else {
            // Log successful login for Google SSO redirect
            if (!sessionStorage.getItem('login_logged')) {
              SupabaseService.logLogin(activeUser.email, 'mahasiswa', 'success', activeUser.id);
              sessionStorage.setItem('login_logged', 'true');
            }
          }

          // If returning from Google SSO, session might not be in localStorage yet
          setSession((prev) => {
            const nim = activeUser.nim || prev?.nimOrNip || '';
            const newSession: UserSession = {
              id: activeUser.id,
              username: nim || activeUser.email,
              role: 'mahasiswa',
              name: activeUser.name,
              nimOrNip: nim,
              avatarUrl: activeUser.avatarUrl || prev?.avatarUrl,
              email: activeUser.email || prev?.email,
              major: activeUser.major || prev?.major || '',
              semester: activeUser.semester || prev?.semester || 0,
            };
            localStorage.setItem('upb_mahasiswa_session', JSON.stringify(newSession));
            return newSession;
          });

          // Clean up query params from URL to prevent infinite loading/redirects
          if (window.location.search.includes('portal=mahasiswa')) {
            const cleanUrl = window.location.pathname + '#/mahasiswa';
            window.history.replaceState({}, document.title, cleanUrl);
          }
        } else if (activeUser && activeUser.role !== 'mahasiswa') {
          // Clear pending_portal to prevent redirect loop
          sessionStorage.removeItem('pending_portal');
          
          const adminRoles = [
            'superadmin', 'admin', 'administrator', 'operator', 
            'direktur', 'staf_beasiswa', 'staf_ormawa', 
            'staf_alumni', 'staf_depan'
          ];
          
          const url = new URL(window.location.href);
          url.search = ''; // Clear query params (e.g. ?portal=mahasiswa)
          
          if (adminRoles.includes(activeUser.role)) {
            url.hash = '#/admin';
          } else if (activeUser.role === 'admin_ormawa') {
            url.hash = '#/ormawa';
          } else {
            url.hash = '#/home';
            await supabase.auth.signOut();
          }
          
          window.location.href = url.toString();
          return;
        } else if (!sbSession) {
          // Only remove local storage session if there is absolutely no active Supabase session (ensures network resilience)
          localStorage.removeItem('upb_mahasiswa_session');
          setSession(null);
        }
      } catch (e) {
        console.error('Failed to verify active session:', e);
      }
    };
    checkActiveAuth();
  }, []);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setActiveTab('dashboard');
    localStorage.setItem('upb_mahasiswa_session', JSON.stringify(userSession));
    sessionStorage.removeItem('pending_portal');
    
    if (!sessionStorage.getItem('login_logged')) {
      SupabaseService.logLogin(userSession.email || userSession.username, 'mahasiswa', 'success', userSession.id);
      sessionStorage.setItem('login_logged', 'true');
    }
    
    // Clean up query params from URL to prevent infinite loading/redirects
    if (window.location.search.includes('portal=mahasiswa')) {
      const cleanUrl = window.location.pathname + '#/mahasiswa';
      window.history.replaceState({}, document.title, cleanUrl);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRegistrationStatus(null);
    setRejectionReason(null);
    localStorage.removeItem('upb_mahasiswa_session');
    sessionStorage.removeItem('pending_portal');
    
    // Clear search and hash to return to landing page
    window.location.search = '';
    window.location.hash = '';
  };

  const handleUpdateSession = (updated: Partial<UserSession>) => {
    if (!session) return;
    const newSession = { ...session, ...updated };
    setSession(newSession);
    localStorage.setItem('upb_mahasiswa_session', JSON.stringify(newSession));
  };

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  if (registrationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-6 text-center font-sans antialiased text-[#191c1e]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200/60 flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#001e40] tracking-tight mb-3">Pendaftaran Ditinjau</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Pendaftaran akun mahasiswa Anda sedang ditinjau oleh Admin. Silakan tunggu persetujuan untuk mengakses portal.
          </p>
          <div className="w-full space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
            >
              Sign Out / Keluar
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full py-3.5 px-4 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (registrationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-6 text-center font-sans antialiased text-[#191c1e]">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200/60 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 text-red-650 rounded-2xl flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#001e40] tracking-tight mb-3">Pendaftaran Ditolak</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Mohon maaf, pendaftaran akun Anda ditolak oleh Admin.
          </p>
          {rejectionReason && (
            <div className="w-full bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-100 mb-6 font-semibold">
              Alasan: {rejectionReason}
            </div>
          )}
          <div className="w-full space-y-3">
            <button
              onClick={() => {
                setRegistrationStatus(null);
                setRejectionReason(null);
              }}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
            >
              Daftar Kembali
            </button>
            <button
              onClick={handleSignOut}
              className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-none"
            >
              Sign Out / Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    if (showRegister) {
      return <MahasiswaRegister onRegistered={() => setShowRegister(false)} onBackToLogin={() => setShowRegister(false)} />;
    }
    return <MahasiswaLogin onLoginSuccess={handleLoginSuccess} onRegister={() => setShowRegister(true)} />;
  }

  // ENFORCE ONBOARDING
  if (!session.nimOrNip) {
    return (
      <MahasiswaCompleteProfile 
        session={session} 
        onProfileCompleted={(updated) => handleUpdateSession(updated)} 
        onProfileSubmitted={() => setRegistrationStatus('pending')}
      />
    );
  }

  const avatarUrl = (session.avatarUrl && !session.avatarUrl.includes('unsplash.com'))
    ? session.avatarUrl
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ukm', label: 'Ormawa Saya', icon: Users },
    { id: 'beasiswa', label: 'Beasiswa', icon: BookOpen },
    { id: 'prestasi', label: 'Pengajuan Prestasi', icon: Award },
    { id: 'ajukan-ormawa', label: 'Ajukan Ormawa Baru', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MahasiswaDashboardOverview session={session} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'ukm':
        return <MahasiswaUkmSaya session={session} />;
      case 'beasiswa':
        return <MahasiswaBeasiswaSaya session={session} />;
      case 'prestasi':
        return <MahasiswaPengajuanPrestasi session={session} />;
      case 'ajukan-ormawa':
        return <MahasiswaAjukanOrmawa studentId={session.id} studentName={session.name} studentNim={session.nimOrNip || ''} />;
      case 'settings':
        return <MahasiswaSettings session={session} onUpdateSession={handleUpdateSession} />;
      default:
        return <div className="p-8 text-center text-slate-400 font-bold">Fitur sedang dalam pengembangan...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#191c1e] font-sans flex w-full relative overflow-x-hidden">
      
      {/* Sidebar Navigation - Desktop */}
      <aside className="bg-white border-r border-slate-200/60 shadow-sm fixed left-0 top-0 h-screen w-64 hidden lg:flex flex-col py-6 px-4 z-40">
        <div className="px-3 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#001e40] rounded-xl flex items-center justify-center text-white shadow-md">
            <Award className="w-6 h-6 text-[#feb234]" />
          </div>
          <div>
            <h1 className="font-sans font-black text-sm text-[#001e40] leading-tight">Student Portal</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Pelita Bangsa</p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl mb-6">
          <img 
            alt="Student Profile" 
            className="w-11 h-11 rounded-full object-cover border border-slate-200" 
            src={avatarUrl} 
          />
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-[#001e40] truncate leading-tight">{session.name}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">NIM: {session.nimOrNip}</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3.5 min-h-[44px] rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#feb234] text-[#291800] shadow-sm'
                    : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#291800]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-1.5 font-sans">
          <button 
            onClick={handleBackToHome}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-[#001e40] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Kembali ke Beranda</span>
          </button>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-red-650 hover:bg-red-50/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full relative">
        
        {/* Header Navigation */}
        <header className="bg-white border-b border-slate-250/20 shadow-sm fixed top-0 right-0 left-0 lg:left-64 h-16 px-6 flex justify-between items-center z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5 text-[#001e40]" />
            </button>
            <span className="font-sans font-black text-sm md:text-base text-[#001e40] tracking-tight">
              UPB Student Affairs
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Global Search */}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#001e40]/10 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text"
                placeholder="Cari prestasi, UKM, info..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none w-48"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-[#001e40] rounded-full transition-all relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 bg-red-650 rounded-full border border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-[#001e40]">Notifikasi Terbaru</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                      className="text-[10px] font-bold text-slate-400 hover:underline cursor-pointer"
                    >
                      Tandai Dibaca
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto font-sans text-xs">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (n.unread) {
                            setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item));
                          }
                        }}
                        className={`p-2.5 rounded-xl border leading-relaxed cursor-pointer hover:bg-slate-100/80 transition-colors ${
                          n.unread ? 'bg-slate-55 border-amber-100 text-slate-700 font-bold' : 'text-slate-500 border-transparent'
                        }`}
                      >
                        {n.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => alert('Knowledge Base Panduan Mahasiswa: Akses manual panduan di direktorat.')}
              className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-[#001e40] rounded-full transition-all cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Profile Info */}
            <div className="pl-3 border-l border-slate-200 flex items-center gap-3 relative">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">{session.name}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Mahasiswa</p>
              </div>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity flex items-center justify-center focus:outline-none"
              >
                <img 
                  alt="Avatar" 
                  src={avatarUrl} 
                  className="w-full h-full object-cover"
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-250/20 py-2.5 z-50 animate-fade-in text-left font-sans">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{session.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">NIM: {session.nimOrNip}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-slate-655 hover:text-[#001e40] hover:bg-slate-50 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <Settings className="w-4 h-4 text-slate-450" />
                    <span>Pengaturan Akun</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Mobile Sidebar Slider */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-[#001e40]/30 backdrop-blur-xs z-50 lg:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside 
              className="bg-white text-slate-800 w-64 h-full p-6 flex flex-col shadow-2xl animate-slide-in-left"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 bg-[#001e40] rounded-lg flex items-center justify-center text-white">
                    <Award className="w-5 h-5 text-[#feb234]" />
                  </div>
                  <span className="font-sans font-black text-sm text-[#001e40]">Student Portal</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-grow space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 min-h-[44px] rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#feb234] text-[#291800]'
                          : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-2 font-sans">
                <button 
                  onClick={handleBackToHome}
                  className="w-full flex items-center gap-3 py-2.5 min-h-[44px] text-xs font-bold text-slate-500 hover:text-[#001e40] cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>
                <button 
                  onClick={handleSignOut} 
                  className="w-full flex items-center gap-3 py-2.5 min-h-[44px] text-xs font-bold text-slate-500 hover:text-red-650 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Dashboard Main Canvas */}
        <main className="flex-1 pt-24 px-6 md:px-8 py-6 w-full max-w-[1200px] mx-auto min-h-screen">
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
}
