# Generator Perangkat Pembelajaran AI Online — V6

Versi V6 menggunakan struktur **static frontend + Vercel Functions** agar halaman utama tidak dijalankan sebagai Express server oleh Vercel.

## Struktur
- `index.html` — tampilan utama
- `api/generate.js` — menghasilkan perangkat pembelajaran dengan Gemini
- `api/export-docx.js` — membuat Word
- `lib/gemini.mjs` — koneksi Gemini API
- `lib/prompts.mjs` — prompt pembelajaran
- `lib/docx.mjs` — format Word
- `local-server.mjs` — hanya untuk menjalankan lokal; tidak dipakai Vercel

## Vercel Environment Variables
Set:
- `GEMINI_API_KEY` = API key Gemini
- `GEMINI_MODEL` = `gemini-3.8-flash`

Jangan memasukkan API key ke GitHub.

## Deployment
Upload/commit seluruh isi repository ini ke GitHub. Vercel akan otomatis membuat deployment baru. `index.html` menjadi halaman utama, sedangkan folder `api/` menjadi Vercel Functions.
