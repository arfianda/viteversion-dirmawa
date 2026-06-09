/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { BookOpen, GraduationCap, Calendar, Award, Shield, Phone, Mail, MapPin, Users } from 'lucide-react';

export default function PanduanMahasiswaView() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#001e40] to-[#002d61] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <GraduationCap className="h-12 w-12 text-[#feb234]" />
            <div>
              <h1 className="text-3xl font-extrabold font-sans">Panduan Mahasiswa</h1>
              <p className="text-slate-300 mt-1 font-sans">Panduan Lengkap Mahasiswa Universitas Pelita Bangsa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold font-sans text-[#001e40] mb-4">Selamat Datang di UPB!</h2>
          <p className="text-slate-600 leading-relaxed font-sans">
            Panduan ini disusun untuk membantu mahasiswa dalam memahami prosedur akademik, kegiatan ekstra kurikuler, dan fasilitas universitas. Dengan membaca panduan ini, Anda dapat memanfaatkan semua yang ditawarkan oleh Universitas Pelita Bangsa secara maksimal.
          </p>
        </div>

        {/* Akademik Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="h-8 w-8 text-[#feb234]" />
            <h2 className="text-2xl font-bold font-sans text-[#001e40]">Prosedur Akademik</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-[#001e40] pl-6">
              <h3 className="font-semibold text-[#001e40] font-sans mb-2">Kehadiran Kelas</h3>
              <p className="text-slate-600 font-sans">
                Mahasiswa wajib hadir minimal 75% dari total pertemuan untuk setiap mata kuliah. Kehadiran dapat diakses melalui portal akademik.
              </p>
            </div>
            <div className="border-l-4 border-[#001e40] pl-6">
              <h3 className="font-semibold text-[#001e40] font-sans mb-2">KRS dan KHS</h3>
              <p className="text-slate-600 font-sans">
                Kartu Rencana Studi (KRS) dijarkan setiap awal semester melalui portal akademik. Kartu Hasil Studi (KHS) dapat diakses setelah penyelesaian semester.
              </p>
            </div>
            <div className="border-l-4 border-[#001e40] pl-6">
              <h3 className="font-semibold text-[#001e40] font-sans mb-2">IPK dan Lulusan</h3>
              <p className="text-slate-600 font-sans">
                Indeks Prestasi Kumulat (IPK) dihitung setiap akhir semester. Syarat lulus adalah IPK minimal 2.00 dan telah menyelesaikan semua beban SKS yang ditetapkan.
              </p>
            </div>
          </div>
        </div>

        {/* Fasilitas Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <MapPin className="h-8 w-8 text-[#feb234]" />
            <h2 className="text-2xl font-bold font-sans text-[#001e40]">Fasilitas Kampus</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: BookOpen, title: 'Perpustakaan', desc: 'Koleksi buku dan jurnal akademik' },
              { icon: Calendar, title: 'Lab Komputer', desc: 'Fasilitas belajar dengan software terkini' },
              { icon: Award, title: 'Ruang UKM', desc: 'Tempat kegiatan organisasi mahasiswa' },
              { icon: Shield, title: 'Unit Kesehatan', desc: 'Layanan kesehatan gratis untuk mahasiswa' }
            ].map((fac, index) => {
              const Icon = fac.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                  <Icon className="h-6 w-6 text-[#feb234] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#001e40] font-sans">{fac.title}</h3>
                    <p className="text-slate-600 font-sans text-sm mt-1">{fac.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organisasi Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="h-8 w-8 text-[#feb234]" />
            <h2 className="text-2xl font-bold font-sans text-[#001e40]">Kegiatan Organisasi</h2>
          </div>
          <p className="text-slate-600 leading-relaxed font-sans mb-6">
            UPB memiliki lebih dari 50 Unit Kegiatan Mahasiswa (UKM) yang dapat diikuti sesuai dengan minat dan bakat. Mahasiswa secara aktif diberikan kesempatan untuk mengembangkan diri melalui organisasi.
          </p>
          <div className="bg-[#001e40] text-white rounded-lg p-6 font-sans">
            <h3 className="font-semibold mb-3">Cara Bergabung dengan UKM:</h3>
            <ol className="space-y-2">
              <li>1. Kunjungi direktori UKM di website</li>
              <li>2. Pilih UKM yang sesuai dengan minat Anda</li>
              <li>3. Isi formulir pendaftaran melalui portal</li>
              <li>4. Ikuti proses seleksi dan interview</li>
              <li>5. Ikuti orientasi anggota baru</li>
            </ol>
          </div>
        </div>

        {/* Kontak Section */}
        <div className="bg-gradient-to-r from-[#001e40] to-[#002d61] rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold font-sans mb-6">Butuh Bantuan?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-[#feb234]" />
              <div>
                <p className="font-sans text-sm text-slate-300">Telepon</p>
                <p className="font-sans font-semibold">(021) 1234-5678</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-[#feb234]" />
              <div>
                <p className="font-sans text-sm text-slate-300">Email</p>
                <p className="font-sans font-semibold">kemahasiswaan@upb.ac.id</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-[#feb234]" />
              <div>
                <p className="font-sans text-sm text-slate-300">Lokasi</p>
                <p className="font-sans font-semibold">Gedung Biro Kemahasiswaan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}