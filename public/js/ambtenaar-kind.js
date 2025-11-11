const kindForm = document.getElementById('KindForm');
const kindList = document.getElementById('Kinderen');

// Kinderen ophalen
function loadKinderen() {
  fetch('/api/kinderen')
    .then(res => res.json())
    .then(data => displayKinderen(data))
    .catch(err => console.error(err));
}

// Overzicht tonen
function displayKinderen(kinderen) {
  kindList.innerHTML = '';
  kinderen.forEach(k => {
    const d = new Date(k.Geboortedatum).toISOString().split('T')[0];
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${k.Voornaam} ${k.Achternaam}</strong> (${d})<br>
      Ouders: ${k.Ouder1} &amp; ${k.Ouder2}<br>
      Familiecode: <strong>${k.Familie_code}</strong>
    `;
    kindList.appendChild(li);
  });
}

// Kind opslaan
kindForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(kindForm);
  const data = Object.fromEntries(formData.entries());

  fetch('/api/kind', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      alert(result.message);
      kindForm.reset();
      loadKinderen();
    } else {
      alert('Fout: ' + (result.error || 'Onbekend probleem'));
    }
  });
});

loadKinderen();
