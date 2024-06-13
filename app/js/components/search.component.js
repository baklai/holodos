class SearchComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --dark-gray: var(--page-hint-color);
          --light-gray: var(--placeholder-color);
          --focus-blue: var(--main-color);

          --target-size: 36px;
          --box-height: var(--target-size);
          --border-width: 1px;
          --border-radius: calc(var(--box-height) / 4);
          --icon-size: calc(var(--box-height) * 3 / 6);
          --side-margin: calc(var(--border-radius) / 2);
          --icon-vertical-margin: calc((var(--box-height) - var(--icon-size)) / 2);

          position: fixed;
          top: 0;
          width: 95%;
          z-index: 10;
          background: var(--block-bg-color);
        }

        :host([hidden]) {
          display: none;
        }

        :host([disabled]) {
          opacity: 0.5;
        }

        input[type="search"]::-webkit-search-cancel-button {
          -webkit-appearance: none;
          appearance: none;
        }

        .searchbox {
          height: var(--box-height);
          margin: auto;
          max-width: 561px;
          margin: 8px auto;
        }

        .searchbox input[type='search'] {
          border: var(--border-width) solid var(--dark-gray);
          border-radius: var(--border-radius);
          height: 100%;
          width: 100%;
        }

        .searchbox svg.search {
          position: absolute;
          fill: var(--dark-gray);
          height: var(--icon-size);
          width: var(--icon-size);
        }

        .searchbox input[type='search'] {
          -webkit-appearance: none;
          color: var(--dark-gray);
          font-family: 'Noto Sans', Verdana, sans-serif;
          font-size: 0.875rem;
        }

        .searchbox input[type='search']::placeholder {
          color: var(--light-gray);
          opacity: 1;
        }

        .searchbox {
          position: relative;
        }

        .searchbox svg.search {
          left: var(--side-margin);
          top: var(--icon-vertical-margin);
          bottom: var(--icon-vertical-margin);
        }

        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          padding: 0;
          background: none;
          top: var(--icon-vertical-margin);
          bottom: var(--icon-vertical-margin);
          cursor: pointer;
          position: absolute;
          right: calc(var(--side-margin) + 4px);
        }

        button svg {
          fill: var(--dark-gray);
          height: var(--icon-size);
          width: var(--icon-size);
        }

        .searchbox input[type='search'] {
          padding-left: calc(var(--side-margin) + var(--icon-size) + 4px);
          padding-right: calc(var(--side-margin) + var(--icon-size) + 8px);
        }

        input[type='search']::-webkit-search-decoration {
          -webkit-appearance: none;
        }

        .searchbox svg.search {
          z-index: -1;
        }

        .searchbox input[type='search'] {
          background: transparent;
        }

        .searchbox input[type='search']:focus {
          border-color: var(--focus-blue);
          box-shadow: 0px 0px 5px var(--focus-blue);
          outline: 1px solid transparent;
        }

        input[type='search'] {
          -webkit-tap-highlight-color: transparent;
        }
      </style>

      <div class="searchbox">
        <svg aria-hidden="true" viewBox="0 0 24 24" class="search">
          <title>Пошук товару</title>
          <path
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
        <input
          autocomplete="off"
          placeholder="Пошук..."
          type="search"
        />
        <button>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <title>Очистити фільтр</title>
            <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
          </svg>
        </button> 
      </div>
    `;

    this.onInputHandler = null;

    this.input = this.shadowRoot.querySelector('input');
    this.clearButton = this.shadowRoot.querySelector('button');

    this.input.onfocus = () => {
      this.setAttribute('focused', '');
    };

    this.input.onblur = () => {
      this.removeAttribute('focused');
    };

    this.input.addEventListener('input', event => {
      this.onInputHandler(event.target.value);
    });

    this.clearButton.addEventListener('click', () => {
      this.input.value = '';
      this.onInputHandler(this.input.value);
    });
  }

  setOnChange(handler) {
    this.onInputHandler = handler;
  }

  static get observedAttributes() {
    return ['disabled', 'placeholder', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      this.input.disabled = newValue !== null;
    } else if (name === 'placeholder') {
      this.input.placeholder = newValue;
    } else if (name === 'value') {
      this.input.value = newValue;
    }
  }

  get placeholder() {
    return this.getAttribute('placeholder');
  }
  get value() {
    return this.getAttribute('value');
  }
  get disabled() {
    return this.getAttribute('disabled');
  }
  get hidden() {
    return this.getAttribute('hidden');
  }
  set placeholder(value) {
    this.setAttribute('placeholder', value);
  }
  set value(text) {
    this.setAttribute('value', text);
  }
  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  set hidden(value) {
    if (value) {
      this.setAttribute('hidden', '');
    } else {
      this.removeAttribute('hidden');
    }
  }
}

customElements.define('fridge-search', SearchComponent);
