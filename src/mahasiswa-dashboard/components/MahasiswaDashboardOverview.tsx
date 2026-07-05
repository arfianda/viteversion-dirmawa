import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  Megaphone, 
  ArrowRight, 
  Star,
  PlusCircle
} from 'lucide-react';
import { UserSession } from '../../types/mahasiswa';
import { StudentNews } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { SupabaseService } from '../../services/supabaseService';

interface DashboardOverviewProps {
  session: UserSession;
  onNavigate: (tab: string) => void;
}

interface ScheduleItem {
  ukmName: string;
  day: string;
  time: string;
  activity: string;
}

export default function MahasiswaDashboardOverview({ session, onNavigate }: DashboardOverviewProps) {
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [joinedUkmsCount, setJoinedUkmsCount] = useState(0);
  const [joinedUkmNames, setJoinedUkmNames] = useState<string[]>([]);
  const [beasiswaStatus, setBeasiswaStatus] = useState<'Aktif' | 'Non-Aktif'>('Non-Aktif');
  const [beasiswaTitle, setBeasiswaTitle] = useState('');
  const [beasiswaValid, setBeasiswaValid] = useState('');
  const [joinedUkmsSchedules, setJoinedUkmsSchedules] = useState<ScheduleItem[]>([]);
  const [news, setNews] = useState<StudentNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      setLoading(true);
      try {
        // 1. Fetch achievements count (only approved/disetujui ones)
        const { data: achievements } = await supabase
          .from('achievements')
          .select('id')
          .eq('student_name', session.name)
          .eq('status', 'Disetujui');
        setAchievementsCount(achievements?.length || 0);

        // Fetch student news
        try {
          const dbNews = await SupabaseService.getNews();
          setNews(dbNews.slice(0, 5));
        } catch (newsErr) {
          console.error('Failed to load news:', newsErr);
        }

        // 2. Fetch joined UKMs from localStorage and catalog
        const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
        const joinedIds = savedIds ? JSON.parse(savedIds) : [];
        setJoinedUkmsCount(joinedIds.length);

        const dbUkms = await SupabaseService.getUkms();
        
        if (joinedIds.length > 0) {
          const joinedUkms = dbUkms.filter((u: any) => joinedIds.includes(u.id));
          const names = joinedUkms.map((u: any) => u.name);
          setJoinedUkmNames(names);

          // Compile all schedules
          const compiledSchedules: ScheduleItem[] = [];
          joinedUkms.forEach((ukm: any) => {
            if (ukm.schedule && ukm.schedule.length > 0) {
              ukm.schedule.forEach((s: any) => {
                compiledSchedules.push({
                  ukmName: ukm.name,
                  day: s.day,
                  time: s.time,
                  activity: s.activity
                });
              });
            }
          });
          setJoinedUkmsSchedules(compiledSchedules);
        } else {
          setJoinedUkmNames([]);
          setJoinedUkmsSchedules([]);
        }

        // 3. Fetch active scholarship status
        const { data: apps } = await supabase
          .from('scholarship_applications')
          .select('status, scholarships(title)')
          .eq('user_id', session.id);

        const approvedApp = (apps || []).find((a: any) => a.status === 'approved');
        if (approvedApp) {
          setBeasiswaStatus('Aktif');
          const scholarshipData = approvedApp.scholarships;
          const sTitle = Array.isArray(scholarshipData)
            ? scholarshipData[0]?.title
            : (scholarshipData as any)?.title;
          setBeasiswaTitle(sTitle || 'Beasiswa Pendidikan UPB');
          setBeasiswaValid('Semester Aktif');
        } else {
          setBeasiswaStatus('Non-Aktif');
          setBeasiswaTitle('');
          setBeasiswaValid('');
        }
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, [session]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        <div className="w-8 h-8 border-4 border-[#001e40]/20 border-t-[#001e40] rounded-full animate-spin mx-auto mb-4" />
        <span>Memuat data dasbor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Selamat Datang Kembali, {session.name}!
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Berikut adalah ringkasan kegiatan kemahasiswaan dan prestasi Anda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#feb234]/10 text-[#6d4700] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#feb234]/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{session.major || 'Fakultas Ilmu Komputer'}</span>
          </div>
          <button 
            onClick={() => onNavigate('prestasi')}
            className="bg-[#001e40] hover:bg-[#1f477b] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Prestasi Baru</span>
          </button>
        </div>
      </section>

      {/* Bento Grid: Academic Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Prestasi Saya */}
        <div 
          onClick={() => onNavigate('prestasi')}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-6 -top-6 bg-[#001e40]/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-[#001e40]/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prestasi Saya</p>
              <h2 className="font-display font-extrabold text-4xl text-[#001e40]">{achievementsCount}</h2>
            </div>
            <div className="bg-[#001e40]/5 p-3 rounded-xl text-[#001e40] group-hover:bg-[#001e40] group-hover:text-white transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Terdaftar di sistem</span>
          </div>
        </div>

        {/* Card: UKM Diikuti */}
        <div 
          onClick={() => onNavigate('ukm')}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-6 -bottom-6 bg-[#feb234]/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-[#feb234]/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">UKM Diikuti</p>
              <h2 className="font-display font-extrabold text-4xl text-[#001e40]">
                {joinedUkmsCount} <span className="text-sm font-medium text-slate-400 font-sans">/ 3 Max</span>
              </h2>
            </div>
            <div className="bg-[#feb234]/10 p-3 rounded-xl text-[#815500] group-hover:bg-[#feb234] group-hover:text-[#291800] transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3 relative z-10">
            {joinedUkmNames.length === 0 ? (
              <span className="text-[10px] text-slate-400 font-bold">Belum bergabung dengan UKM</span>
            ) : (
              joinedUkmNames.map((name, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200">
                  {name}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Card: Status Beasiswa */}
        <div 
          onClick={() => onNavigate('beasiswa')}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute -left-6 -bottom-6 bg-emerald-500/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Beasiswa</p>
              <h2 className={`font-display font-extrabold text-2xl ${beasiswaStatus === 'Aktif' ? 'text-emerald-600' : 'text-slate-400'}`}>
                {beasiswaStatus}
              </h2>
            </div>
            <div className="bg-emerald-55 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-700 mb-0.5">{beasiswaTitle || 'Tidak Ada Beasiswa Aktif'}</p>
          <p className="text-[10px] text-slate-400 font-semibold">
            {beasiswaValid ? `Valid s.d. ${beasiswaValid}` : 'Ajukan beasiswa di menu Beasiswa'}
          </p>
        </div>
      </section>

      {/* Split Layout: Timeline & Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Jadwal Kegiatan UKM (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#001e40]" />
                Jadwal Kegiatan UKM
              </h3>
              <button 
                onClick={() => onNavigate('ukm')}
                className="text-xs font-bold text-[#815500] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Kalender</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {joinedUkmsSchedules.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  Belum ada jadwal kegiatan. Bergabunglah dengan UKM untuk melihat jadwal latihan dan rapat rutin Anda.
                </div>
              ) : (
                joinedUkmsSchedules.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-all">
                    <div className="flex flex-col items-center justify-center w-16 h-14 bg-[#001e40] text-[#feb234] rounded-xl shrink-0 font-sans shadow-sm">
                      <span className="font-bold text-[9px] leading-tight text-center truncate w-full px-1">{item.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#001e40] truncate">{item.activity}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.time}</span>
                      </p>
                    </div>
                    <span className="hidden sm:block px-3 py-1 bg-white text-slate-600 rounded-full text-[10px] font-bold border border-slate-200/80">
                      {item.ukmName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info Kemahasiswaan (Activity Feed) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70">
              <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#815500]" />
                Info Kemahasiswaan
              </h3>
            </div>
            
            <div className="p-5 flex-1 space-y-6">
              {news.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold font-sans">
                  Belum ada info kemahasiswaan terbaru.
                </div>
              ) : (
                news.map((item) => {
                  const isAnnouncement = item.category === 'Pengumuman';
                  const isAgenda = item.category === 'Agenda';
                  
                  const colorClass = isAnnouncement 
                    ? 'bg-[#feb234]' 
                    : isAgenda 
                      ? 'bg-blue-500' 
                      : 'bg-emerald-500';
                  
                  const textColClass = isAnnouncement
                    ? 'text-[#815500]'
                    : isAgenda
                      ? 'text-blue-700'
                      : 'text-emerald-700';

                  const dateText = item.date 
                    ? new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : 'Baru';

                  return (
                    <div 
                      key={item.id}
                      className="relative pl-6 before:absolute before:left-1.5 before:top-2 before:bottom-[-28px] before:w-0.5 before:bg-slate-100 last:before:hidden"
                    >
                      <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full ${colorClass} border-2 border-white shadow-sm ring-1 ring-slate-200`}></div>
                      <p className={`text-[10px] font-bold ${textColClass} uppercase tracking-wider mb-1`}>
                        {dateText} {item.category ? `• ${item.category}` : ''}
                      </p>
                      <h4 className="font-bold text-xs text-[#001e40] mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {item.summary || item.description}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
