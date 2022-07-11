const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      products: [],
      vegetables: [
        { title: 'Свежий помидор', img: 'fresh-tomato.jpeg' },
        { title: 'Острый перец', img: 'hot-peppers.jpeg' },
        { title: 'Свежий огурец', img: 'fresh-cucumber.jpeg' },
        { title: 'Молодой картофель', img: 'new-potatoes.jpeg' }
      ],
      fruits: [
        { title: 'Клубника', img: 'strawberry.jpeg' },
        { title: 'Банан', img: 'banana.jpeg' },
        { title: 'Ананас', img: 'ananas.jpeg' },
        { title: 'Лимон', img: 'lemon.jpeg' },
        { title: 'Папайя', img: 'papaya.jpeg' }
      ],
      meats: []
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

      console.log(this.products);
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

const tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.setParams({
  text: 'Закрыть холодос',
  color: '#008000',
  textColor: '#fff'
});

tg.MainButton.show();

tg.MainButton.onClick(() => {
  tg.sendData(JSON.stringify(app.products));
});
