/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  PlusCircle, 
  Settings, 
  LayoutDashboard, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  FileText
} from 'lucide-react';

export default function PanduanMahasiswaView() {
  return (
    <div className="space-y-12 animate-fade-in text-left">
      {/* Header Title with pristine clean typography */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">PANDUAN SISTEM</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Panduan Fitur Portal Dirmawa</h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
          Temukan berbagai kemudahan layanan kemahasiswaan dan alumni yang dapat Anda akses secara langsung melalui Portal Terpadu Direktorat Kemahasiswaan (Dirmawa).
        </p>
      </div>

      {/* Intro Welcome Card */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#feb234]/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#001e40]/5 text-[#001e40] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="h-9 w-9 text-[#feb234]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-sans text-[#001e40]">Selamat Datang di Portal Dirmawa UPB!</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              Portal ini dirancang khusus untuk memfasilitasi mahasiswa Universitas Pelita Bangsa dalam mengajukan beasiswa, mendaftar keanggotaan UKM, melaporkan prestasi gemilang, hingga mengajukan pembentukan organisasi mahasiswa baru secara digital dan transparan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Features categories (Grid of cards) */}
      <div className="space-y-8">
        {/* Section 1: Fitur untuk Pengunjung Umum / Tanpa Login */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-[#feb234]">
            <div className="w-6 h-0.5 bg-[#feb234]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Akses Publik</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[9px] font-sans font-bold rounded">Tanpa Login</span>
          </div>
          <h3 className="font-sans font-black text-xl text-[#001e40]">Layanan Umum (Landing Page)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Direktori & Pencarian UKM",
                desc: "Jelajahi puluhan Unit Kegiatan Mahasiswa (UKM) aktif di UPB berdasarkan kategori olahraga, seni, maupun akademik. Anda dapat membaca profil, struktur pengurus, program kerja, serta mengajukan minat gabung."
              },
              {
                icon: BookOpen,
                title: "Portal Publik Beasiswa",
                desc: "Cari dan temukan informasi program beasiswa yang sedang dibuka (baik internal kampus, pemerintah, maupun kemitraan swasta) lengkap dengan persyaratan berkas dan batas akhir pendaftaran."
              },
              {
                icon: FileText,
                title: "Statistik Alumni & Tracer Study",
                desc: "Melihat grafik sebaran karir alumni UPB (bekerja, wirausaha, studi lanjut) dan mengakses tautan langsung menuju website resmi pengisian kuesioner pelacakan karir terpadu."
              },
              {
                icon: HelpCircle,
                title: "Informasi Berita & Agenda Kampus",
                desc: "Dapatkan pembaruan berita kemahasiswaan terbaru, pengumuman penting, serta daftar agenda terdekat (seperti seminar, pelatihan karir, maupun rapat koordinasi ormawa)."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#feb234]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-sm text-[#001e40]">{item.title}</h4>
                    <p className="text-xs text-slate-550 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Fitur untuk Portal Mahasiswa (Dengan Login) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2 text-emerald-600">
            <div className="w-6 h-0.5 bg-emerald-600" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600">Portal Utama</span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[9px] font-sans font-bold rounded">Wajib Login</span>
          </div>
          <h3 className="font-sans font-black text-xl text-[#001e40]">Fitur Dashboard Portal Mahasiswa</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: LayoutDashboard,
                title: "Dashboard Overview",
                desc: "Halaman ringkasan yang menampilkan data status pengajuan beasiswa Anda, status pendaftaran UKM, riwayat pelaporan prestasi, serta statistik akumulasi pengajuan ormawa baru secara seketika."
              },
              {
                icon: Users,
                title: "Pengelolaan UKM Saya",
                desc: "Lihat status keanggotaan UKM yang telah Anda ikuti, ajukan minat bergabung ke UKM baru secara digital, dan pantau apakah permohonan keanggotaan Anda disetujui oleh pengurus UKM."
              },
              {
                icon: BookOpen,
                title: "Pendaftaran Beasiswa",
                desc: "Ajukan beasiswa secara online dengan mengisi formulir digital, mengunggah dokumen persyaratan (KTM, Transkrip, Surat Pernyataan), serta melacak proses seleksi (Pending, Terverifikasi, Disetujui, Ditolak)."
              },
              {
                icon: Award,
                title: "Pengajuan Prestasi",
                desc: "Laporkan prestasi akademik maupun non-akademik (Juara 1, 2, 3, Emas, Perak) dari tingkat regional hingga internasional dengan mengunggah sertifikat bukti fisik untuk divalidasi ke poin SIMKATMAWA."
              },
              {
                icon: PlusCircle,
                title: "Ajukan Ormawa Baru",
                desc: "Punya ide untuk mendirikan UKM atau Organisasi Mahasiswa baru? Ajukan proposal pendirian secara online dengan mengunggah nama bakal UKM, visi-misi, serta daftar calon anggota aktif."
              },
              {
                icon: Settings,
                title: "Pengaturan Akun & Profil",
                desc: "Perbarui informasi profil Anda secara berkala, edit nomor telepon kontak aktif, ubah password secara aman, serta unggah/ganti foto avatar profil agar dikenali oleh sistem."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#feb234]/10 text-[#feb234] flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <h4 className="font-sans font-bold text-sm text-[#001e40]">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Box - Panduan Akses */}
      <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <h4 className="font-sans font-black text-sm text-[#001e40] uppercase tracking-wide mb-4">Cara Memulai Penggunaan Portal:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-sans text-xs">
          <div className="space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#001e40] text-[#feb234] font-bold flex items-center justify-center">1</span>
            <p className="font-bold text-[#001e40]">Registrasi Akun</p>
            <p className="text-slate-500">Klik tombol "Login Mahasiswa" lalu pilih registrasi untuk mendaftarkan NIM & prodi Anda.</p>
          </div>
          <div className="space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#001e40] text-[#feb234] font-bold flex items-center justify-center">2</span>
            <p className="font-bold text-[#001e40]">Tunggu Persetujuan</p>
            <p className="text-slate-500">Permintaan pendaftaran mahasiswa baru akan divalidasi oleh administrator Dirmawa.</p>
          </div>
          <div className="space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#001e40] text-[#feb234] font-bold flex items-center justify-center">3</span>
            <p className="font-bold text-[#001e40]">Login ke Portal</p>
            <p className="text-slate-500">Setelah disetujui, login menggunakan email dan password yang Anda daftarkan.</p>
          </div>
          <div className="space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#001e40] text-[#feb234] font-bold flex items-center justify-center">4</span>
            <p className="font-bold text-[#001e40]">Gunakan Layanan</p>
            <p className="text-slate-500">Anda siap mengajukan beasiswa, mendaftar UKM, maupun melaporkan prestasi Anda.</p>
          </div>
        </div>
      </div>

      {/* Kontak Section */}
      <div className="bg-gradient-to-br from-[#001e40] to-[#002d61] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#feb234]/15 blur-3xl pointer-events-none" />
        <h2 className="text-xl font-bold font-sans mb-6">Butuh Bantuan Teknis?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-[#feb234]" />
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Telepon / WhatsApp</p>
              <p className="font-bold text-sm mt-0.5">(021) 1234-5678</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-[#feb234]" />
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Email Layanan</p>
              <p className="font-bold text-sm mt-0.5 lowercase">kemahasiswaan@upb.ac.id</p>
            </div>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-[#feb234]" />
            </div>
            <div>
              <p className="text-slate-400 font-semibold">Alamat Kantor</p>
              <p className="font-bold text-sm mt-0.5">Gedung Biro Kemahasiswaan, UPB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}