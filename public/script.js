document.getElementById('jobForm').addEventListener('submit', async (e) => {
e.preventDefault();
const title = document.getElementById('jobTitle').value;
const description = document.getElementById('jobDescription').value;
const resultDiv = document.getElementById('result');

resultDiv.innerHTML = '<p>Loading candidates...</p>';

try {
 const res = await fetch('/api/match', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ title, description })
 });

 const data = await res.json();

 if(data.error) {
   resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
   return;
 }

 let html = '<h2>Top 3 Candidates from Gemini AI:</h2>';
 data.candidates.forEach(c => {
   html += `
     <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 5px;">
       <h3>${c.name} - ${c.match}% Match</h3>
       <p><b>Skills:</b> ${c.skills}</p>
       <p><b>Reason:</b> ${c.reason}</p>
     </div>
   `;
 });
 resultDiv.innerHTML = html;

} catch(err) {
 resultDiv.innerHTML = `<p style="color: red;">Failed: ${err.message}</p>`;
}
});
