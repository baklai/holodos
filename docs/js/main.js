const tg = window.Telegram.WebApp;

window.Telegram.WebApp.expand(); //расширяем на все окно

tg.MainButton.text = 'Changed Text'; //изменяем текст кнопки
tg.MainButton.setText('Changed Text1'); //изменяем текст кнопки иначе
tg.MainButton.textColor = '#F55353'; //изменяем цвет текста кнопки
tg.MainButton.color = '#143F6B'; //изменяем цвет бэкграунда кнопки

const products = [];

const productItems = document.getElementsByClassName('product-item');

Array.from(productItems).forEach((element) => {
  element.addEventListener('click', () => {
    element.classList.toggle('product-item-select');
    const index = products.indexOf(element.outerText);
    if (index === -1) {
      products.push(element.outerText);
    } else {
      products.splice(index, 1);
    }
  });
});

// tg.onEvent('mainButtonClicked', function () {
//   alert(products);
//   tg.sendData(JSON.stringify(products));
//   //при клике на основную кнопку отправляем данные в строковом виде
// });

const btn = document.getElementById('mainButtonClicked');

btn.addEventListener('click', function () {
  // alert(products);
  //вешаем событие на нажатие html-кнопки
  tg.sendData(JSON.stringify(products));
});
