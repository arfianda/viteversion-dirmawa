/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ScholarshipView from './components/ScholarshipView';
import UkmView from './components/UkmView';
import AchievementView from './components/AchievementView';
import AlumniView from './components/AlumniView';
import AdminView from './components/AdminView';
import AboutView from './components/AboutView';
import NewsView from './components/NewsView';
import ComingSoonView from './components/ComingSoonView';
import FacilitiesView from './components/FacilitiesView';
import KodeEtikMahasiswaView from './components/panduan/KodeEtikMahasiswaView';
import POKUPBView from './components/panduan/POKUPB';
import PanduanMahasiswaView from './components/panduan/PanduanMahasiswaView';
import UserManagementView from './components/UserManagementView';
import UnderConstructionView from './components/UnderConstructionView';

import { Scholarship, UKM, Achievement, AlumniRecord, StudentNews } from './types';
import AdminPortal from './admin/AdminPortal';
import MahasiswaPortal from './mahasiswa-dashboard/MahasiswaPortal';
import OrmawaPortal from './ormawa-dashboard/OrmawaPortal';
import { SupabaseService } from './services/supabaseService';

export default function App() {
  //  ALL useState hooks FIRST (before any conditional returns)
  const checkIsAdminPortal = () => {
    return window.location.search.includes('portal=admin') || window.location.hash === '#/admin';
  };

  const checkIsMahasiswaPortal = () => {
    return window.location.search.includes('portal=mahasiswa') || window.location.hash === '#/mahasiswa';
  };

  const checkIsOrmawaPortal = () => {
    return window.location.search.includes('portal=ormawa') || window.location.hash === '#/ormawa';
  };

  const [isAdminPortal, setIsAdminPortal] = React.useState<boolean>(checkIsAdminPortal);
  const [isMahasiswaPortal, setIsMahasiswaPortal] = React.useState<boolean>(checkIsMahasiswaPortal);
  const [isOrmawaPortal, setIsOrmawaPortal] = React.useState<boolean>(checkIsOrmawaPortal);
  const getInitialTab = () => {
    const hash = window.location.hash;
    if (hash === '#/admin') return 'admin';
    if (hash === '#/mahasiswa') return 'mahasiswa';
    if (hash === '#/ormawa') return 'ormawa';
    if (hash === '#/panduan/kode-etik') return 'panduan-kode-etik';
    if (hash === '#/panduan/pok') return 'panduan-pok';
    if (hash === '#/panduan/mahasiswa') return 'panduan-mahasiswa';
    if (hash === '#/about') return 'about';
    if (hash === '#/facilities') return 'facilities';
    if (hash === '#/achievements') return 'achievements';
    if (hash === '#/alumni/data') return 'alumni-data';
    if (hash === '#/alumni/lowongan') return 'alumni-lowongan';
    if (hash === '#/alumni/ikalisa') return 'alumni-ikalisa';
    if (hash === '#/scholarships') return 'scholarships';
    if (hash === '#/ukms') return 'ukms';
    if (hash === '#/news') return 'news';
    if (hash === '#/user-management') return 'user-management';
    return 'home';
  };

  const [currentTab, setCurrentTab] = React.useState<string>(getInitialTab());
  const [selectedUkmId, setSelectedUkmId] = React.useState<string | null>(null);

  // Core reactive data states — start empty, populated from Supabase
  const [scholarships, setScholarships] = React.useState<Scholarship[]>([]);
  const [ukms, setUkms] = React.useState<UKM[]>([]);
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [news, setNews] = React.useState<StudentNews[]>([]);
  const [alumni, setAlumni] = React.useState<AlumniRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [underConstruction, setUnderConstruction] = React.useState<boolean>(false);

  //  ALL useEffect hooks SECOND
  React.useEffect(() => {
    const updatePortalState = () => {
      const hash = window.location.hash;
      setIsAdminPortal(
        window.location.search.includes('portal=admin') || hash === '#/admin'
      );
      setIsMahasiswaPortal(
        window.location.search.includes('portal=mahasiswa') || hash === '#/mahasiswa'
      );
      setIsOrmawaPortal(
        window.location.search.includes('portal=ormawa') || hash === '#/ormawa'
      );

      // Sync hash to currentTab
      if (hash === '#/panduan/kode-etik') {
        setCurrentTab('panduan-kode-etik');
      } else if (hash === '#/panduan/pok') {
        setCurrentTab('panduan-pok');
      } else if (hash === '#/panduan/mahasiswa') {
        setCurrentTab('panduan-mahasiswa');
      } else if (hash === '#/about') {
        setCurrentTab('about');
      } else if (hash === '#/facilities') {
        setCurrentTab('facilities');
      } else if (hash === '#/achievements') {
        setCurrentTab('achievements');
      } else if (hash === '#/alumni/data') {
        setCurrentTab('alumni-data');
      } else if (hash === '#/alumni/lowongan') {
        setCurrentTab('alumni-lowongan');
      } else if (hash === '#/alumni/ikalisa') {
        setCurrentTab('alumni-ikalisa');
      } else if (hash === '#/scholarships') {
        setCurrentTab('scholarships');
      } else if (hash === '#/ukms') {
        setCurrentTab('ukms');
      } else if (hash === '#/news') {
        setCurrentTab('news');
      } else if (hash === '#/user-management') {
        setCurrentTab('user-management');
      } else if (hash === '#/ormawa') {
        setCurrentTab('ormawa');
      } else if (hash === '#/home' || hash === '') {
        setCurrentTab('home');
      }
    };

    // Initialize on mount
    updatePortalState();

    // Listen for hash changes
    const handleHashChange = () => {
      updatePortalState();
    };
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Sync tab state to URL hash
  React.useEffect(() => {
    let expectedHash = '';
    switch (currentTab) {
      case 'home': expectedHash = '#/home'; break;
      case 'scholarships': expectedHash = '#/scholarships'; break;
      case 'ukms': expectedHash = '#/ukms'; break;
      case 'alumni-data': expectedHash = '#/alumni/data'; break;
      case 'alumni-lowongan': expectedHash = '#/alumni/lowongan'; break;
      case 'alumni-ikalisa': expectedHash = '#/alumni/ikalisa'; break;
      case 'achievements': expectedHash = '#/achievements'; break;
      case 'facilities': expectedHash = '#/facilities'; break;
      case 'about': expectedHash = '#/about'; break;
      case 'panduan-kode-etik': expectedHash = '#/panduan/kode-etik'; break;
      case 'panduan-pok': expectedHash = '#/panduan/pok'; break;
      case 'panduan-mahasiswa': expectedHash = '#/panduan/mahasiswa'; break;
      case 'news': expectedHash = '#/news'; break;
      case 'user-management': expectedHash = '#/user-management'; break;
      case 'admin': expectedHash = '#/admin'; break;
      case 'ormawa': expectedHash = '#/ormawa'; break;
      default: expectedHash = '';
    }
    if (expectedHash && window.location.hash !== expectedHash) {
      window.location.hash = expectedHash;
    }
  }, [currentTab]);

  // Reactive Load data function
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      console.log('[App] Fetching data from Supabase...');
      const [dbScholarships, dbUkms, dbAchievements, dbNews, dbAlumni, dbUnderConstruction] = await Promise.all([
        SupabaseService.getScholarships(),
        SupabaseService.getUkms(),
        SupabaseService.getAchievements(),
        SupabaseService.getNews(),
        SupabaseService.getAlumni(),
        SupabaseService.getSystemSetting('under_construction')
      ]);
      console.log('[App] Supabase data loaded:', { scholarships: dbScholarships.length, ukms: dbUkms.length, achievements: dbAchievements.length, news: dbNews.length, alumni: dbAlumni.length, underConstruction: dbUnderConstruction });
      setScholarships(dbScholarships);
      setUkms(dbUkms);
      setAchievements(dbAchievements);
      setNews(dbNews);
      setAlumni(dbAlumni);
      setUnderConstruction(dbUnderConstruction === 'true');
    } catch (err: any) {
      console.error('[App] Failed to load data from Supabase:', err);
      setLoadError(err?.message || 'Gagal memuat data dari database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load from Supabase on mount only
  React.useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when returning from admin/mahasiswa portals (only when toggling back to public)
  const prevIsAdmin = React.useRef(isAdminPortal);
  const prevIsMahasiswa = React.useRef(isMahasiswaPortal);
  const prevIsOrmawa = React.useRef(isOrmawaPortal);
  React.useEffect(() => {
    const wasPortal = prevIsAdmin.current || prevIsMahasiswa.current || prevIsOrmawa.current;
    const isNowPublic = !isAdminPortal && !isMahasiswaPortal && !isOrmawaPortal;
    if (wasPortal && isNowPublic) {
      loadData();
    }
    prevIsAdmin.current = isAdminPortal;
    prevIsMahasiswa.current = isMahasiswaPortal;
    prevIsOrmawa.current = isOrmawaPortal;
  }, [isAdminPortal, isMahasiswaPortal, isOrmawaPortal, loadData]);

  // Scroll to top on tab transitions
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentTab]);

  //  Conditional returns AFTER all hooks
  if (isAdminPortal) {
    return <AdminPortal />;
  }

  if (underConstruction) {
    return <UnderConstructionView />;
  }

  if (isMahasiswaPortal) {
    return <MahasiswaPortal />;
  }

  if (isOrmawaPortal) {
    return <OrmawaPortal />;
  }

  // Loading state — full-screen spinner while fetching from Supabase
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#001e40]/20 border-t-[#001e40] rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-sans font-medium">Memuat data dari database...</p>
      </div>
    );
  }

  // Error state — if Supabase failed
  if (loadError) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center gap-4 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center space-y-3">
          <p className="text-red-700 font-bold text-sm">Gagal Memuat Data</p>
          <p className="text-red-600 text-xs font-mono break-all">{loadError}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-[#001e40] text-white text-xs font-bold rounded-xl"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  //  Main return
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#191c1e] flex flex-col justify-between selection:bg-[#feb234]/30 selection:text-[#001e40]">
      
      {/* Dynamic Header/Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        setSelectedUkmId={setSelectedUkmId} 
      />

      {/* Main Dynamic View Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="animate-fade-in duration-500">
          {currentTab === 'home' && (
            <HomeView 
              setCurrentTab={setCurrentTab} 
              setSelectedUkmId={setSelectedUkmId} 
              news={news}
              ukmsCount={ukms.length}
              alumniCount={alumni.length}
              achievementsCount={achievements.length}
            />
          )}

          {currentTab === 'scholarships' && (
            <ScholarshipView 
              scholarships={scholarships} 
            />
          )}

          {currentTab === 'ukms' && (
            <UkmView 
              ukms={ukms} 
              selectedUkmId={selectedUkmId} 
              setSelectedUkmId={setSelectedUkmId} 
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementView 
              achievements={achievements} 
            />
          )}

          {currentTab === 'alumni-data' && (
            <AlumniView
              alumniList={alumni}
              setAlumniList={setAlumni}
            />
          )}

          {currentTab === 'alumni-lowongan' && (
            <ComingSoonView
              title="Lowongan Kerja"
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'alumni-ikalisa' && (
            <ComingSoonView
              title="IKALISA"
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'news' && (
            <NewsView
              news={news}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'admin' && (
            <AdminView
              scholarships={scholarships}
              setScholarships={setScholarships}
              ukms={ukms}
              setUkms={setUkms}
              achievements={achievements}
              setAchievements={setAchievements}
              news={news}
              setNews={setNews}
              alumni={alumni}
              setAlumni={setAlumni}
            />
          )}

          {currentTab === 'user-management' && (
            <UserManagementView currentUser={null} />
          )}

          {currentTab === 'about' && (
            <AboutView
              setCurrentTab={setCurrentTab}
              setSelectedUkmId={setSelectedUkmId}
            />
          )}

          {currentTab === 'facilities' && (
            <FacilitiesView
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'panduan-kode-etik' && (
            <KodeEtikMahasiswaView />
          )}

          {currentTab === 'panduan-pok' && (
            <POKUPBView />
          )}

          {currentTab === 'panduan-mahasiswa' && (
            <PanduanMahasiswaView />
          )}
        </div>
      </main>

      {/* Persistent Footer */}
      <Footer 
        setCurrentTab={setCurrentTab} 
        setSelectedUkmId={setSelectedUkmId} 
      />

    </div>
  );
}