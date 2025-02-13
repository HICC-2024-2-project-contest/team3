export default customElements.define(
  'tp-input-string',

  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        * {
          box-sizing: border-box;
          font-family: var(--font-family);
        }
        :host {
          display: flex;
          flex-direction: column;=
        }
        :host > input {
          font-size: 1rem;
          font-weight: 400;
          width: 100%;
          height: 2.25rem;
          padding: 0rem 0.75rem;
          outline: none;
          border: solid 1px rgb(210, 210, 210);
          border-radius: 0.625rem;
          background: rgb(240, 240, 240);
        }
        :host > input:focus {
          border-color: rgb(80, 80, 80);
        }
        :host > input::placeholder,
        :host > input::-webkit-input-placeholder {
          color: rgb(180,180,180);
        }
        :host > input:disabled {
          color: rgb(80, 80, 80);
          border-color: rgb(150,150,150);
          background: rgb(180,180,180);
        }
        :host > input:disabled::placeholder,
        :host > input:disabled::-webkit-input-placeholder {
          color: rgb(128,128,128);
        }
        :host > input:read-only:focus {
          border-color: rgb(210, 210, 210);
        }
        :host > label {
          line-height: 1.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgb(80, 80, 80);
        }
        :host > .message {
          line-height: 1rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: rgb(128,128,128);
          min-height: 1rem;
        }
        :host .star {
          color: var(--th);
        }
      `;
      shadow.appendChild(style);

      const input = document.createElement('input');
      input.type = this.getAttribute('type') || 'text';
      input.value = this.getAttribute('value') || '';
      input.placeholder = this.getAttribute('placeholder') || '';
      input.tabIndex = this.getAttribute('tabindex') || '';
      this.removeAttribute('tabindex');
      input.disabled = this.hasAttribute('disabled');
      input.readOnly = this.hasAttribute('readOnly');
      input.spellcheck = false;
      this.input = input;

      const label = document.createElement('label');
      label.innerHTML = this.getAttribute('label');

      const message = document.createElement('div');
      message.classList.add('message');
      message.innerHTML = this.getAttribute('message');
      if (this.hasAttribute('nomessage')) {
        message.style.display = 'none';
      }

      shadow.appendChild(label);
      shadow.appendChild(input);
      shadow.appendChild(message);
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    static observedAttributes = [
      'type',
      'value',
      'label',
      'message',
      'placeholder',
      'tabindex',
      'disabled',
      'readonly',
    ];

    get type() {
      return this.getAttribute('type');
    }

    set type(newValue) {
      if (newValue) {
        this.setAttribute('type', newValue);
      } else {
        this.removeAttribute('type');
      }
      if (this.shadowRoot) {
        this.input.type = newValue || '';
      }
    }

    get value() {
      return this.shadowRoot?.querySelector('input').value;
    }

    set value(newValue) {
      if (newValue) {
        this.setAttribute('value', newValue);
      } else {
        this.removeAttribute('value');
      }
      if (this.shadowRoot) {
        this.input.value = newValue || '';
      }
    }

    get placeholder() {
      return this.getAttribute('placeholder');
    }

    set placeholder(newValue) {
      if (newValue) {
        this.setAttribute('placeholder', newValue);
      } else {
        this.removeAttribute('placeholder');
      }
      if (this.shadowRoot) {
        this.input.placeholder = newValue || '';
      }
    }

    set tabindex(newValue) {
      this.removeAttribute('tabindex');
      if (this.shadowRoot) {
        this.input.tabIndex = newValue || '';
      }
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

    set disabled(newValue) {
      if (newValue === false) {
        this.removeAttribute('disabled');
      } else {
        this.setAttribute('disabled', '');
      }
      if (this.shadowRoot) {
        this.input.disabled = this.hasAttribute('disabled');
      }
    }

    get readonly() {
      return this.hasAttribute('readonly');
    }

    set readonly(newValue) {
      if (newValue === false) {
        this.removeAttribute('readonly');
      } else {
        this.setAttribute('readonly', '');
      }
      if (this.shadowRoot) {
        this.input.readOnly = this.hasAttribute('readonly');
      }
    }

    get label() {
      return this.getAttribute('label');
    }

    set label(newValue) {
      if (newValue) {
        this.setAttribute('label', newValue);
      } else {
        this.removeAttribute('label');
      }
      if (this.shadowRoot) {
        this.shadowRoot.querySelector('label').innerHTML = newValue || '';
      }
    }

    get message() {
      return this.getAttribute('message');
    }

    set message(newValue) {
      if (newValue) {
        this.setAttribute('message', newValue);
      } else {
        this.removeAttribute('message');
      }
      if (this.shadowRoot) {
        this.shadowRoot.querySelector('.message').innerHTML = newValue || '';
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue == newValue) {
        return;
      }
      if (this[name]) {
        this[name] = newValue;
      }
    }

    focus() {
      this.shadowRoot.querySelector('input').focus();
    }

    blur() {
      this.shadowRoot.querySelector('input').blur();
    }

    addEventListener(name, func, options) {
      return this.shadowRoot
        .querySelector('input')
        .addEventListener(name, func, options);
    }
  }
);
