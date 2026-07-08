import React, { useState } from 'react';
import { UserSession } from '../../types/mahasiswa';
import { supabase } from '../../services/supabaseClient';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  session: UserSession;
  onProfileCompleted: (updatedSession: UserSession) => void;
}

export default function MahasiswaCompleteProfile({ session, onProfileCompleted }: Props) {
  const [nim, setNim] = useState('');
  const [major, setMajor] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Update public.users table (phone)
      const { error: userError } = await supabase
        .from('users')
        .update({ phone, role: 'mahasiswa' })
        .eq('id', session.id);

      // If user doesn't exist in public.users, we should insert them
      if (userError) {
         const { error: insertUserError } = await supabase.from('users').insert({
            id: session.id,
            email: session.email,
            name: session.name,
            role: 'mahasiswa',
            phone: phone
         });
         if (insertUserError) throw insertUserError;
      }

      // 2. Insert into mahasiswa_profiles
      const { error: profileError } = await supabase
        .from('mahasiswa_profiles')
        .insert({
          user_id: session.id,
          nim,
          major,
          semester,
          faculty: 'Belum ditentukan',
        });

      if (profileError && profileError.code !== '23505') {
        throw profileError;
      }

      // Update session locally
      onProfileCompleted({
        ...session,
        nimOrNip: nim,
        username: nim,
        major,
        semester,
      });

    } catch (err: any) {
      console.error('Error completing profile:', err);
      setError(err.message || 'Gagal menyimpan data profil. Pastikan NIM belum digunakan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f7f9fc] h-full overflow-hidden flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#001e40]/5 rounded-2xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-[#001e40]" />
          </div>
          <h2 className="text-2xl font-black text-[#001e40] tracking-tight">Lengkapi Data Diri</h2>
          <p className="mt-2 text-sm text-slate-500">
            Halo {session.name}, Anda berhasil masuk. Silakan lengkapi data akademik Anda untuk melanjutkan ke portal.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">NIM (Nomor Induk Mahasiswa)</label>
            <input
              type="text"
              required
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 transition-all outline-none"
              placeholder="Contoh: 312010123"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Program Studi</label>
            <input
              type="text"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 transition-all outline-none"
              placeholder="Contoh: Teknik Informatika"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Semester</label>
              <input
                type="number"
                min="1"
                max="14"
                required
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">No. WhatsApp</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 transition-all outline-none"
                placeholder="081234..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#001e40]/10 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
            {!isLoading && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
