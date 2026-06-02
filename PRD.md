## Progress Summary

* Created a new folder structure for the Mahasiswa Dashboard in the `@src/` directory.
* Updated the `MahasiswaPortal` component to use the new folder structure and imported the necessary components.
* Created a new file `data.ts` in the `@src/admin/` directory and initialized it with empty arrays for alumni, ukm, scholarships, news, and admins.
* Created a new file `types.ts` in the `@src/types/` directory and defined the `UserSession` and `UKM` interfaces.
* Created a new file `types/mahasiswa.ts` in the `@src/types/` directory and defined the `Beasiswa` interface.
* Updated the `MahasiswaPortal` component to use the new `UserSession` and `UKM` interfaces.
* Updated the `MahasiswaLogin` component to use the new `UserSession` interface.
* Created a new file `MahasiswaLogin.tsx` in the `@src/mahasiswa-dashboard/components/` directory and implemented the login form.
* Updated the `MahasiswaPortal` component to use the new `MahasiswaLogin` component.
* Updated the `PRD.md` file to reflect the progress made so far.