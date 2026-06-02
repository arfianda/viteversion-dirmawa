import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Compass, 
  Calendar, 
  MapPin, 
  Clock, 
  Info, 
  LogOut, 
  Bell, 
  BellOff,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function MahasiswaUkmSaya() {
  const [activeReminders, setActiveReminders] = useState<{ [key: string]: boolean }>({
    'seni-lukis': true,
    'debate-prep': true
  });
  
  const [selectedUkm, setSelectedUkm] = useState<string | null>(null);

  const toggleReminder = (id: string) => {
    setActiveReminders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const myUkms = [
    {
      id: 'seni',
      name: 'UKM Seni',
      division: 'Divisi Seni Lukis & Desain Grafis',
      joinedSince: 'Semester 2',
      logo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&auto=format&fit=crop',
      desc: 'UKM Seni adalah wadah bagi mahasiswa yang memiliki ketertarikan di bidang seni, terutama seni lukis, teater, musik, tari, dan fotografi. Kami mengadakan pameran seni berkala dan workshop desain.',
      members: 180,
      status: 'Active'
    },
    {
      id: 'english',
      name: 'English Club',
      division: 'Debate & Public Speaking Division',
      joinedSince: 'Semester 1',
      logo: 'https://images.unsplash.com/photo-1451244940167-ae42217d8b25?q=80&w=200&auto=format&fit=crop',
      desc: 'English Club UPB memfasilitasi mahasiswa dalam meningkatkan kecakapan bahasa Inggris melalui kegiatan debat parlementer, pidato publik (public speaking), menulis esai, serta diskusi santai.',
      members: 320,
      status: 'Active'
    }
  ];

  const recommendations = [
    {
      id: 'robotika',
      name: 'UKM Robotika',
      category: 'Inovasi Teknologi & AI',
      members: 450,
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 'mapala',
      name: 'MAPALA UPB',
      category: 'Pecinta Alam & Lingkungan',
      members: 210,
      logo: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Hero Header */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Organisasi & UKM Saya
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Kelola aktivitas organisasi mahasiswa Anda. Pantau keanggotaan aktif dan temukan minat baru di Universitas Pelita Bangsa.
          </p>
        </div>
        <button 
          onClick={() => alert('Membuka direktori UKM...')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#feb234]/15 hover:bg-[#feb234]/25 text-[#291800] font-bold text-xs rounded-xl shadow-sm transition-all border border-[#feb234]/25 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#815500]" />
          <span>Jelajahi UKM Baru</span>
        </button>
      </section>

      {/* Grid Layout: Active UKM Cards */}
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
                className="flex-1 py-2 border border-slate-200 hover:border-[#001e40] hover:bg-slate-50 text-[#001e40] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Lihat Profil
              </button>
              <button 
                onClick={() => {
                  if (confirm(`Apakah Anda yakin ingin keluar dari ${ukm.name}?`)) {
                    alert(`Permintaan keluar dari ${ukm.name} telah diajukan ke admin.`);
                  }
                }}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                title="Keluar dari UKM"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Placeholder Card */}
        <div 
          onClick={() => alert('Membuka halaman pendaftaran anggota baru UKM...')}
          className="border-2 border-dashed border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-6 min-h-[220px] bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer group text-center"
        >
          <div className="w-12 h-12 rounded-full bg-slate-200/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-xs font-bold text-slate-600">Bergabung dengan Organisasi Baru</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Daftarkan diri Anda pada gelombang rekrutmen aktif</p>
        </div>

      </section>

      {/* Split: Schedule & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* UKM Schedule (Span 2) */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#001e40]" />
              Jadwal Kegiatan UKM
            </h3>
            <button className="text-xs font-bold text-[#001e40] hover:underline">Lihat Kalender</button>
          </div>
          
          <div className="space-y-4">
            {/* Class 1 */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200/80 transition-colors">
              <div className="text-center px-4 py-2 bg-[#001e40] text-[#feb234] rounded-lg shrink-0 w-16">
                <span className="block font-bold text-lg leading-none">14</span>
                <span className="block text-[8px] uppercase font-black tracking-widest mt-1 opacity-90">Okt</span>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm text-[#001e40] truncate">Latihan Rutin Seni Lukis</h4>
                <p className="text-xs text-slate-550 font-semibold flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>15:00 - 17:30 • Ruang Seni 3.02</span>
                </p>
              </div>
              <button 
                onClick={() => toggleReminder('seni-lukis')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  activeReminders['seni-lukis'] 
                    ? 'bg-[#001e40] text-[#feb234] border-[#001e40]' 
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {activeReminders['seni-lukis'] ? (
                  <>
                    <Bell className="w-3 h-3" />
                    <span>Reminder On</span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3 h-3" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Class 2 */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200/80 transition-colors">
              <div className="text-center px-4 py-2 bg-[#feb234]/15 text-[#815500] rounded-lg shrink-0 w-16 border border-[#feb234]/20">
                <span className="block font-bold text-lg leading-none">16</span>
                <span className="block text-[8px] uppercase font-black tracking-widest mt-1 opacity-90">Okt</span>
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm text-[#001e40] truncate">English Debate Prep</h4>
                <p className="text-xs text-slate-550 font-semibold flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>13:00 - 15:00 • Lab Bahasa Utama</span>
                </p>
              </div>
              <button 
                onClick={() => toggleReminder('debate-prep')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                  activeReminders['debate-prep'] 
                    ? 'bg-[#001e40] text-[#feb234] border-[#001e40]' 
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {activeReminders['debate-prep'] ? (
                  <>
                    <Bell className="w-3 h-3" />
                    <span>Reminder On</span>
                  </>
                ) : (
                  <>
                    <BellOff className="w-3 h-3" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* UKM Recommendations (Span 1) */}
        <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
          <h3 className="font-sans font-black text-lg text-[#001e40] mb-6 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#815500]" />
            Rekomendasi UKM
          </h3>
          <div className="space-y-4">
            
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                onClick={() => alert(`Membuka profil rekomendasi ${rec.name}...`)}
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
            ))}

            <button 
              onClick={() => alert('Membuka seluruh daftar UKM Universitas Pelita Bangsa')}
              className="w-full py-2.5 mt-4 text-[#001e40] hover:text-white border-2 border-[#001e40] hover:bg-[#001e40] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Jelajahi Semua UKM
            </button>
          </div>
        </section>

      </div>

      {/* Modal Profile Info (Overlay) */}
      {selectedUkm && (
        <div className="fixed inset-0 z-50 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedUkm(null)}>
          {(() => {
            const ukm = myUkms.find(u => u.id === selectedUkm);
            if (!ukm) return null;
            return (
              <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 border-t-8 border-t-[#001e40] animate-scale-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
                    <img src={ukm.logo} alt={ukm.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
                    <div>
                      <h4 className="font-sans font-black text-xl text-[#001e40]">{ukm.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold">{ukm.division}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600">Tentang Organisasi</h5>
                    <p className="text-xs text-slate-550 leading-relaxed font-medium">{ukm.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold">Total Anggota</p>
                      <p className="font-bold text-slate-700 text-sm mt-0.5">{ukm.members} Kader</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold">Status Anda</p>
                      <p className="font-bold text-emerald-600 text-sm mt-0.5">Aktif (Verified)</p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => setSelectedUkm(null)}
                      className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      Tutup Profil
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
