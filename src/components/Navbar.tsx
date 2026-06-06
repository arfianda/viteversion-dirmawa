/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { ShieldAlert, BookOpen, Users, Award, Landmark, Search, Key, LogIn, ChevronDown } from 'lucide-react';
import upbLogo from '../assets/images/logo-upb.png';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  setSelectedUkmId: (id: string | null) => void;
}

export default function Navbar({ currentTab, setCurrentTab, setSelectedUkmId }: NavbarProps) {
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [alumniDropdownOpen, setAlumniDropdownOpen] = React.useState(false);
  const alumniDropdownRef = React.useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'scholarships', label: 'Beasiswa' },
    { id: 'ukms', label: 'Direktori UKM' },
    { id: 'news', label: 'Berita' },
  ];

  const alumniDropdownItems = [
    { id: 'alumni-data', label: 'Data Alumni' },
    { id: 'alumni-lowongan', label: 'Lowongan Kerja' },
    { id: 'alumni-ikalisa', label: 'IKALISA' },
  ];

  const dropdownItems = [
    { id: 'achievements', label: 'Prestasi' },
    { id: 'facilities', label: 'Fasilitas' },
    { id: 'about', label: 'Tentang' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setSelectedUkmId(null);
    // Close dropdown when navigating
    setDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (alumniDropdownRef.current && !alumniDropdownRef.current.contains(event.target as Node)) {
        setAlumniDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Brand Logo - Match the exact clean layout */}
          <div className="flex items-center space-x-3 cursor-pointer select-none group" onClick={() => handleNavClick('home')}>
            <img
              src={upbLogo}
              alt="UPB Logo"
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col text-left leading-[1.15]">
              <span className="font-sans font-black text-[13px] sm:text-[14px] text-[#001e40] tracking-tight group-hover:text-[#feb234] transition-colors duration-200">
                Direktorat
              </span>
              <span className="font-sans font-black text-[13px] sm:text-[14px] text-[#001e40] tracking-tight group-hover:text-[#feb234] transition-colors duration-200">
                Kemahasiswaan dan Alumni
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 ml-6">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-sans font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-[#001e40] bg-slate-100 font-extrabold'
                      : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Alumni Dropdown Button */}
            <div
              ref={alumniDropdownRef}
              className="relative"
              onMouseEnter={() => setAlumniDropdownOpen(true)}
              onMouseLeave={() => setAlumniDropdownOpen(false)}
            >
              <button
                onClick={() => setAlumniDropdownOpen(!alumniDropdownOpen)}
                className={`
                  inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-sans font-semibold tracking-wide transition-all duration-200
                  ${alumniDropdownItems.some(item => currentTab === item.id)
                    ? 'text-[#001e40] bg-slate-100 font-extrabold'
                    : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'}
                `}
              >
                <span>Alumni</span>
                <ChevronDown className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ${alumniDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Alumni Dropdown Menu */}
              {alumniDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-48 z-50">
                  <div className="py-1 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in">
                    {alumniDropdownItems.map((item) => {
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`block w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-[#001e40] transition-colors duration-150 ${
                            isActive ? 'bg-slate-100 text-[#001e40]' : ''
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Dropdown Button */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`
                  inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-sans font-semibold tracking-wide transition-all duration-200
                  ${dropdownItems.some(item => currentTab === item.id)
                    ? 'text-[#001e40] bg-slate-100 font-extrabold'
                    : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'}
                `}
              >
                <span>Lainnya</span>
                <ChevronDown className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-48 z-50">
                  <div className="py-1 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in">
                    {dropdownItems.map((item) => {
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`block w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-[#001e40] transition-colors duration-150 ${
                            isActive ? 'bg-slate-100 text-[#001e40]' : ''
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Search & Login */}
          <div className="flex items-center space-x-3">
            {/* Inline Search Bar */}
            <div className={`relative hidden sm:block transition-all duration-300 ${searchFocused ? 'w-56' : 'w-44'}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Cari..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#001e40] transition-all"
              />
            </div>

            {/* Student Login Button */}
            <button
              onClick={() => {
                window.location.hash = '#/mahasiswa';
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 bg-[#001e40] hover:bg-[#002d61] text-white shadow-sm"
            >
              <LogIn size={13} className="text-[#feb234]" />
              <span>Login Mahasiswa</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}