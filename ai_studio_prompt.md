# Google AI Studio Prompt: Build Admin Login and Admin Dashboard

Copy and paste the prompt below into Google AI Studio to generate the code for your **Login Component** and the **Admin Dashboard** hook.

---

### COPY THIS PROMPT INTO GOOGLE AI STUDIO:

```text
Please build a clean, premium, and interactive React TypeScript component for a Login page (LoginView.tsx) and provide instructions/code to adapt my existing Admin Dashboard (AdminView.tsx).

Here is the context of my project:
- **Stack**: React (functional components, hooks), TypeScript, Tailwind CSS v4, and Lucide React icons.
- **Font**: 'Plus Jakarta Sans' / 'Inter' (defined in theme).
- **Colors**:
  - Primary Dark Navy: `#001e40` (hover: `#002d61`)
  - Accent Yellow/Gold: `#feb234`
  - Page Background: `#F8FAFC`
- **Transitions**: Uses custom `.animate-fade-in` animation (defined as keyframe fade-in + translate-y).

---

### REQUIREMENT 1: LoginView.tsx
Please generate the complete code for `src/components/LoginView.tsx`.
It should:
1. Have a premium, modern design (e.g. card layout, clean borders, glassmorphic touches, nice drop shadows).
2. Display a toggle or tab selection at the top to choose between "Login Mahasiswa" and "Login Admin".
3. For the "Login Admin" view:
   - Provide email/username and password input fields with clean labels and focus ring effects using `#001e40` or `#feb234`.
   - Provide a "Show/Hide Password" toggle.
   - Include a "Remember me" checkbox and a "Forgot password?" link.
   - Use Lucide icons (like `Lock`, `User`, `Eye`, `EyeOff`, `ArrowRight`) to make the form look interactive and visual.
4. Trigger an `onLoginSuccess(session: UserSession)` callback when credentials are submitted (with mock validation for now).

Use this TypeScript interface for the session:
```typescript
export interface UserSession {
  username: string;
  role: 'mahasiswa' | 'admin';
  name: string;
  nimOrNip?: string;
}
```

---

### REQUIREMENT 2: Admin Dashboard Integration
Currently, I have `AdminView.tsx` which manages tables for Scholarships, UKMs, Achievements, News, and Alumni.
Please write a wrapper or update structure for `AdminView.tsx` to include an "Overview Dashboard" tab/section at the top.
The dashboard overview should show:
1. **Stat Cards**:
   - Total Beasiswa (Scholarships count)
   - Total UKM (UKM count)
   - Prestasi Baru (Achievements count)
   - Berita Kampus (News count)
   - Alumni Tercatat (Alumni count)
   Use Lucide icons, soft colored background indicators (e.g. blue-50, amber-50, emerald-50), and large bold numbers.
2. **Recent Activities Feed**: A simple list of mock recent admin updates.
3. **Quick Links**: Buttons to quickly open the "Tambah Data" modal/state for each tab.

---

### Please output:
1. The full, ready-to-use code for `src/components/LoginView.tsx` with Tailwind CSS v4 classes.
2. The revised `AdminView.tsx` component (or the diff showing where to insert the dashboard summary cards and stats feed).
3. The mock authentication validation logic.
```
