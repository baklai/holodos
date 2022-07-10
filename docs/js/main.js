const productItems = document.getElementsByClassName('product-item');

const products = [];

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

let tg = window.Telegram.WebApp;

console.log(tg);

tg.expand();

tg.MainButton.text = 'Changed Text'; //изменяем текст кнопки
tg.MainButton.setText('Changed Text1'); //изменяем текст кнопки иначе
tg.MainButton.textColor = '#F55353'; //изменяем цвет текста кнопки
tg.MainButton.color = '#143F6B'; //изменяем цвет бэкграунда кнопки
tg.MainButton.setParams({ color: '#143F6B' }); //так изменяются все параметры

tg.onEvent('mainButtonClicked', function () {
  alert(products);
  tg.sendData(JSON.stringify(products));
  //при клике на основную кнопку отправляем данные в строковом виде
});
