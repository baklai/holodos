class ModalComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          z-index: 999;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          padding-top: 100px;
          background-color: rgb(0, 0, 0, 0.2);
        }

        .content {
          display: flex;
          align-items: center;
          background-color: var(--block-bg-color);
          animation-name: modal;
          animation-duration: 0.6s;
          margin: auto;
          padding: 10px;
          max-width: 280px;
          border-radius: 15px;
        }

        button {
          position: relative;
          overflow: hidden;
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
          outline: none;
        }

        .circle-button {
          display: flex;
          position: absolute;
          align-items: center;
          justify-content: center;
          height: 36px;
          width: 36px;
          border-radius: 50%; 
          padding: 0;
          z-index: 1000;
        }

        .circle-button svg {
          width: 32px; 
          height: 32px; 
        }

        .product {
          position: relative;
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
        }

        .photo img {
          width: 90%;
          cursor: pointer;
          background-color: transparent;
        }

        .label {
          color: var(--text-color);
        }

        .price {
          font-weight: 500; 
          color: var(--main-color);
          white-space: nowrap;
        }

        .price::after {
          display: inline-block;
          vertical-align: top;
          content: '';
          width: 4px;
        }

        .title {
          font-size: 14px;
          font-weight: 500;
        }

        .buttons {
          display: flex;
          width: 80px;
          justify-content: space-between;
          margin: 10px auto 0;
          position: relative;
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

        @keyframes modal {
          from {
            transform: scale(0.5);
          }
          to {
            transform: scale(1);
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

      <div class="content">
        <button class="circle-button" style="left: 6%" data-js="previous">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <title>arrow-left-bold-circle</title>
            <path fill="var(--block-bg-color)" d="M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M7,12L12,17V14H16V10H12V7L7,12Z" />
          </svg>
        </button>

        <div class="product">
          <div class="counter" data-js="count"></div>
          <div class="photo">
            <img loading="lazy" data-js="img"/>
          </div>
          <div class="label" style="padding: 2px 16px">
            <p class="price" data-js="price"></p>
            <p class="title" data-js="title"></p>
          </div>
          <div class="buttons">
            <button class="decr"></button>
            <button class="incr">
              <span class="add">Так</span>
            </button>
          </div>
        </div>

        <button class="circle-button" style="right: 6%" data-js="next">
          <svg viewBox="0 0 24 24">
            <title>arrow-right-bold-circle</title>
            <path fill="var(--block-bg-color)" d="M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M17,12L12,7V10H8V14H12V17L17,12Z" />
          </svg>
        </button>
      </div>
    `;

    this.items = [];
    this.itemsIndex = 0;
    this.onItemUpdate = null;
    this.onRippleEffect = null;

    this.productElement = this.shadowRoot.querySelector('.product');
    this.imgElement = this.shadowRoot.querySelector('[data-js="img"]');
    this.countElement = this.shadowRoot.querySelector('[data-js="count"]');
    this.priceElement = this.shadowRoot.querySelector('[data-js="price"]');
    this.titleElement = this.shadowRoot.querySelector('[data-js="title"]');

    this.addEventListener('click', event => {
      this.remove();
    });

    this.shadowRoot.addEventListener('click', event => {
      const isButtonIncr = event.target.closest('button.incr');
      const isButtonDecr = event.target.closest('button.decr');
      const isImage = event.target.closest('img');

      if (isImage) {
        this.remove();
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

    this.btnPrevious = this.shadowRoot.querySelector('[data-js="previous"]');
    this.btnPrevious.addEventListener('click', event => {
      if (this.itemsIndex > 0) {
        this.itemsIndex--;
        this.renderItem();
      }
    });

    this.btnNext = this.shadowRoot.querySelector('[data-js="next"]');
    this.btnNext.addEventListener('click', event => {
      if (this.itemsIndex < this.items.length - 1) {
        this.itemsIndex++;
        this.renderItem();
      }
    });
  }

  setItems(id, items) {
    this.items = items;
    this.itemsIndex = items.findIndex(item => item.id === id);
    this.renderItem();
  }

  setItemUpdate(handler) {
    this.onItemUpdate = handler;
  }

  setRippleEffect(handler) {
    this.onRippleEffect = handler;
  }

  renderItem() {
    const item = this.items[this.itemsIndex];

    this.productElement.dataset.id = item.id;
    this.productElement.dataset.market = item.market;
    this.productElement.dataset.category = item.categoryName;
    this.productElement.dataset.title = item.title;
    this.productElement.dataset.count = item.count;
    this.productElement.dataset.pricePer = item.pricePer;
    this.productElement.dataset.priceTitle = item.priceTitle;

    this.countElement.textContent = item.count;
    if (parseInt(item.count, 10)) {
      this.productElement.classList.add('selected');
      this.countElement.style.animationName = 'badge-show';
    } else {
      this.productElement.classList.remove('selected');
      this.countElement.style.animationName = 'badge-hide';
    }

    this.imgElement.src = item.img;
    this.imgElement.alt = item.title;
    this.imgElement.onerror = function () {
      this.src = 'img/market/product.png';
    };

    this.priceElement.textContent = item.pricePer + item.priceTitle;

    this.titleElement.textContent = item.title;
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {}

  connectedCallback() {
    this.shadowRoot.querySelectorAll('button').forEach(button => {
      if (this.onRippleEffect && typeof this.onRippleEffect === 'function') {
        this.onRippleEffect(button);
      }
    });
  }
}

customElements.define('fridge-modal', ModalComponent);
