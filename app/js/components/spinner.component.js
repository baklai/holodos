class SpinnerComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --bg-color: #f8a917;
        }

        .grid {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          transform: translate(-50%, -50%);
        }

        .grid-cube {
          float: left;
          width: 33.33%;
          height: 33.33%;
          background-color: var(--bg-color);
          animation: spin 1.3s infinite ease-in-out;
        }

        @keyframes spin {
          0%,
          70%,
          100% {
            transform: scale3D(1, 1, 1);
          }
          35% {
            transform: scale3D(0, 0, 1);
          }
        }
      </style>

      <div class="grid"></div>
    `;

    this.gridElement = this.shadowRoot.querySelector('div.grid');
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
  }

  connectedCallback() {
    const animation = [0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0, 0.1, 0.2];

    animation.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('grid-cube');
      div.style.animationDelay = `${item}s`;

      this.gridElement.appendChild(div);
    });
  }
}

customElements.define('fridge-spinner', SpinnerComponent);
