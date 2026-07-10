/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { createPortal } from "react-dom";
import {
  HeartPulse,
  Clock,
  MapPin,
  CheckCircle2,
  Shield,
  Brain,
  Lock,
  Users,
  Compass,
  HelpCircle,
  Mail,
  Phone,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface FacilitiesViewProps {
  setCurrentTab?: (tab: string) => void;
}

export default function FacilitiesView({ setCurrentTab }: FacilitiesViewProps) {
  // Modal states
  const [emergencyModalOpen, setEmergencyModalOpen] =
    React.useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] =
    React.useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = React.useState<boolean>(false);

  // Form states for Counseling Booking
  const [bookingForm, setBookingForm] = React.useState({
    name: "Budi Santoso",
    nim: "202100123",
    email: "budi.santoso@mhs.pelitabangsa.ac.id",
    date: "",
    time: "",
    notes: "",
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.date || !bookingForm.time) {
      alert("Harap pilih tanggal dan jam konsultasi terlebih dahulu.");
      return;
    }
    // Simulate API call
    setBookingSuccess(true);
  };

  const resetBookingForm = () => {
    setBookingForm({
      name: "Budi Santoso",
      nim: "202100123",
      email: "budi.santoso@mhs.pelitabangsa.ac.id",
      date: "",
      time: "",
      notes: "",
    });
    setBookingSuccess(false);
    setBookingModalOpen(false);
  };

  // Scroll functions
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden py-16 md:py-24 px-6 md:px-12 bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-25"
            alt="University Library"
            src="https://lh3.googleusercontent.com/aida/AP1WRLuINY1u_k5fNeE0Q7klMw31LaQlZLpmO0TxpUO4QAuR3C4uk31DVJgloB17y4ckcEGGtxrKxzX06FoYNADOrFAZyfqg2Mj3_4EVomR1Oy6b9AnPt3wa6PK8-acGfi2F_6ti8oAqkzw_4PbioZr7OVhjAwEDo7KuUVAws1snOqVzFkd9CNro-rioroIv_gDvDg31qoNtyKSoGyR_u-jII_GET9HTMqTpFsPjj_p01yNNkFx7XUYhw-IdtoY"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-block px-3.5 py-1 bg-[#feb234] text-[#001e40] rounded-full text-xs font-bold uppercase tracking-wider">
            Layanan Mahasiswa
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Fasilitas &amp; Layanan Mahasiswa
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Komitmen kami untuk mendukung kesejahteraan, kesehatan, dan
            pertumbuhan profesional setiap mahasiswa Universitas Pelita Bangsa
            melalui ekosistem layanan yang inklusif.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => scrollToSection("facilities-grid")}
              className="bg-[#feb234] text-[#001e40] hover:bg-white hover:text-[#001e40] transition-all duration-300 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Compass size={14} className="stroke-[2.5]" />
              Jelajahi Fasilitas
            </button>
            <button
              onClick={() => scrollToSection("contact-section")}
              className="border border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#001e40] hover:border-white transition-all duration-300 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <HelpCircle size={14} />
              Butuh Bantuan?
            </button>
          </div>
        </div>
      </section>

      {/* Facilities Content Grid */}
      <section id="facilities-grid" className="scroll-mt-24 space-y-8">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-8 h-0.5 bg-[#feb234]" />
          <span className="font-sans text-xs font-bold uppercase tracking-widest">
            Fasilitas Kesehatan &amp; Kesejahteraan
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* UKK Section (Bento Style 7 columns) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="sm:w-2/5 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5">
                  <HeartPulse size={28} />
                </div>
                <h2 className="font-sans font-black text-2xl text-[#001e40] tracking-tight">
                  UKK
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-6">
                  Unit Kesehatan Kampus
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <Clock size={15} className="text-[#feb234] flex-shrink-0" />
                  <span>08:00 - 17:00 WIB</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <MapPin size={15} className="text-[#feb234] flex-shrink-0" />
                  <span>Gedung B, Lantai 1</span>
                </div>
              </div>
            </div>

            <div className="sm:w-3/5 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-6 sm:pt-0 sm:pl-8 flex flex-col justify-between">
              <div>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Fasilitas kesehatan primer yang menyediakan pertolongan
                  pertama, konsultasi medis umum, dan obat-obatan dasar bagi
                  seluruh civitas akademika. Kami memastikan respon cepat untuk
                  keadaan darurat medis di area kampus.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Pemeriksaan Kesehatan Umum",
                    "Ruang Rawat Sementara",
                    "Kotak P3K Terdistribusi di Tiap Gedung",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-[#001e40] flex-shrink-0 mt-0.5"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="w-full bg-slate-50 hover:bg-[#001e40] hover:text-white text-[#001e40] font-sans font-bold text-xs py-3 rounded-xl transition-all duration-300 border border-slate-200/85 shadow-sm hover:shadow-md"
              >
                Lihat Prosedur Darurat
              </button>
            </div>
          </div>

          {/* Asuransi Section (Card Visual 5 columns) */}
          <div className="lg:col-span-5 bg-[#001e40] p-8 rounded-2xl text-white relative overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[350px]">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 text-[#feb234] rounded-xl flex items-center justify-center mb-5">
                <Shield size={24} />
              </div>
              <h2 className="font-sans font-black text-2xl tracking-tight mb-2">
                Asuransi Mahasiswa
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 opacity-90">
                Perlindungan kesehatan dan kecelakaan selama masa studi aktif di
                Universitas Pelita Bangsa.
              </p>
            </div>

            <a
              href="https://forms.gle/LEQiaz5sGVyrgtv49"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-6 w-full bg-[#feb234] text-[#001e40] hover:bg-white transition-all duration-300 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-md hover:shadow-lg relative z-10"
            >
              Ajukan Klaim Asuransi
            </a>

            {/* Decorative background icons */}
            <div className="absolute -right-8 -top-8 text-white/5 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <Shield size={180} />
            </div>
          </div>

          {/* Counseling & Mental Health Section (12 columns) */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#feb234]/10 text-[#feb234] rounded-2xl flex items-center justify-center">
                  <Brain size={28} />
                </div>
                <h2 className="font-sans font-black text-2xl lg:text-3xl text-[#001e40] tracking-tight">
                  Konseling &amp; Kesehatan Mental
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kami percaya bahwa kesehatan mental adalah fondasi dari
                  kesuksesan akademik. Tim psikolog kami siap mendengarkan dan
                  mendampingi Anda melewati tantangan akademik maupun personal
                  dengan kerahasiaan penuh.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-[#001e40]/5 text-[#001e40] rounded-lg">
                    <Lock size={18} />
                  </div>
                  <div className="text-xs font-bold text-slate-700 leading-tight">
                    Sesi Privat &amp; Rahasia
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-[#001e40]/5 text-[#001e40] rounded-lg">
                    <Users size={18} />
                  </div>
                  <div className="text-xs font-bold text-slate-700 leading-tight">
                    Terapi Kelompok &amp; Workshop
                  </div>
                </div>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-[#001e40] text-white hover:bg-[#feb234] hover:text-[#001e40] hover:shadow-md transition-all duration-300 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Booking Sesi Konsultasi
              </button>
            </div>

            <div className="relative h-[280px] md:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
              <img
                className="w-full h-full object-cover"
                alt="Counseling Room"
                src="https://lh3.googleusercontent.com/aida/AP1WRLvkcqU1rCNI28A_tY9pgWhVqjnEKu_AMoIMHruDeOTKab-KhM6LGZwq-ayfp3LSvL4NW4GgMmJJMVkPh8Sk3ZVdqUM3kVxRIEe6VQbxJeo5gCBYu5YRvhtNnAyb0rM1CjRTu2Pn0YC0R4Aabg78fmAfi2gAxOqGfJ34NzytwFuLFmR4MlqQF3eLj5F5TaRce5u1GLwdkoX6oQPi-Y4zNcMJKzcqA9399DHitOHUGAko4zeXkGYdx8AF9g"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img
                    alt="Staff 1"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop"
                  />
                  <img
                    alt="Staff 2"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#001e40] text-[#feb234] flex items-center justify-center text-[10px] font-bold">
                    +4
                  </div>
                </div>
                <div className="text-[10px] font-black text-[#001e40] uppercase tracking-wider">
                  Tim Psikolog Profesional
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        id="contact-section"
        className="py-12 bg-slate-100/60 rounded-3xl text-center border border-slate-200/50"
      >
        <h3 className="font-sans font-black text-xl sm:text-2xl text-[#001e40] mb-2">
          Masih Memiliki Pertanyaan?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed px-4">
          Direktorat Kemahasiswaan siap membantu Anda mendapatkan informasi dan
          layanan terbaik di kampus.
        </p>
        <div className="flex flex-wrap justify-center gap-4 px-4">
          <a
            href="mailto:kemahasiswaan@pelitabangsa.ac.id"
            className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-full border border-slate-200/80 hover:border-[#001e40] hover:text-[#001e40] hover:shadow-sm transition-all duration-300 text-xs font-bold text-slate-600"
          >
            <Mail size={15} className="text-[#feb234]" />
            <span>kemahasiswaan@pelitabangsa.ac.id</span>
          </a>
          <a
            href="tel:+62211234567"
            className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-full border border-slate-200/80 hover:border-[#001e40] hover:text-[#001e40] hover:shadow-sm transition-all duration-300 text-xs font-bold text-slate-600"
          >
            <Phone size={15} className="text-[#feb234]" />
            <span>+62 21 1234 567</span>
          </a>
        </div>
      </section>

      {/* MODALS */}

      {/* 1. UKK Emergency Modal */}
      {emergencyModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setEmergencyModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in">
            <div className="p-6 bg-[#001e40] text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="text-[#feb234]" size={22} />
                <h3 className="font-sans font-black text-lg">
                  Prosedur Darurat Medis Kampus
                </h3>
              </div>
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-3.5 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={18}
                />
                <div className="text-xs text-red-900 leading-normal">
                  <strong>PENTING:</strong> Untuk kejadian kritis/mengancam
                  nyawa, segera hubungi Unit Kesehatan Kampus via ekstensi
                  internal <strong>119</strong> atau hubungi ambulans luar.
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#001e40] uppercase tracking-wide">
                  Alur Penanganan Medis:
                </h4>
                <ol className="space-y-3.5">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-[#001e40] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="text-xs text-slate-600 leading-normal">
                      <strong>Pelaporan Awal:</strong> Laporkan lokasi kejadian,
                      nama korban, dan kondisi umum ke nomor UKK (Ext 104) atau
                      dosen/staf terdekat.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-[#001e40] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="text-xs text-slate-600 leading-normal">
                      <strong>Tindakan Pertama (P3K):</strong> Jika aman dan
                      Anda terlatih, berikan pertolongan pertama dasar
                      menggunakan kotak P3K yang tersedia di lobi lift tiap
                      gedung.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-[#001e40] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="text-xs text-slate-600 leading-normal">
                      <strong>Evakuasi ke UKK:</strong> Tim medis UKK akan
                      menuju lokasi atau korban dievakuasi langsung menggunakan
                      tandu ke ruang rawat sementara UKK di Gedung C Lantai 1.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 bg-[#001e40] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <div className="text-xs text-slate-600 leading-normal">
                      <strong>Rujukan Rumah Sakit:</strong> Bila dibutuhkan
                      penanganan lanjutan, UKK akan merujuk mahasiswa ke Rumah
                      Sakit Mitra terdekat menggunakan ambulans kampus.
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setEmergencyModalOpen(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-350 transition-colors text-[#001e40] font-sans font-bold text-xs rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}


      {/* 3. Counseling Booking Modal */}
      {bookingModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={resetBookingForm}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-fade-in">
            <div className="p-6 bg-[#001e40] text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Brain className="text-[#feb234]" size={22} />
                <h3 className="font-sans font-black text-lg">
                  Booking Konseling Mahasiswa
                </h3>
              </div>
              <button
                onClick={resetBookingForm}
                className="text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {!bookingSuccess ? (
              <form
                onSubmit={handleBookingSubmit}
                className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Silakan tentukan jadwal kosong Anda. Privasi dan identitas
                  Anda dijamin sepenuhnya rahasia oleh kode etik psikolog.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                      Nama Mahasiswa
                    </label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                      NIM
                    </label>
                    <input
                      type="text"
                      value={bookingForm.nim}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Email Mahasiswa
                  </label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                      Pilih Tanggal *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingForm.date}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, date: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#001e40]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                      Pilih Jam *
                    </label>
                    <select
                      required
                      value={bookingForm.time}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, time: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#001e40]"
                    >
                      <option value="">Pilih Jam</option>
                      <option value="09:00 - 10:30">09:00 - 10:30 WIB</option>
                      <option value="11:00 - 12:30">11:00 - 12:30 WIB</option>
                      <option value="13:30 - 15:00">13:30 - 15:00 WIB</option>
                      <option value="15:30 - 17:00">15:30 - 17:00 WIB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                    Keluhan / Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tulis keluhan atau catatan tambahan yang ingin didiskusikan..."
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#001e40]"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={resetBookingForm}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-sans font-bold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] transition-all font-sans font-bold text-xs rounded-xl shadow-md hover:shadow-lg"
                  >
                    Kirim Permohonan
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-10 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={36} />
                </div>
                <h4 className="font-sans font-black text-xl text-[#001e40]">
                  Pengajuan Berhasil Dikirim!
                </h4>
                <div className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  Permohonan sesi konseling untuk tanggal{" "}
                  <strong>{bookingForm.date}</strong> pukul{" "}
                  <strong>{bookingForm.time} WIB</strong> telah didaftarkan. Tim
                  psikolog kami akan menghubungi Anda melalui email{" "}
                  <strong>{bookingForm.email}</strong> untuk konfirmasi
                  lanjutan.
                </div>
                <button
                  onClick={resetBookingForm}
                  className="mt-6 px-6 py-2.5 bg-[#001e40] hover:bg-[#002d61] transition-colors text-white font-sans font-bold text-xs rounded-xl shadow-md"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
