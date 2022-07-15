const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      modal: null,
      comment: null,
      counter: null,
      category: null,
      price: null,
      item: null,
      items: [],
      page: 0
    };
  },

  mounted() {
    fetch('./data/products.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.items = data;
      });

    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.MainButton.hide();

    window.Telegram.WebApp.expand();

    window.Telegram.WebApp.BackButton.onClick(() => {
      --this.page;
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      switch (window.Telegram.WebApp.MainButton.text) {
        case 'Відкрити список':
          this.page = 3;
          window.Telegram.WebApp.BackButton.show();
          break;
        case 'Надіслати список':
          const products = [];
          this.items.forEach((el) => {
            const result = el.products.filter((item) => item.counter > 0);
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
            text: 'Відкрити список',
            color: '#ffc107',
            textColor: '#fff'
          });
          window.Telegram.WebApp.MainButton.show();
        }
      },
      deep: true
    },

    page: {
      handler(value) {
        switch (value) {
          case 0:
            this.modal = false;
            window.Telegram.WebApp.BackButton.hide();
            window.Telegram.WebApp.MainButton.hide();
            break;
          case 1:
            this.modal = false;
            window.Telegram.WebApp.BackButton.show();
            if (this.counter > 0) {
              window.Telegram.WebApp.MainButton.setParams({
                text: 'Відкрити список',
                color: '#ffc107',
                textColor: '#fff'
              });
              window.Telegram.WebApp.MainButton.show();
            } else {
              window.Telegram.WebApp.MainButton.hide();
            }
            break;
          case 2:
            window.Telegram.WebApp.BackButton.show();
            if (this.counter > 0) {
              window.Telegram.WebApp.MainButton.setParams({
                text: 'Відкрити список',
                color: '#ffc107',
                textColor: '#fff'
              });
              window.Telegram.WebApp.MainButton.show();
            } else {
              window.Telegram.WebApp.MainButton.hide();
            }
            break;
          case 3:
            this.modal = false;
            let price = 0;
            this.items.forEach((el) => {
              const result = el.products.filter((item) => item.counter > 0);
              if (result.length > 0) {
                result.forEach((val) => {
                  price += val.counter * val.price;
                });
              }
              this.price = price.toFixed(2);
            });
            window.Telegram.WebApp.MainButton.setParams({
              text: 'Надіслати список',
              color: '#008000',
              textColor: '#fff'
            });
            window.Telegram.WebApp.BackButton.show();
            break;
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
