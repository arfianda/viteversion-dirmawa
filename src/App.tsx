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
  const [currentTab, setCurrentTab] = React.useState<string>('home');
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
      setIsAdminPortal(
        window.location.search.includes('portal=admin') || window.location.hash === '#/admin'
      );
      setIsMahasiswaPortal(
        window.location.search.includes('portal=mahasiswa') || window.location.hash === '#/mahasiswa'
      );
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

          {currentTab === 'about' && (
            <AboutView
              setCurrentTab={setCurrentTab}
              setSelectedUkmId={setSelectedUkmId}
            />
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