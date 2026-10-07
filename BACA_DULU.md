# Toolkit FTTH — versi mandiri

Halaman web biasa: tidak perlu akun Claude, file bisa langsung di-download.
Semua proses jalan di browser pemakai; file proyek tidak dikirim ke server mana pun.

## Pasang di GitHub Pages (gratis, sekali saja)
1. Buat akun di https://github.com (kalau belum ada).
2. Klik **New repository** → beri nama, misalnya `toolkit-ftth` → pilih **Public** → **Create repository**.
3. Di halaman repo, klik **uploading an existing file**. Tarik **isi** folder ini
   (index.html, worker.js, contoh.json, folder `py`, file `.nojekyll`) → **Commit changes**.
   - File `.nojekyll` tersembunyi di Windows Explorer; kalau tidak terbawa, tidak masalah.
4. Buka **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, folder **/(root)** → **Save**.
5. Tunggu 1–2 menit. Link muncul di halaman yang sama, misalnya
   `https://namakamu.github.io/toolkit-ftth/` — bagikan link ini ke tim.

Catatan: repo Public artinya kode halaman bisa dilihat orang. Data proyek **tidak** ikut,
karena data hanya diproses di browser masing-masing. Kalau perlu repo Private,
GitHub Pages butuh akun berbayar; alternatif gratis: Netlify atau Cloudflare Pages
(cukup tarik folder ini ke halaman "Deploy" mereka).

## Coba di komputer sendiri
Double-click `coba_lokal.bat` (butuh Python). Membuka `index.html` langsung dengan
double-click **tidak** bisa — browser memblokir mesin Python-nya dari file lokal.

## Update
Kalau ada versi baru, upload ulang file yang berubah ke repo yang sama. Linknya tetap.
