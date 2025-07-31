document.addEventListener('DOMContentLoaded', () => {
  const langBtns = document.querySelectorAll('.language-btn');
  const themeToggle = document.getElementById('theme-toggle');

  let currentLang = localStorage.getItem('language') || 'en';
  updateLanguage(currentLang);

  // Theme setup
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    themeToggle.checked = true;
  }

  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Language switch
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.getAttribute('data-lang');
      localStorage.setItem('language', currentLang);
      updateLanguage(currentLang);
    });
  });

  function updateLanguage(lang) {
    const t = translations[lang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('welcome').textContent = t.welcome;
    document.getElementById('q1-label').textContent = t.q1;
    document.getElementById('q2-label').textContent = t.q2;
    document.getElementById('q3-label').textContent = t.q3;
    document.getElementById('q4-label').textContent = t.q4;
    document.getElementById('q5-label').textContent = t.q5;
    document.getElementById('q6-label').textContent = t.q6;
    document.getElementById('q7-label').textContent = t.q7;
    document.getElementById('submit-btn').textContent = t.submit;
    document.getElementById('reset-btn').textContent = t.reset;
    document.getElementById('excellent').textContent = t.excellent;
    document.getElementById('good').textContent = t.good;
    document.getElementById('average').textContent = t.average;
    document.getElementById('poor').textContent = t.poor;
    document.getElementById('yes-label').textContent = t.yes;
    document.getElementById('no-label').textContent = t.no;
    document.getElementById('yes-label-2').textContent = t.yes;
    document.getElementById('no-label-2').textContent = t.no;
  }

  document.getElementById('feedback-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const thankYou = document.getElementById('thank-you');
    thankYou.textContent = translations[currentLang].thankYou;
    thankYou.classList.remove('hidden');
    this.reset();
  });
});
