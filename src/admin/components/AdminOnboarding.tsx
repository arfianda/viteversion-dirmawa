import React, { useState } from 'react';
import { ShieldCheck, Mail, User, ArrowRight, LogOut } from 'lucide-react';

interface AdminOnboardingProps {
  email: string;
  onSubmit: (name: string, roles: string[]) => Promise<void>;
  onSignOut: () => void;
  isLoading: boolean;
  error: string | null;
}

const AVAILABLE_ROLES = [
  { value: 'direktur', label: 'Direktur Dirmawa', desc: 'Akses baca (Read-only) ke seluruh modul beasiswa, alumni, ormawa, dan agenda.' },
  { value: 'staf_beasiswa', label: 'Staf Beasiswa', desc: 'Mengelola program beasiswa dan verifikasi pendaftar beasiswa.' },
  { value: 'staf_ormawa', label: 'Staf Ormawa', desc: 'Mengelola direktori Ormawa, verifikasi proposal & LPJ, serta laporan anggota.' },
  { value: 'staf_alumni', label: 'Staf Alumni', desc: 'Mengelola basis data alumni, pelacakan tracer study, dan statistik karir.' },
  { value: 'staf_depan', label: 'Staf Depan / Front Desk', desc: 'Mengatur janji temu tamu/mahasiswa dengan Direktur dan umum.' },
];

export default function AdminOnboarding({ email, onSubmit, onSignOut, isLoading, error }: AdminOnboardingProps) {
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!name.trim()) {
      setValidationError('Nama lengkap wajib diisi.');
      return;
    }
    
    if (selectedRoles.length === 0) {
      setValidationError('Pilih minimal satu peran staf yang diajukan.');
      return;
    }

    onSubmit(name.trim(), selectedRoles);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-[#191c1e] w-full">
      {/* Subtle Background Element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-[#001e40]/5 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <main className="w-full max-w-[480px] z-10 flex flex-col items-center animate-fade-in">
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-[#001e40]/5 border border-[#c3c6d1]/30 p-8 flex flex-col gap-6">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-2 mb-2">
            <div className="w-16 h-16 rounded-xl bg-[#f2f4f7] flex items-center justify-center mb-1 overflow-hidden border border-[#c3c6d1]/30">
              <img
                alt="UPB Logo"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3jVZ0gnP1io7hv_EKmsUA0s0v7P43UjpVBwguh_r3QVt5Dm4tz2mfh0vT9aWln58W1_fZxHlbY16eWk5VKX1jgZBnaH200pA6g1VCPL8I43xCoLGsruIGqBGEGNaLkFtNy1FAH1xOAXyzcn6YIat9XO541xj6DQUzdkHICC1Jb4ngg7898WTlID-ob-hpyTWybxVzdskYbABFEGf_fwFWdIsx-NvILmzz3pxBUjLwfX7jsXe5vh9iYxsbUldDq-FskdT4Ykg80n0"
              />
            </div>
            <h1 className="font-headline font-bold text-2xl text-[#001e40] leading-snug">
              Lengkapi Profil Staf
            </h1>
            <p className="font-semibold text-xs text-[#001e40] uppercase tracking-widest bg-[#001e40]/5 px-3 py-1 rounded-full">
              Pendaftaran SSO Baru
            </p>
          </div>

          {(error || validationError) && (
            <div className="bg-[#ffdad6] text-[#93000a] text-sm p-3.5 rounded-xl border border-[#ffdad6] text-center font-medium">
              {validationError || error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Locked Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-[#191c1e]" htmlFor="email">
                Email Anda (Akun Google)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737780] pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1]/50 text-[#737780] text-sm rounded-xl pl-12 pr-4 py-3 font-medium outline-none cursor-not-allowed"
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />
              </div>
            </div>

            {/* Input Group: Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-[#191c1e]" htmlFor="name">
                Nama Lengkap & Gelar
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737780] pointer-events-none">
                  <User size={18} />
                </span>
                <input
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] text-[#191c1e] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-[#737780]/60 font-medium"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Arfianda Firsta, S.Kom."
                  required
                />
              </div>
            </div>

            {/* Checkbox Group: Roles */}
            <div className="flex flex-col gap-2.5">
              <label className="font-bold text-[10px] text-[#001e40] uppercase tracking-wider">
                Pilih Peran Yang Diajukan
              </label>
              <p className="text-[10px] text-[#737780] font-semibold leading-relaxed -mt-1">
                Anda dapat memilih lebih dari satu peran sesuai kebutuhan tugas.
              </p>
              <div className="space-y-2.5 bg-[#f8fafc] border border-slate-100 p-4 rounded-xl max-h-[220px] overflow-y-auto">
                {AVAILABLE_ROLES.map((role) => (
                  <label
                    key={role.value}
                    className="flex items-start gap-3 cursor-pointer group text-xs text-[#43474f] hover:text-[#191c1e] transition-all py-1 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.value)}
                      onChange={() => handleRoleToggle(role.value)}
                      className="w-4 h-4 mt-0.5 rounded border-[#c3c6d1] text-[#001e40] focus:ring-[#001e40] bg-white cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{role.label}</span>
                      <span className="text-[10px] text-[#737780] font-semibold mt-0.5 leading-normal">{role.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full mt-2 bg-[#001e40] hover:bg-[#1f477b] text-white font-semibold text-sm rounded-xl py-3.5 transition-colors shadow-lg shadow-[#001e40]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Akses'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Cancel/Sign Out Button */}
          <div className="mt-1 pt-4 border-t border-[#c3c6d1]/20 text-center">
            <button
              type="button"
              onClick={onSignOut}
              className="text-[#ba1a1a] hover:bg-[#ffdad6] font-bold text-xs px-4 py-2.5 rounded-xl border border-transparent hover:border-[#ffdad6] transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <LogOut size={14} />
              Batalkan &amp; Keluar
            </button>
          </div>

          {/* Security Banner */}
          <div className="mt-1 pt-4 border-t border-[#c3c6d1]/30 flex items-center justify-center gap-2 text-[#43474f]">
            <ShieldCheck size={18} className="text-[#001e40]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Pendaftaran Tersertifikasi Aman
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
