// Menú mòbil
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

// Any del peu
document.getElementById('any').textContent = new Date().getFullYear();

// Formulari: valida i envia el missatge al correu via FormSubmit
const MAIL = 'azizgarti48@gmail.com';
const form = document.getElementById('form');
const estat = document.getElementById('estat');
const boto = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async e => {
  e.preventDefault();
  estat.className = '';

  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) { estat.className = 'err'; estat.textContent = 'Revisi els camps marcats en vermell.'; return; }

  // Camp ocult anti-spam: si un bot l'omple, no enviem res
  if (form.elements._honey.value) return;

  boto.disabled = true;
  estat.textContent = 'Enviant...';
  try {
    const r = await fetch('https://formsubmit.co/ajax/' + MAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Nou missatge de la web A&M Corporation',
        _replyto: form.elements.email.value,
        Nom: form.elements.nom.value,
        Correu: form.elements.email.value,
        Missatge: form.elements.missatge.value
      })
    });
    const d = await r.json();
    if (!r.ok || d.success === 'false' || d.success === false) throw new Error(d.message || 'Error');
    estat.className = 'ok';
    estat.textContent = 'Missatge enviat. Us respondrem aviat.';
    form.reset();
  } catch (err) {
    estat.className = 'err';
    estat.textContent = "No s'ha pogut enviar. Torni-ho a provar o escrigui a info@amcorp.cat.";
  } finally {
    boto.disabled = false;
  }
});
