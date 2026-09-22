import { createDocx } from '../lib/docx.mjs';

export default async function handler(req,res){
  try{
    if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
    const {data,core,questions}=req.body||{};
    if(!data||!core||!questions) return res.status(400).json({error:'Data output belum lengkap'});
    const buf=await createDocx(data,core,questions);
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition','attachment; filename="Perangkat_Pembelajaran_AI.docx"');
    return res.status(200).send(buf);
  }catch(err){console.error(err);return res.status(500).json({error:err.message||'Gagal membuat Word'});}
}
