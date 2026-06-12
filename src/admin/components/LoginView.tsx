import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserSession } from '../types';
import { AuthService } from '../../services/authService';

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
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
      const { user, error: authError } = await AuthService.signIn(email, password);

      if (authError || !user) {
        setError(authError || 'Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Only allow administrators
      if (user.role !== 'administrator') {
        setError('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      onLoginSuccess({
        username: user.email,
        role: 'admin',
        name: user.name,
        nimOrNip: 'ADMIN-' + user.id.slice(0, 8),
        avatarUrl: user.avatarUrl,
      });
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  // Pre-fill demo credentials
  const fillDemo = (demoType: 'admin' | 'super' | 'editor') => {
    if (demoType === 'admin') {
      setEmail('abcd@upb.ac.id');
      setPassword('password123');
    } else if (demoType === 'super') {
      setEmail('efgh@upb.ac.id');
      setPassword('password123');
    } else if (demoType === 'editor') {
      setEmail('asdf@upb.ac.id');
      setPassword('password123');
    }
    setError(null);
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3jVZ0gnP1io7hv_EKmsUA0s0v7P43UjpVBwguh_r3QVt5Dm4tz2mfh0vT9aWln58W1_fZxHlbY16eWk5VKX1jgZBnaH200pA6g1VCPL8I43xCoLGsruIGqBGEGNaLkFtNy1FAH1xOAXyzcn6YIat9XO541xj6DQUzdkHICC1Jb4ngg7898WTlID-ob-hpyTWybxVzdskYbABFEGf_fwFWdIsx-NvILmzz3pxBUjLwfX7jsXe5vh9iYxsbUldDq-FskdT4Ykg80n0"
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

          {/* Login Form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Input Group: Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-sm text-[#191c1e]" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737780] pointer-events-none">
                  <Mail size={18} />
                </span>
                <input
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] text-[#191c1e] text-sm rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#001e40] focus:border-[#001e40] transition-all placeholder:text-[#737780]/60 font-medium"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pelitabangsa.ac.id"
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
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-1 pt-4 border-t border-[#c3c6d1]/20 flex flex-col gap-2">
            <p className="text-xs text-[#737780] font-medium text-center">Demo Accounts (use password: <code className="bg-slate-100 px-1 rounded">password123</code>):</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => fillDemo('super')}
                className="text-[11px] font-semibold bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001e40] py-1 px-2.5 rounded-lg border border-[#c3c6d1]/30 transition-colors"
                disabled={isLoading}
              >
                Dr. ABCD
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="text-[11px] font-semibold bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001e40] py-1 px-2.5 rounded-lg border border-[#c3c6d1]/30 transition-colors"
                disabled={isLoading}
              >
                EFGH, M.Kom
              </button>
              <button
                type="button"
                onClick={() => fillDemo('editor')}
                className="text-[11px] font-semibold bg-[#f2f4f7] hover:bg-[#eceef1] text-[#001e40] py-1 px-2.5 rounded-lg border border-[#c3c6d1]/30 transition-colors"
                disabled={isLoading}
              >
                ASDF
              </button>
            </div>
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
