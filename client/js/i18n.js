const translations = {
  en: {
    welcome_message: 'Welcome',
    introduction: 'This is a simple i18n example.'
  },
  uk: {
    welcome_message: 'Welcome',
    introduction: 'This is a simple i18n example.'
  },
  ru: {
    welcome_message: 'Добро пожаловать',
    introduction: 'Это простой пример i18n.'
  }
};

function setLanguage(language) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[language] && translations[language][key]) {
      el.textContent = translations[language][key];
    }
  });
}
