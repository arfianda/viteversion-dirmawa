import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  Award,
  HelpCircle,
  X,
  User,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { UserSession } from '../admin/types';
import { OrmawaService, OrmawaAdminProfile } from '../services/ormawaService';

// Subcomponents
import OrmawaDashboardOverview from './components/OrmawaDashboardOverview';
import OrmawaDetailEditor from './components/OrmawaDetailEditor';
import OrmawaMemberManagement from './components/OrmawaMemberManagement';
import OrmawaProposalsManagement from './components/OrmawaProposalsManagement';
import OrmawaLogin from './components/OrmawaLogin';

export default function OrmawaPortal() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('upb_ormawa_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin_ormawa') {
          return parsed;
        } else {
          localStorage.removeItem('upb_ormawa_session');
        }
      } catch (e) {
        localStorage.removeItem('upb_ormawa_session');
      }
    }
    return null;
  });

  const [ormawaProfile, setOrmawaProfile] = useState<OrmawaAdminProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: '1', text: 'Proposal Kegiatan "Workshop IoT" telah disetujui oleh Staff Dirmawa dan diteruskan ke DAU.', unread: true },
    { id: '2', text: 'LPJ "Latihan Gabungan Seni" berhasil diarsipkan oleh Biro Kemahasiswaan.', unread: false }
  ]);

  // Load Ormawa profile linked to this user
  useEffect(() => {
    if (!session) return;
    const fetchOrmawaProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const profile = await OrmawaService.getOrmawaAdminProfile(session.id);
        if (profile) {
          setOrmawaProfile(profile);
        } else {
          console.warn('No Ormawa Profile linked to this user account!');
        }
      } catch (e) {
        console.error('Failed to load Ormawa profile:', e);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchOrmawaProfile();
  }, [session]);

  const handleSignOut = () => {
    setSession(null);
    localStorage.removeItem('upb_ormawa_session');
    window.location.hash = '';
  };

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  if (!session) {
    return <OrmawaLogin onLoginSuccess={setSession} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detail', label: 'Detail Ormawa', icon: Settings },
    { id: 'members', label: 'Anggota Ormawa', icon: Users },
    { id: 'proposals', label: 'Proposal & LPJ', icon: FileText },
  ];

  const renderTabContent = () => {
    if (isLoadingProfile) {
      return (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans font-bold">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#001e40] rounded-full animate-spin"></div>
          <span>Memuat data organisasi...</span>
        </div>
      );
    }

    if (!ormawaProfile) {
      return (
        <div className="p-8 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-start gap-3.5 font-sans">
          <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-bold text-sm">Kesalahan Profil Organisasi</h4>
            <p className="text-xs text-amber-700 mt-1">
              Akun admin ini belum dihubungkan dengan organisasi kemahasiswaan manapun di database. Hubungi Biro Kemahasiswaan (Dirmawa) untuk verifikasi pemetaan profil.
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <OrmawaDashboardOverview ukmId={ormawaProfile.ukm_id} ukmName={ormawaProfile.ukm_name} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'detail':
        return <OrmawaDetailEditor ukmId={ormawaProfile.ukm_id} />;
      case 'members':
        return <OrmawaMemberManagement ukmId={ormawaProfile.ukm_id} ukmName={ormawaProfile.ukm_name} />;
      case 'proposals':
        return <OrmawaProposalsManagement ukmId={ormawaProfile.ukm_id} ukmName={ormawaProfile.ukm_name} />;
      default:
        return <div className="p-8 text-center text-slate-400 font-bold font-sans">Fitur sedang dalam pengembangan...</div>;
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
            <h1 className="font-sans font-black text-sm text-[#001e40] leading-tight">Ormawa Admin</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Pelita Bangsa</p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl mb-6">
          <div className="w-11 h-11 rounded-full bg-[#001e40] text-white font-black text-sm flex items-center justify-center border border-slate-200 uppercase">
            {ormawaProfile ? ormawaProfile.ukm_name.substring(0, 2) : 'OM'}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-[#001e40] truncate leading-tight">
              {ormawaProfile ? ormawaProfile.ukm_name : 'Memuat...'}
            </p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 capitalize">Admin Khusus</p>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#001e40] text-white shadow-sm' 
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#feb234]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer sign out */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50/50 hover:text-red-750 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 h-16 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <span>Ormawa Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#001e40] capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 animate-fade-in font-sans text-xs">
                    <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="font-extrabold text-[#001e40]">Notifikasi</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                          className="text-[10px] font-bold text-slate-450 hover:underline cursor-pointer"
                        >
                          Tandai Dibaca
                        </button>
                        {unreadNotificationsCount > 0 && (
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold text-[9px]">
                            {unreadNotificationsCount} Baru
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto pt-1.5">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (notif.unread) {
                              setNotifications(notifications.map(item => item.id === notif.id ? { ...item, unread: false } : item));
                            }
                          }}
                          className={`px-4 py-3 hover:bg-slate-50/80 transition-colors flex items-start gap-2.5 cursor-pointer ${notif.unread ? 'bg-blue-50/10' : ''}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                          <p className={`text-[11px] leading-relaxed ${notif.unread ? 'text-slate-800 font-bold' : 'text-slate-400 font-medium'}`}>{notif.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu Toggle */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="w-8 h-8 rounded-full bg-[#001e40] text-white flex items-center justify-center font-bold text-xs uppercase">
                {ormawaProfile ? ormawaProfile.ukm_name.substring(0, 1) : 'O'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[11px] font-bold text-[#001e40] leading-tight max-w-[120px] truncate">
                  {ormawaProfile ? ormawaProfile.ukm_name : 'Memuat...'}
                </p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">Admin Ormawa</p>
              </div>
            </div>

          </div>
        </header>

        {/* Sub-view Content Frame */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          <aside className="bg-white fixed left-0 top-0 h-screen w-64 p-6 z-50 flex flex-col lg:hidden animate-slide-in">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#001e40] rounded-xl flex items-center justify-center text-white">
                  <Award className="w-5 h-5 text-[#feb234]" />
                </div>
                <div>
                  <h1 className="font-sans font-black text-xs text-[#001e40] leading-tight">Ormawa Admin</h1>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Pelita Bangsa</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#001e40] text-white' 
                        : 'text-slate-550 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#feb234]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50/50 hover:text-red-750 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </aside>
        </>
      )}

    </div>
  );
}
