const express = require('express');
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// API Endpoint
app.post('/api/post-job', (req, res) => {
  const { jobTitle, jobDescription } = req.body;
  console.log("New Job:", { jobTitle, jobDescription });
  res.json({ message: 'Job posted! Gemini will shortlist candidates soon.' });
});

// For Vercel serverless
module.exports = app;
