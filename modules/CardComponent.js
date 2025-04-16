class CardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const value = this.getAttribute("data-value");
        const suit = this.getAttribute("data-suit");
        this.innerHTML += `
            <img src='/assets/cards/${suit}_${value}.png'></img>
        `;
    }
}

customElements.define("card-component", CardComponent);