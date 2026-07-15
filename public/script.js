document.getElementById('jobForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = '<p>Loading candidates...</p>';

  try {
    const res = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    const data = await res.json();

    if(data.error) {
      resultsDiv.innerHTML = `<p class="text-red-500">Error: ${data.error}</p>`;
      return;
    }

    let html = '<h2 class="text-xl font-bold mb-3">Top 3 Candidates from Gemini AI:</h2>';
    data.candidates.forEach(c => {
      html += `
        <div class="border p-4 rounded mb-3">
          <h3 class="font-bold">${c.name} - ${c.match}% Match</h3>
          <p><b>Skills:</b> ${c.skills}</p>
          <p><b>Reason:</b> ${c.reason}</p>
        </div>
      `;
    });
    resultsDiv.innerHTML = html;

  } catch(err) {
    resultsDiv.innerHTML = `<p class="text-red-500">Failed: ${err.message}</p>`;
  }
});
