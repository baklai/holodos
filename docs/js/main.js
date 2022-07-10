const tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.setParams({
  text: 'Закрыть холодос',
  color: '#008000',
  textColor: '#fff'
});

tg.MainButton.show();

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

tg.MainButton.onClick(() => {
  // console.log(JSON.stringify(products));
  // tg.answerWebAppQuery();

  tg.answerWebAppQuery({
    web_app_query_id: '1100',
    result: JSON.stringify(products)
  });

  // tg.sendData(JSON.stringify(products));
});
