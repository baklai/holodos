const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      order: null,
      comment: null,
      counter: null,
      price: null,
      tabs: []
    };
  },

  // computed: {
  //   async tabs() {
  //     const response = await fetch('./data/products.json');
  //     const data = await response.json();
  //     return [data];
  //   }
  // },

  mounted() {
    fetch('./data/products.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.tabs = data;
      });

    window.Telegram.WebApp.expand();

    window.Telegram.WebApp.BackButton.onClick(() => {
      this.order = false;
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      switch (window.Telegram.WebApp.MainButton.text) {
        case 'Открыть список':
          this.order = true;
          window.Telegram.WebApp.BackButton.show();

          break;
        case 'Отправить список':
          const products = [];

          this.tabs.forEach((el) => {
            const result = el.items.filter((item) => item.counter > 0);
            if (result.length > 0) {
              result.forEach((val) => {
                products.push({
                  title: val.title,
                  counter: val.counter,
                  price: val.price
                });
              });
            }
          });

          const resList = {
            products: products,
            comment: this.comment,
            price: this.price
          };

          window.Telegram.WebApp.sendData(JSON.stringify(resList));
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
        } else if (value && !window.Telegram.WebApp.MainButton.isVisible) {
          window.Telegram.WebApp.MainButton.setParams({
            text: 'Открыть список',
            color: '#ffc107',
            textColor: '#fff'
          });
          window.Telegram.WebApp.MainButton.show();
        }
      },
      deep: true
    },

    order: {
      handler(value) {
        if (value) {
          this.tabs.forEach((el) => {
            const result = el.items.filter((item) => item.counter > 0);
            this.price = 0;
            if (result.length > 0) {
              result.forEach((val) => {
                this.price += val.counter * val.price;
              });
            }
          });

          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.MainButton.setParams({
            text: 'Отправить список',
            color: '#008000',
            textColor: '#fff'
          });
        } else {
          window.Telegram.WebApp.BackButton.hide();
          window.Telegram.WebApp.MainButton.setParams({
            text: 'Открыть список',
            color: '#ffc107',
            textColor: '#fff'
          });
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

    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
}).mount('#app');
