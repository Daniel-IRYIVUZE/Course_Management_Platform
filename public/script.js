// public/script.js
document.addEventListener('DOMContentLoaded', function() {
  // Check for saved language preference
  const savedLang = localStorage.getItem('preferredLang') || 'en';
  updateContent(savedLang);

  // Set up event listeners for language switcher
  document.getElementById('enBtn').addEventListener('click', () => {
    updateContent('en');
    localStorage.setItem('preferredLang', 'en');
  });

  document.getElementById('frBtn').addEventListener('click', () => {
    updateContent('fr');
    localStorage.setItem('preferredLang', 'fr');
  });
});

function updateContent(lang) {
  const translations = window.translations[lang];
  
  // Update all text elements
  document.getElementById('title').textContent = translations.title;
  document.getElementById('welcome').textContent = translations.welcome;
  
  document.getElementById('q1-title').textContent = translations.questions.q1;
  document.getElementById('q1-response').textContent = translations.responses.q1;
  
  document.getElementById('q2-title').textContent = translations.questions.q2;
  document.getElementById('q2-response').textContent = translations.responses.q2;
  
  document.getElementById('q3-title').textContent = translations.questions.q3;
  document.getElementById('q3-response').textContent = translations.responses.q3;
}