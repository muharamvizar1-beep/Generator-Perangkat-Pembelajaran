import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, HeadingLevel, PageBreak, Footer, PageNumber,
  BorderStyle, ImageRun
} from 'docx';

const FONT = 'Times New Roman';
const border = { style: BorderStyle.SINGLE, size: 1, color: '777777' };
const borders = { top:border,bottom:border,left:border,right:border,insideHorizontal:border,insideVertical:border };
const run = (text,bold=false,size=24)=>new TextRun({text:String(text??''),bold,font:FONT,size});
const p = (text='', opts={})=>new Paragraph({
  alignment: opts.align ?? AlignmentType.JUSTIFIED,
  spacing:{after:120,line:1.15},
  children:[run(text,opts.bold??false,opts.size??24)]
});
const title = text=>new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:220},children:[run(text,true,28)]});
const sub = text=>new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{before:120,after:80},children:[run(text,true,24)]});
const bullet = text=>new Paragraph({alignment:AlignmentType.JUSTIFIED,bullet:{level:0},spacing:{after:70},children:[run(text,false,24)]});
const pageBreak=()=>new Paragraph({children:[new PageBreak()]});

function table(headers, rows){
  const data=[headers,...rows];
  return new Table({width:{size:100,type:WidthType.PERCENTAGE},borders,rows:data.map((r,ri)=>new TableRow({children:r.map(c=>new TableCell({width:{size:100/r.length,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.JUSTIFIED,children:[run(c,ri===0,true,22)]})]}) )}))});
}
function addList(arr, out){(arr||[]).forEach(x=>out.push(bullet(typeof x==='string'?x:(x.kegiatan||JSON.stringify(x)))));}
function addPhase(label, items, out){
  out.push(sub(label));
  (items||[]).forEach((x,i)=>{
    const t = typeof x==='string' ? x : `${x.kegiatan||''} ${x.guru?` Guru: ${x.guru}`:''} ${x.pesertaDidik?` Peserta Didik: ${x.pesertaDidik}`:''}`.trim();
    out.push(bullet(t));
  });
}

