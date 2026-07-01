import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Globe, 
  Mail, 
  Phone,
  CheckCircle,
  HelpCircle,
  Camera
} from 'lucide-react';
import { OrmawaService } from '../../services/ormawaService';

interface OrmawaDetailEditorProps {
  ukmId: string;
}

export default function OrmawaDetailEditor({ ukmId }: OrmawaDetailEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [description, setDescription] = useState('');
  const [vision, setVision] = useState('');
  const [missions, setMissions] = useState<string[]>([]);
  
  // Schedules List State
  const [schedules, setSchedules] = useState<{ day: string; time: string; activity: string }[]>([]);
  
  // Contacts List State
  const [contacts, setContacts] = useState<{ role: string; name: string; contact: string }[]>([]);
  
  // Gallery list state
  const [gallery, setGallery] = useState<string[]>([]);

  // Images state
  const [logoImage, setLogoImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo image size must not exceed 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Banner image size must not exceed 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const ukm = await OrmawaService.getUkmDetails(ukmId);
        setDescription(ukm.description || '');
        setVision(ukm.vision || '');
        setMissions(ukm.mission || []);
        setSchedules(ukm.schedule || []);
        setContacts(ukm.contacts || []);
        setGallery(ukm.gallery || []);
        setLogoImage(ukm.logo_image_url || '');
        setCoverImage(ukm.cover_image_url || '');
        setInstagramUrl(ukm.instagram_url || '');
      } catch (e: any) {
        console.error('Failed to load UKM details:', e);
        setErrorMsg('Gagal memuat profil organisasi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [ukmId]);

  // Mission functions
  const addMission = () => setMissions([...missions, '']);
  const handleMissionChange = (idx: number, val: string) => {
    const updated = [...missions];
    updated[idx] = val;
    setMissions(updated);
  };
  const removeMission = (idx: number) => setMissions(missions.filter((_, i) => i !== idx));

  // Schedule functions
  const addSchedule = () => setSchedules([...schedules, { day: 'Senin', time: '16:00 - 18:00', activity: '' }]);
  const handleScheduleChange = (idx: number, field: string, val: string) => {
    const updated = [...schedules];
    updated[idx] = { ...updated[idx], [field]: val };
    setSchedules(updated);
  };
  const removeSchedule = (idx: number) => setSchedules(schedules.filter((_, i) => i !== idx));

  // Contact functions
  const addContact = () => setContacts([...contacts, { role: 'Humas', name: '', contact: '' }]);
  const handleContactChange = (idx: number, field: string, val: string) => {
    const updated = [...contacts];
    updated[idx] = { ...updated[idx], [field]: val };
    setContacts(updated);
  };
  const removeContact = (idx: number) => setContacts(contacts.filter((_, i) => i !== idx));

  // Gallery functions
  const addGallery = () => setGallery([...gallery, '']);
  const handleGalleryChange = (idx: number, val: string) => {
    const updated = [...gallery];
    updated[idx] = val;
    setGallery(updated);
  };
  const removeGallery = (idx: number) => setGallery(gallery.filter((_, i) => i !== idx));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const activeMissions = missions.filter(m => m.trim() !== '');
    const activeGallery = gallery.filter(g => g.trim() !== '');

    try {
      await OrmawaService.updateUkmDetails(ukmId, {
        description,
        vision,
        mission: activeMissions,
        schedule: schedules,
        contacts,
        gallery: activeGallery,
        logoImage,
        coverImage,
        instagramUrl
      });

      setSuccessMsg('Profil organisasi berhasil diperbarui! Perubahan Anda langsung sinkron ke Direktori UKM mahasiswa.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans font-bold">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#001e40] rounded-full animate-spin"></div>
        <span>Memuat formulir profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-10">
      
      {/* Header section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Edit Detail Organisasi
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Perbarui deskripsi, visi, misi, jadwal latihan rutin, dan kontak pengurus. Informasi di sini langsung tampil di direktori pencarian UKM bagi mahasiswa.
          </p>
        </div>
      </section>

      {successMsg && (
        <div className="bg-green-55/15 border border-green-300 text-green-800 p-5 rounded-2xl flex items-start gap-3.5">
          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
          <div className="text-xs font-bold leading-relaxed">{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center font-bold text-xs">
          {errorMsg}
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Card / Header visuals */}
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Tampilan Logo &amp; Cover</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            
            {/* Logo Image URL */}
            <div className="space-y-2">
              <label className="font-bold text-slate-600 block">Logo Organisasi</label>
              <div className="flex gap-4 items-center">
                <div className="relative group shrink-0">
                  <img 
                    src={logoImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop'} 
                    alt="Logo Preview" 
                    className="w-14 h-14 rounded-full object-cover border border-slate-200 bg-slate-50"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop'; }}
                  />
                  <label className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[8px] font-bold">
                    Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoFile} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <input 
                  type="text" 
                  value={logoImage} 
                  onChange={(e) => setLogoImage(e.target.value)} 
                  placeholder="Atau masukkan URL logo..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <label className="font-bold text-slate-600 block">Banner / Sampul Organisasi</label>
              <div className="flex gap-4 items-center">
                <div className="relative group shrink-0">
                  <img 
                    src={coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'} 
                    alt="Cover Preview" 
                    className="w-20 h-12 rounded-lg object-cover border border-slate-200 bg-slate-50"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'; }}
                  />
                  <label className="absolute inset-0 bg-black/40 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[8px] font-bold">
                    Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCoverFile} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <input 
                  type="text" 
                  value={coverImage} 
                  onChange={(e) => setCoverImage(e.target.value)} 
                  placeholder="Atau masukkan URL banner..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Instagram Link */}
            <div className="md:col-span-2 space-y-2 pt-4 border-t border-slate-100">
              <label className="font-bold text-slate-600 block">Link Profil Instagram</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={instagramUrl} 
                  onChange={(e) => setInstagramUrl(e.target.value)} 
                  placeholder="e.g. https://instagram.com/ukmseni_upb"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Text descriptions */}
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
          <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Profil Ringkasan</h3>
          
          <div className="space-y-4 text-xs text-slate-700">
            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Deskripsi Detail</label>
              <textarea 
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan latar belakang, kegiatan utama, dan pencapaian organisasi..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-y"
              />
            </div>

            {/* Vision */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Visi Organisasi</label>
              <textarea 
                required
                rows={2}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Tulis visi jangka panjang organisasi..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-y"
              />
            </div>

            {/* Mission (Dynamic list) */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Misi Organisasi</label>
              <div className="space-y-2">
                {missions.map((mission, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="w-5 h-5 rounded-full bg-[#001e40]/5 flex items-center justify-center font-bold text-[10px] text-[#001e40] shrink-0">
                      {index + 1}
                    </span>
                    <input 
                      type="text"
                      required
                      value={mission}
                      onChange={(e) => handleMissionChange(index, e.target.value)}
                      placeholder="Misi organisasi..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeMission(index)}
                      className="p-2 text-red-500 hover:text-red-750 hover:bg-red-55/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMission}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Misi</span>
              </button>
            </div>
          </div>
        </section>

        {/* Schedules & Routine activities */}
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Jadwal Kegiatan Rutin</h3>
            <button
              type="button"
              onClick={addSchedule}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] rounded-lg text-[10px] font-black transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jadwal</span>
            </button>
          </div>

          {schedules.length === 0 ? (
            <p className="text-xs text-slate-450 font-bold text-center py-4">Belum ada jadwal rutin terdaftar.</p>
          ) : (
            <div className="space-y-4 font-sans text-xs">
              {schedules.map((sched, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 relative pr-12 items-center">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Hari</label>
                    <input 
                      type="text" 
                      required
                      value={sched.day} 
                      onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)}
                      placeholder="Sabtu"
                      className="w-full bg-white border border-slate-200 focus:border-[#001e40] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Jam</label>
                    <input 
                      type="text" 
                      required
                      value={sched.time} 
                      onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                      placeholder="10:00 - 12:00"
                      className="w-full bg-white border border-slate-200 focus:border-[#001e40] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Aktivitas</label>
                    <input 
                      type="text" 
                      required
                      value={sched.activity} 
                      onChange={(e) => handleScheduleChange(idx, 'activity', e.target.value)}
                      placeholder="Latihan rutin"
                      className="w-full bg-white border border-slate-200 focus:border-[#001e40] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSchedule(idx)}
                    className="absolute right-3 top-[34px] p-2 text-red-500 hover:text-red-750 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Personnel */}
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Narahubung &amp; Pengurus</h3>
            <button
              type="button"
              onClick={addContact}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] rounded-lg text-[10px] font-black transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kontak</span>
            </button>
          </div>

          {contacts.length === 0 ? (
            <p className="text-xs text-slate-450 font-bold text-center py-4">Belum ada kontak terdaftar.</p>
          ) : (
            <div className="space-y-4 font-sans text-xs">
              {contacts.map((cont, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 relative pr-12 items-center">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Peran / Jabatan</label>
                    <input 
                      type="text" 
                      required
                      value={cont.role} 
                      onChange={(e) => handleContactChange(idx, 'role', e.target.value)}
                      placeholder="Ketua Umum"
                      className="w-full bg-white border border-slate-200 focus:border-[#001e40] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={cont.name} 
                      onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                      placeholder="Budi Santoso"
                      className="w-full bg-white border border-slate-200 focus:border-[#001e40] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">Nomor Kontak (WhatsApp / HP)</label>
                    <input 
                      type="text" 
                      required
                      value={cont.contact} 
                      onChange={(e) => handleContactChange(idx, 'contact', e.target.value)}
                      placeholder="081234567890"
                      className="w-full bg-white border border-slate-200 focus:border-[#001e40] rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContact(idx)}
                    className="absolute right-3 top-[34px] p-2 text-red-500 hover:text-red-750 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Photo Gallery Links */}
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Galeri Foto Kegiatan</h3>
            <button
              type="button"
              onClick={addGallery}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] rounded-lg text-[10px] font-black transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Foto</span>
            </button>
          </div>

          {gallery.length === 0 ? (
            <p className="text-xs text-slate-450 font-bold text-center py-4">Belum ada link foto terdaftar.</p>
          ) : (
            <div className="space-y-3 font-sans text-xs">
              {gallery.map((url, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="w-5 h-5 rounded-full bg-[#001e40]/5 flex items-center justify-center font-bold text-[10px] text-[#001e40] shrink-0">
                    {idx + 1}
                  </span>
                  <input 
                    type="text"
                    required
                    value={url}
                    onChange={(e) => handleGalleryChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-xxxx..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeGallery(idx)}
                    className="p-2 text-red-500 hover:text-red-750 hover:bg-red-55/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 font-sans pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-sans font-black px-8 py-3.5 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 flex items-center justify-center gap-1.5 min-w-[160px] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
