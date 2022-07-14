const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      modal: null,
      order: null,
      comment: null,
      counter: null,

      price: null,
      item: null,
      tabs: []
    };
  },

  computed: {
    id() {
      return window.Telegram.WebApp.initDataUnsafe.user?.id;
    }
  },

  mounted() {
    fetch('./data/products.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.tabs = data;
      });

    console.log(window.Telegram.WebApp);

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
                  price: val.price,
                  priceTitle: val.priceTitle
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
          let price = 0;
          this.tabs.forEach((el) => {
            const result = el.items.filter((item) => item.counter > 0);
            if (result.length > 0) {
              result.forEach((val) => {
                price += val.counter * val.price;
              });
            }
            this.price = price;
          });
          window.Telegram.WebApp.MainButton.setParams({
            text: 'Отправить список',
            color: '#008000',
            textColor: '#fff'
          });
          window.Telegram.WebApp.BackButton.show();
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

    onModal(item) {
      this.item = item;
      this.modal = true;
    },

    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
}).mount('#app');
