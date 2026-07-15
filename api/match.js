export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY missing in Vercel" });
  }

  try {
    const { title, description } = req.body;

    const prompt = `Return ONLY valid JSON. No extra text.
    Job: ${title}. Desc: ${description}.
    Create 3 fake candidates.
    Format: { "candidates": [{"name": "Name", "match": 90, "skills": "React", "reason": "Good fit"}]}`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await geminiRes.json();
    let text = data.candidates[0].content.parts[0].text;

    // Clean Gemini's markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const json = JSON.parse(text);
    return res.status(200).json(json);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error: " + e.message });
  }
}
