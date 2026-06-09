/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Building2, FileText, Users, TrendingUp, Shield, Calendar } from 'lucide-react';

export default function POKUPBView() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#001e40] to-[#002d61] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Building2 className="h-12 w-12 text-[#feb234]" />
            <div>
              <h1 className="text-3xl font-extrabold font-sans">POK UPB</h1>
              <p className="text-slate-300 mt-1 font-sans">Peraturan Organisasi Kemahasiswaan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold font-sans text-[#001e40] mb-4">Tentang POK UPB</h2>
          <p className="text-slate-600 leading-relaxed font-sans">
            Peraturan Organisasi Kemahasiswaan (POK) Universitas Pelita Bangsa adalah dasar hukum yang mengatur struktur, fungsi, dan kegiatan organisasi kemahasiswaan di lingkungan universitas. POK menjadi panduan bagi seluruh mahasiswa dalam menjalankan kegiatan organisasi dan extrakurikuler.
          </p>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="h-8 w-8 text-[#feb234]" />
            <h2 className="text-2xl font-bold font-sans text-[#001e40]">Struktur Organisasi</h2>
          </div>
          <div className="space-y-4">
            {[
              { level: 'Biro Kemahasiswaan', desc: 'Fokus pemerintahan universitas' },
              { level: 'Badan Perwakilan Mahasiswa', desc: 'Fungsi legislatif student government' },
              { level: 'Badan Eksekutif Mahasiswa', desc: 'Pelaksana kegiatan kemahasiswaan' },
              { level: 'Unit kegiatan Mahasiswa (UKM)', desc: 'Organisasi berdasarkan minat dan bakat' }
            ].map((org, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="bg-[#001e40] text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-[#001e40] font-sans">{org.level}</h3>
                  <p className="text-slate-600 font-sans text-sm mt-1">{org.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fungsi dan Tugas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="h-8 w-8 text-[#feb234]" />
            <h2 className="text-2xl font-bold font-sans text-[#001e40]">Fungsi dan Tugas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Perlindungan', desc: 'Melindungi hak-hak mahasiswa' },
              { icon: Calendar, title: 'Pengagendaan', desc: 'Menyelenggarakan kegiatan rutin' },
              { icon: TrendingUp, title: 'Pembinaan', desc: 'Mengembangkan potensi mahasiswa' },
              { icon: Users, title: 'Fasilitasi', desc: 'Menyediakan sarana kegiatan' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                  <Icon className="h-6 w-6 text-[#feb234] flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#001e40] font-sans">{item.title}</h3>
                    <p className="text-slate-600 font-sans text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* mekanisme */}
        <div className="bg-gradient-to-r from-[#001e40] to-[#002d61] rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold font-sans mb-4">Mekanisme Pendaftaran Organisasi</h2>
          <ol className="space-y-3 font-sans">
            <li className="flex items-start">
              <span className="text-[#feb234] font-bold mr-3">1.</span>
              <span>Usulan pendirian organisasi dari minimal 20 mahasiswa</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#feb234] font-bold mr-3">2.</span>
              <span>Pengajuan AD/ART dan struktur organisasi ke Biro Kemahasiswaan</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#feb234] font-bold mr-3">3.</span>
              <span>Verifikasi dan evaluated oleh tim asesor</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#feb234] font-bold mr-3">4.</span>
              <span>Surat Keputusan resmi dari Biro Kemahasiswaan</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}