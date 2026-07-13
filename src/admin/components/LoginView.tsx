import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';
import { AuthService } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';
import { SupabaseService } from '../../services/supabaseService';
import { BRAND_LOGO } from '../../constants/brand';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleGoogleSSO = async () => {
    setError(null);
    setIsLoading(true);
    try {
      sessionStorage.setItem('pending_portal', 'admin');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Force it to explicitly target your local network loopback domain
          redirectTo: 'http://10.200.24.199.nip.io:3000/?portal=admin',
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
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan saat otentikasi Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignupMessage(null);
    setIsLoading(true);

    try {
      if (isSignup) {
        if (email !== 'arfiandafirsta@gmail.com' && selectedRoles.length === 0) {
          setError('Silakan pilih minimal satu peran.');
          setIsLoading(false);
          return;
        }

        const primaryRole = email === 'arfiandafirsta@gmail.com' ? 'superadmin' : (selectedRoles[0] || 'staf_depan');
        const rolesList = email === 'arfiandafirsta@gmail.com' ? ['superadmin'] : selectedRoles;

        // Sign up new user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name.trim() || email.split('@')[0],
              role: primaryRole,
              roles: rolesList,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }

        if (data?.user) {
          // Create profile in public.users
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email,
              name: name.trim() || email.split('@')[0],
              role: primaryRole,
              roles: rolesList,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            setError('Gagal membuat profil pengguna: ' + profileError.message);
            setIsLoading(false);
            return;
          }

          setSignupMessage('Akun berhasil dibuat! Silakan masuk.');
          setIsSignup(false);
          setIsLoading(false);
          return;
        }
      } else {
        // Sign in existing user
        const { user, error: authError } = await AuthService.signIn(email, password);

        console.log('Login attempt - user:', user);

        if (authError || !user) {
          setError(authError || 'Login failed. Please check your credentials.');
          await SupabaseService.logLogin(email, 'admin', 'failed');
          setIsLoading(false);
          return;
        }

        // Only allow administrators, superadmins, and ormawa admins
        console.log('Checking role:', user.role);
        if (user.role === 'admin_ormawa') {
          await SupabaseService.logLogin(email, 'admin_ormawa', 'success', user.id);
          sessionStorage.setItem('login_logged', 'true');
          localStorage.setItem('upb_ormawa_session', JSON.stringify({
            id: user.id,
            username: user.email,
            role: 'admin_ormawa',
            name: user.name,
            nimOrNip: 'ORMAWA-' + user.id.slice(0, 8),
            avatarUrl: user.avatarUrl,
          }));
          window.location.hash = '#/ormawa';
          setIsLoading(false);
          return;
        }

        const allowedRoles = ['superadmin', 'direktur', 'staf_beasiswa', 'staf_ormawa', 'staf_alumni', 'staf_depan', 'admin', 'administrator'];
        if (!allowedRoles.includes(user.role)) {
          setError('Akses ditolak. Peran admin/staf diperlukan.');
          await SupabaseService.logLogin(email, user.role, 'failed', user.id);
          setIsLoading(false);
          return;
        }

        if (user.isApproved === false && user.role !== 'superadmin') {
          setError('Akun Anda belum disetujui oleh Super Admin. Silakan hubungi admin utama untuk aktivasi.');
          await SupabaseService.logLogin(email, user.role, 'failed', user.id);
          setIsLoading(false);
          return;
        }

        await SupabaseService.logLogin(email, user.role, 'success', user.id);
        sessionStorage.setItem('login_logged', 'true');

        onLoginSuccess({
          id: user.id,
          username: user.email,
          role: user.role === 'superadmin' ? 'superadmin' : 'admin',
          roles: user.roles || [user.role],
          isApproved: user.isApproved,
          name: user.name,
          nimOrNip: 'ADMIN-' + user.id.slice(0, 8),
          avatarUrl: user.avatarUrl,
        });
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-[#191c1e] w-full">
      {/* Subtle Background Element */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-[#001e40]/5 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[440px] z-10 flex flex-col items-center animate-fade-in">
        
        {/* Login Card */}
        <div id="login-card" className="w-full bg-white rounded-2xl shadow-xl shadow-[#001e40]/5 border border-[#c3c6d1]/30 p-8 flex flex-col gap-6">
          
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-2 mb-2">
            <div className="w-16 h-16 rounded-xl bg-[#f2f4f7] flex items-center justify-center mb-1 overflow-hidden border border-[#c3c6d1]/30">
              <img
                alt="UPB Logo"
                className="w-full h-full object-cover"
                src={BRAND_LOGO}
              />
            </div>
            <h1 className="font-headline font-bold text-2xl text-[#001e40] leading-snug">
              Direktorat Kemahasiswaan
            </h1>
            <p className="font-semibold text-xs text-[#001e40] uppercase tracking-widest bg-[#001e40]/5 px-3 py-1 rounded-full">
              Admin Portal
            </p>
          </div>

          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] text-sm p-3 rounded-lg border border-[#ffdad6] text-center font-medium">
              {error}
            </div>
          )}

          {signupMessage && (
            <div className="bg-[#dcfce7] text-[#166534] text-sm p-3 rounded-lg border border-[#dcfce7] text-center font-medium">
              {signupMessage}
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="font-semibold text-sm text-[#191c1e]" htmlFor="name">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] text-[#191c1e] text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-[#737780]/60 font-medium"
                    id="name"
                    type="text"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arfianda"
                    required={isSignup}
                  />
                </div>
              </div>
            )}

            {/* Input Group: Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-[#191c1e]" htmlFor="email">
                Email Address / Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737780] pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] text-[#191c1e] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-[#737780]/60 font-medium"
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pelitabangsa.ac.id atau ukmseni_upb"
                  required
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-[#191c1e]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737780] pointer-events-none">
                  <Lock size={18} />
                </span>
                <input
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] text-[#191c1e] text-sm rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-[#737780]/60 font-medium"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737780] hover:text-[#191c1e] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="flex flex-col gap-2 bg-[#f8fafc] border border-slate-100 p-4 rounded-xl animate-fade-in text-left">
                <label className="font-bold text-[10px] text-[#001e40] uppercase tracking-wider">
                  Pilih Peran Yang Diajukan
                </label>
                <p className="text-[10px] text-[#737780] font-semibold leading-relaxed mb-1">
                  Pilih satu atau beberapa peran staf Dirmawa.
                </p>
                <div className="space-y-2">
                  {[
                    { key: 'direktur', label: 'Direktur Dirmawa' },
                    { key: 'staf_beasiswa', label: 'Staf Beasiswa' },
                    { key: 'staf_ormawa', label: 'Staf Ormawa / Kemahasiswaan' },
                    { key: 'staf_alumni', label: 'Staf Alumni / Karir' },
                    { key: 'staf_depan', label: 'Staf Depan / Front Staff' },
                  ].map((roleItem) => (
                    <label key={roleItem.key} className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#43474f] hover:text-[#191c1e] transition-all py-0.5">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(roleItem.key)}
                        onChange={() => handleRoleToggle(roleItem.key)}
                        className="w-4 h-4 rounded border-[#c3c6d1] text-[#001e40] focus:ring-[#001e40] bg-white cursor-pointer"
                      />
                      <span>{roleItem.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Helper Row */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  className="w-4 h-4 rounded border-[#c3c6d1] text-[#001e40] focus:ring-[#001e40] bg-[#f2f4f7] cursor-pointer"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-xs text-[#43474f] font-medium group-hover:text-[#191c1e] transition-colors select-none">
                  Remember Me
                </span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact Administrator to reset your password."); }} className="text-xs font-semibold text-[#001e40] hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              className="w-full mt-2 bg-[#001e40] hover:bg-[#1f477b] text-white font-semibold text-sm rounded-xl py-3.5 transition-colors shadow-lg shadow-[#001e40]/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              id="sign-in-button"
              disabled={isLoading}
            >
              {isLoading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
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
            Masuk dengan Google Kampus
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-1 pt-4 border-t border-[#c3c6d1]/20 text-center">
            <p className="text-xs text-[#737780] font-medium">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                  setSignupMessage(null);
                }}
                className="text-[#001e40] font-bold hover:underline"
              >
                {isSignup ? 'Sign In' : 'Sign Up Here'}
              </button>
            </p>
          </div>

          {/* Back to Landing Page Link */}
          <div className="text-center mt-1">
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

          {/* Security Indicator */}
          <div className="mt-1 pt-4 border-t border-[#c3c6d1]/30 flex items-center justify-center gap-2 text-[#43474f]">
            <ShieldCheck size={18} className="text-[#001e40]" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Authorized Personnel Only
            </span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col items-center gap-1.5 text-center">
          <p className="text-xs text-[#43474f] font-medium">
            Need assistance? Contact{' '}
            <a
              href="#support"
              onClick={(e) => { e.preventDefault(); alert("IT Support Email: support@pelitabangsa.ac.id"); }}
              className="text-[#001e40] font-bold hover:underline"
            >
              IT Support
            </a>
          </p>
          <p className="text-xs text-[#737780] font-medium">
            © 2024 Universitas Pelita Bangsa. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
