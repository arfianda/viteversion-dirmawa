# Implementation Plan - Student Portal & Dashboard

Implement the Student Portal (Portal Mahasiswa) for Universitas Pelita Bangsa (UPB). This includes a custom login page, dashboard overview, active UKM list, scholarship monitoring, achievement submission (SKPI integration), and account settings, based on the Stitch designs.

## Proposed Changes

We will group all student-specific components inside the `src/mahasiswa-dashboard` directory.

---

### Student Portal System

#### [NEW] [MahasiswaPortal.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/MahasiswaPortal.tsx)
The main controller for the student portal. Features:
- Manages student session state (`session`).
- Manages active tab state (`dashboard`, `ukm`, `beasiswa`, `prestasi`, `settings`).
- Renders the sidebar navigation (collapsible or floating on mobile) and header bar (profile view, search, notifications, sign-out).
- Persists session in `localStorage` for seamless reload.

#### [NEW] [MahasiswaLogin.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/components/MahasiswaLogin.tsx)
The login screen based on design `ba839bc6cf9c46cf9a8a4521d9185e55`. Features:
- Left-panel institutional branding with a background image and mission statement.
- Right-panel login form with username/NIM and password fields.
- Auto-fill demo credentials for testing (`Budi Santoso`, NIM: `202100123`).
- Seamless login triggering `onLoginSuccess` back to the portal controller.

#### [NEW] [MahasiswaDashboardOverview.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/components/MahasiswaDashboardOverview.tsx)
The main dashboard page based on design `77bc4fe9ae6f47f6b39054a9659b3db6`. Features:
- Personalized greeting widget ("Selamat Datang Kembali, Budi!").
- Bento-grid metric cards:
  - **Prestasi Saya**: count of reported achievements with pending verifications indicator.
  - **UKM Diikuti**: count and list of active student groups.
  - **Status Beasiswa**: active scholarship details and validity.
- Split layout:
  - **Jadwal Kegiatan UKM**: timeline of upcoming UKM activities.
  - **Info Kemahasiswaan**: activity feed / announcements list.

#### [NEW] [MahasiswaUkmSaya.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/components/MahasiswaUkmSaya.tsx)
The UKM management screen based on design `638c69c29bf741eca46828e01de4c2b0`. Features:
- Active student group memberships cards (UKM Seni, English Club) with logos and status.
- Section to join new groups with recommendations (UKM Robotika, Mapala UPB).
- Detail modally-triggered overlays or quick view properties.

#### [NEW] [MahasiswaBeasiswaSaya.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/components/MahasiswaBeasiswaSaya.tsx)
The scholarship monitoring screen based on design `c03f707c9126486795acac905dcdb13a`. Features:
- Active scholarship detailed status card (e.g. valid duration, GPA target 3.50).
- Tasks & documents checklist (e.g. uploading GPA reports, keaktifan certificates).
- Historical scholarship record table.
- Recommendation list for external and internal scholarships (Bank Indonesia, Hibah Riset).

#### [NEW] [MahasiswaPengajuanPrestasi.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/components/MahasiswaPengajuanPrestasi.tsx)
The achievement submission form based on design `d3ed60ffbe334498bccb4f7b16b0cb64`. Features:
- Formulir Pengajuan Baru: Name of competition, level (International, National, etc.), category (Academic, Sports, Arts), date, ranking, and drag-and-drop file upload.
- Guidance panel showing verification rules.
- Historical achievements table showing past records, status (Approved, Waiting, Rejected), and verification details.

#### [NEW] [MahasiswaSettings.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/mahasiswa-dashboard/components/MahasiswaSettings.tsx)
The student account settings page based on design `d7f5e6331c0c4d5f8242bb775a7e1df0`. Features:
- Tabbed layout: Personal Info, Security (Password change), and Notification Preferences.
- Form inputs for full name, NIM, email, phone, and password changes.
- Email and Push notification toggle preferences for scholarship and UKM activities.

---

### Core Integration

#### [MODIFY] [App.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/App.tsx)
Integrate the student portal:
- Detect if the current page should render the student portal:
  ```typescript
  const isMahasiswaPortal = window.location.search.includes('portal=mahasiswa') || window.location.hash === '#/mahasiswa';
  ```
- If true, import and render `<MahasiswaPortal />`.

#### [MODIFY] [Navbar.tsx](file:///c:/Users/arfia/Documents/Websites/dirmawa2.0/src/components/Navbar.tsx)
Connect the "Login Mahasiswa" button:
- Update the button action to trigger navigation to the Mahasiswa Portal by updating the hash:
  ```typescript
  onClick={() => {
    window.location.hash = '#/mahasiswa';
  }}
  ```

---

## Verification Plan

### Manual Verification
1. Open the home page and click the **Login Mahasiswa** button in the header.
2. Verify it displays the student login page with full institutional branding.
3. Click the "Budi Santoso" quick demo account button, and click **Sign In**.
4. Verify the student dashboard loads successfully, showing the personalized greeting, metric cards, and schedules.
5. Navigate through all sidebar tabs:
   - **Dashboard**: check timelines and announcements.
   - **My UKM**: check registered groups and recommendations.
   - **Scholarships**: check active status, file upload warnings, and recommendations.
   - **Achievement Submission**: fill out the form, submit a mock achievement, and verify it updates the history table as "Waiting".
   - **Settings**: toggle settings tabs and forms.
6. Click **Sign Out** and verify you are redirected back to the public university portal.
