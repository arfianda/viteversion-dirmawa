import React, { useState } from 'react';
import { ArrowLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, List, ListOrdered, Link, Image as ImageIcon, Settings, X, Upload } from 'lucide-react';
import { NewsArticle } from '../types';

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface NewsEditorProps {
  article: NewsArticle | null;
  onSave: (article: NewsArticle) => void;
  onBack: () => void;
  readOnly?: boolean;
}

export default function NewsEditor({ article, onSave, onBack, readOnly = false }: NewsEditorProps) {
  // If no active editing article, use defaults
  const [id] = useState(article?.id || generateUUID());
  const [title, setTitle] = useState(article?.title || 'Universitas Pelita Bangsa Launches New Tech Incubator');
  const [content, setContent] = useState(
    article?.content ||
      `Universitas Pelita Bangsa is proud to announce the launch of its new Technology Innovation Incubator, aimed at supporting student-led startups and research initiatives. The state-of-the-art facility, located in the newly renovated East Wing, will provide resources, mentorship, and funding opportunities for aspiring entrepreneurs.
  
  "This initiative represents a significant step forward in our commitment to fostering practical innovation," said Dr. Budi Santoso, Director of Student Affairs. "We want to equip our students not just with theoretical knowledge, but with the tools to build real-world solutions."`
  );
  const [status, setStatus] = useState<'Draft' | 'Published' | 'Archived'>(article?.status || 'Draft');
  const [visibility, setVisibility] = useState<'Public' | 'Students Only' | 'Alumni Only'>(article?.visibility || 'Public');
  const [publishDate, setPublishDate] = useState(article?.publishDate || '2026-05-26');
  const [category, setCategory] = useState(article?.category || 'News');
  const [tags, setTags] = useState<string[]>(article?.tags || ['Technology', 'Innovation']);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(article?.coverImageUrl || null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (readOnly) return;
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveAction = (newStatus?: 'Draft' | 'Published' | 'Archived') => {
    if (readOnly) return;
    const finalStatus = newStatus || status;
    onSave({
      id,
      title,
      content,
      status: finalStatus,
      visibility,
      publishDate,
      category,
      tags,
      coverImageUrl: coverImage || undefined,
    });
    alert(`Article saved successfully as: ${finalStatus}!`);
    onBack();
  };

  const simulateCoverUpload = () => {
    if (readOnly) return;
    // Simulated cover URL
    setCoverImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCKm5znh_KB_mBV_IKSCdEaYJ1mOsq4eYtwWfbAm-UHEDRznPRdsNKTjpeI6Gl74m-9RUOLeU_3_WXC49JqK4ByqVrfWohIWI2vPUJGS42hnVyb-3X-QCD59AlgJEbXn7LtZGn4iXMiJSApSAu7jmp4VzK1w6rz1J8T4T3E8RKZQkk7k9riFbFjx8_LI7dAuLyXxO10MRm0ZLEchNNrRTSzCj5WtRqVshssD5toBZpaocgbUoboPus9aPe8PzMQmD9xxo3q-1gvv9I");
  };

  return (
    <div className="flex flex-col h-full bg-[#f7f9fc] animate-fade-in">
      
      {/* TopNavBar Header Contextual Edit Bar */}
      <header className="h-16 bg-white border-b border-[#c3c6d1]/40 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-[#43474f] hover:bg-[#eceef1] rounded-full p-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-headline font-bold text-[#191c1e] text-lg">{readOnly ? 'Lihat Artikel' : 'Edit News Article'}</h2>
        </div>
        {!readOnly && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveAction('Draft')}
              className="font-bold text-xs text-[#43474f] px-4 py-2.5 rounded-xl border border-[#c3c6d1] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSaveAction('Published')}
              className="font-bold text-xs bg-[#001e40] hover:bg-[#1F477B] text-white px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Publish News
            </button>
          </div>
        )}
      </header>

      {/* Editor Main Space Layout Grid */}
      <div className="p-6 overflow-y-auto flex-1 h-full">
        <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 pb-12">
          
          {/* Left Editor Area (8 cols) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
            
            {/* Title card input */}
            <div className="bg-white rounded-2xl shadow-sm p-3 border border-[#eceef1]">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title"
                className="w-full bg-transparent border-none font-headline font-bold text-xl text-[#191c1e] placeholder-[#cbd5e1] p-2 focus:ring-0 outline-none"
                disabled={readOnly}
              />
            </div>

            {/* Simulated Word Processor container */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eceef1] flex flex-col h-[520px]">
              
              {/* Toolbars */}
              <div className="border-b border-[#eceef1] p-2 flex flex-wrap gap-1.5 items-center bg-[#f7f9fc] rounded-t-2xl">
                <div className="flex items-center gap-1 border-r border-[#c3c6d1]/30 pr-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 font-bold text-xs text-[#1c1c30] py-1 pl-2 pr-6 cursor-pointer"
                  >
                    <option value="News">Paragraph</option>
                    <option value="Announcement">Heading 1</option>
                    <option value="Achievement">Heading 2</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 border-r border-[#c3c6d1]/30 pr-2">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Bold">
                    <Bold size={16} />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Italic">
                    <Italic size={16} />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Underline">
                    <Underline size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1 border-r border-[#c3c6d1]/30 pr-2">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Align Left">
                    <AlignLeft size={16} />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Align Center">
                    <AlignCenter size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1 border-r border-[#c3c6d1]/30 pr-2">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Bulleted List">
                    <List size={16} />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Numbered List">
                    <ListOrdered size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Insert Link">
                    <Link size={16} />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-slate-200 text-[#191c1e] transition-colors" title="Insert Image">
                    <ImageIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Text Area Content */}
              <div className="flex-1 p-5 rounded-b-2xl bg-white">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start crafting university announcement content here..."
                  className="w-full h-full bg-white text-[#191c1e] placeholder-[#737780]/60 resize-none border-none outline-none focus:ring-0 p-0 text-sm font-medium leading-relaxed"
                  disabled={readOnly}
                />
              </div>

              {/* Word indicator footer */}
              <div className="p-3 bg-slate-50 border-t border-[#eceef1] rounded-b-2xl text-right text-[10px] text-[#737780] font-bold uppercase tracking-wider">
                Words: {content.split(/\s+/).filter(Boolean).length} | Characters: {content.length}
              </div>

            </div>
          </div>

          {/* Right settings column (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Publish settings card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eceef1] p-5">
              <h3 className="font-headline font-bold text-sm text-[#001e40] mb-4 flex items-center gap-1.5 border-b border-[#eceef1] pb-2">
                <Settings size={16} />
                Publish Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Current Status</label>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    status === 'Published'
                      ? 'bg-blue-50 text-[#001e40] border-[#a7c8ff]/20'
                      : status === 'Draft'
                      ? 'bg-[#feb234]/15 text-[#6d4700] border-[#feb234]/20'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Visibility Setting</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl py-2 px-3 text-sm text-[#191c1e] focus:outline-none focus:ring-1 focus:ring-[#001e40]"
                    disabled={readOnly}
                  >
                    <option value="Public">Public</option>
                    <option value="Students Only">Students Only</option>
                    <option value="Alumni Only">Alumni Only</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Publish Schedule Date</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#001e40]"
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>

            {/* Categorization card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eceef1] p-5">
              <h3 className="font-headline font-bold text-sm text-[#001e40] mb-4 flex items-center gap-1.5 border-b border-[#eceef1] pb-2">
                <ImageIcon size={16} />
                Categorization
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Content Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#001e40]"
                    disabled={readOnly}
                  >
                    <option value="News">News</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Alumni">Alumni Highlight</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Tags (Press Enter)</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={readOnly ? "" : "Type and press Enter"}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#001e40]"
                    disabled={readOnly}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#f2f4f7] text-[#43474f] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#c3c6d1]/40"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-700 font-bold transition-colors cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eceef1] p-5">
              <h3 className="font-headline font-bold text-sm text-[#001e40] mb-4 flex items-center gap-1.5 border-b border-[#eceef1] pb-2">
                <ImageIcon size={16} />
                Cover Image
              </h3>

              {coverImage ? (
                <div className="relative rounded-xl overflow-hidden group">
                  <img src={coverImage} alt="Cover" className="w-full h-32 object-cover border border-[#c3c6d1]/40" />
                  <div className="absolute inset-0 bg-[#001e40]/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="text-white text-xs font-bold leading-none bg-[#ba1a1a] p-2 rounded-xl"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={simulateCoverUpload}
                      className="text-[#001e40] text-xs font-bold leading-none bg-[#feb234] p-2 rounded-xl"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={simulateCoverUpload}
                  className="border-2 border-dashed border-[#c3c6d1] rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#f2f4f7] hover:bg-[#eceef1] transition-colors cursor-pointer min-h-[140px]"
                >
                  <Upload size={24} className="text-[#737780]" />
                  <div>
                    <p className="text-xs font-bold text-[#001e40]">Click to upload or drag</p>
                    <p className="text-[10px] text-[#737780] font-semibold mt-0.5">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
