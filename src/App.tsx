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

// Import initial mock data
import {
  SCHOLARSHIPS as initialScholarships,
  UKMS as initialUkms,
  ACHIEVEMENTS as initialAchievements,
  NEWS as initialNews,
  INITIAL_ALUMNI as initialAlumni
} from './data';

import { Scholarship, UKM, Achievement, AlumniRecord, StudentNews } from './types';
import AdminPortal from './admin/AdminPortal';
import MahasiswaPortal from './mahasiswa-dashboard/MahasiswaPortal';
import { SupabaseService } from './services/supabaseService';

export default function App() {
  //  ALL useState hooks FIRST (before any conditional returns)
  const [isAdminPortal, setIsAdminPortal] = React.useState<boolean>(false);
  const [isMahasiswaPortal, setIsMahasiswaPortal] = React.useState<boolean>(false);
  const getInitialTab = () => {
    const hash = window.location.hash;
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
  
  // Core reactive data states
  const [scholarships, setScholarships] = React.useState<Scholarship[]>(initialScholarships);
  const [ukms, setUkms] = React.useState<UKM[]>(initialUkms);
  const [achievements, setAchievements] = React.useState<Achievement[]>(initialAchievements);
  const [news, setNews] = React.useState<StudentNews[]>(initialNews);
  const [alumni, setAlumni] = React.useState<AlumniRecord[]>(initialAlumni);

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
      default: expectedHash = '';
    }
    if (expectedHash && window.location.hash !== expectedHash) {
      window.location.hash = expectedHash;
    }
  }, [currentTab]);

  // Load from Supabase
  React.useEffect(() => {
    async function loadData() {
      try {
        const [dbScholarships, dbUkms, dbAchievements, dbNews, dbAlumni] = await Promise.all([
          SupabaseService.getScholarships(),
          SupabaseService.getUkms(),
          SupabaseService.getAchievements(),
          SupabaseService.getNews(),
          SupabaseService.getAlumni(),
        ]);
        setScholarships(dbScholarships);
        setUkms(dbUkms);
        setAchievements(dbAchievements);
        setNews(dbNews);
        setAlumni(dbAlumni);
      } catch (err) {
        console.error("Failed to load data from Supabase, using mock fallback:", err);
      }
    }
    loadData();
  }, []);

  // Scroll to top on tab transitions
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentTab]);

  //  Conditional returns AFTER all hooks
  if (isAdminPortal) {
    return <AdminPortal />;
  }

  if (isMahasiswaPortal) {
    return <MahasiswaPortal />;
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