import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCorePrompt, buildQuestionPrompt } from './lib/prompts.mjs';
import { generateJSON } from './lib/openai.mjs';
import { createDocx } from './lib/docx.mjs';

const app=express();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:'5mb'}));
app.use(express.static(path.join(__dirname,'public')));
app.post('/api/generate',async(req,res)=>{try{const data=req.body||{};const core=await generateJSON(buildCorePrompt(data));const questions=await generateJSON(buildQuestionPrompt(data,core));res.json({core,questions});}catch(e){console.error(e);res.status(500).json({error:e.message||'Gagal membuat perangkat pembelajaran'});}});
app.post('/api/export-docx',async(req,res)=>{try{const {data,core,questions}=req.body||{};const buf=await createDocx(data,core,questions);res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.wordprocessingml.document');res.setHeader('Content-Disposition','attachment; filename="Perangkat_Pembelajaran_AI.docx"');res.send(buf);}catch(e){console.error(e);res.status(500).json({error:e.message||'Gagal membuat Word'});}});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`Generator AI berjalan di http://localhost:${port}`));
