const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Gemini init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Endpoint with Gemini
app.post('/api/post-job', async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `You are an HR AI. For this job: "${jobTitle}" - "${jobDescription}"
    Generate 3 fake but realistic candidate profiles who would be a good fit. 
    Return only JSON array like this: 
    [{"name": "Rahul Sharma", "skills": "React, Node, Tailwind", "match": "95%"}, ...]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean 
```json from response
    const cleanText = text.replace(/
```json|
```/g, '');

    res.json({ 
      message: 'Job posted! Here are top candidates:',
      candidates: JSON.parse(cleanText)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with Gemini API. Check API Key.' });
  }
});

module.exports = app;
