# Portofolio Teja Lesmana — versi 2

Portofolio statis dengan tema biru–ungu, galeri konsep latihan, animasi pembuka Swarm Rebuild, dan 12 cursor bernama yang ikut bergerak setiap kali pengunjung menggulir ke bagian halaman berikutnya.

## Lihat website

Setelah GitHub Pages aktif, buka: **https://teja-dev-alt.github.io/teja-portofolio-test/**

Pengunjung repository bisa memilih tautan **Website / Visit site** di kotak About repository, atau membuka alamat di atas. Di GitHub, buka **Settings → Pages**, pilih **Deploy from a branch**, pilih branch `main` dan folder `/(root)`, lalu tekan **Save**. Tunggu proses publikasi selesai.

Repository yang dipakai: `teja-portofolio-test`. Pastikan `index.html` dan folder `Asset/` ada di tingkat teratas repository.

## Pratinjau di komputer

1. Ekstrak ZIP.
2. Buka folder hasil ekstrak.
3. Klik dua kali `index.html`.

Untuk server lokal: pasang Node.js 20+, buka PowerShell di folder ini, lalu jalankan `npm install`, `npm run build`, dan `npm run dev -- --port 4174`. Buka http://localhost:4174. Tekan Ctrl+C di jendela PowerShell untuk mematikan server.

## Isi dan edit

- Galeri saat ini berisi tiga **ide latihan** yang secara jelas ditandai sebagai konsep, bukan karya selesai.
- Tambahkan karya asli ke `src/data/projects.json` memakai field yang sama.
- Informasi sekolah, kursus, dan profil diedit di `src/app.jsx`.
- Foto hero: `Asset/img/teja-portrait.png`.
- Penghargaan dan brand partner tetap kosong hingga Teja memberi datanya.

Untuk hosting statis, unggah `index.html` dan folder `Asset/`. Untuk menjaga source agar bisa dibuild lagi, unggah juga `src/`, `scripts/`, `package.json`, `package-lock.json`, dan README. Jangan unggah `node_modules/` atau file sementara.
