// api/gemini.js
export default async function handler(req, res) {
  const { jobTitle, jobDescription } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Give 3 candidates for Job: ${jobTitle}. Desc: ${jobDescription}. Return JSON with name, skills, match%, reason` }]
    })
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
