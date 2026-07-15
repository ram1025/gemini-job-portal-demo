export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).end();
  
  const { title, description } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: "API key missing" });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a job matcher. For Job Title: "${title}" and Description: "${description}", return 3 fake candidate profiles as JSON. Format: { "candidates": [{"name": "", "match": 90, "skills": "", "reason": ""}]}` }] }]
      })
    });
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const json = JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
    
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
