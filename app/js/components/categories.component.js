class CategoriesComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          row-gap: 1rem;
          flex-wrap: wrap;
          width: 100%;
          max-width: 240px;
          margin: 1rem auto;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          animation: fadeIn 0.5s ease-in-out; 
        }

        img {
          align-self: center;
        }

        span {
          align-self: center;
          margin: 0 auto;
        }

        button {
          position: relative;
          overflow: hidden;
          display: flex;
          padding: 0.5rem 1rem;
          width: 100%;
          font-family: var(--default-font);
          font-weight: 700;
          font-size: 14px;
          line-height: 1.25;
          border-radius: 7px;
          text-decoration: none;
          background-color: var(--main-color);
          color: #fff;
          cursor: pointer;
          outline: none;
          border: none;
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      </style>
    `;

    this.shadowRoot.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button && this.shadowRoot.contains(button)) {
        const market = button.dataset?.market || '';
        const category = button.dataset?.category || '';
        if (this.onClickHandler && typeof this.onClickHandler === 'function') {
          this.onClickHandler(market, category);
        }
        event.stopPropagation();
      }
    });

    this.items = [];
    this.onClickHandler = null;
    this.onRippleEffect = null;
  }

  setItems(items) {
    this.items = items;
  }

  setItemClick(handler) {
    this.onClickHandler = handler;
  }

  setRippleEffect(handler) {
    this.onRippleEffect = handler;
  }

  renderItems() {
    this.items.forEach(item => {
      const button = document.createElement('button');
      button.dataset.market = item.market;
      button.dataset.category = item.categoryName;

      const img = document.createElement('img');
      img.src = item.categoryIcon;
      img.alt = item.categoryName;
      img.loading = 'lazy';
      img.width = 24;
      img.height = 24;

      const span = document.createElement('span');
      span.textContent = item.categoryName;

      button.appendChild(img);
      button.appendChild(span);

      this.shadowRoot.appendChild(button);
    });
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {}

  connectedCallback() {
    this.renderItems();

    this.shadowRoot.querySelectorAll('button').forEach(button => {
      if (this.onRippleEffect && typeof this.onRippleEffect === 'function') {
        this.onRippleEffect(button);
      }
    });
  }
}

customElements.define('fridge-categories', CategoriesComponent);
