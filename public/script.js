document.getElementById('jobForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('jobTitle').value;
  const description = document.getElementById('jobDescription').value;
  const resultDiv = document.getElementById('result');
  const button = document.getElementById('submitBtn');

  resultDiv.innerHTML = '<p>Loading candidates from Gemini...</p>';
  button.disabled = true;

  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      let html = '<h3>Top 3 Candidates from Gemini AI:</h3>';
      data.candidates.forEach((candidate, index) => {
        html += `
          <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <h4>${index + 1}. ${candidate.name} - ${candidate.match}% Match</h4>
            <p><b>Skills:</b> ${candidate.skills}</p>
            <p><b>Why good fit:</b> ${candidate.reason}</p>
          </div>
        `;
      });
      resultDiv.innerHTML = html;
    } else {
      resultDiv.innerHTML = '<p>No candidates found.</p>';
    }

  } catch (error) {
    console.error('Error:', error);
    resultDiv.innerHTML = '<p style="color: red;">Error: Could not connect to server</p>';
  }

  button.disabled = false;
});
