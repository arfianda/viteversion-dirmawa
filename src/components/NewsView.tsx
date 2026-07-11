import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Calendar, BookOpen, Clock, Tag, X, ChevronRight } from 'lucide-react';
import { StudentNews } from '../types';

interface NewsViewProps {
  news: StudentNews[];
  setCurrentTab: (tab: string) => void;
}

export default function NewsView({ news, setCurrentTab }: NewsViewProps) {
  const [activeCategory, setActiveCategory] = React.useState<'Semua' | 'Berita' | 'Agenda' | 'Pengumuman'>('Semua');
  const [selectedArticle, setSelectedArticle] = React.useState<StudentNews | null>(null);

  const filteredNews = React.useMemo(() => {
    // Sort news by date descending or ID descending (assuming newer news has higher IDs or date order)
    const sorted = [...news].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id);
    });

    if (activeCategory === 'Semua') return sorted;
    return sorted.filter(item => {
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

  // Split into Featured (latest one) and regular list
  const featuredArticle = filteredNews[0] || null;
  const regularArticles = filteredNews.slice(1);

  const getBadgeStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('pengumuman') || cat.includes('announcement')) {
      return 'bg-blue-50/80 text-blue-700 border border-blue-200/50';
    }
    if (cat.includes('agenda')) {
      return 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/50';
    }
    return 'bg-amber-50/80 text-[#815500] border border-amber-200/50';
  };

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-6 border-b border-slate-200/80 gap-4 text-left">
        <div>
          <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block mb-1">KABAR KAMPUS</span>
          <h2 className="font-sans font-black text-3xl text-[#001e40] tracking-tight">Informasi &amp; Pengumuman</h2>
          <p className="text-sm text-slate-500 font-medium mt-1.5 max-w-2xl leading-relaxed">
            Dapatkan berita terbaru, agenda kegiatan kemahasiswaan, dan pengumuman resmi dari Direktorat Kemahasiswaan UPB.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('home')}
          className="group text-xs font-sans font-extrabold text-[#001e40] hover:text-[#feb234] flex items-center space-x-1.5 shrink-0 bg-slate-100 hover:bg-[#001e40]/5 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide uppercase transition-all duration-200 cursor-pointer whitespace-nowrap border ${
              activeCategory === cat
                ? 'bg-[#001e40] text-white border-[#001e40] shadow-sm'
                : 'bg-white text-slate-505 border-slate-200 hover:bg-slate-50 hover:text-[#001e40]'
            }`}
          >
            {cat === 'Semua' ? 'Semua Informasi' : cat}
          </button>
        ))}
      </div>

      {/* Featured News (Hero Banner Layout) */}
      {featuredArticle && activeCategory === 'Semua' && (
        <div 
          onClick={() => setSelectedArticle(featuredArticle)}
          className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col lg:flex-row cursor-pointer text-left group"
        >
          {/* Featured Image */}
          <div className="w-full lg:w-3/5 h-64 lg:h-96 relative overflow-hidden bg-slate-100 shrink-0">
            <img 
              src={featuredArticle.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'} 
              alt={featuredArticle.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 bg-[#001e40] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-md">
              Sorotan Utama
            </span>
          </div>

          {/* Featured Content */}
          <div className="p-6 md:p-10 flex flex-col justify-between flex-grow space-y-6">
            <div className="space-y-4">
              <span className={`inline-block px-3 py-1 text-[10px] font-sans font-black uppercase tracking-wider rounded-lg ${getBadgeStyle(featuredArticle.category)}`}>
                {featuredArticle.category}
              </span>
              <h3 className="font-sans font-black text-[#001e40] text-2xl md:text-3xl leading-snug group-hover:text-[#feb234] transition-colors duration-200">
                {featuredArticle.title}
              </h3>
              <p className="text-slate-505 text-sm leading-relaxed font-medium line-clamp-4">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
              <div className="flex items-center text-xs text-slate-400 font-sans font-bold gap-2">
                <Calendar size={14} className="text-[#feb234]" />
                <span>{featuredArticle.date}</span>
              </div>
              <span className="text-xs font-black text-[#001e40] flex items-center gap-1 group-hover:text-[#feb234] transition-colors">
                Baca Selengkapnya
                <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of regular articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(activeCategory === 'Semua' ? regularArticles : filteredNews).map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedArticle(item)}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer text-left group shadow-sm"
          >
            <div>
              {/* Full Card Image Thumbnail */}
              <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop'} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-sans font-black uppercase tracking-wider rounded-lg shadow-sm ${getBadgeStyle(item.category)}`}>
                  {item.category}
                </span>
              </div>

              {/* Content details */}
              <div className="p-5 space-y-3">
                <h4 className="font-sans font-extrabold text-[#001e40] text-base leading-snug line-clamp-2 group-hover:text-[#feb234] transition-colors duration-200">
                  {item.title}
                </h4>
                <p className="text-slate-505 text-xs leading-relaxed font-medium line-clamp-3">
                  {item.summary}
                </p>
              </div>
            </div>

            {/* Meta and read more link */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center text-[10px] text-slate-400 font-sans font-bold gap-1.5">
                <Calendar size={12} className="text-[#feb234]" />
                <span>{item.date}</span>
              </div>
              <span className="text-[10px] font-black text-[#001e40] flex items-center gap-0.5 group-hover:text-[#feb234] transition-colors">
                Baca Detail
                <ChevronRight size={12} />
              </span>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredNews.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white border border-slate-200/60 rounded-3xl">
            <BookOpen size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-sm">Tidak ada berita atau agenda tersedia</p>
            <p className="text-xs text-slate-400 mt-1.5">Silakan kembali beberapa saat lagi untuk informasi terbaru.</p>
          </div>
        )}
      </div>

      {/* ARTICLE DETAIL MODAL (React Portal) */}
      {selectedArticle && createPortal(
        <div 
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-[100] animate-fade-in"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-none sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200/80 animate-scale-up text-left flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[90vh]"
          >
            {/* Header Image Header */}
            {selectedArticle.image && (
              <div 
                className="h-64 md:h-80 w-full bg-cover bg-center relative shrink-0"
                style={{ backgroundImage: `url('${selectedArticle.image}')` } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-black/10 to-black/30" />
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 w-9 h-9 rounded-full flex items-center justify-center transition shadow-md z-20 cursor-pointer"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6 z-10">
                  <span className={`inline-block px-3 py-1 text-[10px] font-sans font-black uppercase tracking-wider rounded-lg shadow ${getBadgeStyle(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                </div>
              </div>
            )}

            {!selectedArticle.image && (
              <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                <span className={`inline-block px-3 py-1 text-[10px] font-sans font-black uppercase tracking-wider rounded-lg ${getBadgeStyle(selectedArticle.category)}`}>
                  {selectedArticle.category}
                </span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-grow">
              <div className="space-y-3">
                <h3 className="font-sans font-black text-[#001e40] text-xl md:text-3xl leading-snug">
                  {selectedArticle.title}
                </h3>
                
                <div className="flex items-center text-xs text-slate-400 font-sans font-bold gap-4 pt-1.5 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#feb234]" />
                    <span>Diterbitkan: {selectedArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>Bacaan 3 menit</span>
                  </div>
                </div>
              </div>

              <div className="text-slate-655 text-sm leading-relaxed space-y-5">
                {/* Summary Intro */}
                <p className="font-bold text-slate-700 text-base border-l-4 border-[#feb234] pl-4 italic">
                  {selectedArticle.summary}
                </p>
                {/* Full Article Content Description */}
                <div 
                  className="prose prose-sm max-w-none text-slate-600 leading-relaxed font-medium space-y-4"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.description || '' }}
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}