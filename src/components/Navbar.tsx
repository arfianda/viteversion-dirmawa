/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { ShieldAlert, BookOpen, Users, Award, Landmark, Search, Key, LogIn, ChevronDown, Shield, User as UserIcon, Menu, X } from 'lucide-react';
import upbLogo from '../assets/images/logo-upb.png';
import { AuthService } from '../services/authService';
import { AuthUser } from '../services/authService';

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
  const [panduanSubmenuOpen, setPanduanSubmenuOpen] = React.useState(false);
  const panduanRef = React.useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Load current user on mount
  React.useEffect(() => {
    const loadUser = async () => {
      const user = await AuthService.getSession();
      if (user) {
        setCurrentUser(user);
      }
    };
    loadUser();
  }, []);

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'news', label: 'Berita' },
    { id: 'scholarships', label: 'Beasiswa' },
    { id: 'ukms', label: 'Ormawa' },
    { id: 'facilities', label: 'Fasilitas' },
  ];

  const panduanItems = [
    { id: 'panduan-kode-etik', label: 'Kode Etik Mahasiswa' },
    { id: 'panduan-pok', label: 'POK UPB' },
    { id: 'panduan-mahasiswa', label: 'Panduan Mahasiswa' },
  ];

  const alumniDropdownItems = [
    { id: 'alumni-data', label: 'Data Alumni' },
    { id: 'alumni-lowongan', label: 'Lowongan Kerja' },
    { id: 'alumni-ikalisa', label: 'IKALISA' },
  ];

  const dropdownItems = [
    { id: 'achievements', label: 'Prestasi' },
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
      if (panduanRef.current && !panduanRef.current.contains(event.target as Node)) {
        setPanduanSubmenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
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
                <div className="absolute left-0 top-full pt-1.5 w-56 z-50">
                  <div className="py-1 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 animate-fade-in">
                    {dropdownItems.map((item) => {
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`block w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-[#001e40] transition-colors duration-150 first:rounded-t-md ${
                            isActive ? 'bg-slate-100 text-[#001e40]' : ''
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}

                    {/* Divider */}
                    <div className="border-t border-slate-100 my-1" />

                    {/* Panduan Submenu */}
                    <div 
                      className="relative" 
                      ref={panduanRef}
                      onMouseEnter={() => setPanduanSubmenuOpen(true)}
                      onMouseLeave={() => setPanduanSubmenuOpen(false)}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-[#001e40] transition-colors duration-150 flex items-center justify-between rounded-b-md"
                        onClick={() => setPanduanSubmenuOpen(!panduanSubmenuOpen)}
                      >
                        <span>Panduan</span>
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 -rotate-90 ${panduanSubmenuOpen ? 'rotate-0' : ''}`} />
                      </button>

                      {/* Panduan Submenu Items - muncul ke kanan */}
                      {panduanSubmenuOpen && (
                        <div className="absolute left-full top-0 pl-1 w-48 z-50">
                          <div className="py-1 bg-white rounded-lg shadow-lg border border-slate-100 ring-1 ring-black ring-opacity-5 overflow-hidden animate-fade-in">
                            {panduanItems.map((item) => {
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

            {/* User Menu (if logged in) */}
            {currentUser && (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#001e40] to-[#feb234] flex items-center justify-center text-white font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-bold text-[#001e40] leading-none">{currentUser.name}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider leading-none mt-1 ${
                      currentUser.role === 'superadmin' ? 'text-red-600' :
                      currentUser.role === 'admin' ? 'text-blue-600' : 'text-slate-500'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-fade-in">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-[#001e40]">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700">
                        {currentUser.role}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {/* Dashboard Option */}
                      <button
                        onClick={() => {
                          const adminRoles = [
                            'superadmin', 'admin', 'administrator', 'operator', 
                            'direktur', 'staf_beasiswa', 'staf_ormawa', 
                            'staf_alumni', 'staf_depan'
                          ];
                          if (currentUser.role === 'mahasiswa') {
                            window.location.hash = '#/mahasiswa';
                          } else if (adminRoles.includes(currentUser.role)) {
                            window.location.hash = '#/admin';
                          } else if (currentUser.role === 'admin_ormawa') {
                            window.location.hash = '#/ormawa';
                          } else {
                            window.location.hash = '#/home';
                          }
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#001e40] flex items-center gap-2"
                      >
                        <BookOpen size={14} />
                        Dashboard
                      </button>

                      {currentUser.role === 'superadmin' && (
                        <button
                          onClick={() => {
                            setCurrentTab('user-management');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-650 hover:bg-slate-50 hover:text-[#001e40] flex items-center gap-2"
                        >
                          <Shield size={14} />
                          User Management
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await AuthService.signOut();
                          setCurrentUser(null);
                          setUserMenuOpen(false);
                          localStorage.removeItem('upb_mahasiswa_session');
                          localStorage.removeItem('upb_affairs_session');
                          window.location.hash = '';
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-650 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogIn size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Student Login Button */}
            {!currentUser && (
              <>
                {/* Desktop Version */}
                <button
                  onClick={() => {
                    window.location.hash = '#/mahasiswa';
                  }}
                  className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-sans font-extrabold tracking-wide transition-all duration-300 bg-[#001e40] hover:bg-[#002d61] text-white shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <LogIn size={13} className="text-[#feb234]" />
                  <span>Login Mahasiswa</span>
                </button>

                {/* Mobile Version (Icon Only) */}
                <button
                  onClick={() => {
                    window.location.hash = '#/mahasiswa';
                  }}
                  className="flex sm:hidden items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 bg-[#001e40] hover:bg-[#002d61] text-white shadow-sm cursor-pointer shrink-0"
                  aria-label="Login Mahasiswa"
                >
                  <LogIn size={18} className="text-[#feb234]" />
                </button>
              </>
            )}

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#001e40] hover:bg-slate-100 focus:outline-none w-11 h-11 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-inner animate-fade-in py-4 px-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-[#001e40]"
            />
          </div>

          {/* Nav Items */}
          <div className="flex flex-col space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">Navigasi Utama</p>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-sans font-bold transition-all ${
                    isActive
                      ? 'text-[#001e40] bg-slate-100'
                      : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Alumni Items (Accordion style or collapsible) */}
          <div className="flex flex-col space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">Alumni</p>
            {alumniDropdownItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2 rounded-xl text-sm font-sans font-bold transition-all ${
                    isActive
                      ? 'text-[#001e40] bg-slate-100'
                      : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Lainnya & Panduan */}
          <div className="flex flex-col space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">Panduan &amp; Lainnya</p>
            {dropdownItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2 rounded-xl text-sm font-sans font-bold transition-all ${
                    isActive
                      ? 'text-[#001e40] bg-slate-100'
                      : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Panduan Items */}
            {panduanItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-8 py-2 rounded-xl text-xs font-sans font-semibold text-slate-500 hover:bg-slate-55 transition-all ${
                    isActive ? 'text-[#001e40] bg-slate-100' : ''
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Profile / Mobile Login */}
          <div className="pt-4 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#001e40] to-[#feb234] flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#001e40]">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const adminRoles = [
                        'superadmin', 'admin', 'administrator', 'operator', 
                        'direktur', 'staf_beasiswa', 'staf_ormawa', 
                        'staf_alumni', 'staf_depan'
                      ];
                      if (currentUser.role === 'mahasiswa') {
                        window.location.hash = '#/mahasiswa';
                      } else if (adminRoles.includes(currentUser.role)) {
                        window.location.hash = '#/admin';
                      } else if (currentUser.role === 'admin_ormawa') {
                        window.location.hash = '#/ormawa';
                      } else {
                        window.location.hash = '#/home';
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2.5 bg-slate-100 text-[#001e40] text-xs font-bold rounded-xl text-center"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={async () => {
                      await AuthService.signOut();
                      setCurrentUser(null);
                      setMobileMenuOpen(false);
                      localStorage.removeItem('upb_mahasiswa_session');
                      localStorage.removeItem('upb_affairs_session');
                      window.location.hash = '';
                    }}
                    className="px-4 py-2.5 bg-red-50 text-red-650 text-xs font-bold rounded-xl text-center"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  window.location.hash = '#/mahasiswa';
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-sans font-bold uppercase tracking-wider bg-[#001e40] text-white shadow-sm"
              >
                <LogIn size={14} className="text-[#feb234]" />
                <span>Login Mahasiswa</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}