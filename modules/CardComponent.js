class CardComponent {
    constructor(suit, value, faceDown = false) {
        this.suit = suit;
        this.value = value;
        this.faceDown = faceDown;
        this.element = this.createElement();
    }

    createElement() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (this.faceDown) {
            cardElement.classList.add('face-down');
            // Card back image
            const cardImg = document.createElement('img');
            cardImg.src = '../assets/cards/back_dark.png';
            cardImg.alt = 'Card Back';
            cardElement.appendChild(cardImg);
        } else {
            // Face-up card
            const cardImg = document.createElement('img');
            
            // Convert suit to the format used in image paths
            let suitStr = this.suit.toLowerCase();
            
            // Use the Deck of Cards API image format
            cardImg.src = `../assets/cards/${suitStr}_${this.value}.png`;
            cardImg.alt = `${this.value} of ${this.suit}`;
            cardElement.appendChild(cardImg);
        }
        
        return cardElement;
    }

    flip() {
        this.faceDown = !this.faceDown;
        // Replace the current element with a new one
        const newElement = this.createElement();
        this.element.parentNode.replaceChild(newElement, this.element);
        this.element = newElement;
    }

    getElement() {
        return this.element;
    }
}