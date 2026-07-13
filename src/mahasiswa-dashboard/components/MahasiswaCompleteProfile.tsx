import React, { useState } from 'react';
import { UserSession } from '../../types/mahasiswa';
import { supabase } from '../../services/supabaseClient';
import { User, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
import SearchableProdiDropdown from '../../components/SearchableProdiDropdown';

interface Props {
  session: UserSession;
  onProfileCompleted: (updatedSession: UserSession) => void;
  onProfileSubmitted?: () => void;
}

export default function MahasiswaCompleteProfile({ session, onProfileCompleted, onProfileSubmitted }: Props) {
  const [nim, setNim] = useState('');
  const [major, setMajor] = useState('');
  const [faculty, setFaculty] = useState('');
  const [semester, setSemester] = useState<number>(1);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!major) {
        throw new Error('Silakan pilih Program Studi terlebih dahulu.');
      }

      // 1. Check if registration request already exists by NIM or Email
      const { data: reqData, error: reqCheckError } = await supabase
        .rpc('get_registration_status', { p_query: nim });

      if (reqCheckError) throw reqCheckError;

      const requestExists = reqData && reqData.length > 0;
      if (requestExists) {
        throw new Error('NIM ini sudah terdaftar atau dalam antrean persetujuan.');
      }

      // 2. Insert into registration_requests as pending
      const { error: insertError } = await supabase
        .from('registration_requests')
        .insert({
          nim,
          name: session.name,
          email: session.email,
          password: 'sso-authenticated', // Dummy password for SSO accounts
          major,
          faculty: faculty || 'Belum ditentukan',
          semester,
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Update phone in public.users table if it exists
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .eq('id', session.id);

      if (users && users.length > 0) {
        await supabase
          .from('users')
          .update({ phone })
          .eq('id', session.id);
      }

      onProfileSubmitted?.();

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
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <SearchableProdiDropdown
                value={major}
                onChange={(m, f) => {
                  setMajor(m);
                  setFaculty(f);
                }}
                placeholder="Cari & Pilih Program Studi..."
              />
            </div>
            {faculty && (
              <div className="text-[10px] text-slate-500 font-semibold mt-1">
                Fakultas otomatis terdeteksi: <span className="text-[#001e40] font-bold">{faculty}</span>
              </div>
            )}
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
