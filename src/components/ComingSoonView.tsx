import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';

interface ComingSoonViewProps {
  title: string;
  setCurrentTab: (tab: string) => void;
}

export default function ComingSoonView({ title, setCurrentTab }: ComingSoonViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-[#001e40]/5 flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-[#feb234]" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-sans font-black text-[#001e40] tracking-tight mb-2">
        {title}
      </h1>
      <p className="text-lg font-sans font-semibold text-[#feb234] mb-4">
        Coming Soon
      </p>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        Fitur ini sedang dalam pengembangan. Nantikan pembaruan selanjutnya!
      </p>
      <button
        onClick={() => setCurrentTab('alumni-data')}
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-sans font-bold text-white bg-[#001e40] hover:bg-[#002d61] transition-colors duration-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-[#feb234]" />
        <span>Kembali ke Data Alumni</span>
      </button>
    </div>
  );
}
