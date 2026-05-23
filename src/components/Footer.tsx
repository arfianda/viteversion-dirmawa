/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Globe, MessageSquare } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  setSelectedUkmId: (id: string | null) => void;
}

export default function Footer({ setCurrentTab, setSelectedUkmId }: FooterProps) {
  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setSelectedUkmId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#001e40] border-t border-[#002d61] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Universitas / Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-[#feb234] p-2 rounded-lg text-[#001e40]">
                <Globe size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <span className="font-sans font-extrabold tracking-tight text-white block">
                  UNIVERSITAS PELITA BANGSA
                </span>
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#feb234] font-bold block">
                  DIREKTORAT KEMAHASISWAAN DAN ALUMNI
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt labore sit rerum eos consectetur itaque blanditiis quis qui quos nesciunt?
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="p-2.5 bg-[#002d61] hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-300 transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2.5 bg-[#002d61] hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-300 transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2.5 bg-[#002d61] hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-300 transition-all duration-300">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-sans font-semibold text-base py-1 uppercase tracking-wider relative inline-block border-b-2 border-[#feb234] mb-6">
              Layanan Mahasiswa
            </h3>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
                  Portal Berita & Kegiatan
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scholarships')} className="hover:text-[#feb234] text-slate-300 transition-colors block text-left font-semibold">
                  Informasi Beasiswa
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ukms')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
                  Direktori UKM & Organisasi
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('achievements')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
                  Panggung Prestasi Mahasiswa
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('alumni')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
                  Sebaran Alumni & Pelacakan Karir
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-sans font-semibold text-base py-1 uppercase tracking-wider relative inline-block border-b-2 border-[#feb234] mb-2">
              Hubungi Kami
            </h3>
            <ul className="space-y-3.5 font-sans text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="text-[#feb234] flex-shrink-0 mt-1" size={18} />
                <span className="text-slate-400 leading-relaxed text-xs">
                  Gedung B Lt. 2, Kampus Universitas Pelita Bangsa.<br />
                  Jl. Inspeksi Kalimalang Tegal Danas, Cikarang Pusat, Kab. Bekasi - 17530
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-[#feb234] flex-shrink-0" size={18} />
                <span className="text-slate-400 text-xs">kemahasiswaan@pelitabangsa.ac.id</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-[#feb234] flex-shrink-0" size={18} />
                <span className="text-slate-400 text-xs">(021) 2928-1111 / Ext: 104</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Peta Lokasi (Mini Maps Mock) */}
          <div>
            <h3 className="text-white font-sans font-semibold text-base py-1 uppercase tracking-wider relative inline-block border-b-2 border-[#feb234] mb-6">
              Lokasi Kampus
            </h3>
            <div className="relative group overflow-hidden rounded-xl border border-[#002d61] h-36 bg-[#001e40]">
              {/* Fake Map Rendering */}
              <div className="absolute inset-0 bg-[#002d61]/90 flex flex-col items-center justify-center p-4 text-center">
                <MapPin className="text-[#feb234] animate-bounce mb-1" size={24} />
                <span className="text-xs text-white font-sans font-semibold">Kampus Pusat UPB</span>
                <span className="text-[10px] text-slate-300 font-mono mt-0.5">Cikarang Pusat, Bekasi</span>
              </div>
              <div className="absolute bottom-2 right-2 z-10">
                <a
                  href="https://maps.app.goo.gl/HhNnKfLmxn4g6Gin7"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] font-mono font-bold text-[9px] px-2 py-1 rounded shadow uppercase"
                >
                  Buka Peta
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Brand Copyright */}
        <div className="border-t border-[#002d61] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono">
          <p>© 2026 Direktorat Kemahasiswaan & Hubungan Alumni UPB. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0 text-[#feb234]">Pristine Academic Integrity — Tridharma Perguruan Tinggi</p>
        </div>
      </div>
    </footer>
  );
}
