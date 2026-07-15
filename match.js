export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, description } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY missing. Add it in Vercel > Settings > Environment Variables" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ 
          parts: [{ 
            text: `Return ONLY JSON. Job: "${title}". Desc: "${description}". Give 3 fake candidates. Format: { "candidates": [{"name": "Name", "match": 90, "skills": "React", "reason": "Good"}]}` 
          }] 
        }] 
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    res.status(200).json(JSON.parse(jsonText));

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
