import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Plus, 
  Compass, 
  Calendar, 
  Clock, 
  MapPin, 
  LogOut, 
  Bell, 
  BellOff,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { UserSession } from '../../types/mahasiswa';
import { SupabaseService } from '../../services/supabaseService';

interface MahasiswaUkmSayaProps {
  session: UserSession;
}

interface UkmItem {
  id: string;
  name: string;
  division: string;
  joinedSince?: string;
  logo: string;
  desc: string;
  members: number;
  status: string;
  category?: string;
  schedule?: any[];
}

export default function MahasiswaUkmSaya({ session }: MahasiswaUkmSayaProps) {
  const [myUkms, setMyUkms] = useState<UkmItem[]>([]);
  const [recommendations, setRecommendations] = useState<UkmItem[]>([]);
  const [joinedUkmIds, setJoinedUkmIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReminders, setActiveReminders] = useState<{ [key: string]: boolean }>({});
  const [selectedUkm, setSelectedUkm] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedVerifyUkm, setSelectedVerifyUkm] = useState<UkmItem | null>(null);
  const [verifyMethod, setVerifyMethod] = useState<'code' | 'scan'>('code');
  const [verificationCode, setVerificationCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const toggleReminder = (id: string) => {
    setActiveReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
      const joinedIds = savedIds ? JSON.parse(savedIds) : [];
      setJoinedUkmIds(joinedIds);

      const dbUkms = await SupabaseService.getUkms();
      
      const mappedMyUkms = dbUkms.filter((u: any) => joinedIds.includes(u.id)).map((u: any) => ({
        id: u.id,
        name: u.name,
        division: u.category || 'Organisasi',
        joinedSince: 'Semester ' + (session.semester || 1),
        logo: u.logoImage || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&auto=format&fit=crop',
        desc: u.description || '',
        members: u.activeMembers || 120,
        status: 'Active',
        schedule: u.schedule
      }));

      const studentMajor = session.major || '';

      const isHimpunanMatch = (ukmName: string, major: string): boolean => {
        if (!major) return false;
        const cleanName = ukmName.toLowerCase();
        const cleanMajor = major.toLowerCase();
        if (cleanName.includes(cleanMajor) || cleanMajor.includes(cleanName)) {
          return true;
        }
        const stopwords = ['teknik', 'sistem', 'ilmu', 'dan', '&'];
        const keywords = cleanMajor.split(/\s+/).filter(word => !stopwords.includes(word) && word.length > 2);
        if (keywords.length > 0) {
          return keywords.some(keyword => cleanName.includes(keyword));
        }
        return false;
      };

      const mappedRecs = dbUkms
        .filter((u: any) => !joinedIds.includes(u.id))
        .filter((u: any) => {
          if (u.category === 'Himpunan') {
            return isHimpunanMatch(u.name, studentMajor);
          }
          return true;
        })
        .map((u: any) => ({
          id: u.id,
          name: u.name,
          category: u.category || 'Organisasi',
          members: u.activeMembers || 120,
          logo: u.logoImage || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=200&auto=format&fit=crop',
          desc: u.description || '',
          status: 'Active',
          division: u.category || 'Organisasi',
          schedule: u.schedule
        }));

      // Sort: non-himpunan first, himpunan last
      mappedRecs.sort((a, b) => {
        const aIsHimpunan = a.category === 'Himpunan';
        const bIsHimpunan = b.category === 'Himpunan';
        if (aIsHimpunan && !bIsHimpunan) return 1;
        if (!aIsHimpunan && bIsHimpunan) return -1;
        return 0;
      });

      setMyUkms(mappedMyUkms);
      setRecommendations(mappedRecs);
    } catch (e) {
      console.error('Failed to load student UKM data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const ukmTokens: Record<string, string> = {
    '1': 'UPB-SENI-X9A2F',
    '2': 'UPB-BASKET-7D3K9',
    '3': 'UPB-ROBOT-5H8P2',
    '4': 'UPB-MAPALA-3K6J1',
    '5': 'UPB-FUTSAL-8R2L9',
    '6': 'UPB-ENGLISH-4N8Y2'
  };

  const getUkmToken = (ukm: UkmItem) => {
    if (ukmTokens[ukm.id]) return ukmTokens[ukm.id];
    const shortName = ukm.name.split(' ').pop()?.toUpperCase() || 'ORMAWA';
    return `UPB-${shortName}-X7K2B`;
  };

  const handleJoin = (id: string, name: string) => {
    const ukm = recommendations.find(r => r.id === id) || myUkms.find(m => m.id === id);
    if (!ukm) return;

    const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
    let joinedIds = savedIds ? JSON.parse(savedIds) : [];
    
    if (joinedIds.length >= 3) {
      alert('Batas maksimal mengikuti UKM adalah 3.');
      return;
    }

    setSelectedVerifyUkm(ukm);
    setShowVerifyModal(true);
    setVerifyMethod('code');
    setVerificationCode('');
    setScanSuccess(false);
    setIsScanning(false);
    setShowJoinModal(false);
    setSelectedUkm(null);
  };

  const handleLeave = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin keluar dari ${name}?`)) {
      const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
      let joinedIds = savedIds ? JSON.parse(savedIds) : [];
      joinedIds = joinedIds.filter((item: string) => item !== id);
      localStorage.setItem(`upb_joined_ukms_${session.id}`, JSON.stringify(joinedIds));
      alert(`Anda berhasil keluar dari ${name}.`);
      fetchData();
    }
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerifyUkm) return;

    const expectedToken = getUkmToken(selectedVerifyUkm);
    if (verificationCode.trim().toUpperCase() === expectedToken) {
      const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
      let joinedIds = savedIds ? JSON.parse(savedIds) : [];
      
      if (!joinedIds.includes(selectedVerifyUkm.id)) {
        joinedIds.push(selectedVerifyUkm.id);
        localStorage.setItem(`upb_joined_ukms_${session.id}`, JSON.stringify(joinedIds));
        alert(`Verifikasi Berhasil! Selamat, Anda resmi bergabung dengan ${selectedVerifyUkm.name}.`);
        setShowVerifyModal(false);
        setSelectedVerifyUkm(null);
        fetchData();
      }
    } else {
      alert('Token verifikasi salah. Silakan periksa kembali token unik Anda.');
    }
  };

  const handleSimulateScan = () => {
    if (!selectedVerifyUkm) return;
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      
      const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
      let joinedIds = savedIds ? JSON.parse(savedIds) : [];
      
      if (!joinedIds.includes(selectedVerifyUkm.id)) {
        joinedIds.push(selectedVerifyUkm.id);
        localStorage.setItem(`upb_joined_ukms_${session.id}`, JSON.stringify(joinedIds));
        
        alert(`Scan Barcode/QR Berhasil! Anda resmi bergabung dengan ${selectedVerifyUkm.name}.`);
        setShowVerifyModal(false);
        setSelectedVerifyUkm(null);
        fetchData();
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        <div className="w-8 h-8 border-4 border-[#001e40]/20 border-t-[#001e40] rounded-full animate-spin mx-auto mb-4" />
        <span>Memuat data UKM...</span>
      </div>
    );
  }

  const joinedSchedules: any[] = [];
  myUkms.forEach(ukm => {
    if (ukm.schedule && ukm.schedule.length > 0) {
      ukm.schedule.forEach(s => {
        joinedSchedules.push({
          ukmId: ukm.id,
          ukmName: ukm.name,
          day: s.day,
          time: s.time,
          activity: s.activity
        });
      });
    }
  });

  return (
    <div className="space-y-8 animate-fade-in pb-10 w-full max-w-full overflow-hidden">
      
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Organisasi &amp; Ormawa Saya
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Kelola aktivitas organisasi mahasiswa Anda. Pantau keanggotaan aktif dan temukan minat baru di Universitas Pelita Bangsa.
          </p>
        </div>
        <button 
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#feb234]/15 hover:bg-[#feb234]/25 text-[#291800] font-bold text-xs rounded-xl shadow-sm transition-all border border-[#feb234]/25 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#815500]" />
          <span>Jelajahi Ormawa Baru</span>
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {myUkms.map((ukm) => (
          <div 
            key={ukm.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group relative flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  <img src={ukm.logo} alt={ukm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                  {ukm.status}
                </span>
              </div>
              <h3 className="font-sans font-black text-lg text-[#001e40] mb-1">{ukm.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">{ukm.division} • Bergabung sejak {ukm.joinedSince}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedUkm(ukm.id)}
                className="flex-1 min-h-[44px] flex items-center justify-center py-2 border border-slate-200 hover:border-[#001e40] hover:bg-slate-50 text-[#001e40] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Lihat Profil
              </button>
              <button 
                onClick={() => handleLeave(ukm.id, ukm.name)}
                className="w-11 h-11 flex items-center justify-center shrink-0 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                title="Keluar dari UKM"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <div 
          onClick={() => setShowJoinModal(true)}
          className="border-2 border-dashed border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-6 min-h-[220px] bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group text-center"
        >
          <div className="w-12 h-12 rounded-full bg-slate-200/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-xs font-bold text-slate-600">Bergabung dengan Organisasi Baru</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Pilih dari rekomendasi UKM untuk mendaftar</p>
        </div>

      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#001e40]" />
              Jadwal Kegiatan UKM
            </h3>
          </div>
          
          <div className="space-y-4">
            {joinedSchedules.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                Belum ada jadwal kegiatan. Bergabunglah dengan UKM untuk melihat jadwal latihan dan rapat rutin Anda.
              </div>
            ) : (
              joinedSchedules.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200/80 transition-colors">
                  <div className="text-center px-4 py-2 bg-[#001e40] text-[#feb234] rounded-lg shrink-0 w-20">
                    <span className="block font-bold text-[10px] leading-none uppercase truncate">{item.day}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm text-[#001e40] truncate">{item.activity}</h4>
                    <p className="text-xs text-slate-550 font-semibold flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.time}</span>
                    </p>
                  </div>
                  <span className="hidden sm:block px-3 py-1 bg-white text-slate-600 rounded-full text-[10px] font-bold border border-slate-200/80">
                    {item.ukmName}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="recommendations-section" className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <h3 className="font-sans font-black text-lg text-[#001e40] mb-6 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#815500]" />
            Rekomendasi UKM
          </h3>
          <div className="space-y-4">
            
            {recommendations.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                Anda sudah bergabung dengan semua UKM yang tersedia.
              </div>
            ) : (
              recommendations.map(rec => (
                <div 
                  key={rec.id}
                  onClick={() => setSelectedUkm(rec.id)}
                  className="flex gap-3 items-start p-2.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <img src={rec.logo} alt={rec.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-[#001e40] group-hover:text-amber-600 transition-colors truncate">{rec.name}</h4>
                    <p className="text-[10px] text-slate-450 font-semibold truncate">{rec.category}</p>
                    <span className="text-[10px] text-amber-600 font-bold block mt-0.5">{rec.members} Anggota</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 self-center group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {selectedUkm && createPortal(
        <div className="fixed inset-0 z-50 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedUkm(null)}>
          {(() => {
            const ukm = myUkms.find(u => u.id === selectedUkm) || recommendations.find(u => u.id === selectedUkm);
            if (!ukm) return null;
            const isJoined = joinedUkmIds.includes(ukm.id);
            return (
              <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 border-t-8 border-t-[#001e40] animate-scale-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
                    <img src={ukm.logo} alt={ukm.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
                    <div>
                      <h4 className="font-sans font-black text-xl text-[#001e40]">{ukm.name}</h4>
                      <p className="text-xs text-slate-550 font-semibold">{ukm.division}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-650">Tentang Organisasi</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{ukm.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Total Anggota</p>
                      <p className="font-bold text-slate-700 text-sm mt-0.5">{ukm.members} Kader</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Status Anda</p>
                      <p className={`font-bold text-sm mt-0.5 ${isJoined ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isJoined ? 'Aktif (Verified)' : 'Belum Bergabung'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      onClick={() => setSelectedUkm(null)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    {!isJoined ? (
                      <button 
                        onClick={() => handleJoin(ukm.id, ukm.name)}
                        className="px-5 py-2.5 bg-[#feb234] hover:bg-[#e09b24] text-[#291800] text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        Bergabung dengan UKM
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedUkm(null)}
                        className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        Tutup Profil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>,
        document.body
      )}

      {/* Modal Join Ormawa Baru */}
      {showJoinModal && createPortal(
        <div className="fixed inset-0 z-50 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowJoinModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4 flex flex-col min-h-0">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#815500]" />
                  Jelajahi &amp; Gabung Ormawa Baru
                </h3>
                <button onClick={() => setShowJoinModal(false)} className="w-11 h-11 flex items-center justify-center shrink-0 text-slate-400 hover:text-slate-655 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 w-full min-w-0">
                {recommendations.length === 0 ? (
                  <p className="text-center py-8 text-slate-450 text-xs font-semibold">
                    Tidak ada Ormawa baru yang tersedia saat ini (Anda sudah bergabung dengan semua Ormawa).
                  </p>
                ) : (
                  recommendations.map(rec => (
                    <div 
                      key={rec.id}
                      className="w-full flex items-center justify-between p-3 hover:bg-slate-50 border border-slate-150 rounded-xl transition-all min-w-0"
                    >
                      <div className="flex gap-3 items-center min-w-0 flex-1">
                        <img src={rec.logo} alt={rec.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#001e40] truncate">{rec.name}</h4>
                          <p className="text-[9px] text-slate-455 font-bold">{rec.category}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleJoin(rec.id, rec.name)}
                        className="ml-3 px-4 py-2 bg-[#feb234] hover:bg-[#e09b24] text-[#291800] font-bold text-[10px] rounded-lg shadow-sm transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[72px] flex items-center justify-center"
                      >
                        Gabung
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button 
                  onClick={() => setShowJoinModal(false)}
                  className="px-5 py-2.5 min-h-[44px] flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Verifikasi Gabung UKM */}
      {showVerifyModal && selectedVerifyUkm && createPortal(
        <div className="fixed inset-0 z-50 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => { if (!isScanning) { setShowVerifyModal(false); setSelectedVerifyUkm(null); } }}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-sans font-black text-base text-[#001e40]">Verifikasi Anggota Baru</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">{selectedVerifyUkm.name}</p>
                </div>
                <button 
                  disabled={isScanning}
                  onClick={() => { setShowVerifyModal(false); setSelectedVerifyUkm(null); }} 
                  className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                <button 
                  disabled={isScanning}
                  onClick={() => setVerifyMethod('code')}
                  className={`py-2 text-[10px] font-bold rounded-lg transition-all ${verifyMethod === 'code' ? 'bg-white text-[#001e40] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Kode Verifikasi
                </button>
                <button 
                  disabled={isScanning}
                  onClick={() => setVerifyMethod('scan')}
                  className={`py-2 text-[10px] font-bold rounded-lg transition-all ${verifyMethod === 'scan' ? 'bg-white text-[#001e40] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Scan Barcode/QR
                </button>
              </div>

              {verifyMethod === 'code' ? (
                <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Token Verifikasi Ormawa</label>
                    <input 
                      type="text"
                      required
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      placeholder="Masukkan 12-karakter token unik..."
                      className="w-full p-3 bg-white border border-slate-200 focus:border-[#feb234] focus:ring-1 focus:ring-[#feb234] rounded-xl text-xs font-mono font-bold tracking-wider outline-none text-center"
                    />
                    <p className="text-[9px] text-amber-600 font-semibold text-center mt-1">
                      Info Demo: Pengurus memberikan token unik berikut `{getUkmToken(selectedVerifyUkm)}`
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => { setShowVerifyModal(false); setSelectedVerifyUkm(null); }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-[#feb234] hover:bg-[#e09b24] text-[#291800] font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Verifikasi &amp; Gabung
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {isScanning ? (
                    <div className="bg-slate-955 rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-x-0 h-[2px] bg-emerald-500 animate-scan-line"></div>
                      <div className="w-24 h-24 border-2 border-dashed border-emerald-500/60 rounded-xl flex items-center justify-center animate-pulse">
                        <Compass className="w-8 h-8 text-emerald-500 animate-spin" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-4">Memindai Barcode/QR...</span>
                    </div>
                  ) : (
                    <div className="bg-slate-900 rounded-2xl p-5 text-center text-white space-y-4 relative overflow-hidden">
                      <div className="flex justify-center">
                        <Compass className="w-12 h-12 text-[#feb234]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Pindai QR Code Rekrutmen</p>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                          Arahkan kamera ke QR code / barcode rekrutmen resmi yang dipasang oleh pengurus Ormawa.
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={handleSimulateScan}
                          className="w-full py-2.5 bg-[#feb234] hover:bg-[#e09b24] text-[#291800] font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                          Simulasikan Scan Kamera
                        </button>
                        <div className="relative border border-dashed border-slate-700 hover:border-slate-500 rounded-xl py-3 cursor-pointer transition-colors bg-slate-950/40">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleSimulateScan}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                          />
                          <p className="text-[9px] text-slate-455 font-bold">Atau Unggah Gambar QR Code</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button 
                      disabled={isScanning}
                      onClick={() => { setShowVerifyModal(false); setSelectedVerifyUkm(null); }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
