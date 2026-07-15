const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/post-job', (req, res) => {
  const { jobTitle, jobDescription } = req.body;
  console.log("New Job:", { jobTitle, jobDescription });
  res.json({ message: 'Job posted! Gemini will shortlist candidates soon.' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
