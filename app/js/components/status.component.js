class StatusComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 0;
          width: 100%;
          max-width: 480px;
          padding: 8px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0;
          opacity: 0.5;
          background-color: var(--accent-color);
          box-shadow: 0 var(--status-height) var(--accent-color);
          color: #fff;
          height: var(--status-height);
          min-height: var(--status-height);
          box-sizing: border-box;
          pointer-events: none;
          z-index: 10;
        }

        :host(.error) {
          background-color: var(--error-color);
          box-shadow: 0 var(--status-height) var(--error-color);
        }
      </style>

      <slot></slot>
    `;
  }

  connectedCallback() {
    setTimeout(() => {
      if (this.parentElement) {
        this.parentElement.removeChild(this);
      }
    }, 5000);
  }
}

customElements.define('fridge-status', StatusComponent);
