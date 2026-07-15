export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, description } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY missing in Vercel" });
  }

  try {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `Return ONLY valid JSON. Job: ${title}. Desc: ${description}. Create 3 fake candidates. Format: {"candidates":[{"name":"Name","match":90,"skills":"React","reason":"Good fit"}]}` }] }] 
      })
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return res.status(500).json({ error: `Gemini Error: ${err}` });
    }

    const data = await geminiRes.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    res.status(200).json(JSON.parse(jsonText));

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
