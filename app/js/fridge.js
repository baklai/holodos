export class Fridge {
  #page;
  #market;
  #comment;
  #markets;
  #category;
  #orderlist;
  #botclosed;
  constructor() {
    this.app = null;
    this.#markets = [];
    this.#orderlist = [];
    this.#botclosed = false;

    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    Telegram.WebApp.BackButton.hide();
    Telegram.WebApp.MainButton.hide();

    Telegram.WebApp.BackButton.onClick(() => {
      switch (this.#page) {
        case 'categories':
          this.showMarkets();
          break;
        case 'products':
          this.showCategories(this.#market, this.#category);
          break;
        case 'order-view':
          this.showMarkets();
          break;
      }
    });

    Telegram.WebApp.MainButton.onClick(() => {
      switch (this.#page) {
        case 'order-view':
          this.sendWebDataToBot();
          break;
        default:
          this.showOrderOverview();
      }
    });

    if (!!Telegram.WebApp.initData) {
      this.#botclosed = true;
      document.body.classList.add('closed');
      this.showStatus('Холодос тимчасово закритий', true);
    }
  }

  mount(app) {
    this.app = document.querySelector(app);

    const signin = document.createElement('fridge-signin');
    signin.setAttribute('data-src', 'img/logo.webp');
    signin.setAttribute('data-label', 'Відкрити холодос');
    signin.setAttribute('data-comment', 'бот агрегує товари із бази мереж супермаркетів');
    signin.setOnSignin(() => {
      if (!this.#botclosed) {
        this.showSpinner();
        this.showMarkets();
      }
    });

    this.app.replaceChildren(signin);
  }

  get orderPrice() {
    if (!this.#orderlist?.length) return 0;

    return this.#orderlist
      .reduce((acc, item) => acc + Number(item.pricePer) * Number(item.count), 0)
      .toFixed(2);
  }

  get orderTimeStamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  async fetchAPI(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (err) {
      console.error('There has been a problem with your fetch operation:', err);
      throw new Error(err.message);
    }
  }

  async showMarkets() {
    this.#page = 'markets';

    try {
      this.#markets = await this.fetchAPI('/markets');

      const markets = document.createElement('fridge-markets');
      markets.setAttribute('data-comment', 'бот агрегує товари із бази мереж супермаркетів');
      markets.setItems([...this.#markets]);
      markets.setItemClick(key => {
        this.showSpinner();
        this.showCategories(key);
      });

      Telegram.WebApp.BackButton.hide();
      if (this.#orderlist.length) {
        Telegram.WebApp.MainButton.show();
      }

      this.app.replaceChildren(markets);
    } catch (err) {
      console.error('There has been a problem with your fetch operation:', err);
    }
  }

  async showCategories(market) {
    this.#page = 'categories';
    this.#market = market;

    try {
      const items = await this.fetchAPI(`/categories?market=${market}`);

      const img = document.createElement('img');
      img.src = this.#markets.find(({ key }) => key === market).icon;
      img.alt = this.#markets.find(({ key }) => key === market).label;
      img.width = 120;

      this.app.replaceChildren(img);

      if (items?.length) {
        const categories = document.createElement('fridge-categories');
        categories.setItems([...items]);
        categories.setItemClick((market, category) => {
          this.showSpinner();
          this.showProducts(market, category);
        });

        this.app.appendChild(categories);
      } else {
        const paragraph = document.createElement('p');
        paragraph.style.width = '80%';
        paragraph.style.textAlign = 'center';
        paragraph.style.color = 'var(--hint-color)';
        paragraph.textContent =
          'перелік товарів поки що порожній, та найближчим часов він оновиться';
        this.app.appendChild(paragraph);
      }
    } catch (err) {
      console.error('There has been a problem with your fetch operation:', err);
    }

    Telegram.WebApp.BackButton.show();
    if (this.#orderlist.length) {
      Telegram.WebApp.MainButton.show();
    }
  }

  async showProducts(market, category) {
    this.#page = 'products';
    this.#market = market;
    this.#category = category;

    try {
      const items = await this.fetchAPI(`/products?market=${market}&category=${category}`);

      const products = document.createElement('fridge-products');
      products.setAttribute('data-market', market);
      products.setAttribute('data-category', category);
      products.setItems([
        ...items.map(item => {
          return { ...item, count: this.getOrderCount(item.id) };
        })
      ]);
      products.setItemClick((market, category) => {
        this.showSpinner();
        this.showProducts(market, category);
      });
      products.setItemUpdate(args => {
        this.updateOrderProducts({ ...args });
      });

      this.app.replaceChildren(products);
    } catch (err) {
      console.error('There has been a problem with your fetch operation:', err);
    }

    Telegram.WebApp.BackButton.show();
    if (this.#orderlist?.length) {
      Telegram.WebApp.MainButton.show();
    }
  }

  showOrderOverview() {
    this.#page = 'order-view';

    Telegram.WebApp.MainButton.setParams({
      text: 'Отримати список',
      color: '#008000',
      textColor: '#fff'
    });

    const order = document.createElement('fridge-order');
    order.setAttribute('data-number', `СПИСОК #${this.orderTimeStamp}`);
    order.setAttribute('data-price', `₴${this.orderPrice}`);
    order.setItems(
      this.#orderlist.map(item => {
        return {
          ...item,
          market: `${this.#markets.find(({ key }) => item.market === key).label}/${item.category}`
        };
      })
    );
    order.setComment(value => {
      this.#comment = value;
    });
    order.setOrderClear(() => {
      Telegram.WebApp.isClosingConfirmationEnabled = false;
      Telegram.WebApp.MainButton.hide();
      this.#orderlist = [];
      this.showSpinner();
      this.showMarkets();
      Telegram.WebApp.MainButton.setParams({
        text: `УСЬОГО ${this.orderPrice}₴`,
        color: '#f8a917',
        textColor: '#fff'
      });
    });

    this.app.replaceChildren(order);

    Telegram.WebApp.BackButton.show();
    if (this.#orderlist.length) {
      Telegram.WebApp.MainButton.show();
    }
  }

  showSpinner() {
    Telegram.WebApp.BackButton.hide();
    Telegram.WebApp.MainButton.hide();

    const spinner = document.createElement('fridge-spinner');
    this.app.replaceChildren(spinner);
  }

  showStatus(text, err) {
    const status = document.createElement('fridge-status');
    if (err) {
      status.classList.add('error');
    }
    status.textContent = text;
    document.body.appendChild(status);
  }

  getOrderCount(id) {
    const order = this.#orderlist.find(item => item.id === id);
    return order && order?.count ? order.count : 0;
  }

  updateOrderProducts(product) {
    const order = this.#orderlist.find(item => item.id === product.id);

    if (order) {
      order.count = product.count;
    } else {
      this.#orderlist.push({ ...product });
    }

    if (order && order.count === '0') {
      const index = this.#orderlist.findIndex(item => item.id == order.id);
      this.#orderlist.splice(index, 1);
    }

    Telegram.WebApp.MainButton.setParams({
      text: `УСЬОГО ${this.orderPrice}₴`,
      color: '#f8a917',
      textColor: '#fff'
    });

    if (this.#orderlist.length) {
      Telegram.WebApp.MainButton.show();
      Telegram.WebApp.isClosingConfirmationEnabled = true;
    } else {
      Telegram.WebApp.MainButton.hide();
      Telegram.WebApp.isClosingConfirmationEnabled = false;
    }
  }

  sendWebDataToBot() {
    if (!this.#orderlist?.length) return;

    Telegram.WebApp.sendData(
      JSON.stringify({
        order: this.#orderlist.map(item => {
          return { id: item.id, count: item.count };
        }),
        price: this.orderPrice,
        comment: this.#comment
      })
    );
  }
}

function initRippleEffect() {
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', event => {
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.5s linear';

      const rect = event.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      button.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  });
}
