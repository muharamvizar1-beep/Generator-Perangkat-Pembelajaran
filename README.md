# Generator Perangkat Pembelajaran AI Online — V4

Versi ini adalah aplikasi web **berbasis AI**. Form dibuat mendetail agar guru dapat memasukkan identitas, NIP/NUPTK, Elemen, CP, TP, ATP, materi, desain pembelajaran, dan minggu efektif. AI menghasilkan:

- Lembar Pengesahan setelah cover
- Identitas, Elemen, CP, TP, ATP
- PROTA dan PROMES berdasarkan data minggu efektif + JP/minggu
- Pengalaman Pembelajaran per pertemuan dengan AWAL, INTI, MEMAHAMI, MENGAPLIKASIKAN (proses mencari solusi, identifikasi masalah, analisis penyebab, penerapan solusi), MEREFLEKSI, PENUTUP
- LKPD otomatis berisi kasus/tugas/soal setiap pertemuan
- Asesmen awal, proses, akhir
- Rubrik penilaian skala 1–4 dengan deskriptor konkret
- 50 soal PG A–D + kunci + indikator + level kognitif
- 25 soal essai + pedoman jawaban + indikator + level kognitif
- Materi Ajar Rinci di lembar akhir
- Cetak/Simpan PDF melalui dialog print browser
- Export Word asli `.docx`
- Simpan/Muat form dan simpan hasil JSON

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env`.
2. Isi `OPENAI_API_KEY`.
3. Jalankan `npm install`.
4. Jalankan `npm start`.
5. Buka `http://localhost:3000`.

## Deploy online (Vercel)

Upload folder ini ke GitHub lalu import repository ke Vercel. Atur Environment Variable:

`OPENAI_API_KEY` = API key proyek Anda

Opsional:
`OPENAI_MODEL` = `gpt-5.6-luna`

Aplikasi memakai endpoint server-side sehingga API key tidak ditaruh di browser.

## Catatan keamanan

Jangan memasukkan API key ke `index.html` atau membagikannya kepada pengguna. Permintaan AI dilakukan dari backend/serverless function.
