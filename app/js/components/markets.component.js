class MarketsComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          max-width: 200px;
          row-gap: 1.5rem;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          max-width: 200px;
          animation: fadeIn 0.5s ease-in-out;
        }

        div {
          display: flex;
          width: 100%;
          row-gap: 1.625rem;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }

        button {
          display: inline-block;
          padding: 0.5em 1em;
          height: 38px;
          text-decoration: none;
          background: var(--main-color);
          color: #fff;
          cursor: pointer;
          border-radius: 4px;
          box-shadow: 0px 0px 0px 5px var(--main-color);
          border: dashed 1px #fff;
        }

        button:hover {
          border: dotted 1px #fff;
        }

        p {
          margin: 0;
          color: var(--hint-color);
        }
      </style>

      <div></div>
      <p></p>
    `;

    this.shadowRoot.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button && this.shadowRoot.contains(button)) {
        const market = button.dataset?.market || '';
        if (this.onClickHandler && typeof this.onClickHandler === 'function') {
          this.onClickHandler(market);
        }
        event.stopPropagation();
      }
    });

    this.items = [];
    this.onClickHandler = null;

    this.contentElement = this.shadowRoot.querySelector('div');
    this.commentElement = this.shadowRoot.querySelector('p');
  }

  setItems(itemsArray) {
    this.items = itemsArray;
    this.renderButtons();
  }

  setItemClick(handler) {
    this.onClickHandler = handler;
  }

  renderButtons() {
    this.items.forEach(item => {
      const button = document.createElement('button');
      button.dataset.market = item.key;

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = item.icon;
      img.alt = item.label;
      img.height = 24;

      button.appendChild(img);

      this.contentElement.appendChild(button);
    });
  }

  static get observedAttributes() {
    return ['data-comment'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'data-comment':
        this.commentElement.textContent = newValue;
        break;
    }
  }

  connectedCallback() {
    if (this.hasAttribute('data-comment')) {
      this.commentElement.textContent = this.getAttribute('data-comment');
    }
  }
}

customElements.define('fridge-markets', MarketsComponent);
