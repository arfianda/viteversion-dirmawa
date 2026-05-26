# About Section and Navbar Dropdown Design

## Overview
This document outlines the design for adding a new "Tentang" (About) section to the Dirmawa 2.0 website and restructuring the navbar to use a dropdown menu to reduce visual clutter.

## Requirements
1. Create a new "Tentang" section/page that contains:
   - Organisasi deskripsi singkat
   - Visi dan misi Dirmawa
   - Struktur organisasi
   - Sejarah dan prestasi
2. Make the section accessible via:
   - "Selengkapnya" button in the hero banner (HomeView)
   - Navigation menu (navbar)
3. Restructure navbar to use dropdown menu to reduce item clustering
4. All text must be in Bahasa Indonesia (consistent with previous localization)

## Current State Analysis
Based on code review:

### Navbar Component (`src/components/Navbar.tsx`)
Currently has 6 nav items:
- Homepage (Beranda)
- Alumni
- Prestasi
- Beasiswa
- Direktori UKM
- Berita

Plus brand text and search/login controls.

### HomeView Component (`src/components/HomeView.tsx`)
Has a hero banner with "Selengkapnya" button that currently links to scholarships tab.

## Proposed Solution

### 1. About Section Implementation
Create a new component: `src/components/AboutView.tsx` containing:
- Header with title "Tentang Dirmawa"
- Organisasi section: deskripsi singkat tentang Dirmawa Kemahasiswaan dan Alumni UPB
- Visi & Misi section: 
  * Visi: Menjadi wadah yang aktif dan inovatif dalam menyalurkan minat, bakat, dan keagamaan mahasiswa
  * Misi: Menyelenggarakan program dan kegiatan yang dapat mengembangkan potensi mahasiswa dalam bidang kepemimpinan, kreativitas, dan kebermaskaran
- Struktur Organisasi: tabel atau diagram sederhana showing kepengurusan
- Sejarah & Prestasi: timeline singkat tentang pembentukan dan prestasi yang diraih

### 2. Navbar Restructuring with Dropdown
Modify `src/components/Navbar.tsx` to:
- Replace current horizontal menu with a dropdown for "Lainnya" or "Menu" 
- Keep frequently accessed items visible: Beranda, Beasiswa, UKM, Berita
- Move less frequently accessed items to dropdown: Alumni, Prestasi, Tentang
- Dropdown appears on hover/click on desktop, and in mobile hamburger menu

### 3. Hero Banner Integration
Update HomeView hero banner "Selengkapnya" button to:
- Navigate to the new About section instead of scholarships tab
- Update URL route to `/about` or similar

## Component Structure
```
src/
├── components/
│   ├── Navbar.tsx          // Modified: add dropdown menu
│   ├── HomeView.tsx        // Modified: update hero banner link
│   ├── AboutView.tsx       // NEW: About/Tentang section
│   ├── ... (existing components)
```

## Data Flow
1. User clicks "Selengkapnya" in hero banner OR selects "Tentang" from navbar dropdown
2. Application navigates to AboutView component
3. AboutView displays all organizational information in Bahasa Indonesia
4. User can navigate back to home or other sections via navbar

## Error Handling
- If AboutView component fails to load, show error message in Indonesian
- Navigation links include proper error handling for routing

## Implementation Plan
1. Create AboutView component with all required content
2. Modify Navbar to implement dropdown menu
3. Update HomeView hero banner to link to About section
4. Add routing logic if needed (check if using React Router)
5. Test all navigation paths
6. Ensure responsive design works on mobile and desktop

## Success Criteria
- About section accessible via both hero banner and navbar
- Navbar dropdown reduces visual clutter while maintaining accessibility
- All content properly localized in Bahasa Indonesia
- Responsive design works on all device sizes
- No broken links or navigation issues
- Existing functionality preserved

## Next Steps
After design approval, proceed to implementation planning phase.