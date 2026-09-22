# Generator Perangkat Pembelajaran AI Online — V5

Generator perangkat pembelajaran berbasis AI untuk guru Indonesia. Versi ini menggunakan **Gemini API** melalui backend/server-side sehingga API key tidak ditaruh di browser.

## Isi yang dihasilkan
- Cover
- Lembar Pengesahan (langsung setelah cover)
- Identitas + NIP/NUPTK
- Elemen, CP, TP, ATP
- PROTA berdasarkan ATP, alokasi JP, semester, dan minggu efektif pada form
- PROMES berdasarkan bulan dan minggu efektif pada form
- Pengalaman Pembelajaran tiap pertemuan: AWAL, INTI, MEMAHAMI, MENGAPLIKASIKAN (proses mencari solusi, identifikasi masalah, analisis penyebab, penerapan solusi), MEREFLEKSI, PENUTUP
- LKPD otomatis per pertemuan lengkap dengan kasus, tugas, soal, produk, dan kriteria keberhasilan
- Asesmen Awal, Proses, dan Akhir
- Rubrik penilaian skala 1–4 dengan deskriptor konkret
- 50 soal pilihan ganda A–D + kunci dan indikator
- 25 soal essai + pedoman jawaban dan indikator
- Materi Ajar Rinci di bagian akhir sesuai Elemen, CP, TP, ATP, materi, dan konteks form
- Cetak/Simpan PDF melalui dialog print browser
- Export Word `.docx`
- Simpan/Muat Form dan hasil JSON

## Format dokumen
- Judul: Times New Roman 14 pt, bold, center
- Subbab/sub-subbagian: Times New Roman 12 pt, bold, justified
- Isi: Times New Roman 12 pt, justified
- Tabel memakai Times New Roman

## A. Deploy online gratis dengan Vercel + Gemini Free Tier

Google menyediakan Gemini API Free Tier untuk model tertentu; kuota/rate limit tetap berlaku. V5 default memakai model `gemini-3.8-flash` yang pada halaman harga resmi saat ini tercantum sebagai tersedia pada Free Tier. Periksa kuota terbaru di Google AI Studio sebelum penggunaan banyak.

1. Buat API key di Google AI Studio: https://aistudio.google.com/apikey
2. Upload isi folder V5 ke repository GitHub Anda.
3. Di Vercel, import repository GitHub.
4. Pada Environment Variables, tambahkan:
   - `GEMINI_API_KEY` = API key dari Google AI Studio
   - `GEMINI_MODEL` = `gemini-3.8-flash` (opsional, karena sudah menjadi default)
   - `PORT` tidak perlu diisi untuk deployment Vercel.
5. Pilih environment Production dan Preview untuk `GEMINI_API_KEY` jika ingin dipakai pada keduanya.
6. Klik Deploy.
7. Setelah deploy, buka URL Vercel yang diberikan.

**Jangan upload `.env` ke GitHub.** Hanya `.env.example` yang boleh masuk repository.

## B. Menjalankan lokal (opsional)

Buka CMD di folder project, lalu:

```bash
npm install
```

Salin `.env.example` menjadi `.env`, lalu isi:

```env
GEMINI_API_KEY=API_KEY_ANDA
GEMINI_MODEL=gemini-3.8-flash
PORT=3000
```

Kemudian:

```bash
npm start
```

Buka `http://localhost:3000`.

## Catatan kuota

Satu kali Generate membuat rancangan inti dan bank soal melalui beberapa panggilan ke Gemini. Jika kuota/rate limit Free Tier tercapai, tunggu lalu coba lagi. Generator memeriksa agar bank soal harus berjumlah tepat 50 PG dan 25 essai.

## Keamanan

API key hanya dibaca oleh backend dari environment variable `GEMINI_API_KEY`. Jangan menaruh API key di `index.html`, JavaScript frontend, atau file yang di-commit ke GitHub.
