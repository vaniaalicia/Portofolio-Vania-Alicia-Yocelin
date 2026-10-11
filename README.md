# Vania Portfolio

React + Vite. Satu halaman: Landing → Hook + buku → About → Skills → Experience → My Work → Contact.
Ada 3 tema: Dark, Sunset, Clean.

## Cara menjalankan (sekali di awal)

1. Pastikan Node.js sudah terpasang. Cek di Terminal:
   ```
   node -v
   ```
   Kalau keluar angka 18 ke atas, aman. Kalau belum ada, download versi LTS di https://nodejs.org
2. Masuk ke folder project:
   ```
   cd ~/Downloads/vania-portfolio
   ```
3. Install bahan-bahannya (cuma sekali):
   ```
   npm install
   ```
4. Jalankan:
   ```
   npm run dev
   ```
5. Buka link yang muncul (biasanya http://localhost:5173) di browser.

Untuk berhenti: tekan `Ctrl + C` di Terminal.

## Mengganti isi

Semua teks ada di **`src/data/content.js`**:
- `profile` → email, link LinkedIn, GitHub, CV
- `about` → teks About Me
- `skills` → kartu skill
- `experience` → timeline pengalaman
- `projects` → project di My Work

Simpan file, halaman langsung update sendiri.

## Menaruh file

- **CV**: taruh PDF di folder `public/` dengan nama `Vania-Alicia-Yocelin-CV.pdf`
- **Screenshot project**: taruh di `public/projects/`, lalu tulis path-nya di `content.js`, contoh:
  ```js
  desktop: '/projects/waste2taste-desktop.png',
  mobile: '/projects/waste2taste-mobile.png',
  gallery: ['/projects/waste2taste-1.png', '/projects/waste2taste-2.png'],
  ```

## Struktur

```
src/
  data/content.js      ← semua teks & data
  components/          ← tiap bagian halaman
  hooks/hooks.js       ← tema, scroll, animasi kecil
  index.css            ← warna 3 tema + semua style
  assets/              ← gambar
public/                ← CV, screenshot project, favicon
```

## Halaman tambahan

- **All projects**: tombol "View all projects" di My Work. Semua project di `content.js` muncul di sini.
  Project dengan `featured: true` juga tampil di "Selected work".
- **Contact**: dibuka dari daftar isi buku dan tombol "Send a message" di footer.
  Form-nya berisi nama, email, kebutuhan, dan pesan.
  - Tanpa pengaturan: form membuka aplikasi email pengunjung dengan pesan yang sudah terisi.
  - Supaya pesan langsung masuk ke inbox: daftar gratis di https://web3forms.com pakai email kamu,
    salin "Access Key" yang dikirim, lalu tempel di `contactForm.accessKey` di `content.js`.
