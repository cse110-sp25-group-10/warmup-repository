class CardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const number = this.getAttribute("data-number");
        const suit = this.getAttribute("data-suit");
        const imageUrl = this.getAttribute("data-image-url");
        this.innerHTML += `
            <img src='${imageUrl}'></img>
        `;
    }
}

customElements.define("card-component", CardComponent);