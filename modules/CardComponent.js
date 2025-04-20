class CardComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const value = this.getAttribute("data-value");
        const suit = this.getAttribute("data-suit");
        this.innerHTML += `
            <img class="cardBack" src='assets/cards/back_dark.png'></img>
            <img class="cardFront" src='assets/cards/${suit}_${value}.png' alt="${suit} ${value}"></img>
        `;
    }

    disconnectedCallback() {
        this.textContent = "";
    }
}

customElements.define("card-component", CardComponent);