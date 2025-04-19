class BlackjackGame {
    constructor() {
      this.deck = [];
      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;
      this.playerStand = false;
      this.createDeck();
    }
  
    createDeck() {
      // Create a deck of 52 cards using numbers 0-51
      this.deck = [];
      for (let i = 0; i <= 51; i++) {
        this.deck.push(new CardComponent(i));
      }
      this.shuffleDeck();
    }
  
    shuffleDeck() {
      // Shuffle the deck
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    }
  
    dealInitialCards() {
      // Clear hands
      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;
      this.playerStand = false;
      
      // Deal 2 cards to player and dealer (alternating)
      this.dealCardTo('player').flip();
      this.dealCardTo('dealer').flip();
      this.dealCardTo('player').flip();
      // Only flip the first dealer card, leave second face down
      this.dealCardTo('dealer');
      
      // Check for blackjack
      if (this.calculateHandValue(this.playerHand) === 21) {
        this.dealerHand[1].flip(); // Flip dealer's second card
        if (this.calculateHandValue(this.dealerHand) === 21) {
          // Both have blackjack - it's a push (tie)
          return "push";
        } else {
          // Player has blackjack
          return "blackjack";
        }
      }
      
      return "continue";
    }
  
    dealCardTo(recipient) {
      if (this.deck.length === 0) {
        this.createDeck(); // Recreate and shuffle if we run out of cards
      }
      
      // Take the top card from the deck
      const card = this.deck.pop();
      
      // Add to appropriate hand
      if (recipient === 'player') {
        this.playerHand.push(card);
      } else {
        this.dealerHand.push(card);
      }
      
      return card;
    }
  
    hit() {
      if (this.gameOver || this.playerStand) return false;
      
      // Deal a card to the player and flip it face up
      this.dealCardTo('player').flip();
      
      const playerValue = this.calculateHandValue(this.playerHand);
      
      // Check if player busts
      if (playerValue > 21) {
        this.gameOver = true;
        return "bust";
      }
      
      // Check if player has 21
      if (playerValue === 21) {
        this.stand();
        return "twenty-one";
      }
      
      return "continue";
    }
  
    stand() {
      if (this.gameOver) return false;
      
      this.playerStand = true;
      
      // Flip dealer's face-down card
      if (this.dealerHand.length > 1 && !this.dealerHand[1].faceup) {
        this.dealerHand[1].flip();
      }
      
      // Dealer draws until 17 or higher
      let dealerValue = this.calculateHandValue(this.dealerHand);
      
      while (dealerValue < 17) {
        this.dealCardTo('dealer').flip();
        dealerValue = this.calculateHandValue(this.dealerHand);
      }
      
      this.gameOver = true;
      
      // Determine the outcome
      const playerValue = this.calculateHandValue(this.playerHand);
      
      if (dealerValue > 21) {
        return "dealer-bust";
      } else if (dealerValue > playerValue) {
        return "dealer-wins";
      } else if (playerValue > dealerValue) {
        return "player-wins";
      } else {
        return "push";
      }
    }
  
    calculateHandValue(hand) {
      let value = 0;
      let aces = 0;
      
      // First pass: count non-ace cards and count aces
      for (const card of hand) {
        const cardValue = card.getValue();
        
        if (cardValue === 1) {
          // Ace
          aces++;
        } else if (cardValue > 10) {
          // Face cards (Jack, Queen, King)
          value += 10;
        } else {
          // Number cards (2-10)
          value += cardValue;
        }
      }
      
      // Second pass: add aces optimally
      for (let i = 0; i < aces; i++) {
        // Add 11 if it doesn't bust, otherwise add 1
        if (value + 11 <= 21) {
          value += 11;
        } else {
          value += 1;
        }
      }
      
      return value;
    }
  
    getCardElements(hand) {
      return hand.map(card => {
        if (!card.element) {
          card.createCardElement();
        }
        return card.element;
      });
    }
  
    getRemainingCards() {
      return this.deck.length;
    }
  }
  
  // Game initialization code
  document.addEventListener('DOMContentLoaded', () => {
    const game = new BlackjackGame();
    
    const playerHandElement = document.getElementById('player-hand');
    const dealerHandElement = document.getElementById('dealer-hand');
    const dealButton = document.getElementById('deal-button');
    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const messageElement = document.getElementById('message');
    const deckCountElement = document.getElementById('deck-count');
    
    // Update the display of card count
    function updateCardCount() {
      deckCountElement.textContent = game.getRemainingCards();
    }
    
    // Display a hand in the specified container
    function displayHand(hand, container) {
      container.innerHTML = '';
      const cardElements = game.getCardElements(hand);
      cardElements.forEach(cardElement => {
        container.appendChild(cardElement);
      });
    }
    
    // Update the game display
    function updateDisplay() {
      displayHand(game.playerHand, playerHandElement);
      displayHand(game.dealerHand, dealerHandElement);
      updateCardCount();
    }
    
    // Set button states based on game state
    function updateControls(enableDeal, enableGame) {
      dealButton.disabled = !enableDeal;
      hitButton.disabled = !enableGame;
      standButton.disabled = !enableGame;
    }
    
    // Display a message
    function showMessage(msg) {
      messageElement.textContent = msg;
    }
    
    // Start a new round
    dealButton.addEventListener('click', () => {
      const result = game.dealInitialCards();
      updateDisplay();
      
      switch(result) {
        case "blackjack":
          showMessage("Blackjack! You win!");
          updateControls(true, false);
          break;
        case "push":
          showMessage("Both have Blackjack! Push.");
          updateControls(true, false);
          break;
        default:
          showMessage("Your turn. Hit or Stand?");
          updateControls(false, true);
      }
    });
    
    // Hit button - draw another card
    hitButton.addEventListener('click', () => {
      const result = game.hit();
      updateDisplay();
      
      switch(result) {
        case "bust":
          showMessage("Bust! You went over 21. Dealer wins.");
          updateControls(true, false);
          break;
        case "twenty-one":
          showMessage("21! Standing automatically.");
          standButton.click(); // Automatically stand if player hits 21
          break;
      }
    });
    
    // Stand button - end player turn and play dealer turn
    standButton.addEventListener('click', () => {
      const result = game.stand();
      updateDisplay();
      
      switch(result) {
        case "dealer-bust":
          showMessage("Dealer busts! You win!");
          break;
        case "dealer-wins":
          showMessage("Dealer wins!");
          break;
        case "player-wins":
          showMessage("You win!");
          break;
        case "push":
          showMessage("Push - it's a tie!");
          break;
      }
      
      updateControls(true, false);
    });
    
    // Initial setup
    updateCardCount();
    updateControls(true, false);
    showMessage("Click 'Deal' to start a new game");
  });