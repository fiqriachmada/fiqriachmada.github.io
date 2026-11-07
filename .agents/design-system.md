# Design System, Typography & Color Standardization

Dokumen ini menetapkan standar tipografi, sistem warna, tema (Light & Dark Mode), dan estetika visual pada **Fiqriachmada Personal Website**.

---

## 1. Standar Tipografi (`Plus Jakarta Sans`)

Seluruh halaman dan komponen wajib menggunakan font utama **Plus Jakarta Sans** yang diselaraskan dengan ekosistem **Fiqriachmada CMS**.

### Konfigurasi di `app/layout.tsx`:
```tsx
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```
Variabel `jakarta.variable` (`--font-sans`) wajib dipasang pada elemen `<body>` bersama class `font-sans antialiased`.

### Konfigurasi di `tailwind.config.ts` & `app/globals.css`:
- Pada `tailwind.config.ts`:
  ```ts
  fontFamily: {
    sans: ["var(--font-sans)", "sans-serif"],
  },
  ```
- **DILARANG** menulis `body { font-family: Arial, Helvetica, sans-serif; }` pada `app/globals.css` karena akan menimpa font `Plus Jakarta Sans` yang sudah di-inject oleh Next.js.

### Hirarki Tipografi:
- **Judul Utama / Hero (`h1`)**: `text-3xl sm:text-4xl font-bold tracking-tight text-foreground`
- **Sub-judul / Role**: `text-lg sm:text-xl font-medium text-muted-foreground`
- **Judul Card (`h2`)**: `text-xl font-semibold tracking-tight text-card-foreground`
- **Teks Isi / Deskripsi (`p`)**: `text-sm sm:text-base leading-relaxed text-muted-foreground`

---

## 2. Semantic Color Tokens

Seluruh komponen **wajib** menggunakan token warna semantik berbasis CSS Variables (`app/globals.css`) yang dikelola oleh `next-themes`:

| Token CSS | Class Tailwind | Kegunaan Utama |
| :--- | :--- | :--- |
| `--background` | `bg-background` | Latar belakang utama halaman (`<body>`). |
| `--foreground` | `text-foreground` | Warna teks utama di atas `background`. |
| `--card` | `bg-card` | Permukaan kontainer kartu (`Projects`, `Works`). |
| `--card-foreground` | `text-card-foreground` | Warna teks utama di dalam `Card`. |
| `--popover` | `bg-popover` | Permukaan dropdown menu (`ModeToggle`) dan drawer. |
| `--popover-foreground` | `text-popover-foreground` | Warna teks di dalam `Popover` / dropdown. |
| `--primary` | `bg-primary`, `text-primary` | Warna aksi utama, menu aktif pada navigasi, dan indikator fokus. |
| `--primary-foreground` | `text-primary-foreground` | Teks kontras tinggi di atas elemen `bg-primary`. |
| `--secondary` | `bg-secondary` | Elemen sekunder, badge, atau tombol pendukung. |
| `--muted` | `bg-muted` | Area latar lembut (skeleton, placeholder gambar). |
| `--muted-foreground` | `text-muted-foreground` | Teks pendukung, deskripsi proyek/pekerjaan, dan caption. |
| `--accent` | `bg-accent` | State hover pada menu item dan tombol `ghost`/`outline`. |
| `--border` | `border-border` | Garis batas kartu dan pemisah section. |
| `--ring` | `ring-ring` | Focus ring dan efek hover ring pada kartu/avatar. |

---

## 3. Aturan Efek Visual & Aurora

1. **Subtle Background Glow**:
   - Efek gradien/aurora latar belakang hanya berfungsi sebagai aksen atmosferik (`opacity-25` hingga `opacity-30`).
   - Jangan menggunakan `drop-shadow` raksasa atau `blur` ratusan piksel yang dihitung ulang via JavaScript pada `window.resize`.
2. **Pembatasan `backdrop-blur`**:
   - Gunakan `backdrop-blur-sm` atau `backdrop-blur-md` **hanya** pada elemen mengambang berukuran terbatas (seperti `HeaderIndex` pill navigation atau kartu saat di-hover).
   - **Dilarang** memasang `backdrop-blur-*` pada `<div>` satu layar penuh (`fixed inset-0` / `absolute inset-0`) di atas animasi gradien karena memaksa GPU melakukan *re-compositing* layar penuh di setiap frame.
