# MISSION 60
### Membuat Presentasi Profesional dengan AI dalam 60 Menit
*Interactive Keynote Experience — static site, tanpa build step.*

---

## Isi Proyek

```
Mission60/
├── index.html          # Seluruh struktur & konten halaman
├── css/
│   └── style.css       # Design system (token warna, tipografi, layout, responsive)
├── js/
│   └── app.js           # Boot sequence, HUD, timer misi, animasi scroll, checklist, confetti
├── assets/              # (kosong — siap untuk gambar/ikon/lottie tambahan)
└── README.md
```

Proyek ini **murni HTML/CSS/JavaScript** (tanpa React, tanpa build tool, tanpa `npm install`).
Library eksternal (GSAP, Lenis, Lucide) dimuat lewat CDN langsung di `index.html`, jadi file ini
bisa langsung dibuka di browser atau di-deploy ke hosting statis apa pun — termasuk GitHub Pages
dan Vercel secara gratis.

## Fitur yang Sudah Dibangun (Tahap 1–4)

**Konten & storytelling**
- **Boot sequence** bergaya "AI Presentation OS" saat halaman pertama dibuka
- Narasi lengkap ala komik/keynote: Mission Start → The Story Begins → The Problem →
  The Solution → **Misi Hari Ini (10 Langkah)** → **Level 1–5** (satu quest detail per langkah) →
  **Level 6–10** (finalisasi hingga siap tampil) → Mission Complete → Toolkit → Checklist →
  Bonus → Achievement
- Setiap Level ditulis actionable — peserta bisa langsung mempraktikkan promptnya, bukan cuma membaca teori
- Animasi typewriter untuk "ucapan" AI, dan simulasi chat You → AI → Generating... pada Level 2

**Interaktif**
- **HUD/mission bar** yang muncul saat scroll, lengkap dengan progress bar & timer misi 60 menit
- **Checklist interaktif** dengan progress bar dan efek confetti saat semua item dicentang
- **Widget maskot AI** mengambang di kanan bawah — klik untuk tips kontekstual
  ("Klik Quest berikutnya", "Coba Mode Presentasi", dsb.)
- Tombol **"Next Mission →"** di setiap Level untuk lompat ke langkah berikutnya
- Scroll-reveal animation (GSAP + ScrollTrigger) dan smooth scroll (Lenis)

**Tahap 4 — Mode Presentasi (Keynote Experience)**
- Tombol **"Mode Presentasi"** di HUD mengubah seluruh halaman menjadi keynote layar penuh
- Navigasi **Space / → / ↓** untuk lanjut, **← / ↑** untuk kembali, **Esc** untuk keluar
- Scroll terkunci per-slide (CSS scroll-snap) — satu bagian cerita, satu layar
- Progress dots di kanan layar dan penghitung slide di bawah, keduanya bisa diklik langsung
- Otomatis masuk mode fullscreen browser (Fullscreen API, dengan fallback aman jika diblokir)
- Cocok dipakai langsung sebagai keynote seminar — tidak perlu PowerPoint sama sekali

Sepenuhnya **responsive** untuk mobile (Mode Presentasi otomatis menyembunyikan hint keyboard
di layar sentuh karena navigasinya tetap bisa lewat swipe/scroll biasa).

## Menjalankan secara lokal

Tidak perlu instalasi apa pun. Cukup buka `index.html` langsung di browser, atau jalankan
server statis sederhana (disarankan agar semua fitur berjalan normal):

```bash
# Python
python3 -m http.server 8080
# lalu buka http://localhost:8080

# atau Node
npx serve .
```

---

## Deploy Gratis ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `mission-60`.
2. Upload seluruh isi folder `Mission60/` ke repository tersebut (pastikan `index.html`
   ada di root repo, bukan di dalam subfolder).
3. Masuk ke **Settings → Pages**.
4. Pada **Source**, pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1–2 menit. Situs akan tersedia di:
   `https://<username-anda>.github.io/mission-60/`

**Via terminal (opsional):**
```bash
cd Mission60
git init
git add .
git commit -m "Initial commit: Mission 60"
git branch -M main
git remote add origin https://github.com/<username-anda>/mission-60.git
git push -u origin main
```
Lalu aktifkan GitHub Pages seperti langkah di atas.

---

## Deploy Gratis ke Vercel

**Opsi A — lewat dashboard (tanpa terminal):**
1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai akun GitHub).
2. Klik **Add New → Project**.
3. Import repository `mission-60` yang sudah dibuat di GitHub.
4. Karena ini proyek statis, Vercel akan otomatis mendeteksinya. Biarkan
   **Framework Preset** = *Other*, **Build Command** kosong, **Output Directory** kosong.
5. Klik **Deploy**. Dalam ±30 detik situs akan online di domain `https://mission-60.vercel.app`.

**Opsi B — lewat Vercel CLI:**
```bash
npm i -g vercel
cd Mission60
vercel
```
Ikuti instruksi di terminal (pilih akun, nama project, dan biarkan pengaturan default untuk
static site). Setelah selesai, Vercel akan memberikan URL live secara otomatis.

---

## Rencana Pengembangan Lanjutan

Tahap 1–4 dari roadmap awal sudah selesai (landing page, story animation, interaktivitas,
dan presentation mode). Ide pengembangan lanjutan yang masih terbuka:

- **Three.js background** — partikel/lampu kota ringan di Hero untuk kedalaman visual tambahan
- **Maskot custom (Aiko + robot AI)** — mengganti orb AI generik saat ini dengan ilustrasi
  karakter/Lottie sesuai gaya visual yang diinginkan
- **Efek suara** ringan saat pindah slide di Mode Presentasi (`js/audio.js`)
- **Mouse-follow particle** (`js/particle.js`) untuk lapisan ambient tambahan
- **Export checklist** — simpan status checklist peserta ke `localStorage`-pengganti
  (di luar artifact, browser storage aman digunakan) supaya progres tidak hilang saat reload

File sudah dipisah rapi per tanggung jawab (`css/`, `js/`, `assets/`) supaya pengembangan
berikutnya bisa ditambahkan tanpa merombak struktur yang sudah ada.
