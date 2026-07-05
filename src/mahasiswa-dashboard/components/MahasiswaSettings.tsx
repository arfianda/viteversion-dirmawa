import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Camera, 
  ShieldAlert, 
  Mail, 
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2
} from 'lucide-react';
import { UserSession } from '../../types/mahasiswa';

interface SettingsProps {
  session: UserSession;
  onUpdateSession: (updated: Partial<UserSession>) => void;
}

type TabType = 'profile' | 'security' | 'notifications';

export default function MahasiswaSettings({ session, onUpdateSession }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const avatarUrl = (session.avatarUrl && !session.avatarUrl.includes('unsplash.com'))
    ? session.avatarUrl
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  
  // Profile state seeded from real session data
  const [profileForm, setProfileForm] = useState({
    name: session.name || '',
    email: session.email || '',
    phone: '+62 812 3456 7890'
  });

  // Security state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    scholarshipEmail: true,
    scholarshipPush: true,
    ukmEmail: false,
    ukmPush: true
  });

  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const triggerSaveState = (action: () => void) => {
    setSavingState('saving');
    setTimeout(() => {
      action();
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    }, 1000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSaveState(() => {
      onUpdateSession({ name: profileForm.name });
    });
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Sandi baru dan konfirmasi sandi tidak cocok!');
      return;
    }
    triggerSaveState(() => {
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Kata sandi Anda berhasil diperbarui.');
    });
  };

  const toggleShowPassword = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Save Success Alert Overlay */}
      {savingState === 'saved' && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-50 text-emerald-800 border border-emerald-200 px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-xs">Perubahan Anda telah berhasil disimpan!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Side: Navigation Tabs Sidebar */}
        <nav className="w-full md:w-64 space-y-2 shrink-0 font-sans">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${
              activeTab === 'profile' 
                ? 'bg-[#001e40] text-white shadow-sm' 
                : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${
              activeTab === 'security' 
                ? 'bg-[#001e40] text-white shadow-sm' 
                : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Keamanan</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${
              activeTab === 'notifications' 
                ? 'bg-[#001e40] text-white shadow-sm' 
                : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Preferensi Notifikasi</span>
          </button>
        </nav>

        {/* Right Side: Content Area */}
        <div className="flex-1 w-full">
          
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-md relative">
                    <img 
                      src={avatarUrl} 
                      alt="Student Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={() => alert('Fitur upload foto profil segera hadir.')}
                    className="absolute -bottom-2 -right-2 bg-[#001e40] hover:bg-[#1f477b] text-white p-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    title="Ubah Foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-display font-extrabold text-xl text-[#001e40]">Informasi Personal</h3>
                  <p className="text-xs text-slate-500 font-medium">Perbarui detail profil dan cara kami menghubungi Anda.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800 font-sans">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Nama Lengkap</label>
                  <input 
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-750 block">Nomor Induk Mahasiswa (NIM)</label>
                  <input 
                    type="text"
                    disabled
                    value={session.nimOrNip || '202100123'}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Email Institusi</label>
                  <input 
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Nomor Telepon</label>
                  <input 
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2 pt-4 flex justify-end border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={savingState === 'saving'}
                    className="px-6 py-3 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#001e40]/5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingState === 'saving' ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-8 animate-fade-in">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h3 className="font-display font-extrabold text-xl text-[#001e40]">Keamanan Akun</h3>
                <p className="text-xs text-slate-500 font-medium">Kelola kata sandi Anda untuk menjaga keamanan data akademik.</p>
              </div>

              <form onSubmit={handleSecuritySubmit} className="space-y-5 max-w-md text-xs text-slate-800 font-sans">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Kata Sandi Saat Ini</label>
                  <div className="relative">
                    <input 
                      type={showPassword['current'] ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl pl-4 pr-12 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleShowPassword('current')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 transition-colors"
                    >
                      {showPassword['current'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Kata Sandi Baru</label>
                  <div className="relative">
                    <input 
                      type={showPassword['new'] ? 'text' : 'password'}
                      required
                      placeholder="Minimal 8 karakter"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl pl-4 pr-12 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleShowPassword('new')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 transition-colors"
                    >
                      {showPassword['new'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <input 
                      type={showPassword['confirm'] ? 'text' : 'password'}
                      required
                      placeholder="Ulangi kata sandi baru"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl pl-4 pr-12 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleShowPassword('confirm')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700 transition-colors"
                    >
                      {showPassword['confirm'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    disabled={savingState === 'saving'}
                    className="px-6 py-3 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <span>{savingState === 'saving' ? 'Mengubah...' : 'Ubah Sandi'}</span>
                  </button>
                </div>
              </form>

              {/* 2FA Banner */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="font-sans font-black text-xs uppercase tracking-wider text-slate-650">Verifikasi Dua Langkah (2FA)</h4>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-amber-50/50 border border-[#feb234]/15 rounded-2xl gap-4">
                  <div className="flex gap-3 items-center">
                    <ShieldAlert className="w-8 h-8 text-[#815500] shrink-0" />
                    <div className="text-xs font-semibold text-slate-700 leading-normal">
                      <p className="font-bold text-[#291800]">2FA belum diaktifkan</p>
                      <p className="opacity-90 mt-0.5">Tambahkan lapisan keamanan ekstra pada akun mahasiswa Anda.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Membuka penyiapan authenticator MFA...')}
                    className="text-xs font-bold text-[#815500] hover:underline shrink-0 pl-11 sm:pl-0"
                  >
                    Aktifkan Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notification Preferences */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-8 animate-fade-in">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h3 className="font-display font-extrabold text-xl text-[#001e40]">Preferensi Notifikasi</h3>
                <p className="text-xs text-slate-500 font-medium">Pilih jenis informasi yang ingin Anda terima.</p>
              </div>

              <div className="space-y-8 text-xs text-slate-800 font-sans">
                
                {/* Scholarship Preferences */}
                <div className="space-y-4">
                  <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#815500]" />
                    <span>Info Beasiswa</span>
                  </h4>
                  
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#291800]">Email Notifikasi</p>
                        <p className="text-slate-450 font-medium mt-0.5">Terima info update beasiswa terbaru di inbox email Anda.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.scholarshipEmail}
                          onChange={() => setNotifications(prev => ({ ...prev, scholarshipEmail: !prev.scholarshipEmail }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001e40]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#291800]">Push Notifikasi</p>
                        <p className="text-slate-450 font-medium mt-0.5">Dapatkan notifikasi instan pada panel dashboard atau perangkat mobile.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.scholarshipPush}
                          onChange={() => setNotifications(prev => ({ ...prev, scholarshipPush: !prev.scholarshipPush }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001e40]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* UKM Preferences */}
                <div className="pt-6 border-t border-slate-150 space-y-4">
                  <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#815500]" />
                    <span>Kegiatan &amp; Informasi UKM</span>
                  </h4>
                  
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#291800]">Email Notifikasi</p>
                        <p className="text-slate-450 font-medium mt-0.5">Menerima rangkuman mingguan mengenai program pendaftaran dan kegiatan UKM.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.ukmEmail}
                          onChange={() => setNotifications(prev => ({ ...prev, ukmEmail: !prev.ukmEmail }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001e40]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#291800]">Push Notifikasi</p>
                        <p className="text-slate-450 font-medium mt-0.5">Dapatkan peringatan mendesak terkait perubahan jadwal latihan atau rapat.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.ukmPush}
                          onChange={() => setNotifications(prev => ({ ...prev, ukmPush: !prev.ukmPush }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001e40]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => triggerSaveState(() => {})}
                    disabled={savingState === 'saving'}
                    className="px-6 py-3 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingState === 'saving' ? 'Menyimpan...' : 'Simpan Preferensi'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
