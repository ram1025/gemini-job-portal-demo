function showTab(tab) {
  document.getElementById('candidate-tab').style.display = tab === 'candidate'? 'block' : 'none';
  document.getElementById('recruiter-tab').style.display = tab === 'recruiter'? 'block' : 'none';
}

async function uploadResume() {
  const file = document.getElementById('resumeFile').files[0];
  const formData = new FormData();
  formData.append('resume', file);
  const res = await fetch('/api/upload', {method: 'POST', body: formData});
  const data = await res.json();
  document.getElementById('uploadMsg').innerText = `Uploaded: ${data.data.name}`;
}

async function searchCandidates() {
  const jobTitle = document.getElementById('jobTitle').value;
  const jobDesc = document.getElementById('jobDesc').value;
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({jobTitle, jobDesc})
  });
  const candidates = await res.json();
  document.getElementById('results').innerHTML = JSON.stringify(candidates, null, 2);
}
