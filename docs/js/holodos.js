const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      order: null,
      comment: null,
      counter: null,
      price: null,
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
  mounted() {
    window.Telegram.WebApp.expand();

    window.Telegram.WebApp.BackButton.onClick(() => {
      this.order = false;
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      switch (window.Telegram.WebApp.MainButton.text) {
        case 'Открыть список':
          this.order = true;
          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.MainButton.setParams({
            text: 'Отправить список',
            color: '#008000',
            textColor: '#fff'
          });
          break;
        case 'Отправить список':
          window.Telegram.WebApp.sendData(JSON.stringify(this.products));
          break;
        default:
          console.log('Sorry, we are out of.');
      }
    });
  },

  watch: {
    counter: {
      handler(value) {
        if (!value && window.Telegram.WebApp.MainButton.isVisible) {
          window.Telegram.WebApp.MainButton.hide();
          window.Telegram.WebApp.BackButton.hide();
        } else if (value && !window.Telegram.WebApp.MainButton.isVisible) {
          window.Telegram.WebApp.MainButton.setParams({
            text: 'Открыть список',
            color: '#ffc107',
            textColor: '#fff'
          });
          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.MainButton.show();
        }
      },
      deep: true
    }
  },

  methods: {
    addCounter(item) {
      ++item.counter;
      ++this.counter;
    },

    delCounter(item) {
      --item.counter;
      --this.counter;
    },

    returnClick() {
      window.Telegram.WebApp.MainButton.setParams({
        text: 'Открыть список',
        color: '#ffc107',
        textColor: '#fff'
      });
      this.order = false;
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
