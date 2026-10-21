# Layout, Header & Background Performance Standards

Dokumen ini mengatur standarisasi tata letak (layout), struktur navigasi header, serta arsitektur latar belakang pada **Fiqriachmada Personal Website**.

---

## 1. Struktur Hirarki Root Layout (`app/layout.tsx`)

Root layout wajib menjaga struktur DOM tetap ramping tanpa wrapper berlapis yang tidak perlu:

```tsx
<html lang="en" suppressHydrationWarning>
  <body
    className={cn(
      "min-h-screen bg-background text-foreground font-sans antialiased",
      jakarta.variable
    )}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <div className="relative min-h-screen overflow-x-hidden">
        <HeaderIndex />
        <BackgroundImage />
        <main className="mx-6 md:mx-32 lg:mx-60 xl:mx-96 my-24 lg:my-28">
          {children}
        </main>
      </div>
    </ThemeProvider>
  </body>
</html>
```

### Aturan Penting pada Root Layout:
1. **Jangan Membungkus `BackgroundImage` dengan Margin Konten**:
   `BackgroundImage` harus dirender sebagai layer latar belakang (`fixed inset-0 -z-10 pointer-events-none overflow-hidden`), bukan di dalam `<div className="mx-6 md:mx-32 ... my-24">` yang menyebabkan tinggi halaman bertambah dua kali lipat dan memicu scroll kosong.
2. **Satu Kontainer `<main>` Utama**:
   Seluruh halaman anak (`children`) dirender di dalam satu tag semantik `<main>` dengan margin/padding responsif yang konsisten.

---

## 2. Navigasi Header (`components/header/index.tsx`)

- **Posisi & Z-Index**: Menggunakan `fixed left-0 right-0 top-0 z-[2] w-full p-4 backdrop-blur-sm`.
- **Desktop Navigation**: Menampilkan daftar route (`about`, `projects`, `works`) di dalam kapsul (`rounded-full border border-primary bg-background/70 px-6 shadow-lg`) beserta `ModeToggle`.
- **Mobile Navigation**: Menggunakan komponen `Drawer` (`vaul`) untuk layar kecil (`block md:hidden`) yang menutup otomatis (`DrawerClose asChild`) ketika item navigasi diklik.
- **Transisi Avatar Beranda**: Menampilkan avatar profil di sebelah kiri kapsul navigasi saat pengguna berada di luar halaman `/` dengan transisi `transition-opacity duration-500 ease-in-out` (tanpa timer `backdrop-blur-2xl` yang membebani render).

---

## 3. Standar Grid Halaman (`Projects` & `Works`)

- Gunakan `grid grid-cols-1 lg:grid-cols-2 gap-4` untuk menampilkan daftar kartu proyek dan pengalaman kerja.
- Setiap `Card` menggunakan padding `p-8`, latar transparan/adaptif (`bg-transparent` / `bg-card/50`), dan transisi ringan saat hover (`transition-transform duration-200 hover:shadow-2xl hover:ring-2`).
