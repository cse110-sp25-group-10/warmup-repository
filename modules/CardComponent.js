class CardComponent {
  constructor(cardNumber) {
    this.cardNumber = cardNumber;
    this.value = (this.cardNumber % 13) + 1;
  }
}
