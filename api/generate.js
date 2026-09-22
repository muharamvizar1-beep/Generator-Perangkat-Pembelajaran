import { buildCorePrompt, buildQuestionPrompt } from '../lib/prompts.mjs';
import { generateJSON } from '../lib/openai.mjs';

export default async function handler(req,res){
  try{
    if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
    const data=req.body || {};
    const core=await generateJSON(buildCorePrompt(data));
    const qs=await generateJSON(buildQuestionPrompt(data,core));
    return res.status(200).json({core,questions:qs});
  }catch(err){
    console.error(err);
    return res.status(500).json({error:err.message||'Gagal membuat perangkat pembelajaran'});
  }
}
