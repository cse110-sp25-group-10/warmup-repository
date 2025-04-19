export class GameState {
    constructor() {
      this.suits = ['clubs', 'diamonds', 'hearts', 'spades'];
      this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      this.resetDeck();
    }
  
    resetDeck() {
      this.deck = [];
      for (let suit of this.suits) {
        for (let value of this.values) {
          this.deck.push({ suit, value });
        }
      }
      this.shuffle();
    }
  
    shuffle() {
      this.deck.sort(() => Math.random() - 0.5);
    }
  
    drawCard(count = 1) {
      return this.deck.splice(0, count);
    }
  
    get remaining() {
      return this.deck.length;
    }
  }
  