class SigninComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          max-width: 200px;
          row-gap: 0.625rem;
          text-align: center;
          justify-content: center;
          flex-direction: column;
          animation: fadeIn 0.5s ease-in-out;
        }

        button {
          font-family: var(--default-font);
          font-weight: 700;
          font-size: 14px;
          line-height: 1.25;
          padding: 6px 16px;
          height: 35px;
          border-radius: 7px;
          box-sizing: border-box;
          background-color: var(--main-color);
          text-transform: uppercase;
          cursor: pointer;
          color: #fff;
          outline: none;
          border: none;
        }

        p {
          margin: 0;
          color: var(--hint-color);
        }
      </style>

      <img alt="Холодос" width="200" />
      <button></button>
      <p></p>
    `;

    this.imageElement = this.shadowRoot.querySelector('img');
    this.paragraphElement = this.shadowRoot.querySelector('p');
    this.buttonElement = this.shadowRoot.querySelector('button');

    this.buttonElement.addEventListener('click', () => {
      if (this.onClickHandler && typeof this.onClickHandler === 'function') {
        this.onClickHandler();
      }
    });

    this.onClickHandler = null;
  }

  setOnSignin(handler) {
    this.onClickHandler = handler;
  }

  static get observedAttributes() {
    return ['data-src', 'data-label', 'data-comment'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data-src':
        this.imageElement.src = newValue;
        break;
      case 'data-label':
        this.buttonElement.textContent = newValue;
        break;
      case 'data-comment':
        this.paragraphElement.textContent = newValue;
        break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute('data-src')) {
      this.imageElement.src = this.getAttribute('data-src');
    }
    if (this.hasAttribute('data-label')) {
      this.buttonElement.textContent = this.getAttribute('data-label');
    }
    if (this.hasAttribute('data-comment')) {
      this.paragraphElement.textContent = this.getAttribute('data-comment');
    }
  }
}

customElements.define('fridge-signin', SigninComponent);
