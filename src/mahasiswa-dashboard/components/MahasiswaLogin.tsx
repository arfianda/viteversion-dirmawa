import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, GraduationCap } from 'lucide-react';
import { UserSession } from '../../types/mahasiswa';
import { AuthService } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';
import { SupabaseService } from '../../services/supabaseService';

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
        await SupabaseService.logLogin(loginInfo.email, 'mahasiswa', 'failed');
        setIsLoading(false);
        return;
      }

      // Step 3: Authenticate via Supabase Auth
      const { user, error: authError } = await AuthService.signIn(loginInfo.email, password);

      if (authError || !user) {
        setError(authError || 'NIM atau password salah. Silakan periksa kembali.');
        await SupabaseService.logLogin(loginInfo.email, 'mahasiswa', 'failed');
        setIsLoading(false);
        return;
      }

      // Log success
      await SupabaseService.logLogin(loginInfo.email, 'mahasiswa', 'success', user.id);
      sessionStorage.setItem('login_logged', 'true'); // Prevents double logging SSO hooks

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

  const handleGoogleSSO = async () => {
    try {
      sessionStorage.setItem('pending_portal', 'mahasiswa');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Force it to explicitly target your local network loopback domain
          redirectTo: 'http://127.0.0.1:3000/?portal=mahasiswa',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          }
        }
      });
      if (error) {
        setError('Gagal masuk dengan Google: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat otentikasi Google.');
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

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ATAU</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google SSO Button */}
          <button
            onClick={handleGoogleSSO}
            type="button"
            className="w-full flex justify-center items-center gap-3 py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>

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
              onClick={() => {
                sessionStorage.removeItem('pending_portal');
                const url = new URL(window.location.href);
                url.search = '';
                url.hash = '#/home';
                window.location.href = url.toString();
              }}
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
