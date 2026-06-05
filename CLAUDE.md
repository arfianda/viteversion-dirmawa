# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Introduction
This repository contains the source code for Dirmawa, a modern, high-fidelity, and fully responsive Student Affairs Web Portal designed for Universitas Pelita Bangsa (UPB). The application serves as an integrated platform connecting students, alumni, and university administration (Biro Kemahasiswaan) to manage academic and extracurricular opportunities, accomplishments, and career tracking.

## Key Features
The portal comprises six main functional areas:
1. **Homepage / Dashboard (`HomeView.tsx`)**
- High-contrast hero banner featuring dynamic call-to-actions.
- Real-time statistics counter tracking 50+ Student Activity Units (UKM), 15k+ Alumni, and 500+ Achievements.
- Quick Access Grid linking to key student services (SIPMA Beasiswa, UKM Directory, Alumni Tracer, and Pusat Karir).
- News feed for student achievements and academic announcements.
- Upcoming Agenda panel tracking campus events (e.g., Job Fairs).

2. **Scholarships Portal (`ScholarshipView.tsx`)**
- Category-based filtering (Pemerintah, Internal, Swasta).
- Detailed modal view displaying funding amounts, deadlines, benefits, and requirements.
- Student application simulator checking pre-requisites.

3. **UKM Directory (`UkmView.tsx`)**
- Filterable directory categorized by activity fields (Sports, Arts & Culture, Academic, Social, etc.).
- Full profile views outlining vision, mission, weekly schedules, contact personnel, and photo galleries.
- Built-in registration form for students to join units directly.

4. **Achievements Board (`AchievementView.tsx`)**
- Showcase of student awards at regional, national, and international levels.
- Dynamic report form allowing students to submit new achievements for university verification.

5. **Alumni Tracer Study (`AlumniView.tsx`)**
- Interactive analytics dashboard visualizing career distribution (Recharts Pie Chart) and graduation trends (Recharts Bar Chart).
- Searchable, sortable, and paginated directory table powered by **TanStack Table**.
- Robust tracer study questionnaire built with **React Hook Form** and **Zod** to validate and submit career data.

6. **Console Admin Portal (`AdminView.tsx`)**
- Secure management dashboard for university administrators.
- Full CRUD (Create, Read, Update, Delete) workflows to manage Scholarships, UKMs, Achievements, News, and Alumni records.
- Global reactive state updates across the client-side database.

## Technology Stack
- **Framework:** React 19 & TypeScript
- **Bundler & Build Tool:** Vite (v6.2.3)
- **Styling:** Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin and `@import "tailwindcss"` in `src/index.css`)
- **Typography:** Plus Jakarta Sans & Inter (Google Fonts)
- **Table Operations:** TanStack Table v8 (`@tanstack/react-table`)
- **Data Visualization:** Recharts (v3.8.1)
- **State & Form Validation:** React Hook Form & Zod Resolver
- **Transitions & Animations:** Motion (v12)
- **Icons:** Lucide React

## Project Directory Structure
```text

dirmawa2.0/
    ├── docs/
    │   ├── superpowers/plans/
    │   └── version-management.md
    ├── src/
    │   ├── components/
    │   │   ├── AchievementView.tsx
    │   │   ├── AdminView.tsx
    │   │   ├── AlumniView.tsx
    │   │   ├── Footer.tsx
    │   │   ├── HomeView.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── ScholarshipView.tsx
    │   │   └── UkmView.tsx
    │   ├── App.tsx
    │   ├── data.ts
    │   ├── index.css
    │   ├── main.tsx
    │   └── types.ts
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
    ```

## Current Development Progress
- [x] **Core UI Layout & Routing:** Implemented standard layout shell using responsive side/header navigation.
- [x] **All Pages & Interactive Forms:** Fully developed all views with rich client interactions (forms, search filters, modals, tables, and pagination).
- [x] **Validated Inputs:** Wired React Hook Form with Zod schemas for the tracer study questionnaire and achievements submission.
- [x] **Visual Analytics:** Integrated Recharts to represent alumni tracer study metrics with a modern visual style.
- [x] **Admin Management Console:** Full CRUD operational on mock states for real-time reactivity during live demo testing.
- [x] **Tailwind CSS v4 Integration:** Modernized theme variables using native CSS custom properties inside `index.css`.
- [x] **React 19 Version Management Strategy:** Successfully migrated to React 19 and established a flexible semantic versioning schema (`^19.0.0`) for dependencies and dev type definitions to receive patch updates safely (documented in [docs/version-management.md](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/docs/version-management.md)).

## Getting Started Locally
1. **Install Dependencies**
```bash
    npm install
```
2. **Run Development Server**
```bash
    npm run dev
```
*The server defaults to port `3000` (`http://localhost:3000`).*
3. **Build for Production**
```bash
    npm run build
```
