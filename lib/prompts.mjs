export const SOURCE_GUIDANCE = `
Rujukan struktur yang harus dipertahankan berasal dari contoh perangkat pembelajaran pengguna. Istilah dan urutannya meliputi: PROGRAM TAHUNAN (PROTA), PROGRAM SEMESTER (PROMES), LEMBAR PENGESAHAN, Pengalaman Pembelajaran, AWAL (Berkesadaran dan Bermakna), INTI (Berkesadaran, Bermakna dan Menggembirakan), MEMAHAMI (Berkesadaran), MENGAPLIKASIKAN (Bermakna dan Menggembirakan), MEREFLEKSI (Bermakna, Menggembirakan, dan Berkesadaran), PENUTUP (Berkesadaran), serta asesmen awal, proses, dan akhir. Pada contoh, bagian MENGAPLIKASIKAN diuraikan menjadi proses mencari solusi, identifikasi masalah, analisis penyebab, dan penerapan solusi. Jangan mengubah istilah tersebut secara sembarangan.
`;

export function buildCorePrompt(data) {
  return `Anda adalah AI penyusun perangkat pembelajaran untuk guru Indonesia. Buat dokumen yang siap ditempel ke Word, sangat rinci, runtut, mudah dipakai guru, dan selaras dengan data yang dimasukkan. Gunakan Bahasa Indonesia baku dan kontekstual.

${SOURCE_GUIDANCE}

ATURAN FORMAT ISI:
- Jangan mengubah teks CP, TP, atau ATP yang diberikan pengguna; boleh diberi elaborasi tetapi teks asli tetap dipertahankan.
- Judul utama nantinya akan diformat 14 pt Times New Roman, tebal, rata tengah.
- Subbab dan sub-subbagian 12 pt Times New Roman, tebal. Isi 12 pt Times New Roman, rata kiri-kanan.
- Kegiatan pembelajaran WAJIB berupa butir-butir operasional: apa yang guru lakukan dan apa yang peserta didik lakukan.
- Awal, inti, penutup harus sangat jelas dan tidak generik.
- Pada INTI, wajib ada MEMAHAMI, MENGAPLIKASIKAN, dan MEREFLEKSI.
- MENGAPLIKASIKAN sebisa mungkin memuat: proses mencari solusi, identifikasi masalah, analisis penyebab, penerapan solusi. Sesuaikan dengan model pembelajaran yang dipilih.
- LKPD setiap pertemuan harus berisi tujuan, petunjuk, kasus/konteks, tugas langkah demi langkah, dan soal pertanyaan. Soal harus berhubungan langsung dengan materi/ATP pertemuan.
- Asesmen harus terdiri dari asesmen awal, asesmen proses, dan asesmen akhir; sertakan metode, instrumen, indikator, bentuk bukti, dan teknik penskoran.
- Rubrik harus jelas dan observabel, minimal skala 1-4 dengan deskriptor konkret.
- Prota dan Promes harus menggunakan data minggu efektif dan alokasi JP yang diberikan pengguna. Jangan mengarang kalender baru.
- Materi ajar akhir harus sangat rinci dan langsung berdasarkan Elemen, CP, TP, ATP, Materi Utama, karakteristik peserta didik, serta konteks bidang studi yang dimasukkan.
- Hindari klaim bahwa data yang tidak diberikan pengguna sudah pasti ada. Jika data belum ada, gunakan formulasi yang wajar dan beri tanda perlu disesuaikan.

DATA PENGGUNA:
${JSON.stringify(data, null, 2)}

KELUARAN WAJIB berupa JSON valid saja (tanpa markdown dan tanpa komentar) dengan struktur berikut:
{
  "ringkasan": "...",
  "identitasPembelajaran": "...",
  "tujuanDokumen": ["..."],
  "prota": [{"no":1,"semester":"Ganjil/Genap","atpCode":"","atp":"","materi":"","alokasiJP":0,"rentangWaktu":"","keterangan":""}],
  "promes": [{"semester":"Ganjil/Genap","bulan":"","mingguEfektif":0,"alokasiJP":0,"atpCode":"","tp":"","materi":"","kegiatanUtama":"","asesmen":""}],
  "materiRingkas": {"gambaranUmum":"","konsepInti":[],"prasyarat":[],"keselamatanDanBudayaKerja":[],"contohKontekstual":[]},
  "pertemuan": [{
    "pertemuan":1,
    "judul":"",
    "alokasiMenit":0,
    "fokusATP":"",
    "tujuan":[],
    "awal":[{"kegiatan":"","guru":"","pesertaDidik":""}],
    "memahami":[{"kegiatan":"","guru":"","pesertaDidik":""}],
    "mengaplikasikan":{"prosesMencariSolusi":[{"kegiatan":"","guru":"","pesertaDidik":""}],"identifikasiMasalah":[{"kegiatan":"","guru":"","pesertaDidik":""}],"analisisPenyebab":[{"kegiatan":"","guru":"","pesertaDidik":""}],"penerapanSolusi":[{"kegiatan":"","guru":"","pesertaDidik":""}]},
    "merefleksi":[{"kegiatan":"","guru":"","pesertaDidik":""}],
    "penutup":[{"kegiatan":"","guru":"","pesertaDidik":""}],
    "mediaSumber":[],
    "diferensiasi":[""],
    "produkBukti":[],
    "pertanyaanMendasar":"",
    "pertanyaanPenyelidikan":""
  }],
  "asesmen": {"awal":{"tujuan":"","metode":"","instrumen":[],"indikator":[],"skor":""},"proses":{"tujuan":"","metode":"","instrumen":[],"indikator":[],"skor":""},"akhir":{"tujuan":"","metode":"","instrumen":[],"indikator":[],"skor":""}},
  "lkpd":[{"pertemuan":1,"judul":"","tujuan":[],"petunjuk":[""],"kasus":"","tugas":[""],"soal":[{"pertanyaan":"","levelKognitif":"C1-C6"}],"produk":"","kriteriaKeberhasilan":[]}],
  "rubrik":[{"aspek":"","indikator":"","level4":"","level3":"","level2":"","level1":""}],
  "pengesahan":{"tempatTanggal":"","jabatanPengesah1":"","namaPengesah1":"","nipPengesah1":"","jabatanPengesah2":"","namaPengesah2":"","nipPengesah2":""},
  "materiAjarRinci":{"pendahuluan":"","fakta":[],"konsep":[],"prinsip":[],"prosedur":[""],"contoh":[""],"kesalahanUmum":[""],"keselamatan":[""],"ringkasan":"","pertanyaanPemahaman":[""],"pertanyaanHOTS":[""]}
}`;
}

