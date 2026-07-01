import React from 'react';
import { Hammer, Shield, RefreshCw, Key } from 'lucide-react';

export default function UnderConstructionView() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#191c1e] font-sans flex flex-col justify-between p-6">
      {/* Top Header / Logo */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#001e40] flex items-center justify-center text-white shadow-sm font-black text-sm">
            UPB
          </div>
          <div>
            <h1 className="font-sans font-black text-xs text-[#001e40] uppercase tracking-wider leading-none">
              Direktorat Kemahasiswaan
            </h1>
            <p className="text-[9px] text-[#737780] font-semibold tracking-wide uppercase mt-0.5">
              Universitas Pelita Bangsa
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        {/* Decorative Maintenance Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#feb234]/15 blur-2xl rounded-full scale-150 animate-pulse"></div>
          <div className="w-24 h-24 rounded-3xl bg-[#001e40] text-[#feb234] flex items-center justify-center shadow-xl border border-white/20 relative z-10">
            <Hammer size={48} className="animate-bounce" />
          </div>
        </div>

        {/* Headline */}
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#feb234] bg-[#feb234]/10 border border-[#feb234]/30 px-3 py-1 rounded-full mb-4 inline-block">
          Scheduled Maintenance
        </span>
        <h2 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight mb-4 leading-tight">
          Portal Sedang Dalam Pemeliharaan
        </h2>
        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed mb-8 font-medium">
          Kami sedang melakukan peningkatan sistem dan pembaruan berkala untuk memberikan layanan kemahasiswaan yang lebih baik. Silakan kembali dalam beberapa saat lagi.
        </p>

        {/* Small Progress / Status Indicator */}
        <div className="inline-flex items-center gap-2 bg-[#eceef1]/80 border border-slate-200 px-4 py-2 rounded-xl text-xs text-[#5c606a] font-semibold">
          <RefreshCw size={14} className="animate-spin text-[#001e40]" />
          <span>Sistem akan segera kembali online</span>
        </div>
      </main>

      {/* Footer / Admin Gateway */}
      <footer className="max-w-7xl mx-auto w-full py-6 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-[#737780]">
        <p>© {new Date().getFullYear()} Direktorat Kemahasiswaan &amp; Alumni UPB. All rights reserved.</p>
        
        {/* Hidden Admin Entrypoint */}
        <a 
          href="/#admin" 
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '#/admin';
            window.location.reload();
          }}
          className="flex items-center gap-1.5 hover:text-[#001e40] transition-colors bg-white hover:bg-slate-50 border border-slate-250 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <Key size={12} />
          <span>Admin Gateway</span>
        </a>
      </footer>
    </div>
  );
}
