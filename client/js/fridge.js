const MARKETS = [
  {
    key: 'atb',
    label: 'АТБ-Маркет',
    icon: 'img/logo/atb-logo.svg'
  },
  {
    key: 'silpo',
    label: 'Сільпо-Маркет',
    icon: 'img/logo/silpo-logo.svg'
  },
  {
    key: 'novus',
    label: 'NOVUS-Маркет',
    icon: 'img/logo/novus-logo.svg'
  }
];

export class Fridge {
  #container;
  #isClosed;
  #products;
  constructor(container = '#app') {
    this.#container = document.querySelector(container);
    this.#isClosed = false;
    this.#products = [];

    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    Telegram.WebApp.BackButton.hide();
    Telegram.WebApp.MainButton.hide();

    Telegram.WebApp.BackButton.onClick(() => {
      const container = this.#container.querySelector('section');

      const { section = '', market = '', category = '' } = container.dataset;

      switch (section) {
        case 'markets':
          this.showFridge();
          break;
        case 'categories':
        case 'order':
          this.showMarkets();
          break;
        case 'products':
          this.showCategories(market, category);
          break;
        default:
          this.showFridge();
      }
    });

    Telegram.WebApp.MainButton.onClick(() => {
      const container = this.#container.querySelector('section');

      const { section } = container.dataset;

      switch (section) {
        case 'order':
          this.sendWebDataToBot();
          break;
        default:
          this.showOrderOverview();
      }
    });

    // if (!Telegram.WebApp.initDataUnsafe || !Telegram.WebApp.initDataUnsafe.query_id) {
    //   this.#isClosed = true;
    //   document.body.classList.add('closed');
    //   this.showStatus('Холодос тимчасово закритий', true);
    // }

    this.showFridge();
  }

  showSpin() {
    Telegram.WebApp.BackButton.hide();
    Telegram.WebApp.MainButton.hide();

    const template = document.querySelector('#spin');
    const node = template.content.cloneNode(true);

    this.#container.replaceChildren(node);
  }

  showFridge() {
    Telegram.WebApp.BackButton.hide();
    const template = document.querySelector('#fridge');
    const node = template.content.cloneNode(true);

    const section = node.querySelector('section');
    section.dataset.section = 'fridge';

    const button = node.querySelector('button');

    button.addEventListener('click', event => {
      if (!this.#isClosed) {
        this.showSpin();
        this.showMarkets();
      }
    });

    this.#container.replaceChildren(node);

    initRippleEffect();
  }

