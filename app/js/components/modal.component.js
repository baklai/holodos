class ModalComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          z-index: 999;
          padding-top: 100px;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgb(0, 0, 0, 0.2);
        }

        img {
          width: 90%;
          cursor: pointer;
        }

        .content {
          background-color: var(--block-bg-color);
          animation-name: modal;
          animation-duration: 0.6s;
          margin: auto;
          padding: 10px;
          max-width: 280px;
          border-radius: 15px;
        }

        .title {
          font-size: 14px;
        }

        .price {
          font-weight: 500; 
          color: var(--main-color);
        }

        @keyframes modal {
          from {
            transform: scale(0.5);
          }
          to {
            transform: scale(1);
          }
        }
      </style>

      <div class="content">
        <div style="text-align: center">
          <img loading="lazy" />
          <div style="padding: 2px 16px">
            <p class="title"></p>
            <p class="price"></p>
          </div>
        </div>
      </div>
    `;

    this.imgElement = this.shadowRoot.querySelector('img');
    this.titleElement = this.shadowRoot.querySelector('.title');
    this.priceElement = this.shadowRoot.querySelector('.price');

    this.shadowRoot.addEventListener('click', event => {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    });
  }

  static get observedAttributes() {
    return ['data-img', 'data-title', 'data-price'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data-img':
        this.imgElement.src = newValue;
        break;
      case 'data-title':
        this.titleElement.textContent = newValue;
        break;
      case 'data-price':
        this.priceElement.textContent = newValue;
        break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute('data-img')) {
      this.imgElement.src = this.getAttribute('data-img');
    }
    if (this.hasAttribute('data-title')) {
      this.titleElement.textContent = this.getAttribute('data-title');
    }
    if (this.hasAttribute('data-price')) {
      this.priceElement.textContent = this.getAttribute('data-price');
    }
  }
}

customElements.define('fridge-modal', ModalComponent);
