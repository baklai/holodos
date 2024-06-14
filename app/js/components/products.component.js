class ProductsComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-wrap: wrap;
          margin: 0 auto;
          margin-top: 48px;
          max-width: 640px;
          height: 100vh;
          justify-content: space-around;
          align-content: flex-start;
          animation: fadeIn 0.5s ease-in-out;
        }

        button {
          display: inline-block;
          font-family: var(--default-font);
          font-weight: 700;
          font-size: 14px;
          line-height: 1.25;
          padding: 6px 16px;
          height: 30px;
          border: none;
          border-radius: 7px;
          box-sizing: border-box;
          text-transform: uppercase;
          text-decoration: none;
          background-color: var(--main-color);
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          outline: none;
        }

        .product {
          position: relative;
          width: 120px;
          height: 159px;
          padding: 4px 5px 21px;
          box-sizing: border-box;
          text-align: center;
        }

        .selected .incr {
          width: 38px;
        }

        .selected .decr {
          pointer-events: auto;
          transform: scale3d(1, 1, 1);
          visibility: visible;
        }

        .selected .incr:before,
        .selected .incr:after {
          background-color: #fff;
        }

        .selected .incr .add {
          transform: scale3d(0.4, 0, 1);
        }

        .counter {
          display: inline-block;
          font-family: var(--default-font);
          font-weight: 700;
          font-size: 14px;
          line-height: 1.25;
          position: absolute;
          right: 0;
          top: 0;
          min-width: 22px;
          height: 22px;
          padding: 2px 6px;
          margin: 4px 6px;
          border-radius: 11px;
          transform: scale3d(0, 0, 1);
          animation: var(--animation) both;
          pointer-events: none;
          z-index: 3;
          box-sizing: border-box;
          background-color: var(--main-color);
          text-transform: uppercase;
          color: #fff;
          outline: none;
          border: none;
        }

        .photo {
          position: relative;
          height: 78px;
        }

        .photo img {
          cursor: pointer;
          background-color: transparent;
        }

        .label {
          display: flex;
          justify-content: center;
          color: var(--text-color);
        }

        .price {
          font-weight: 700;
          white-space: nowrap;
        }

        .price::after {
          display: inline-block;
          vertical-align: top;
          content: '';
          width: 4px;
        }

        .title {
          font-weight: 500;
        }

        .buttons {
          position: relative;
          overflow: hidden;
          display: flex;
          width: 80px;
          justify-content: space-between;
          margin: 10px auto 0;
          transition: all var(--animation);
        }

        .add {
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: top;
          position: relative;
          z-index: 1;
        }

        .incr {
          top: 0;
          right: 0;
          position: absolute;
          transition: width var(--animation);
          width: 80px;
        }

        .incr .add {
          transition: transform var(--animation);
        }

        .decr {
          position: relative;
          width: 38px;
          background-color: #e64d44;
          pointer-events: none;
          transform: scale3d(0.9, 0.9, 1);
          transition: transform var(--animation), visibility var(--animation);
          visibility: hidden;
        }

        .incr:before,
        .incr:after,
        .decr:before {
          display: inline-block;
          position: absolute;
          content: '';
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 14px;
          height: 3px;
          background-color: #fff;
          border-radius: 1px;
          z-index: 1;
        }

        .incr:before,
        .incr:after {
          background-color: rgba(255, 255, 255, 0);
          transition: background-color var(--animation);
        }

        .incr:after {
          width: 3px;
          height: 14px;
        }

        .touch {
          position: absolute;
          top: calc(50% - 17px);
          left: calc(50% - 17px);
          transform: translate(-50%, -50%);
          width: 34px;
          height: 34px;
          cursor: pointer;
          animation: appear 1s forwards;
        }

        @keyframes appear {
          0% {
            opacity: 1;
            transform: scale(1.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes badge-show {
          from {
            transform: scale3d(0.5, 0.5, 1);
            opacity: 0;
            visibility: hidden;
          }
          30% {
            transform: scale3d(1.2, 1.2, 1);
          }
          to {
            transform: scale3d(1, 1, 1);
            opacity: 1;
            visibility: visible;
          }
        }

        @keyframes badge-hide {
          from {
            transform: scale3d(1, 1, 1);
            opacity: 1;
            visibility: visible;
          }
          to {
            transform: scale3d(0.5, 0.5, 1);
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes badge-incr {
          from,
          to {
            transform: scale3d(1, 1, 1);
          }
          40% {
            transform: scale3d(1.2, 1.2, 1);
          }
        }

        @keyframes badge-incr2 {
          from,
          to {
            transform: scale3d(1, 1, 1);
          }
          40% {
            transform: scale3d(1.2, 1.2, 1);
          }
        }

        @keyframes badge-decr {
          from,
          to {
            transform: scale3d(1, 1, 1);
          }
          40% {
            transform: scale3d(0.8, 0.8, 1);
          }
        }

        @keyframes badge-decr2 {
          from,
          to {
            transform: scale3d(1, 1, 1);
          }
          40% {
            transform: scale3d(0.8, 0.8, 1);
          }
        }
      </style>

      <template id="product">
        <div class="product">
          <div class="counter" data-js="count"></div>
          <div class="photo">
            <img width="74" height="74" loading="lazy" data-js="img"/>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 24 24"
              class="touch"
              data-js="svg"
            >
              <path
                fill="#fff"
                stroke="#f8a917"
                stroke-width="1"
                stroke-linejoin="round"
                d="M10 11V8.99c0-.88.59-1.64 1.44-1.86h.05A1.99 1.99 0 0 1 14 9.05V12v-2c0-.88.6-1.65 1.46-1.87h.05A1.98 1.98 0 0 1 18 10.06V13v-1.94a2 2 0 0 1 1.51-1.94h0A2 2 0 0 1 22 11.06V14c0 .6-.08 1.27-.21 1.97a7.96 7.96 0 0 1-7.55 6.48 54.98 54.98 0 0 1-4.48 0 7.96 7.96 0 0 1-7.55-6.48C2.08 15.27 2 14.59 2 14v-1.49c0-1.11.9-2.01 2.01-2.01h0a2 2 0 0 1 2.01 2.03l-.01.97v-10c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2V11Z"
              />
            </svg>
          </div>
          <div class="label">
            <span class="price" data-js="price-per"></span>
            <span class="title" data-js="price-title"></span>
          </div>
          <div class="buttons">
            <button class="decr"></button>
            <button class="incr">
              <span class="add">Так</span>
            </button>
          </div>
        </div>
      </template>
    `;

    this.shadowRoot.addEventListener('click', event => {
      const isButtonIncr = event.target.closest('button.incr');
      const isButtonDecr = event.target.closest('button.decr');
      const isImage = event.target.closest('img');
      if (isImage) {
        const product = event.target.closest('.product');
        const modal = document.createElement('fridge-modal');
        modal.setRippleEffect(button => {
          this.onRippleEffect(button);
        });
        modal.setItems(product.dataset.id, [
          ...this.items.filter(item => {
            const title = item.title.toLowerCase();
            if (!this.filterValue || title.includes(this.filterValue)) {
              return true;
            } else {
              return false;
            }
          })
        ]);
        modal.setItemUpdate(args => {
          const itemIndex = this.items.findIndex(item => item.id === args.id);
          if (itemIndex >= 0) this.items[itemIndex].count = args.count;
          const product = this.shadowRoot.querySelector(`[data-id="${args.id}"]`);
          product.dataset.count = args.count;
          const counter = product.querySelector('[data-js="count"]');
          counter.textContent = args.count;
          if (parseInt(product.dataset.count, 10)) {
            product.classList.add('selected');
            counter.style.animationName = 'badge-show';
          }
          this.onItemUpdate({ ...args });
        });

        this.shadowRoot.appendChild(modal);
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
        const itemIndex = this.items.findIndex(item => item.id === product.dataset.id);
        if (itemIndex >= 0) this.items[itemIndex].count = product.dataset.count;
        this.onItemUpdate({ ...product.dataset, img: img.src });
        if (!parseInt(product.dataset.count, 10)) {
          product.classList.remove('selected');
          counter.style.animationName = 'badge-hide';
        }
      }

      event.stopPropagation();
    });

    this.items = [];
    this.filterValue = null;

    this.onItemUpdate = null;
    this.onClickHandler = null;
    this.onRippleEffect = null;

    this.template = this.shadowRoot.querySelector('#product');

    const search = document.createElement('fridge-search');
    search.setAttribute('placeholder', 'Пошук товару за назвою...');
    search.setOnChange(value => {
      const products = this.shadowRoot.querySelectorAll('.product');
      this.filterValue = value.toLowerCase();
      products.forEach(product => {
        const title = product.dataset.title.toLowerCase();
        if (!this.filterValue || title.includes(this.filterValue)) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });

    this.shadowRoot.appendChild(search);
  }

  setItems(items) {
    this.items = items;
    this.renderItems();
  }

  setItemClick(handler) {
    this.onClickHandler = handler;
  }

  setItemUpdate(handler) {
    this.onItemUpdate = handler;
  }

  setRippleEffect(handler) {
    this.onRippleEffect = handler;
  }

  renderItems() {
    const elements = this.shadowRoot.querySelectorAll('div.product');
    elements.forEach(element => element.remove());

    this.items.forEach(item => {
      const node = this.template.content.cloneNode(true);

      const product = node.querySelector('div.product');
      product.dataset.id = item.id;
      product.dataset.market = item.market;
      product.dataset.category = item.categoryName;
      product.dataset.title = item.title;
      product.dataset.count = item.count;
      product.dataset.pricePer = item.pricePer;
      product.dataset.priceTitle = item.priceTitle;

      const title = product.dataset.title.toLowerCase();
      if (!this.filterValue || title.includes(this.filterValue)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }

      const counter = node.querySelector('[data-js="count"]');
      counter.textContent = product.dataset.count;
      if (parseInt(product.dataset.count, 10)) {
        product.classList.add('selected');
        counter.style.animationName = 'badge-show';
      }

      const img = node.querySelector('[data-js="img"]');
      img.src = item.img;
      img.alt = item.title;
      img.onerror = function () {
        this.src = 'img/market/product.png';
      };

      const svg = node.querySelector('[data-js="svg"]');
      svg.addEventListener('animationend', function () {
        svg.remove();
      });

      const pricePer = node.querySelector('[data-js="price-per"');
      pricePer.textContent = item.pricePer;

      const priceTitle = node.querySelector('[data-js="price-title"');
      priceTitle.textContent = item.priceTitle;

      this.shadowRoot.appendChild(node);
    });
  }

  static get observedAttributes() {
    return ['data-market', 'data-category'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    switch (name) {
      case 'data-market':
        this.dataset.market = newValue;
        break;
      case 'data-category':
        this.dataset.category = newValue;
        break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute('data-market')) {
      this.dataset.market = this.getAttribute('data-market');
    }
    if (this.hasAttribute('data-category')) {
      this.dataset.category = this.getAttribute('data-category');
    }

    this.shadowRoot.querySelectorAll('button').forEach(button => {
      if (this.onRippleEffect && typeof this.onRippleEffect === 'function') {
        this.onRippleEffect(button);
      }
    });
  }
}

customElements.define('fridge-products', ProductsComponent);
