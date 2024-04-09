const messageTemplate = document.createElement('template');

messageTemplate.innerHTML = `
  <style>
  </style>
  <h1>Hello, World!</h1>
  <p>And all who inhabit it</p>
`;

class Message extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    shadowRoot.appendChild(messageTemplate.content);
  }
}

customElements.define('message-component', Message);