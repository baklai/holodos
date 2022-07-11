const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      products: [],
      tabs: [
        {
          title: 'Овощи',
          items: [
            { title: 'Свежий помидор', img: 'fresh-tomato.jpeg' },
            { title: 'Острый перец', img: 'hot-peppers.jpeg' },
            { title: 'Свежий огурец', img: 'fresh-cucumber.jpeg' },
            { title: 'Молодой картофель', img: 'new-potatoes.jpeg' },
            { title: 'Зеленая капуста', img: 'green-cabbage.jpg' },
            { title: 'Цветная капуста', img: 'cauliflower.jpg' },
            { title: 'Чеснок', img: 'garlic.jpg' },
            { title: 'Имбирь', img: 'ginger.jpg' }
          ]
        },
        {
          title: 'Фрукты',
          items: [
            { title: 'Клубника', img: 'strawberry.jpeg' },
            { title: 'Банан', img: 'banana.jpeg' },
            { title: 'Ананас', img: 'ananas.jpeg' },
            { title: 'Лимон', img: 'lemon.jpeg' },
            { title: 'Папайя', img: 'papaya.jpeg' },
            { title: 'Черная смородина', img: 'black-currant.jpg' },
            { title: 'Виноград', img: 'grapes.jpg' },
            { title: 'Груша', img: 'pear.jpg' }
          ]
        },
        {
          title: 'Мясо и рыба',
          items: [
            { title: 'Мясо цыпленка', img: 'chicken-meat.jpg' },
            { title: 'Утка', img: 'duck.jpg' },
            { title: 'Кролик', img: 'rabbit.jpg' },
            { title: 'Говядина', img: 'beef.jpg' },
            { title: 'Свинина', img: 'pork.jpg' },
            { title: 'Фарш', img: 'ground-meat.jpg' },
            { title: 'Лосось', img: 'salmon.jpg' },
            { title: 'Свежая рыба', img: 'fresh-fish.jpg' }
          ]
        }
      ]
    };
  },
  methods: {
    itemClick(title) {
      const index = this.products.indexOf(title);
      if (index === -1) {
        this.products.push(title);
      } else {
        this.products.splice(index, 1);
      }
    },
    isActive(title) {
      const index = this.products.indexOf(title);
      if (index === -1) {
        return false;
      } else {
        return true;
      }
    }
  }
}).mount('#app');

window.Telegram.WebApp.expand();
window.Telegram.WebApp.MainButton.setParams({
  text: 'Закрыть холодос',
  color: '#008000',
  textColor: '#fff'
});
window.Telegram.WebApp.MainButton.show();
window.Telegram.WebApp.MainButton.onClick(() => {
  window.Telegram.WebApp.sendData(JSON.stringify(app.products));
});
