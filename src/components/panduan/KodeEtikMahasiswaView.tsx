/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Scale } from 'lucide-react';

export default function KodeEtikMahasiswaView() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#001e40] to-[#002d61] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-12 w-12 text-[#feb234]" />
            <div>
              <h1 className="text-3xl font-extrabold font-sans">Kode Etik Mahasiswa</h1>
              <p className="text-slate-300 mt-1 font-sans">Universitas Pelita Bangsa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold font-sans text-[#001e40] mb-4">Pendahuluan</h2>
          <p className="text-slate-600 leading-relaxed font-sans">
            Kode Etik Mahasiswa Universitas Pelita Bangsa (UPB) adalah rangkaian prinsip dan norma yang harus dipatuhi oleh seluruh mahasiswa sebagai pedoman perilaku akademik dan non-akademik. Kode etik ini bertujuan untuk menciptakan lingkungan akademik yang kondusif, adil, dan mendukung pertumbuhan intelektual serta kerukunan akademik yang sejahtera.
          </p>
        </div>

        {/* Prinsip Dasar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="h-8 w-8 text-[#feb234]" />
            <h2 className="text-2xl font-bold font-sans text-[#001e40]">Prinsip Dasar</h2>
          </div>
          <div className="space-y-4">
            {[
              'Menghormati martabat dan hak sesama mahasiswa, dosen, dan tenaga kependidikan',
              'Menjaga integritas akademik dalam setiap aktivitas pembelajaran',
              'Berkontribusi positif terhadap pengembangan lingkungan kampus',
              'Berpatisipasi aktif dalam kegiatan yang mendukung tri Dharma Perguruan Tinggi',
              'Menjaga nama baik universitas dalam setiap kesempatan'
            ].map((prinsip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 font-sans">{prinsip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hak dan Kewajiban */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold font-sans text-[#001e40] mb-6">Hak dan Kewajiban Mahasiswa</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold font-sans text-[#001e40] mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Hak Mahasiswa
              </h3>
              <ul className="space-y-3">
                {[
                  'Menerima pendidikan yang berkualitas',
                  'Menggunakan fasilitas kampus',
                  'Mengembangkan potensi melalui organisasi',
                  'Mendapatkan bimbingan akademik',
                  'Berk proporre masukan untuk perbaikan kampus'
                ].map((hak, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-sans">{hak}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-sans text-[#001e40] mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-[#feb234] mr-2" />
                Kewajiban Mahasiswa
              </h3>
              <ul className="space-y-3">
                {[
                  'Menunju ketaatan terhadap peraturan universitas',
                  'Menjaga ketertiban dan keamanan kampus',
                  'Menghormati norma agama dan sosial',
                  'Menjaga kebersihan dan keutuhan fasilitas',
                  'Aktif mengikuti proses pembelajaran'
                ].map((kewajiban, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-sans">{kewajiban}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sanksi */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-8">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600" />
            <h2 className="text-2xl font-bold font-sans text-amber-800">Sanksi Pelanggaran</h2>
          </div>
          <p className="text-amber-700 leading-relaxed font-sans mb-4">
            Mahasiswa yang melanggar kode etik akan dikenai sanksi sesuai dengan tingkat pelanggaran, berupa:
          </p>
          <div className="space-y-2">
            {['Teguran lisan', 'Teguran tertulis', 'Pemberhentian sementara', 'Pemberhentian tetap'].map((sanksi, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-amber-600 font-bold">{index + 1}.</span>
                <span className="text-amber-800 font-sans">{sanksi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}