export async function createDocx(data, core, qs) {
  const c=[];
  c.push(title('PERANGKAT PEMBELAJARAN'));
  const idRows=[
    ['Nama Guru',data.namaGuru],['NIP',data.nip||'-'],['NUPTK',data.nuptk||'-'],['Sekolah',data.sekolah],['Mata Pelajaran',data.mataPelajaran],['Konsentrasi/Keahlian',data.konsentrasi||'-'],['Kelas / Fase',`${data.kelas} / ${data.fase}`],['Semester',data.semester],['Tahun Ajaran',data.tahunAjaran],['Alokasi Waktu',`${data.alokasiMenit} menit/pertemuan × ${data.jumlahPertemuan} pertemuan`]
  ];
  c.push(table(['IDENTITAS','KETERANGAN'],idRows));
  c.push(pageBreak());

  c.push(title('LEMBAR PENGESAHAN'));
  c.push(p(`Perangkat pembelajaran ${data.mataPelajaran} ini disusun untuk digunakan sebagai pedoman pelaksanaan pembelajaran ${data.kelas} / ${data.fase} Tahun Ajaran ${data.tahunAjaran}.`));
  c.push(p('Tempat/Tanggal: '+(core.pengesahan?.tempatTanggal||'________________________')));
  c.push(p(''));
  c.push(table(['Mengetahui','Guru Pengampu'],[[`${core.pengesahan?.jabatanPengesah1||'Kepala Sekolah'}\n\n${core.pengesahan?.namaPengesah1||'________________________'}\nNIP. ${core.pengesahan?.nipPengesah1||'-'}`,`${core.pengesahan?.jabatanPengesah2||'Guru Pengampu'}\n\n${data.namaGuru||'________________________'}\nNIP. ${data.nip||'-'}\nNUPTK. ${data.nuptk||'-'}`]]));
  c.push(pageBreak());

  c.push(title('IDENTITAS, ELEMEN, CAPAIAN, TUJUAN & ALUR PEMBELAJARAN'));
  for(const [label,val] of [['Elemen',data.elemen],['CP',data.cp],['TP',data.tp],['ATP',data.atpText]]){c.push(sub(label));c.push(p(val||'-'));}

  if(data.outputs?.prota){
    c.push(pageBreak()); c.push(title('PROGRAM TAHUNAN (PROTA)'));
    c.push(table(['No','Sem.','Kode ATP','ATP/TP','Materi','JP','Rentang Waktu','Keterangan'],(core.prota||[]).map(x=>[x.no,x.semester,x.atpCode,x.atp,x.materi,x.alokasiJP,x.rentangWaktu,x.keterangan])));
  }
  if(data.outputs?.promes){
    c.push(pageBreak()); c.push(title('PROGRAM SEMESTER (PROMES)'));
    c.push(table(['Sem.','Bulan','Minggu Efektif','JP','Kode ATP','TP','Materi','Kegiatan Utama','Asesmen'],(core.promes||[]).map(x=>[x.semester,x.bulan,x.mingguEfektif,x.alokasiJP,x.atpCode,x.tp,x.materi,x.kegiatanUtama,x.asesmen])));
  }

  c.push(pageBreak()); c.push(title('PENGALAMAN PEMBELAJARAN'));
  (core.pertemuan||[]).forEach(m=>{
    c.push(sub(`PERTEMUAN ${m.pertemuan} — ${m.judul||''}`));
    c.push(p(`Alokasi: ${m.alokasiMenit||data.alokasiMenit||'-'} menit. Fokus ATP: ${m.fokusATP||'-'}`));
    c.push(sub('Tujuan Pembelajaran')); addList(m.tujuan,c);
    addPhase('AWAL (Berkesadaran dan Bermakna)',m.awal,c);
    addPhase('INTI (Berkesadaran, Bermakna dan Menggembirakan) — MEMAHAMI',m.memahami,c);
    for(const [label,arr] of [['MENGAPLIKASIKAN — Proses Mencari Solusi',m.mengaplikasikan?.prosesMencariSolusi],['MENGAPLIKASIKAN — Identifikasi Masalah',m.mengaplikasikan?.identifikasiMasalah],['MENGAPLIKASIKAN — Analisis Penyebab',m.mengaplikasikan?.analisisPenyebab],['MENGAPLIKASIKAN — Penerapan Solusi',m.mengaplikasikan?.penerapanSolusi]]) addPhase(label,arr,c);
    addPhase('MEREFLEKSI (Bermakna, Menggembirakan, dan Berkesadaran)',m.merefleksi,c);
    addPhase('PENUTUP (Berkesadaran)',m.penutup,c);
    if(m.pertanyaanMendasar){c.push(sub('Pertanyaan Mendasar'));c.push(p(m.pertanyaanMendasar));}
    if(m.pertanyaanPenyelidikan){c.push(sub('Pertanyaan Penyelidikan'));c.push(p(m.pertanyaanPenyelidikan));}
    c.push(sub('Media, Sumber dan Diferensiasi'));addList([...(m.mediaSumber||[]),...(m.diferensiasi||[])],c);
    c.push(pageBreak());
  });

  c.push(title('ASESMEN PEMBELAJARAN'));
  for(const [label,obj] of [['A. Asesmen pada Awal Pembelajaran',core.asesmen?.awal],['B. Asesmen pada Proses Pembelajaran',core.asesmen?.proses],['C. Asesmen pada Akhir Pembelajaran',core.asesmen?.akhir]]){
    c.push(sub(label)); c.push(p(`Tujuan: ${obj?.tujuan||'-'}`));c.push(p(`Metode: ${obj?.metode||'-'}`));c.push(sub('Instrumen'));addList(obj?.instrumen,c);c.push(sub('Indikator'));addList(obj?.indikator,c);c.push(p(`Penskoran: ${obj?.skor||'-'}`));
  }

  c.push(pageBreak()); c.push(title('LKPD OTOMATIS'));
  (core.lkpd||[]).forEach(l=>{c.push(sub(`LKPD Pertemuan ${l.pertemuan} — ${l.judul||''}`));c.push(sub('Tujuan'));addList(l.tujuan,c);c.push(sub('Petunjuk'));addList(l.petunjuk,c);c.push(sub('Kasus/Konteks'));c.push(p(l.kasus));c.push(sub('Tugas'));addList(l.tugas,c);c.push(sub('Soal'));(l.soal||[]).forEach(s=>c.push(bullet(`${s.pertanyaan} [${s.levelKognitif}]`)));c.push(sub('Produk/Bukti'));c.push(p(l.produk));c.push(sub('Kriteria Keberhasilan'));addList(l.kriteriaKeberhasilan,c);});

  c.push(pageBreak()); c.push(title('RUBRIK PENILAIAN'));
  c.push(table(['Aspek','Indikator','Level 4','Level 3','Level 2','Level 1'],(core.rubrik||[]).map(x=>[x.aspek,x.indikator,x.level4,x.level3,x.level2,x.level1])));

  c.push(pageBreak()); c.push(title('BANK SOAL LATIHAN — 50 PILIHAN GANDA'));
  (qs.pilihanGanda||[]).forEach(q=>{c.push(p(`${q.no}. ${q.soal}`,{bold:true}));for(const [k,v] of Object.entries(q.opsi||{}))c.push(p(`${k}. ${v}`));c.push(p(`Kunci: ${q.kunci} | Indikator: ${q.indikator} | ${q.levelKognitif}`));});
  c.push(pageBreak()); c.push(title('BANK SOAL LATIHAN — 25 ESSAI'));
  (qs.essai||[]).forEach(q=>{c.push(p(`${q.no}. ${q.soal}`,{bold:true}));c.push(p(`Pedoman Jawaban: ${q.pedomanJawaban}`));c.push(p(`Indikator: ${q.indikator} | ${q.levelKognitif}`));});

  c.push(pageBreak()); c.push(title('MATERI AJAR RINCI'));
  const ma=core.materiAjarRinci||{}; c.push(sub('Pendahuluan'));c.push(p(ma.pendahuluan||''));
  for(const [lab,key] of [['Fakta', 'fakta'],['Konsep','konsep'],['Prinsip','prinsip'],['Prosedur','prosedur'],['Contoh','contoh'],['Kesalahan Umum','kesalahanUmum'],['Keselamatan','keselamatan'],['Pertanyaan Pemahaman','pertanyaanPemahaman'],['Pertanyaan HOTS','pertanyaanHOTS']]){c.push(sub(lab));addList(ma[key],c);}
  c.push(sub('Ringkasan'));c.push(p(ma.ringkasan||''));

  const doc=new Document({
    styles:{default:{document:{run:{font:FONT,size:24},paragraph:{alignment:AlignmentType.JUSTIFIED,spacing:{line:1.15,after:120}}}}},
    sections:[{properties:{page:{margin:{top:900,right:1000,bottom:900,left:1000}}},children:c,footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[run('Halaman ',false,20),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:20})]})]})}}]
  });
  return Packer.toBuffer(doc);
}
