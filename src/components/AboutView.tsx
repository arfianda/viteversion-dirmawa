import React from 'react';

export default function AboutView() {
  return (
    <div className="space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#feb234]">
          TENTANG DIRMAWA
        </span>
        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl lg:text-[36px] text-[#001e40] tracking-tight">
          Tentang Dirmawa Kemahasiswaan dan Alumni UPB
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </section>

      {/* Organisasi Section */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            Informasi & Ormawa
          </span>
        </div>
        <h3 className="font-sans font-bold text-xl text-[#001e40]">
          Deskripsi Singkat Organisasi
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
        </p>
      </section>

      {/* Visi & Misi Section */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            Informasi & Ormawa
          </span>
        </div>
        <h3 className="font-sans font-bold text-xl text-[#001e40]">
          Visi & Misi Dirmawa
        </h3>

        {/* Visi Subsection */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-lg text-[#001e40]">
            Visi Dirmawa
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>

        {/* Misi Subsection */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-lg text-[#001e40]">
            Misi Dirmawa
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            Informasi & Ormawa
          </span>
        </div>
        <h3 className="font-sans font-bold text-xl text-[#001e40]">
          Struktur Organisasi Dirmawa
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Ketua Umum */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#feb234]/20 text-[#feb234] flex items-center justify-center mx-auto mb-2">
              <span className="font-mono text-xs">KU</span>
            </div>
            <h4 className="font-sans font-semibold text-[#001e40]">
              Ketua Umum
            </h4>
            <p className="text-xs text-slate-500">
              Lorem ipsum dolor sit amet
            </p>
          </div>

          {/* Sekretaris */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#feb234]/20 text-[#feb234] flex items-center justify-center mx-auto mb-2">
              <span className="font-mono text-xs">Sek</span>
            </div>
            <h4 className="font-sans font-semibold text-[#001e40]">
              Sekretaris
            </h4>
            <p className="text-xs text-slate-500">
              Lorem ipsum dolor sit amet
            </p>
          </div>

          {/* Bendahara */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#feb234]/20 text-[#feb234] flex items-center justify-center mx-auto mb-2">
              <span className="font-mono text-xs">Ben</span>
            </div>
            <h4 className="font-sans font-semibold text-[#001e40]">
              Bendahara
            </h4>
            <p className="text-xs text-slate-500">
              Lorem ipsum dolor sit amet
            </p>
          </div>

          {/* Koordinator Divisi */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#feb234]/20 text-[#feb234] flex items-center justify-center mx-auto mb-2">
              <span className="font-mono text-xs">KD</span>
            </div>
            <h4 className="font-sans font-semibold text-[#001e40]">
              Koordinator Divisi
            </h4>
            <p className="text-xs text-slate-500">
              Lorem ipsum dolor sit amet
            </p>
          </div>
        </div>
      </section>

      {/* Sejarah & Prestasi Section */}
      <section className="space-y-8">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            Informasi & Ormawa
          </span>
        </div>
        <h3 className="font-sans font-bold text-xl text-[#001e40]">
          Sejarah dan Prestasi Dirmawa
        </h3>

        {/* Sejarah Subsection */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-lg text-[#001e40]">
            Sejarah Dirmawa
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Prestasi Subsection */}
        <div className="space-y-4">
          <h4 className="font-sans font-semibold text-lg text-[#001e40]">
            Prestasi Dirmawa
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </section>
    </div>
  );
}