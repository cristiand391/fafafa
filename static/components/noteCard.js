class NoteCard extends HTMLElement {
  constructor() {
    super();

    let template = document.getElementById("note-card");

    let shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("note-card", NoteCard);
