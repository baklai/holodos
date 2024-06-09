class OrderComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          height: 100vh;
          width: 100%;
          justify-content: start;
          flex-direction: column;
          animation: fadeIn 0.5s ease-in-out;
          background-color: var(--bg-color);
        }

        p {
          margin: 0;
        }

        button {
          font-family: var(--default-font);
          font-weight: 700;
          font-size: 14px;
          line-height: 1.25;
          border-radius: 7px;
          text-decoration: none;
          background-color: var(--main-color);
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          outline: none;
          border: none;
        }

        textarea {
          background-color: var(--block-bg-color);
          font-size: 16px;
          padding: 5px 20px;
          box-sizing: border-box;
          max-height: 100px;
          width: 100%;
          outline: none;
          border: none;
          resize: none;
        }

        .header {
          display: flex;
          align-items: center;
          column-gap: 10px;
          margin: 10px 0px;
          padding: 10px 20px;
          background-color: var(--block-bg-color);
        }

        .items {
          display: flex;
          row-gap: 10px;
          flex-direction: column;
          width: 100%;
          max-height: 280px;
          overflow-y: auto;
        }
      </style>

      <div class="header">
        <img src="img/logo.webp" alt="Холодос" width="56" height="56" />
        <div style="display: flex; flex-direction: column; row-gap: 2px; width: 100%">
          <p data-js="order-number" style="margin: 0; font-weight: 700"></p>
          <p style="margin: 0">Ідеальний список для покупок</p>
          <p style="margin: 0; color: var(--page-hint-color)">@MyHolodosBot</p>
        </div>
      </div>

      <div style="padding: 10px 20px; background-color: var(--block-bg-color)">
        <div style="padding: 10px 0px; display: flex; align-items: center">
          <p style="flex-grow: 1; font-size: 17px; font-weight: 700; text-transform: uppercase">
            Ваш список
          </p>

          <button
            data-js="order-clear"
            title="Видалити список"
            style="background: none; width: 30px"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>Видалити список</title>
              <path
                fill="#64666d50"
                d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
              />
            </svg>
          </button>
        </div>

        <div class="items"></div>

        <div style="display: flex; padding: 10px 0px">
          <div style="flex-grow: 1; margin-left: 60px; font-size: 16px; font-weight: 700">
            Усього:
          </div>
          <div data-js="total-price" style="font-weight: 700"></div>
        </div>
      </div>

      <div style="margin: 10px 0px">
        <textarea
          data-js="comment"
          rows="1"
          placeholder="Додати коментар, побажання тощо..."
        ></textarea>
      </div>

      <template id="product">
        <div style="display: flex">
          <img data-js="img" width="50" height="50" style="flex: none" loading="lazy" />

          <div style="width: 100%; padding: 0 10px">
            <span data-js="title" style="font-weight: 500"></span>
            <span data-js="count" style="font-weight: 900; color: var(--main-color)"></span>
            <p data-js="market" style="font-size: 12px; color: var(--hint-color)"></p>
          </div>

          <div style="flex: none; font-weight: 500">
            <p data-js="price-per"></p>
            <p data-js="price-title"></p>
          </div>
        </div>
      </template> 
    `;

    this.items = [];

    this.onOrderClear = null;
    this.onCommentUpdate = null;

    this.orderItems = this.shadowRoot.querySelector('.items');
    this.orderNumber = this.shadowRoot.querySelector('[data-js="order-number"]');
    this.totalPrice = this.shadowRoot.querySelector('[data-js="total-price"]');
    this.itemTemplate = this.shadowRoot.querySelector('#product');

    this.comment = this.shadowRoot.querySelector('[data-js="comment"]');
    this.comment.addEventListener('input', event => {
      const height = event.target.scrollHeight + 'px';
      event.target.style.height = height;
      if (this.onCommentUpdate && typeof this.onCommentUpdate === 'function') {
        this.onCommentUpdate(event.target.value);
      }
    });

    const button = this.shadowRoot.querySelector('[data-js="order-clear"]');
    button.addEventListener('click', event => {
      if (this.onOrderClear && typeof this.onOrderClear === 'function') {
        this.onOrderClear();
      }
    });
  }

  setItems(items) {
    this.items = items;
    this.renderItems();
  }

  setComment(handler) {
    this.onCommentUpdate = handler;
  }

  setOrderClear(handler) {
    this.onOrderClear = handler;
  }

  renderItems() {
    this.items.forEach(item => {
      const product = this.itemTemplate.content.cloneNode(true);

      const img = product.querySelector('[data-js="img"]');
      img.alt = item.title;
      img.src = item.img;

      const title = product.querySelector('[data-js="title"]');
      title.textContent = item.title;

      const count = product.querySelector('[data-js="count"]');
      count.textContent = `${item.count}x`;

      const market = product.querySelector('[data-js="market"]');
      market.textContent = item.market;

      const pricePer = product.querySelector('[data-js="price-per"]');
      pricePer.textContent = item.pricePer;

      const priceTitle = product.querySelector('[data-js="price-title"]');
      priceTitle.textContent = item.priceTitle;

      this.orderItems.appendChild(product);
    });
  }

  static get observedAttributes() {
    return ['data-number', 'data-price'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data-number':
        this.orderNumber.textContent = newValue;
        break;
      case 'data-price':
        this.totalPrice.textContent = newValue;
        break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute('data-number')) {
      this.orderNumber.textContent = this.getAttribute('data-number');
    }
    if (this.hasAttribute('data-price')) {
      this.totalPrice.textContent = this.getAttribute('data-price');
    }
  }
}

customElements.define('fridge-order', OrderComponent);
