const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      order: null,
      comment: null,
      totalPrice: null,
      products: [],
      tabs: [
        {
          title: 'Овощи',
          items: [
            {
              title: 'Свежий помидор',
              img: 'fresh-tomato',
              counter: 0,
              price: 1.99
            },
            {
              title: 'Острый перец',
              img: 'hot-peppers',
              counter: 0,
              price: 1.99
            },
            {
              title: 'Свежий огурец',
              img: 'fresh-cucumber',
              counter: 0,
              price: 1.99
            },
            {
              title: 'Молодой картофель',
              img: 'new-potatoes',
              counter: 0,
              price: 1.99
            },
            {
              title: 'Зеленая капуста',
              img: 'green-cabbage',
              counter: 0,
              price: 1.99
            },
            {
              title: 'Цветная капуста',
              img: 'cauliflower',
              counter: 0,
              price: 1.99
            },
            { title: 'Чеснок', img: 'garlic', counter: 0, price: 1.99 },
            { title: 'Имбирь', img: 'ginger', counter: 0, price: 1.99 }
          ]
        },
        {
          title: 'Фрукты',
          items: [
            { title: 'Клубника', img: 'strawberry', counter: 0, price: 1.99 },
            { title: 'Банан', img: 'banana', counter: 0, price: 1.99 },
            { title: 'Ананас', img: 'ananas', counter: 0, price: 1.99 },
            { title: 'Лимон', img: 'lemon', counter: 0, price: 1.99 },
            { title: 'Папайя', img: 'papaya', counter: 0, price: 1.99 },
            {
              title: 'Черная смородина',
              img: 'black-currant',
              counter: 0,
              price: 1.99
            },
            { title: 'Виноград', img: 'grapes', counter: 0, price: 1.99 },
            { title: 'Груша', img: 'pear', counter: 0, price: 1.99 }
          ]
        },
        {
          title: 'Мясо и рыба',
          items: [
            {
              title: 'Мясо цыпленка',
              img: 'chicken-meat',
              counter: 0,
              price: 1.99
            },
            { title: 'Утка', img: 'duck', counter: 0, price: 1.99 },
            { title: 'Кролик', img: 'rabbit', counter: 0, price: 1.99 },
            { title: 'Говядина', img: 'beef', counter: 0, price: 1.99 },
            { title: 'Свинина', img: 'pork', counter: 0, price: 1.99 },
            { title: 'Фарш', img: 'ground-meat', counter: 0, price: 1.99 },
            { title: 'Лосось', img: 'salmon', counter: 0, price: 1.99 },
            { title: 'Свежая рыба', img: 'fresh-fish', counter: 0, price: 1.99 }
          ]
        }
      ]
    };
  },
  methods: {
    addCounter(item) {
      ++item.counter;
    },

    delCounter(item) {
      --item.counter;
    },

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
// window.Telegram.WebApp.MainButton.onClick(() => {
//   window.Telegram.WebApp.sendData(JSON.stringify(app.products));
// });
