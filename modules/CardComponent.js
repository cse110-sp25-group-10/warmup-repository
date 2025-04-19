class CardComponent {
  constructor(cardNumber) {
    this.cardNumber = cardNumber;
    this.faceup = false;
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


}
