import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCorePrompt, buildQuestionPrompt } from './lib/prompts.mjs';
import { generateJSON } from './lib/gemini.mjs';
import { createDocx } from './lib/docx.mjs';

const app=express();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:'8mb'}));
app.use(express.static(path.join(__dirname,'public')));

app.post('/api/generate',async(req,res)=>{
  try{
    const data=req.body||{};
    const core=await generateJSON(buildCorePrompt(data),{maxOutputTokens:50000,temperature:0.2});
    const qs=await generateJSON(buildQuestionPrompt(data,core),{maxOutputTokens:24000,temperature:0.25});
    if((qs?.pilihanGanda||[]).length!==50 || (qs?.essai||[]).length!==25){
      throw new Error(`Bank soal belum lengkap: AI menghasilkan ${(qs?.pilihanGanda||[]).length} PG dan ${(qs?.essai||[]).length} essai. Silakan Generate lagi.`);
    }
    res.json({core,questions:qs});
  }catch(e){console.error(e);res.status(500).json({error:e.message||'Gagal membuat perangkat pembelajaran'});}
});

app.post('/api/export-docx',async(req,res)=>{
  try{
    const {data,core,questions}=req.body||{};
    if(!data||!core||!questions) return res.status(400).json({error:'Data output belum lengkap'});
    const buf=await createDocx(data,core,questions);
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition','attachment; filename="Perangkat_Pembelajaran_AI_Gemini.docx"');
    res.send(buf);
  }catch(e){console.error(e);res.status(500).json({error:e.message||'Gagal membuat Word'});}
});

app.use((req,res,next)=>{
  if(req.method==='GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(__dirname,'public','index.html'));
  next();
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Generator AI Gemini berjalan di http://localhost:${port}`));
