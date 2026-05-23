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
import NewsView from './components/NewsView';

// Import initial mock data
import {
  SCHOLARSHIPS as initialScholarships,
  UKMS as initialUkms,
  ACHIEVEMENTS as initialAchievements,
  NEWS as initialNews,
  INITIAL_ALUMNI as initialAlumni
} from './data';

import { Scholarship, UKM, Achievement, AlumniRecord, StudentNews } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = React.useState<string>('home');
  const [selectedUkmId, setSelectedUkmId] = React.useState<string | null>(null);

  // Core reactive data states
  const [scholarships, setScholarships] = React.useState<Scholarship[]>(initialScholarships);
  const [ukms, setUkms] = React.useState<UKM[]>(initialUkms);
  const [achievements, setAchievements] = React.useState<Achievement[]>(initialAchievements);
  const [news, setNews] = React.useState<StudentNews[]>(initialNews);
  const [alumni, setAlumni] = React.useState<AlumniRecord[]>(initialAlumni);

  // Scroll to top on tab transitions
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentTab]);

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

          {currentTab === 'alumni' && (
            <AlumniView
              alumniList={alumni}
              setAlumniList={setAlumni}
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
