# UI & Component Standards

Dokumen ini mengatur standarisasi pembuatan dan penggunaan komponen antarmuka (UI) pada **Fiqriachmada Personal Website**.

---

## 1. Kebersihan Komponen & Larangan Boilerplate Code

Saat menginstal atau menyalin komponen dari library UI (`shadcn/ui`, Magic UI, Aceternity UI):
1. **Hapus Kode Demo / Contoh Dokumentasi**:
   Jangan menyisakan import atau state demo bawaan dokumentasi. Contoh kasus yang dilarang: menyisakan `import { Bar, BarChart, ResponsiveContainer } from "recharts"` dan array `goal` dari demo `shadcn/ui Drawer` di dalam `components/header/index.tsx`.
2. **Evaluasi Beban Animasi Komponen**:
   - Komponen dekoratif seperti `NeonGradientCardBackgroundImage` harus mengandalkan **CSS Variables & Keyframes murni** (`animate-background-position-spin`) dengan properti `will-change-transform`.
   - Hindari penggunaan `useLayoutEffect` + `window.addEventListener("resize")` yang membaca `offsetWidth`/`offsetHeight` untuk menghitung nilai blur dinamis ratusan piksel.
   - Jika komponen animasi berat seperti `PulseBeams` (`components/ui/pulse-beam.tsx`) tidak digunakan, jangan di-import di `app/layout.tsx`.

---

## 2. Penggunaan Komponen `shadcn/ui`

- **`Button` (`@/components/ui/button`)**: Gunakan varian resmi (`default`, `secondary`, `outline`, `ghost`, `destructive`, `link`) dan ukuran standar (`default`, `sm`, `lg`, `icon`).
- **`Card` (`@/components/ui/card`)**: Digunakan sebagai kontainer item pada halaman `/projects` dan `/works`.
- **`Drawer` (`@/components/ui/drawer`)**: Digunakan khusus untuk menu navigasi mobile pada `HeaderIndex`.
- **`DropdownMenu` (`@/components/ui/dropdown-menu`)**: Digunakan pada `ModeToggle` untuk memilih tema (`Light`, `Dark`, `System`).

---

## 3. Standar Gambar & Aset (`next/image`)

1. Selalu gunakan komponen `Image` dari `next/image` dengan atribut `width`, `height`, dan `alt` yang deskriptif.
2. Pastikan seluruh domain gambar eksternal terdaftar pada `images.remotePatterns` di `next.config.ts` (`github.com`, `ik.imagekit.io`, `upload.wikimedia.org`).
3. Simpan aset statis di direktori `public/` dengan ukuran file yang sudah terkompresi (gunakan format WebP/AVIF atau SVG yang sudah dioptimasi dengan SVGO).
