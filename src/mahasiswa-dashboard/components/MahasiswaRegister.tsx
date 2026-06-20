import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, Lock, ShieldCheck, BookOpen, Calendar, Hash } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface MahasiswaRegisterProps {
  onRegistered: () => void;
  onBackToLogin: () => void;
}

export default function MahasiswaRegister({ onRegistered, onBackToLogin }: MahasiswaRegisterProps) {
  const [form, setForm] = useState({
    nim: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    major: '',
    faculty: '',
    semester: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (!/^[0-9]+$/.test(form.nim)) {
      setError('NIM harus berupa angka.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: insertError } = await supabase.from('registration_requests').insert({
        nim: form.nim,
        name: form.name,
        email: form.email,
        password: form.password,
        major: form.major,
        faculty: form.faculty,
        semester: parseInt(form.semester) || null,
      });

      if (insertError) {
        if (insertError.message.includes('unique') || insertError.code === '23505') {
          setError('NIM atau email sudah terdaftar.');
        } else {
          setError(insertError.message);
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      onRegistered();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-[#001e40] mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Akun Anda sedang menunggu persetujuan dari admin. Anda akan menerima email setelah akun disetujui.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full py-3 bg-[#001e40] text-white font-bold text-sm rounded-xl hover:bg-[#1f477b] transition-colors"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center p-4 md:p-10 font-sans text-[#191c1e]">
      <div className="w-full max-w-[900px] bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#001e40]/5 border border-slate-200/50">
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-2 text-[#001e40] font-bold text-xs mb-4 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </button>
            <h2 className="font-sans font-black text-3xl text-[#001e40] tracking-tight mb-1.5">
              Daftar Akun Mahasiswa
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Isi data diri Anda. Akun akan aktif setelah disetujui admin.
            </p>
          </div>

          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] text-xs p-3.5 rounded-xl border border-[#ffdad6] text-center font-bold mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">NIM</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 312410377"
                    value={form.nim}
                    onChange={(e) => handleChange('nim', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Ulangi password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Program Studi</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Teknik Informatika"
                    value={form.major}
                    onChange={(e) => handleChange('major', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Fakultas</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Teknik"
                    value={form.faculty}
                    onChange={(e) => handleChange('faculty', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-xs uppercase tracking-wider text-slate-600">Semester</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min={1}
                    max={14}
                    placeholder="Contoh: 4"
                    value={form.semester}
                    onChange={(e) => handleChange('semester', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#001e40]/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Mendaftar...' : 'Daftar'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
