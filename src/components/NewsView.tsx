import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { StudentNews } from '../types';

interface NewsViewProps {
  news: StudentNews[];
  setCurrentTab: (tab: string) => void;
}

export default function NewsView({ news, setCurrentTab }: NewsViewProps) {
  const [activeCategory, setActiveCategory] = React.useState<'Semua' | 'Berita' | 'Agenda' | 'Pengumuman'>('Semua');

  const filteredNews = React.useMemo(() => {
    if (activeCategory === 'Semua') return news;
    return news.filter(item => {
      // Handle case insensitive or variations
      const itemCat = item.category?.toLowerCase() || '';
      const targetCat = activeCategory.toLowerCase();
      if (targetCat === 'berita') {
        return itemCat.includes('berita') || itemCat.includes('news');
      }
      if (targetCat === 'agenda') {
        return itemCat.includes('agenda');
      }
      if (targetCat === 'pengumuman') {
        return itemCat.includes('pengumuman') || itemCat.includes('announcement');
      }
      return itemCat === targetCat;
    });
  }, [news, activeCategory]);

  const categories: ('Semua' | 'Berita' | 'Agenda' | 'Pengumuman')[] = ['Semua', 'Berita', 'Agenda', 'Pengumuman'];

  const getBadgeStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('pengumuman') || cat.includes('announcement')) {
      return 'bg-blue-50 text-blue-600 border border-blue-100';
    }
    if (cat.includes('agenda')) {
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    }
    return 'bg-orange-50 text-orange-600 border border-orange-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-2xl text-[#001e40]">Informasi & Pengumuman</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Dapatkan berita terbaru, agenda kegiatan, dan pengumuman resmi Direktorat Kemahasiswaan.</p>
        </div>
        <button
          onClick={() => setCurrentTab('home')}
          className="text-xs font-sans font-bold text-[#feb234] hover:text-[#feb234]/80 flex items-center space-x-1 shrink-0"
        >
          <span>Kembali ke Beranda</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#001e40] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="space-y-6">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col sm:flex-row gap-6 hover:shadow-md transition duration-300">
            {/* Image */}
            <div
              className="w-full sm:w-48 h-36 bg-cover bg-center rounded-xl flex-shrink-0 border border-slate-100 bg-[#f2f4f7]"
              style={{ backgroundImage: `url('${item.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop'}')` }}
            />
            {/* Content */}
            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <div>
                {/* Category badge */}
                <span className={`inline-block px-2.5 py-0.5 text-[9px] font-sans font-black uppercase rounded ${getBadgeStyle(item.category)}`}>
                  {item.category}
                </span>
                {/* Title */}
                <h3 className="font-sans font-extrabold text-[#001e40] text-lg sm:text-xl leading-tight mt-2 hover:text-[#001e40]/90 transition-colors">
                  {item.title}
                </h3>
                {/* Summary */}
                <p className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-2">
                  {item.summary}
                </p>
              </div>
              {/* Meta */}
              <div className="flex items-center text-[10px] text-slate-400 font-sans space-x-2 pt-2">
                <Calendar size={12} />
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl">
            <p className="text-slate-500 font-semibold text-sm">Tidak ada informasi atau pengumuman yang tersedia di kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}