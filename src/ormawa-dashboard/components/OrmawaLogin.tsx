import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface OrmawaLoginProps {
  onLoginSuccess: (session: any) => void;
}

export default function OrmawaLogin({ onLoginSuccess }: OrmawaLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, error: authError } = await AuthService.signIn(email, password);

      if (authError || !user) {
        setError(authError || 'Kredensial salah. Silakan periksa kembali.');
        setIsLoading(false);
        return;
      }

      if (user.role !== 'admin_ormawa') {
        setError('Akses ditolak. Halaman ini hanya untuk Administrator Ormawa.');
        setIsLoading(false);
        return;
      }

      const sessionData = {
        id: user.id,
        username: user.email,
        role: 'admin_ormawa',
        name: user.name,
        nimOrNip: 'ORMAWA-' + user.id.slice(0, 8),
        avatarUrl: user.avatarUrl,
      };

      localStorage.setItem('upb_ormawa_session', JSON.stringify(sessionData));
      onLoginSuccess(sessionData);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Terjadi kesalahan sistem saat masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-[#191c1e] w-full">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-[#001e40]/5 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <main className="w-full max-w-[420px] z-10 flex flex-col items-center animate-fade-in">
        {/* Brand logo/badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#001e40] flex items-center justify-center shadow-lg shadow-[#001e40]/10">
            <span className="text-[#feb234] font-black text-lg">O</span>
          </div>
          <div className="text-left leading-tight">
            <span className="font-mono text-[9px] font-black text-[#feb234] block uppercase tracking-widest">PORTAL INTEGRASI</span>
            <span className="font-sans font-black text-sm text-[#001e40]">ADMIN ORMAWA</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-[#001e40]/5 border border-[#c3c6d1]/30 p-8 flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-1.5">
            <h2 className="font-sans font-black text-xl text-[#001e40] tracking-tight">Portal Ormawa</h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Masuk dengan akun Ormawa / Himpunan mahasiswa untuk mengelola organisasi Anda.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200/60 p-4 rounded-xl flex items-start gap-3 animate-fade-in text-left text-xs font-semibold text-red-700">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-650" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            {/* Input Group: Username / Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700" htmlFor="email">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  className="w-full bg-slate-50 border border-[#c3c6d1]/70 text-[#191c1e] text-xs rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-slate-400 font-semibold"
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: username_ormawa"
                  required
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  className="w-full bg-slate-50 border border-[#c3c6d1]/70 text-[#191c1e] text-xs rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-slate-400 font-semibold"
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#191c1e] transition-colors w-11 h-11 flex items-center justify-center cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full mt-2 bg-[#001e40] hover:bg-[#1f477b] text-white font-semibold text-xs uppercase tracking-wider rounded-xl py-3.5 transition-colors shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Masuk...' : 'Masuk Portal'}
              {!isLoading && <ArrowRight size={14} />}
            </button>
          </form>
        </div>

        <p className="mt-8 text-[10px] text-slate-400 font-semibold">
          Direktorat Kemahasiswaan &amp; Alumni Universitas Pelita Bangsa © 2026
        </p>
      </main>
    </div>
  );
}
