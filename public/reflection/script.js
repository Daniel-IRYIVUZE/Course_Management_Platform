// Translations dictionary
const translations = {
  en: {
    title: "Course Reflection",
    welcomeMessage: "Welcome to your course reflection page. Please share your thoughts about the course.",
    question1: "What did you enjoy most about the course?",
    question2: "What was the most challenging part?",
    question3: "What could be improved?",
    saveButton: "Save Reflection",
    footerText: "© 2023 Zanda College. All rights reserved.",
    savedMessage: "Your reflection has been saved!",
    errorMessage: "Error saving your reflection. Please try again."
  },
  fr: {
    title: "Réflexion sur le cours",
    welcomeMessage: "Bienvenue sur votre page de réflexion sur le cours. Veuillez partager vos réflexions sur le cours.",
    question1: "Qu'avez-vous le plus apprécié dans ce cours?",
    question2: "Quelle a été la partie la plus difficile?",
    question3: "Qu'est-ce qui pourrait être amélioré?",
    saveButton: "Enregistrer la réflexion",
    footerText: "© 2023 Zanda College. Tous droits réservés.",
    savedMessage: "Votre réflexion a été enregistrée!",
    errorMessage: "Erreur lors de l'enregistrement de votre réflexion. Veuillez réessayer."
  },
  rw: {
    title: "Igitekerezo kuri icyo somo",
    welcomeMessage: "Murakaza neza kuri urupapuro rwawe rw'igitekerezo ku musomo. Nyamuneka share igitekerezo cyawe ku musomo.",
    question1: "Ni iki wizeye cyane muri iki somo?",
    question2: "Ni iki cyari ikibazo cy'ingenzi?",
    question3: "Ni iki gishobora kongerwamo?",
    saveButton: "Bika igitekerezo",
    footerText: "© 2023 Ishami ry'Ubumenyi Zanda. Amategeko yose yarabitswe.",
    savedMessage: "Igitekerezo cyawe cyabitswe!",
    errorMessage: "Ikosa mu kubika igitekerezo cyawe. Nyamuneka gerageza nanone."
  }
};

// DOM Elements
const elementsToTranslate = {
  'title': 'title',
  'welcome-message': 'welcomeMessage',
  'question1': 'question1',
  'question2': 'question2',
  'question3': 'question3',
  'save-btn': 'saveButton',
  'footer-text': 'footerText'
};

// Current language
let currentLanguage = 'en';

// Initialize the page with default language
document.addEventListener('DOMContentLoaded', () => {
  // Load language from localStorage if available
  const savedLanguage = localStorage.getItem('reflectionLanguage');
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
    document.querySelector(`#${savedLanguage}-btn`).classList.add('active');
  }
  
  translatePage();
  
  // Set up language switcher
  document.getElementById('en-btn').addEventListener('click', () => switchLanguage('en'));
  document.getElementById('fr-btn').addEventListener('click', () => switchLanguage('fr'));
  document.getElementById('rw-btn').addEventListener('click', () => switchLanguage('rw'));
  
  // Set up save button
  document.getElementById('save-btn').addEventListener('click', saveReflection);
});

// Switch language
function switchLanguage(lang) {
  if (currentLanguage === lang) return;
  
  // Update active button
  document.querySelector('.language-btn.active').classList.remove('active');
  document.getElementById(`${lang}-btn`).classList.add('active');
  
  // Update current language
  currentLanguage = lang;
  localStorage.setItem('reflectionLanguage', lang);
  
  // Translate page
  translatePage();
}

// Translate the page
function translatePage() {
  const langData = translations[currentLanguage];
  
  for (const [elementId, translationKey] of Object.entries(elementsToTranslate)) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = langData[translationKey];
    }
  }
}

// Save reflection to localStorage
function saveReflection() {
  const reflection = {
    language: currentLanguage,
    answers: {
      question1: document.getElementById('answer1').value,
      question2: document.getElementById('answer2').value,
      question3: document.getElementById('answer3').value
    },
    savedAt: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('courseReflection', JSON.stringify(reflection));
    alert(translations[currentLanguage].savedMessage);
  } catch (error) {
    console.error('Error saving reflection:', error);
    alert(translations[currentLanguage].errorMessage);
  }
}