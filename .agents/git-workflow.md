# Git & Branching Workflow Standards (`git-workflow.md`)

Dokumen ini mengatur standarisasi alur kerja Git, konvensi penamaan branch, format pesan commit, serta prosedur pembuatan Pull Request (PR) dan Merge pada **Fiqriachmada Personal Website**.

---

## 1. Arsitektur Branching (Development-First)

Repositori ini menerapkan strategi **Development-First**:

1. **`master`** (Production Branch):
   - Selalu dalam kondisi stabil dan siap deploy ke lingkungan produksi.
   - Tidak boleh melakukan commit langsung (`direct commit`) ke `master`.
   - Kode hanya masuk ke `master` melalui merge/PR dari branch `development` atau hotfix resmi.

2. **`development`** (Integration / Staging Branch):
   - Branch pusat integrasi fitur, perbaikan, optimasi performa, dan refactor yang sedang aktif dikembangkan.
   - Seluruh branch fitur baru di-branch dari `development` dan di-merge kembali ke `development`.

3. **Feature / Task Branches**:
   - Dibuat dari `origin/development` atau `development` lokal yang sudah ter-update (`git pull origin development`).

---

## 2. Format Penamaan Branch (Branch Naming Convention)

Setiap branch baru wajib menggunakan format:

```text
<tipe>/<deskripsi-singkat-kebab-case>
```

### Daftar Tipe Branch:
| Tipe | Kegunaan | Contoh Nama Branch |
| :--- | :--- | :--- |
| `feat` | Fitur baru atau penambahan tampilan/halaman/komponen | `feat/portfolio-carousel-card`<br>`feat/blog-reading-time` |
| `fix` | Perbaikan bug visual atau penanganan error | `fix/dark-mode-card-contrast`<br>`fix/aurora-gpu-flicker` |
| `refactor` | Restrukturisasi kode tanpa mengubah fungsionalitas | `refactor/clean-drawer-boilerplate`<br>`refactor/prisma-singleton-client` |
| `style` | Penyesuaian styling, tipografi Plus Jakarta Sans, atau warna semantik | `style/harmonize-theme-tokens`<br>`style/mobile-nav-spacing` |
| `perf` | Optimasi performa halaman, aset gambar, atau konsumsi GPU | `perf/next-image-blur-cleanup`<br>`perf/reduce-backdrop-filter` |
| `chore` | Update dependensi, konfigurasi build, tooling, script | `chore/upgrade-next-15`<br>`chore/update-tailwind-config` |
| `docs` | Perubahan atau penambahan dokumentasi | `docs/update-agent-rules`<br>`docs/security-audit-guide` |
| `hotfix` | Perbaikan darurat langsung ke master/production | `hotfix/critical-build-failure` |

> [!IMPORTANT]
> Gunakan huruf kecil semua (`lowercase`), pisahkan kata dengan tanda strip (`-`), dan hindari nama yang terlalu panjang atau ambigu (contoh buruk: `fix1`, `update`, `coba-coba`).

---

## 3. Konvensi Pesan Commit (Conventional Commits)

Format commit mengikuti standar *Conventional Commits*:

```text
<tipe>(<lingkup/scope>): <deskripsi singkat>

[opsional isi/detail penjelasan]
```

### Contoh Commit:
- `feat(blog): implement dynamic blog card from CMS API`
- `fix(theme): fix theme flicker on initial hydration`
- `perf(effects): optimize background aurora blur radius for low GPU usage`
- `style(typography): enforce Plus Jakarta Sans font-sans variable`
- `chore(deps): upgrade to nextjs 15.2.0`

---

## 4. Pre-Push & Validation Checklist

Sebelum melakukan push atau membuat PR, developer maupun AI Agent **wajib** memastikan:
1. **Linter & Type Check Bersih**:
   ```bash
   npm run lint
   # atau npx tsc --noEmit
   ```
2. **Tidak Ada File Credential/Secret Ter-commit**:
   - Pastikan `.env`, `.env.local`, `.env dev`, file backup, atau secret keys tidak masuk ke git staging (`git status`).
3. **Commit Atomic & Bersih**:
   - Commit hanya file yang relevan dengan tugas/fitur tersebut.

---

## 5. Alur Pembuatan Pull Request (PR) & Merge

Sesuai kesepakatan, alur PR dan merge dapat dilakukan baik secara otomatis oleh AI Agent maupun secara terstruktur oleh developer:

### Skenario A: Menggunakan Git CLI (Standar Lokal & Otomasi Agen)

1. **Pastikan branch fitur sudah di-push**:
   ```bash
   git push -u origin feat/<nama-fitur>
   ```

2. **Merge ke branch `development`**:
   ```bash
   # Ambil update terbaru dari remote
   git fetch origin development
   git checkout development
   git pull origin development

   # Lakukan merge dengan merge commit yang jelas (no-ff)
   git merge --no-ff feat/<nama-fitur> -m "Merge branch 'feat/<nama-fitur>' into development"

   # Push hasil merge ke remote development
   git push origin development
   ```

3. **Promosi ke `master` (Saat Rilis / Siap Produksi)**:
   ```bash
   git fetch origin master
   git checkout master
   git pull origin master
   git merge --no-ff development -m "Release: merge development into master"
   git push origin master
   ```

4. **Bersihkan Branch Lokal (Opsional)**:
   ```bash
   git branch -d feat/<nama-fitur>
   ```

---

### Skenario B: Menggunakan GitHub Web / GitHub CLI (`gh`)

Jika GitHub CLI (`gh`) telah terpasang atau membuat PR via browser:

1. **Buat PR dari `feat/<nama-fitur>` menuju base `development`**:
   - Judul PR: `[Feat] Deskripsi Fitur Singkat`
   - Isi PR merangkum:
     - Apa yang diubah / ditambahkan
     - Kaitannya dengan standarisasi `.agents/`
     - Screenshot / hasil pengujian (jika ada)
2. **Review & Merge**:
   - Merge PR ke `development` menggunakan strategi *Create a merge commit* atau *Squash and merge*.
3. **Release PR**:
   - Saat siap rilis, buat PR dari `development` menuju `master`.

---

## 6. Prosedur Otomasi AI Agent

Saat AI Agent bekerja pada suatu task:
1. **Membuat Branch**: Agen membuat branch baru dari `development` sesuai format penamaan (`feat/*`, `fix/*`, dll.).
2. **Commit & Push**: Agen melakukan commit terstruktur dan push branch ke remote repository.
3. **Konfirmasi Merge**: Agen melaporkan ringkasan perubahan dan menanyakan persetujuan user sebelum melakukan merge ke `development` atau `master`.
4. **Eksekusi Merge**: Setelah disetujui, agen melakukan checkout ke target branch (`development`), menjalankan merge `--no-ff`, dan melakukan push ke remote.