export function buildQuestionPrompt(data, core) {
  const atp = JSON.stringify(core?.prota || [], null, 2);
  return `Anda adalah penyusun bank soal SMK/pendidikan berbasis AI. Susun soal latihan sesuai data pengguna dan rancangan perangkat pembelajaran berikut. Gunakan Bahasa Indonesia. Jangan keluar dari materi yang dimasukkan. Bila bidangnya otomotif/teknik, gunakan konteks bengkel, alat, prosedur, diagnosis, K3, atau situasi kerja yang sesuai. Bila bukan otomotif, gunakan konteks bidang studi yang sesuai.

DATA:
${JSON.stringify(data, null, 2)}

ALOKASI/RANCANGAN PROTA:
${atp}

Ketentuan:
- Tepat 50 soal pilihan ganda dengan opsi A-D.
- Tepat 25 soal essai.
- Semua soal harus benar-benar terkait Elemen, CP, TP, ATP, materi, dan konteks yang dimasukkan.
- Campurkan C1, C2, C3, C4, C5, dan C6; utamakan soal kontekstual/HOTS pada bagian analitis.
- Hindari soal duplikat dan kalimat yang hanya mengganti angka tanpa mengubah kompetensi.
- Pilihan jawaban harus satu yang paling tepat, distraktor masuk akal.
- Setiap PG wajib memiliki kunci jawaban dan indikator.
- Setiap essai wajib memiliki pedoman jawaban dan indikator.
- Soal LKPD tidak perlu diulang di sini.

Keluarkan JSON valid saja:
{
 "pilihanGanda":[{"no":1,"soal":"","opsi":{"A":"","B":"","C":"","D":""},"kunci":"A","indikator":"","levelKognitif":"C4"}],
 "essai":[{"no":1,"soal":"","indikator":"","levelKognitif":"C4","pedomanJawaban":""}]
}`;
}
