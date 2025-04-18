class BlackjackGame {

    constructor(){
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
    }

    createDeck() {
        // Create a deck of 52 cards using numbers 0-51
        this.deck = [];
        for (let i = 0; i <= 51; i++) {
          this.deck.push(i);
        }
        // Shuffle the deck
        for (let i = this.deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
      }


      
}