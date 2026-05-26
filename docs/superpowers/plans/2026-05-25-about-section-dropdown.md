# About Section and Navbar Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Tentang" (About) section containing organizational information and implement a navbar dropdown menu to reduce visual clutter while maintaining accessibility.

**Architecture:** 
1. Create new AboutView component with sections for descripsi singkat, visi/misi, struktur organisasi, and sejarah/prestasi (using lorem ipsum placeholder text as requested)
2. Modify Navbar to implement dropdown menu that groups less frequently accessed items (Alumni, Prestasi, Tentang) 
3. Update HomeView hero banner "Selengkapnya" button to navigate to the new About section
4. Ensure responsive design works on both desktop and mobile

**Tech Stack:** React, TypeScript, Vite
---
### Task 1: Create AboutView Component

**Files:**
- Create: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\AboutView.tsx`

- [ ] **Step 1: Create basic AboutView component structure**

```typescript
import React from 'react';

interface AboutViewProps {
  // No props needed for now
}

export default function AboutView({}: AboutViewProps) {
  return (
    <div className="space-y-12">
      
      {/* Header Title */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">TENTANG DIRMAWA</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Tentang Dirmawa Kemahasiswaan dan Alumni UPB</h1>
        <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Organisasi Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Organisasi</span>
        </div>
        <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Deskripsi Singkat Organisasi</h2>
        <p className="text-sm sm:text-base text-slate-505 max-w-3xl mx-auto font-sans leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>

      {/* Visi & Misi Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-[#feb234]">
            <div className="w-6 h-0.5 bg-[#feb234]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Visi</span>
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Visi Dirmawa</h2>
          <p className="text-sm sm:text-base text-slate-505 max-w-3xl mx-auto font-sans leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-[#feb234]">
            <div className="w-6 h-0.5 bg-[#feb234]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Misi</span>
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Misi Dirmawa</h2>
          <p className="text-sm sm:text-base text-slate-505 max-w-3xl mx-auto font-sans leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      {/* Struktur Organisasi Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Struktur</span>
        </div>
        <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Struktur Organisasi Dirmawa</h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 font-bold">Ketua Umum:</span>
              <span className="font-sans font-medium text-slate-700">Lorem Ipsum Dolor</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 font-bold">Sekretaris:</span>
              <span className="font-sans font-medium text-slate-700">Lorem Ipsum Dolor</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 font-bold">Bendahara:</span>
              <span className="font-sans font-medium text-slate-700">Lorem Ipsum Dolor</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 font-bold">Koordinator Divisi:</span>
              <span className="font-sans font-medium text-slate-700">Lorem Ipsum Dolor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sejarah & Prestasi Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-[#feb234]">
          <div className="w-6 h-0.5 bg-[#feb234]" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Sejarah</span>
        </div>
        <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Sejarah dan Prestasi Dirmawa</h2>
        <p className="text-sm sm:text-base text-slate-505 max-w-3xl mx-auto font-sans leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p className="text-sm sm:text-base text-slate-505 max-w-3xl mx-auto font-sans leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      
    </div>
  );
}
```

- [ ] **Step 2: Save the file**

### Task 2: Modify Navbar Component for Dropdown Menu

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\Navbar.tsx`

- [ ] **Step 1: Update navItems to include About section and prepare for dropdown**

```typescript
const navItems = [
  { id: 'home', label: 'Beranda' },
  { id: 'scholarships', label: 'Beasiswa' },
  { id: 'ukms', label: 'UKM' },
  { id: 'news', label: 'Berita' },
];

const dropdownItems = [
  { id: 'alumni', label: 'Alumni' },
  { id: 'achievements', label: 'Prestasi' },
  { id: 'about', label: 'Tentang' },
];
```

- [ ] **Step 2: Modify navbar structure to show main items and dropdown**

```typescript
{/* Center Navigation Links - Main Items */}
<div className="hidden md:flex items-center space-x-1">
  {navItems.map((item) => {
    const isActive = currentTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`px-4 py-2 rounded-lg text-sm font-sans font-semibold tracking-wide transition-all duration-200 ${
          isActive
            ? 'text-[#001e40] bg-slate-100 font-extrabold'
            : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
        }`}
      >
        {item.label}
      </button>
    );
  })}
</div>

{/* Center Navigation Links - Dropdown */}
<div className="hidden md:flex items-center relative">
  <button
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className={`px-4 py-2 rounded-lg text-sm font-sans font-semibold tracking-wide transition-all duration-200 ${
      dropdownOpen
        ? 'text-[#001e40] bg-slate-100 font-extrabold'
        : 'text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
    }`}
  >
    Lainnya
    <ChevronDown size={10} className={`transition-transform duration-200 ${
      dropdownOpen ? 'rotate-180' : ''
    }`} />
  </button>
  
  {/* Dropdown Menu */}
  {dropdownOpen && (
    <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
      {dropdownItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              handleNavClick(item.id);
              setDropdownOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm font-sans ${
              isActive
                ? 'bg-[#feb234] text-[#001e40]'
                : 'hover:bg-slate-50 hover:text-[#001e40]'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  )}
</div>
```

- [ ] **Step 3: Add dropdown state to component**

```typescript
const [dropdownOpen, setDropdownOpen] = React.useState(false);
```

- [ ] **Step 4: Save the file**

### Task 3: Update HomeView Hero Banner Link

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\HomeView.tsx`

- [ ] **Step 1: Update the "Selengkapnya" button in hero banner to navigate to About section**

```typescript
<button 
  onClick={() => {
    setCurrentTab('about');
    setSelectedUkmId(null);
  }}
  className="px-6 py-3 bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow transition-all active:scale-95 duration-300 flex items-center space-x-2"
>
  <span>Selengkapnya</span>
  <ArrowRight size={14} className="stroke-[2.5]" />
</button>
```

- [ ] **Step 2: Update the service card click handlers if needed (optional - keeping existing behavior for service cards)**

- [ ] **Step 3: Save the file**

### Task 4: Add About Section Route Handler in App.tsx

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\App.tsx`

- [ ] **Step 1: Import AboutView component**

```typescript
import AboutView from './components/AboutView';
```

- [ ] **Step 2: Add AboutView routing in the main return statement**

```typescript
{currentTab === 'about' && (
  <AboutView 
    setCurrentTab={setCurrentTab} 
    setSelectedUkmId={setSelectedUkmId} 
  />
)}
```

- [ ] **Step 3: Save the file**

### Task 5: Test Application Functionality

**Files:**
- Test: Application functionality

- [ ] **Step 1: Start the development server**

Run: `npm run dev`
Expected: Application starts successfully

- [ ] **Step 2: Verify all navigation paths work correctly**

- [ ] **Step 3: Test About section accessibility**
  * Click "Selengkapnya" button in hero banner → should navigate to About section
  * Click "Lainnya" dropdown in navbar → select "Tentang" → should navigate to About section
  * Verify URL/path updates correctly

- [ ] **Step 4: Test navbar dropdown functionality**
  * Hover/click on "Lainnya" button → dropdown should appear
  * Click dropdown items → should navigate to correct sections
  * Click outside dropdown → should close (if implemented)
  * Test on responsive/mobile view (hamburger menu)

- [ ] **Step 5: Verify About section content displays correctly**
  * All sections visible: Organisasi, Visi & Misi, Struktur Organisasi, Sejarah & Prestasi
  * Text properly formatted and readable
  * Lorem ipsum placeholder text visible as requested

- [ ] **Step 6: Test interactive elements**
  * Ensure existing functionality still works (scholarships, UKM, etc.)
  * Test navigation between all sections

- [ ] **Step 7: Stop the development server**

- [ ] **Step 8: Commit all changes**

```bash
git add src/components/AboutView.tsx src/components/Navbar.tsx src/components/HomeView.tsx src/App.tsx
git commit -m "feat: add About section and navbar dropdown menu"
```