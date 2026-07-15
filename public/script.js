document.getElementById('job-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const jobTitle = document.getElementById('job-title').value;
  const jobDescription = document.getElementById('job-description').value;
  
  const res = await fetch('/api/post-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobTitle, jobDescription })
  });
  
  const data = await res.json();
  document.getElementById('result').innerHTML = `<p style="color:green">${data.message}</p>`;
});
