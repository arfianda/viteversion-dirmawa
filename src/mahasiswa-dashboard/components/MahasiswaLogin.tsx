import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, GraduationCap } from 'lucide-react';
import { UserSession } from '../../types/mahasiswa';
import { AuthService } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';

interface MahasiswaLoginProps {
  onLoginSuccess: (session: UserSession) => void;
  onRegister: () => void;
}

interface MahasiswaProfile {
  user_id: string;
  major: string;
  semester: number;
}

interface UserData {
  email: string;
  role: string;
  name: string;
  avatar_url: string | null;
}

export default function MahasiswaLogin({ onLoginSuccess, onRegister }: MahasiswaLoginProps) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Fetch the student's email, name, role, major, and semester via secure RPC by NIM
      const { data: loginInfoList, error: loginInfoError } = await supabase
        .rpc('get_student_login_info', { p_nim: nim });

      const loginInfo = loginInfoList && loginInfoList.length > 0 ? loginInfoList[0] : null;

      if (loginInfoError || !loginInfo) {
        // Fall back to checking registration requests if they just signed up
        const { data: reqData, error: reqError } = await supabase
          .rpc('get_registration_status', { p_query: nim });

        const firstRequest = reqData && reqData.length > 0 ? reqData[0] : null;

        if (!reqError && firstRequest) {
          if (firstRequest.status === 'pending') {
            setError('Pendaftaran akun Anda sedang ditinjau oleh Admin. Harap tunggu persetujuan.');
          } else if (firstRequest.status === 'rejected') {
            setError(`Pendaftaran akun Anda ditolak oleh Admin. Alasan: ${firstRequest.rejection_reason || 'Tidak ada alasan yang diberikan.'}`);
          } else {
            setError('NIM tidak ditemukan. Silakan periksa kembali NIM Anda.');
          }
        } else {
          setError('NIM tidak ditemukan. Silakan periksa kembali NIM Anda.');
        }
        setIsLoading(false);
        return;
      }

      // Step 2: Ensure the user is a student
      if (loginInfo.role !== 'mahasiswa') {
        setError('Akses ditolak. Portal ini hanya untuk mahasiswa.');
        setIsLoading(false);
        return;
      }

      // Step 3: Authenticate via Supabase Auth
      const { user, error: authError } = await AuthService.signIn(loginInfo.email, password);

      if (authError || !user) {
        setError(authError || 'NIM atau password salah. Silakan periksa kembali.');
        setIsLoading(false);
        return;
      }

      // Step 4: Build session
      onLoginSuccess({
        id: user.id,
        username: nim,
        role: 'mahasiswa',
        name: loginInfo.name || user.name,
        nimOrNip: nim,
        avatarUrl: loginInfo.avatar_url || user.avatarUrl,
        email: loginInfo.email,
        major: loginInfo.major,
        semester: loginInfo.semester,
      });

      setIsLoading(false);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4 md:p-10 font-sans text-[#191c1e] antialiased">
      <div className="w-full max-w-[1100px] bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#001e40]/5 flex flex-col md:flex-row min-h-[680px] border border-slate-200/50">
        {/* Left Panel: Brand / Image Graphic */}
        <div className="hidden md:flex w-1/2 relative bg-[#001e40] items-center justify-center p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Universitas Pelita Bangsa Campus"
              className="w-full h-full object-cover opacity-25 mix-blend-overlay"
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001e40] via-transparent to-transparent opacity-80"></div>
          </div>

          <div className="relative z-10 max-w-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 mb-8 transform transition hover:scale-105">
              <GraduationCap className="text-[#feb234] w-12 h-12" />
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight leading-tight mb-4">
              Empowering Your Academic Journey
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Selamat datang di Portal Direktorat Kemahasiswaan & Alumni. Akses rekaman akademik, ajukan beasiswa, laporkan prestasi, dan kembangkan minat bakat Anda.
            </p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-[#001e40]/5 rounded-xl flex items-center justify-center text-[#001e40]">
              <GraduationCap className="w-6 h-6 text-[#001e40]" />
            </div>
            <span className="font-sans font-black text-base text-[#001e40] tracking-tight">
              UPB Student Affairs
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-sans font-black text-3xl text-[#001e40] tracking-tight mb-1.5">
              Masuk Portal Mahasiswa
            </h2>
            <p className="text-sm text-sale-500 font-medium">
              Silakan masuk menggunakan NIM dan sandi Anda.
            </p>
          </div>

          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] text-xs p-3.5 rounded-xl border border-[#ffdad6] text-center font-bold mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIM Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-xs uppercase tracking-wider text-slate-600" htmlFor="nim">
                NIM / Username
              </label>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl px-4 py-3.5 font-medium outline-none transition-all placeholder:text-slate-400"
                  id="nim"
                  name="nim"
                  placeholder="Masukkan NIM Anda"
                  required
                  type="text"
                  value={nim}
                    onChange={(e) => setNim(e.target.value)}
                  />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600" htmlFor="password">
                  Password
                </label>
                <a
                  className="text-xs font-semibold text-[#001e40] hover:underline"
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Hubungi Biro Teknologi Informasi UPB untuk mereset kata sandi Anda.'); }}
                >
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-4 pr-12 py-3.5 font-medium outline-none transition-all placeholder:text-slate-400"
                  id="password"
                  name="password"
                  placeholder="Masukkan password Anda"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#001e40]/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Memuat...' : 'Masuk Portal'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="text-[#001e40] font-bold hover:underline cursor-pointer"
              >
                Daftar disini
              </button>
            </p>
          </div>

          {/* Back to Landing Page Link */}
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => { window.location.hash = ''; }}
              className="text-slate-400 hover:text-[#001e40] text-xs font-bold transition-colors cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>

          {/* Security Banner */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-5 h-5 text-[#001e40]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Authorized Student Access Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