  showMarkets() {
    const section = document.createElement('section');
    section.dataset.section = 'markets';
    section.classList.add('markets');

    section.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button && section.contains(button)) {
        const market = button.dataset?.market || '';
        this.showSpin();
        this.showCategories(market);

        event.stopPropagation();
      }
    });

    MARKETS.forEach(market => {
      const template = document.querySelector('#market');
      const node = template.content.cloneNode(true);

      const button = node.querySelector('button');
      button.dataset.market = market.key;

      const img = node.querySelector('img');
      img.src = market.icon;
      img.alt = market.label;

      section.appendChild(node);
    });

    const paragraph = document.createElement('p');
    paragraph.textContent = 'бот агрегує товари із бази мереж супермаркетів';
    section.appendChild(paragraph);

    Telegram.WebApp.BackButton.show();
    if (this.#products.length) {
      Telegram.WebApp.MainButton.show();
    }

    this.#container.replaceChildren(section);

    initRippleEffect();
  }

  async showCategories(market) {
    const section = document.createElement('section');
    section.dataset.section = 'categories';
    section.classList.add('categories');

    section.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button && section.contains(button)) {
        const market = button.dataset?.market || '';
        const category = button.dataset?.category || '';

        this.showSpin();
        this.showProducts(market, category);

        event.stopPropagation();
      }
    });

    try {
      const response = await fetch(`/categories?market=${market}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const categories = await response.json();

      categories.forEach(category => {
        const template = document.querySelector('#category');
        const node = template.content.cloneNode(true);

        const button = node.querySelector('button');
        button.dataset.market = market;
        button.dataset.category = category.categoryName;

        const img = node.querySelector('img');
        img.src = category.categoryIcon;
        img.alt = category.categoryName;

        const span = node.querySelector('span');
        span.textContent = category.categoryName;

        section.appendChild(node);
      });
    } catch (err) {
      console.error('There has been a problem with your fetch operation:', err);
    }

    Telegram.WebApp.BackButton.show();
    if (this.#products.length) {
      Telegram.WebApp.MainButton.show();
    }

    this.#container.replaceChildren(section);

    initRippleEffect();
  }

  async showProducts(market, category) {
    const section = document.createElement('section');
    section.dataset.section = 'products';
    section.dataset.market = market;
    section.dataset.category = category;
    section.classList.add('products');

    section.addEventListener('click', event => {
      const isButtonIncr = event.target.closest('button.incr');
      const isButtonDecr = event.target.closest('button.decr');

      const isImage = event.target.closest('img');

      if (isImage) {
        const product = event.target.closest('.product');

        const template = document.querySelector('#modal');
        const node = template.content.cloneNode(true);

        const modal = node.querySelector('[data-js="modal"]');
        modal.addEventListener('click', event => {
          modal.remove();
        });

        const img = node.querySelector('[data-js="img"]');
        img.src = isImage.src;

        const title = node.querySelector('[data-js="title"]');
        title.textContent = product.dataset.title;

        const price = node.querySelector('[data-js="price"]');
        price.textContent = product.dataset.pricePer + product.dataset.priceTitle;

        this.#container.appendChild(node);
      }

      if (isButtonIncr || isButtonDecr) {
        const product = event.target.closest('.product');
        const counter = product.querySelector('.counter');

        if (isButtonIncr) {
          product.classList.add('selected');

          switch (counter.style.animationName) {
            case 'badge-show':
              counter.style.animationName = 'badge-incr';
              break;
            case 'badge-incr':
              counter.style.animationName = 'badge-incr2';
              break;
            case 'badge-incr2':
              counter.style.animationName = 'badge-incr';
              break;
            default:
              counter.style.animationName = 'badge-show';
          }

          product.dataset.count++;
        }

        if (isButtonDecr) {
          switch (counter.style.animationName) {
            case 'badge-decr':
              counter.style.animationName = 'badge-decr2';
              break;
            case 'badge-decr2':
              counter.style.animationName = 'badge-decr';
              break;
            default:
              counter.style.animationName = 'badge-decr';
          }

          product.dataset.count--;
        }

        counter.textContent = parseInt(product.dataset.count, 10);

        const img = product.querySelector('img');

        this.updateOrderProducts({ market, category, ...product.dataset, img: img.src });

        if (!parseInt(product.dataset.count, 10)) {
          product.classList.remove('selected');
          counter.style.animationName = 'badge-hide';
        }
      }
    });

    try {
      const response = await fetch(`/products?market=${market}&category=${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const products = await response.json();

      products.forEach(product => {
        const template = document.querySelector('#product');
        const node = template.content.cloneNode(true);

        const orderCount = this.getOrderCount(product.id);

        const card = node.querySelector('div.product');
        card.dataset.id = product.id;
        card.dataset.title = product.title;
        card.dataset.count = orderCount;
        card.dataset.pricePer = product.pricePer;
        card.dataset.priceTitle = product.priceTitle;

        const counter = node.querySelector('div.counter');

        counter.textContent = card.dataset.count;

        if (parseInt(card.dataset.count, 10)) {
          card.classList.add('selected');
          counter.style.animationName = 'badge-show';
        }

        const img = node.querySelector('div.photo img');
        img.src = product.img;
        img.alt = product.title;

        const spanPricePer = node.querySelector('div.label span.price');
        spanPricePer.textContent = product.pricePer;

        const spanPriceTitle = node.querySelector('div.label span.title');
        spanPriceTitle.textContent = product.priceTitle;

        section.appendChild(node);
      });
    } catch (err) {
      console.error('There has been a problem with your fetch operation:', err);
    }

    Telegram.WebApp.BackButton.show();
    if (this.#products.length) {
      Telegram.WebApp.MainButton.show();
    }

    this.#container.replaceChildren(section);

    initRippleEffect();
  }

  showOrderOverview() {
    Telegram.WebApp.MainButton.setParams({
      text: 'Отримати список',
      color: '#008000',
      textColor: '#fff'
    });

    const template = document.querySelector('#order-view');
    const node = template.content.cloneNode(true);

    const section = node.querySelector('section');
    section.dataset.section = 'order';

    const number = node.querySelector('[data-js="order-number"]');
    number.textContent = `СПИСОК #${this.genOrderTimeStamp()}`;

    const totalPrice = node.querySelector('[data-js="total-price"]');
    totalPrice.textContent = `₴${this.getOrderPrice()}`;

    const content = node.querySelector('[data-js="content"]');

    const button = node.querySelector('[data-js="order-clear"]');

    button.addEventListener('click', event => {
      Telegram.WebApp.isClosingConfirmationEnabled = false;
      Telegram.WebApp.MainButton.hide();
      this.#products = [];
      this.showSpin();
      this.showFridge();

      Telegram.WebApp.MainButton.setParams({
        text: `УСЬОГО ${this.getOrderPrice()}₴`,
        color: '#f8a917',
        textColor: '#fff'
      });
    });

    this.#products.forEach(product => {
      const template = document.querySelector('#order-product');
      const node = template.content.cloneNode(true);

      const img = node.querySelector('[data-js="img"]');
      img.alt = product.title;
      img.src = product.img;

      const title = node.querySelector('[data-js="title"]');
      title.textContent = product.title;
      const count = node.querySelector('[data-js="count"]');
      count.textContent = `${product.count}x`;
      const market = node.querySelector('[data-js="market"]');
      market.textContent = `${MARKETS.find(({ key }) => product.market === key).label}/${product.category}`;
      const pricePer = node.querySelector('[data-js="price-per"]');
      pricePer.textContent = product.pricePer;
      const priceTitle = node.querySelector('[data-js="price-title"]');
      priceTitle.textContent = product.priceTitle;

      content.appendChild(node);
    });

    const comment = node.querySelector('[data-js="comment"]');
    comment.addEventListener('input', event => {
      const height = event.target.scrollHeight + 'px';
      event.target.style.height = height;
    });

    this.#container.replaceChildren(node);

    Telegram.WebApp.BackButton.show();
    if (this.#products.length) {
      Telegram.WebApp.MainButton.show();
    }

    initRippleEffect();
  }

  showStatus(text, err) {
    const section = document.createElement('section');
    section.classList.add('status');
    if (err) {
      section.classList.add('error');
    }
    section.textContent = text;
    document.body.appendChild(section);

    setTimeout(() => {
      const section = document.querySelector('section.status');
      if (section) {
        section.remove();
      }
    }, 5000);
  }

  getOrderCount(id) {
    const order = this.#products.find(item => item.id === id);
    return order && order?.count ? order.count : 0;
  }

  getOrderPrice() {
    if (!this.#products.length) return 0;

    return this.#products
      .reduce((acc, item) => acc + Number(item.pricePer) * Number(item.count), 0)
      .toFixed(2);
  }

  genOrderTimeStamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  updateOrderProducts(product) {
    const order = this.#products.find(item => item.id === product.id);

    if (order) {
      order.count = product.count;
    } else {
      this.#products.push({ ...product });
    }

    if (order && order.count === '0') {
      const index = this.#products.findIndex(item => item.id == order.id);
      this.#products.splice(index, 1);
    }

    console.log(this.#products);

    Telegram.WebApp.MainButton.setParams({
      text: `УСЬОГО ${this.getOrderPrice()}₴`,
      color: '#f8a917',
      textColor: '#fff'
    });

    if (this.#products.length) {
      Telegram.WebApp.MainButton.show();
      Telegram.WebApp.isClosingConfirmationEnabled = true;
    } else {
      Telegram.WebApp.MainButton.hide();
      Telegram.WebApp.isClosingConfirmationEnabled = false;
    }
  }

  sendWebDataToBot() {
    if (!this.#products.length) return;

    const comment = document.querySelector('[data-js="comment"]');

    Telegram.WebApp.sendData(
      JSON.stringify({
        order: this.#products.map(item => {
          return { id: item.id, count: item.count };
        }),
        price: this.getOrderPrice(),
        comment: comment.value
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
