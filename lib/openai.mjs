import OpenAI from 'openai';

export function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY belum disetel di server.');
  return new OpenAI({ apiKey: key });
}

export async function generateJSON(prompt, model = process.env.OPENAI_MODEL || 'gpt-5.6-luna') {
  const client = getClient();
  const response = await client.responses.create({
    model,
    store: false,
    input: [
      { role: 'developer', content: 'Kamu adalah penyusun perangkat pembelajaran profesional. Keluarkan JSON valid sesuai instruksi pengguna.' },
      { role: 'user', content: prompt }
    ],
    text: { format: { type: 'json_object' } },
    max_output_tokens: 40000
  });
  const raw = response.output_text?.trim();
  if (!raw) throw new Error('AI tidak mengembalikan isi.');
  try { return JSON.parse(raw); }
  catch (e) {
    throw new Error('Hasil AI bukan JSON valid. Silakan generate ulang.');
  }
}
