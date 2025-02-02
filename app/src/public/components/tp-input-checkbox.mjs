export default customElements.define(
  'tp-input-checkbox',

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
          flex-direction: column;
          margin-bottom: 1rem;
        }
        :host > .wrapper {
          position: relative;
          width: 100%;
        }
        :host > .wrapper > input {
          position: absolute;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          opacity: 0;
          cursor: pointer;
        }
        :host > .wrapper > .content {
          position: relative;
          display: flex;
          flex-direction: row;
          pointer-events: none;
          justify-content: flex-end;
        }
        :host > .wrapper > .content > .checkbox {
          display: flex;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 0.35rem;
          border: solid 1px rgb(255, 51, 0);
        }
        :host > .wrapper > .content > .checkbox > span {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.25rem;
          color: white;
        }
        :host > .wrapper > input:checked ~ .content > .checkbox {
          background: rgb(255, 100, 60);
        }
        :host > .wrapper > .content > label {
          line-height: 1.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          padding-left: 0.5rem;
        }
        :host > .message {
          line-height: 1rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: rgb(128,128,128);
          min-height: 1rem;
          text-align: right;
        }
      `;
      shadow.appendChild(style);

      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = this.getAttribute('value');
      input.disabled = this.hasAttribute('disabled');

      const content = document.createElement('div');
      content.classList.add('content');

      const checkbox = document.createElement('div');
      checkbox.classList.add('checkbox');
      checkbox.innerHTML += `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />`;
      checkbox.innerHTML += `<span class="material-symbols-outlined"> check </span>`;

      const label = document.createElement('label');
      label.innerHTML = this.getAttribute('label');

      content.appendChild(checkbox);
      content.appendChild(label);

      wrapper.appendChild(input);
      wrapper.appendChild(content);

      const message = document.createElement('div');
      message.classList.add('message');
      message.innerHTML = this.getAttribute('message');

      this.innerHTML = '';
      shadow.appendChild(wrapper);
      shadow.appendChild(message);
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    static observedAttributes = ['value', 'label', 'message', 'disabled'];

    get checked() {
      return this.shadowRoot?.querySelector('input').checked;
    }

    set checked(newValue) {
      if (newValue) {
        this.setAttribute('checked', newValue);
      } else {
        this.removeAttribute('checked');
      }
      this.shadowRoot.querySelector('input').checked = newValue || '';
    }

    get disabled() {
      return this.hasAttribute('disabled');
    }

    set disabled(newValue) {
      if (newValue != undefined) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
      this.shadowRoot.querySelector('input').disabled = newValue != undefined;
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
      this.shadowRoot.querySelector('label').innerHTML = newValue || '';
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
      this.shadowRoot.querySelector('.message').innerHTML = newValue || '';
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue == newValue) {
        return;
      }
      if (this[name]) {
        this[name] = newValue;
      }
    }

    addEventListener(name, func, options) {
      return this.shadowRoot
        .querySelector('input')
        .addEventListener(name, func, options);
    }
  }
);
