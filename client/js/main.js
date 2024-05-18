// Telegram.WebApp.expand();
// function setThemeClass() {
//   document.documentElement.className = Telegram.WebApp.colorScheme;
// }
// Telegram.WebApp.onEvent('themeChanged', setThemeClass);
// setThemeClass();

console.log('script load');

const fetchData = async () => {
  const url = 'https://41p7lm52-3000.euw.devtunnels.ms/';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Сетевая ошибка');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
};
