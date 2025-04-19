class CardComponent {
  constructor(cardNumber) {
    this.cardNumber = cardNumber;
    this.faceup = false;
    this.element = null;
  }

  getSuit(cardNumber){
    if (this.cardNumber <= 13) return 'spades';
    if (this.cardNumber <= 26) return 'clubs';
    if (this.cardNumber <= 39) return 'hearts';
    return 'diamonds';
  }

  getValue() {
    return ((this.cardNumber - 1) % 13) + 1;
  }

  getCardFilename() {
    const suit = this.getSuit();
    const value = this.getValue();
    
    // Convert value to card name (1 = ace, 11 = jack, etc.)
    let valueName;
    switch (value) {
      case 1: valueName = 'A'; break;
      case 11: valueName = 'J'; break;
      case 12: valueName = 'Q'; break;
      case 13: valueName = 'King'; break;
      default: valueName = value;
    }
    
    return `${suit}_${valueName}.png`;
  }

  flip() {
    this.faceup = !this.faceup;
    if (this.element) {
      this.updateElement();
    }
    return this;
  }

  createCardElement() {
    this.element = document.createElement('div');
    this.element.className = 'card';
    this.updateElement();
    return this.element;
  }

  updateElement() {
    if (!this.element) return;
    
    if (this.faceup) {
      // Show card face
      this.element.classList.add('faceup');
      this.element.classList.remove('facedown');
      this.element.style.backgroundImage = `url('assets/cards/${this.getCardFilename()}')`;
    } else {
      // Show card back
      this.element.classList.add('facedown');
      this.element.classList.remove('faceup');
      this.element.style.backgroundImage = "url('images/cards/card_back.png')";
    }
  }

}
