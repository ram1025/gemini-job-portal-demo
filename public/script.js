document.getElementById('jobForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const jobTitle = document.getElementById('jobTitle').value;
  const jobDescription = document.getElementById('jobDescription').value;
  const resultDiv = document.getElementById('result');

  resultDiv.innerHTML = 'Loading candidates from Gemini...';

  try {
    const response = await fetch('/api/post-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobTitle, jobDescription })
    });

    const data = await response.json();

    let candidatesHTML = `<p><b>${data.message}</b></p>`;
    if(data.candidates){
      data.candidates.forEach(c => {
        candidatesHTML += `<div style="border:1px solid #ddd; padding:10px; margin:10px 0; border-radius:5px;">
          <h3>${c.name} - ${c.match} Match</h3>
          <p><b>Skills:</b> ${c.skills}</p>
        </div>`
      })
    } else {
      candidatesHTML += `<p style="color:red;">${data.message}</p>`
    }
    resultDiv.innerHTML = candidatesHTML;

  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">Error: Could not connect to server</p>`
  }
});
