/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { StudentNews } from '../types';

interface NewsViewProps {
  news: StudentNews[];
  setCurrentTab: (tab: string) => void;
}

export default function NewsView({ news, setCurrentTab }: NewsViewProps) {
  // Filter news by category 'Berita'
  const beritaNews = news.filter(item => item.category === 'Berita');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <h2 className="font-sans font-extrabold text-xl text-[#001e40]">Berita</h2>
        <button
          onClick={() => setCurrentTab('home')}
          className="text-xs font-sans font-bold text-[#feb234] hover:text-[#ffddb2] flex items-center space-x-1"
        >
          <span>Kembali ke Homepage</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* News list */}
      <div className="space-y-6">
        {beritaNews.map((item) => (
          <div key={item.id} className="bg-white border border-slate-100 p-6 rounded-xl flex flex-col sm:flex-row gap-6 hover:shadow-sm transition">
            {/* Image */}
            <div
              className="w-full sm:w-48 h-48 bg-cover bg-center rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            {/* Content */}
            <div className="space-y-3 flex-grow">
              {/* Category badge */}
              <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 text-[9px] font-sans font-black uppercase rounded">
                {item.category}
              </span>
              {/* Title */}
              <h3 className="font-sans font-extrabold text-[#001e40] text-lg sm:text-xl leading-tight">
                {item.title}
              </h3>
              {/* Summary */}
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                {item.summary}
              </p>
              {/* Meta */}
              <div className="flex items-center text-[10px] text-slate-400 font-sans space-x-4">
                <Calendar size={12} />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {beritaNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak berita yang tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}