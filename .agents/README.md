# Fiqriachmada Personal Website — Agent & Developer Standardization Guide (`.agents`)

Folder `.agents` ini berisi dokumen standarisasi resmi dan *custom skills* untuk **Fiqriachmada Personal Website (`fiqriachmada-personal-website-nextjs-15`)**. Seluruh pengembang maupun AI Agent yang bekerja pada repositori ini **wajib** mengacu pada panduan di dalam direktori ini sebelum menambah halaman, membuat komponen baru, atau memodifikasi tampilan UI dan performa.

## Daftar Dokumen Standarisasi

1. **[Design System, Typography & Color Standardization (`design-system.md`)](./design-system.md)**
   - Standar tipografi menggunakan **Plus Jakarta Sans** (`next/font/google` -> `--font-sans`).
   - Standar palet warna berbasis **CSS Variables** untuk Light Mode dan Dark Mode (`next-themes`).
   - Hirarki warna semantik (`background`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `ring`).
   - Aturan pelarangan warna hardcoded dan font override manual di `globals.css`.

2. **[Layout, Header & Background Performance Standards (`layout-and-spacing.md`)](./layout-and-spacing.md)**
   - Standar struktur `RootLayout` (`app/layout.tsx`) dan kontainer responsif.
   - Aturan ketat penggunaan efek visual/aurora (`BackgroundImage` & `NeonGradientCardBackgroundImage`) agar ringan di GPU dan tidak membebani performa halaman.
   - Aturan pembatasan penggunaan `backdrop-blur-*` yang bertumpuk.

3. **[UI & Component Standards (`component-standards.md`)](./component-standards.md)**
   - Standar penggunaan komponen `shadcn/ui` (`Button`, `Card`, `Drawer`, `Avatar`, `DropdownMenu`).
   - Aturan kebersihan komponen (dilarang menyisakan boilerplate unused code seperti `recharts` demo pada `Drawer` atau `Header`).
   - Standar optimasi gambar (`next/image`) dan aset publik (`public/`).

4. **[Coding, Architecture & Performance Conventions (`coding-conventions.md`)](./coding-conventions.md)**
   - Struktur direktori Next.js App Router (`app/`, `components/`, `helpers/`, `lib/`, `prisma/`, `routes/`, `socials/`, `types/`).
   - Standar **Prisma 7** (`prisma.config.ts` & `@prisma/adapter-mariadb` dengan Global Singleton di `prisma/client/index.ts`).
   - Standar penamaan file environment (`.env`, `.env dev`) dan konstanta `helpers/constants/env.ts`.

5. **[Git & Branching Workflow (`git-workflow.md`)](./git-workflow.md)**
   - Strategi branching **Development-First** (`prod` untuk produksi, `development` untuk staging/integrasi).
   - Standar penamaan branch (`feat/*`, `fix/*`, `refactor/*`, `style/*`, `perf/*`, `chore/*`, `docs/*`, `hotfix/*`).
   - Format pesan *Conventional Commits* dan pre-push checklist (lint & build).
   - Prosedur pembuatan Pull Request (PR) serta alur merge otomatis via Git CLI ke `development` dan `prod`.

## Daftar Agent Skills (`.agents/skills/`)

- **[`security-audit`](./skills/security-audit/SKILL.md)**: Skill audit keamanan berbasis *trust boundary*, *data isolation*, *web protocol & auth*, serta *resource exhaustion* untuk meninjau keamanan kode dan endpoint secara mendalam.

---

## Prinsip Utama (Golden Rules)

- **Tipografi Konsisten (`Plus Jakarta Sans`)**: Seluruh teks menggunakan `--font-sans` (`Plus Jakarta Sans`) yang dimuat melalui `next/font/google` di `app/layout.tsx`. Jangan pernah menimpa `body { font-family: Arial, ... }` di `app/globals.css`.
- **Performa Visual & GPU-Friendly**: Efek latar belakang/aurora wajib bersifat `pointer-events-none`, menggunakan ukuran dan radius blur statis yang wajar (`blur-[96px]`), serta tidak menggunakan listener `resize` + `useLayoutEffect` yang memicu layout thrashing atau `backdrop-blur` berlapis satu layar penuh.
- **Zero Boilerplate**: Saat mengadopsi komponen dari dokumentasi `shadcn/ui` atau Magic UI / Aceternity UI (seperti `Drawer`, `NeonGradientCard`, `PulseBeams`), hapus seluruh kode demo/sample (`recharts`, state `goal`, dll.) yang tidak digunakan oleh fitur asli.
- **Semantic Color Tokens**: Gunakan `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-primary`, `border-border` agar tampilan selalu konsisten di Light Mode maupun Dark Mode.
