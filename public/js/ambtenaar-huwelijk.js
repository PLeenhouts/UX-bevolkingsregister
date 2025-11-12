const huwelijkForm = document.getElementById('HuwelijkForm');
const huwelijkList = document.getElementById('Huwelijken');

// Huwelijken ophalen
function loadHuwelijken() {
  fetch('/api/huwelijken')
    .then(res => res.json())
    .then(data => displayHuwelijken(data))
    .catch(err => console.error(err));
}

// Overzicht tonen
function displayHuwelijken(huwelijken) {
  huwelijkList.innerHTML = '';
  huwelijken.forEach(h => {
    const date = new Date(h.datum).toISOString().split('T')[0];
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${h.persoon1} & ${h.persoon2}</strong> (${date})<br>
      Familiecode huwelijk: <strong>${h.familie_code}</strong>
    `;
    huwelijkList.appendChild(li);
  });
}

// Huwelijk met inteeltcheck
if (huwelijkForm) {
  huwelijkForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(huwelijkForm);
    const data = Object.fromEntries(formData.entries());
    
    fetch('/api/huwelijk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(check => {
      if (check.warning) {
        const doorgaan = confirm(
          `${check.message}\n\nFamiliecode huwelijk: ${check.familiecode}\nWil je dit huwelijk definitief registreren?`
        );
        if (!doorgaan) return;
        
        return fetch('/api/huwelijk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, force: true })
        })
        .then(res => res.json())
        .then(final => {
          if (final.success) {
            alert(`Huwelijk geregistreerd. Inteelt: ${final.inbreeding}%. Kind-DNA: ${final.kindDNA}`);
            huwelijkForm.reset();
            loadHuwelijken();
          } else {
            alert('Fout: ' + (final.error || 'Onbekend probleem'));
          }
        });
      }
      
      if (check.success) {
        alert(`Huwelijk geregistreerd. Inteelt: ${check.inbreeding}%. Kind-DNA: ${check.kindDNA}`);
        huwelijkForm.reset();
        loadHuwelijken();
      } else if (check.error) {
        alert('Fout: ' + check.error);
      }
    });
  });
}

loadHuwelijken();
