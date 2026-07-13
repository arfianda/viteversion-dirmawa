import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, BookOpen } from 'lucide-react';
import { LIST_PRODI_UPB } from '../constants/prodi';

interface SearchableProdiDropdownProps {
  value: string;
  onChange: (value: string, faculty: string) => void;
  placeholder?: string;
}

export default function SearchableProdiDropdown({
  value,
  onChange,
  placeholder = 'Pilih Program Studi'
}: SearchableProdiDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProdis = LIST_PRODI_UPB.filter((prodi) =>
    prodi.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (prodiName: string, faculty: string) => {
    onChange(prodiName, faculty);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-10 py-3 font-medium outline-none transition-all text-left flex justify-between items-center cursor-pointer focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10"
      >
        <span className="truncate">
          {value || <span className="text-slate-400 font-medium">{placeholder}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search Input */}
          <div className="relative p-2.5 border-b border-slate-100 bg-slate-50/50">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-xs rounded-lg pl-8 pr-3 py-2.5 font-medium outline-none transition-all text-slate-800 placeholder:text-slate-400"
              placeholder="Cari program studi..."
            />
          </div>

          {/* List Options */}
          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50">
            {filteredProdis.map((prodi) => {
              const isSelected = prodi.name === value;
              return (
                <button
                  key={prodi.name}
                  type="button"
                  onClick={() => handleSelect(prodi.name, prodi.faculty)}
                  className={`w-full text-left px-4 py-3 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer hover:bg-slate-50 ${
                    isSelected ? 'bg-[#001e40]/5 text-[#001e40] font-black' : 'text-slate-700'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="truncate">{prodi.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{prodi.faculty}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#001e40] shrink-0" />}
                </button>
              );
            })}

            {filteredProdis.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">
                Tidak ada program studi ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
