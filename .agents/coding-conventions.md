# Coding, Architecture & Performance Conventions

Dokumen ini merangkum konvensi arsitektur, struktur direktori, penamaan environment variables, pengelolaan database Prisma 7, serta aturan performa dan keamanan data pada **Fiqriachmada Personal Website**.

---

## 1. Struktur Direktori Utama

```text
fiqriachmada-personal-website-nextjs-15/
├── .agents/               # Dokumen standarisasi desain, layout, komponen, kode & skills
│   └── skills/            # Workspace skills (termasuk security-audit)
├── app/                   # Next.js App Router (halaman, layout, dan loading states)
│   ├── about/             # Halaman profil / tentang saya
│   ├── projects/          # Halaman daftar proyek (`page.tsx` & `loading.tsx`)
│   ├── works/             # Halaman daftar pengalaman kerja (`page.tsx` & `loading.tsx`)
│   ├── globals.css        # Konfigurasi Tailwind CSS v4 & CSS Variables
│   ├── layout.tsx         # Root layout & konfigurasi font Plus Jakarta Sans
│   └── page.tsx           # Halaman utama (Home)
├── components/            # Komponen UI dan komponen halaman
│   ├── about/             # Komponen halaman About
│   ├── header/            # Navigasi Header utama (Desktop & Mobile Drawer)
│   ├── home/              # Komponen halaman utama (Landing Page)
│   ├── mode-toggle/       # Komponen pengubah tema (Light / Dark / System)
│   ├── projects/          # Komponen kartu daftar proyek
│   ├── ui/                # Komponen dasar shadcn/ui, skeleton & efek latar belakang
│   └── theme-provider.tsx # Wrapper NextThemesProvider
├── helpers/               # Fungsi utilitas, konstanta, dan server data-fetching
│   ├── constants/env.ts   # Konstanta terpusat pembacaan process.env
│   └── server/            # Server-only query helpers (`projects.ts`, `works.ts`)
├── lib/                   # Fungsi utilitas (`utils.ts` -> `cn()`)
├── prisma/                # Skema database Prisma 7 (`schema.prisma`), client adapter, & generated client
├── public/                # Aset statis publik (`profile.jpg`, `icon.svg`)
├── routes/                # Definisi daftar route navigasi
├── socials/               # Definisi tautan media sosial beserta ikon
├── types/                 # Definisi tipe TypeScript dan skema validasi Zod
├── .env                   # Konfigurasi environment aktif (di-ignore oleh Git)
├── .env dev               # Template referensi environment development/staging
└── prisma.config.ts       # Konfigurasi datasource & migrasi Prisma 7
```

---

## 2. Standar Keamanan Data Fetching, Streaming & Caching

Mengacu pada prinsip **Trust Boundary Minimizing** & **Least Privilege Data Exposure** dari [`.agents/skills/security-audit`](./skills/security-audit/SKILL.md):

1. **Direct Server-Side Query Helpers (`helpers/server/projects.ts` & `helpers/server/works.ts`)**:
   - Halaman publik (`/projects`, `/works`) **wajib** mengambil data langsung melalui Server Component menggunakan fungsi di `helpers/server/`, bukan melakukan HTTP `fetch` ke `NEXT_PUBLIC_API_URL/api/*`.
   - Gunakan proyeksi eksplisit (`select`) pada Prisma agar hanya field yang ditampilkan ke UI (`id`, `title`/`name`, `description`, `image_url`) yang melewati batas server.
   - Endpoint `/api/projects` dan `/api/works` ditutup untuk akses publik langsung (`403 Forbidden`) guna mencegah *unauthenticated data scraping* dan *database resource exhaustion*.

2. **Instant Loading State (`loading.tsx`)**:
   - Setiap halaman yang memuat data asinkron wajib memiliki file pendamping `loading.tsx` yang me-render `<CardGridSkeleton />` (`components/ui/card-grid-skeleton.tsx`).
   - Hal ini memastikan transisi navigasi antar-tab langsung instan (0ms delay) seperti aplikasi *client-side*.

3. **Two-Layer Caching (Server Cache + Client Router Cache sampai Reload)**:
   - **Server Cache (`unstable_cache`)**: Query Prisma dibungkus dengan `unstable_cache` (`revalidate: 60`) agar tidak membebani database TiDB pada setiap request.
   - **Client Router Cache (`experimental.staleTimes` di `next.config.ts`)**: Dikonfigurasi `dynamic: 300` dan `static: 600` sehingga setelah halaman dibuka sekali, perpindahan menu di sisi client langsung disajikan dari memori browser (persis seperti `React Query`) sampai pengguna melakukan *hard reload* (`F5`).

---

## 3. Standar Environment Variables & Penamaan File (`.env` & `helpers/constants/env.ts`)

Selaras dengan `fiqriachmada-cms`:
1. **Penamaan File**:
   - Gunakan **`.env`** sebagai file environment utama yang dibaca oleh Next.js dan `dotenv/config` pada `prisma.config.ts`.
   - Gunakan **`.env dev`** sebagai referensi environment staging/development.
2. **Konstanta Terpusat (`helpers/constants/env.ts`)**:
   Seluruh akses ke variabel koneksi database (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`) diimpor dari `@/helpers/constants/env`.

---

## 4. Standar Prisma 7 (`prisma.config.ts` & `@prisma/adapter-mariadb`)

1. **`prisma.config.ts`**: Menggunakan `defineConfig` dari `"prisma/config"` dan `"dotenv/config"` untuk menentukan lokasi `schema` dan `datasource.url`.
2. **`prisma/schema.prisma`**: Generator client menghasilkan output ke `./generated/prisma` (`provider = "prisma-client"`).
3. **`prisma/client/index.ts`**: Menggunakan driver adapter **`PrismaMariaDb`** (`@prisma/adapter-mariadb`) yang dibungkus dengan pola **Global Singleton** agar aman saat *hot-reload*.

---

## 5. TypeScript

Proyek ini menggunakan **TypeScript** (`strict: true`, lihat `tsconfig.json`) untuk seluruh kode sumber (`.ts` / `.tsx`).

- Alias import `@/*` mengarah ke root proyek.
- Tipe bersama (respons API, item data, route) disimpan di `types/` (`api.ts`, `project.ts`, `route.ts`).
- Hindari `any`; jika tidak dapat dihindari, beri komentar alasannya.
- Jalankan `npm run typecheck` (`tsc --noEmit`) dan `npm run lint` (`eslint .`) sebelum commit.

