import { GameState } from './game-state.js';
import { renderBlackjack } from './render.js';
import './card.js'; // Imports PlayingCard

class BlackjackGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = new GameState();
        this.money = parseInt(localStorage.getItem('money') || '2500');
        this.currentBet = 10; // Default bet
        this.render();
    }

    connectedCallback() {
        // Wait briefly for elements to be fully rendered before initializing
        requestAnimationFrame(() => {
            // Initially disable game controls
            this.shadowRoot.querySelector('#hit').disabled = true;
            this.shadowRoot.querySelector('#stand').disabled = true;
            this.shadowRoot.querySelector('#reset').disabled = true;
            
            // Add event listeners for game controls
            this.shadowRoot.querySelector('#hit').addEventListener('click', () => this.hit());
            this.shadowRoot.querySelector('#stand').addEventListener('click', () => this.stand());
            this.shadowRoot.querySelector('#reset').addEventListener('click', () => this.resetGame());
            this.shadowRoot.querySelector('#place-bet').addEventListener('click', () => this.placeBet());
            this.shadowRoot.querySelector('#continueButton').addEventListener('click', () => this.handleGameOverContinue());
            
            // Add event listeners for betting controls
            const betAmounts = [1, 10, 100, 500];
            betAmounts.forEach(amount => {
                this.shadowRoot.querySelector(`#bet-up-${amount}`).addEventListener('click', () => this.adjustBet(amount));
                this.shadowRoot.querySelector(`#bet-down-${amount}`).addEventListener('click', () => this.adjustBet(-amount));
            });
            
            // Setup initial game state
            this.setupNewGame();
        });
    }

    async animateShuffle() {
        const deck = this.shadowRoot.querySelector('.deck');
        deck.classList.add('shuffling');
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 800));
        deck.classList.remove('shuffling');
    }

    setupNewGame() {
        // Clear the table
        const $player = this.shadowRoot.querySelector('#player');
        const $dealer = this.shadowRoot.querySelector('#dealer');
        $player.innerHTML = '';
        $dealer.innerHTML = '';
        
        // Reset the result display
        const resultEl = this.shadowRoot.querySelector('#result');
        resultEl.textContent = '';
        resultEl.classList.remove('show');
        resultEl.className = '';
        
        // Enable only betting controls with proper limits
        const betAmounts = [1, 10, 100, 500];
        betAmounts.forEach(amount => {
            this.shadowRoot.querySelector(`#bet-up-${amount}`).disabled = (this.currentBet + amount > this.money);
            this.shadowRoot.querySelector(`#bet-down-${amount}`).disabled = (this.currentBet - amount < 1);
        });
        this.shadowRoot.querySelector('#place-bet').disabled = false;
        
        // Disable game controls
        this.shadowRoot.querySelector('#hit').disabled = true;
        this.shadowRoot.querySelector('#stand').disabled = true;
        
        // Reset sums
        this.updateSums();
        this.state.resetDeck();
        // Animate shuffle and update deck count
        this.animateShuffle().then(() => {
            this.updateDeckCount();
        });
    }

    async placeBet() {
        // Disable betting controls
        const betAmounts = [1, 10, 100, 500];
        betAmounts.forEach(amount => {
            this.shadowRoot.querySelector(`#bet-up-${amount}`).disabled = true;
            this.shadowRoot.querySelector(`#bet-down-${amount}`).disabled = true;
        });
        this.shadowRoot.querySelector('#place-bet').disabled = true;
        
        // Animate shuffle before starting the game
        await this.animateShuffle();
        
        // Start the game
        await this.initGame();
    }

    showGameOverPopup() {
        const popup = this.shadowRoot.querySelector('#gameOverPopup');
        popup.classList.add('show');
    }

    hideGameOverPopup() {
        const popup = this.shadowRoot.querySelector('#gameOverPopup');
        popup.classList.remove('show');
    }

    handleGameOverContinue() {
        this.money = 2500; // Reset to new default amount
        localStorage.setItem('money', this.money);
        this.shadowRoot.querySelector('#money').textContent = `Money: $${this.money}`;
        this.hideGameOverPopup();
        this.setupNewGame();
    }

    resetGame() {
        if (this.money <= 0) {
            this.showGameOverPopup();
            return;
        }
        this.setupNewGame();
    }

    adjustBet(amount) {
        const newBet = this.currentBet + amount;
        if (newBet >= 1 && newBet <= this.money) {
            this.currentBet = newBet;
            // Update button states based on new bet amount
            const betAmounts = [1, 10, 100, 500];
            betAmounts.forEach(amt => {
                this.shadowRoot.querySelector(`#bet-up-${amt}`).disabled = (this.currentBet + amt > this.money);
                this.shadowRoot.querySelector(`#bet-down-${amt}`).disabled = (this.currentBet - amt < 1);
            });
            this.updateBetDisplay();
        }
    }

    updateBetDisplay() {
        this.shadowRoot.querySelector('#current-bet').textContent = `Current Bet: $${this.currentBet}`;
    }

    updateDeckCount() {
        this.shadowRoot.querySelector('.deck-count').textContent = `${this.state.remaining} cards`;
    }

    // Note: Simple visual delay, not a physics-based animation for now
    async dealCardAnimation(targetElement, cardElement, delay = 0) {
         // Position card initially off-screen or at deck position (optional)
         // For simplicity, just add it with a delay and maybe a CSS transition class

         return new Promise(resolve => {
            setTimeout(() => {
                // cardElement.classList.add('dealt'); // Remove old class
                cardElement.classList.add('deal-animation'); // Add the new animation class
                targetElement.appendChild(cardElement);

                // Remove the animation class after it finishes to avoid conflicts
                setTimeout(() => {
                    cardElement.classList.remove('deal-animation');
                    resolve(); // Resolve the promise *after* animation completes
                }, 300); // Match the updated animation duration from CSS (0.3s)

                // Resolve slightly after adding to allow rendering/CSS transition start
                // setTimeout(resolve, 50); // Remove this, resolve after animation
            }, delay);
         });
    }

    updateSums(revealDealer = false) {
        const playerSum = this.handValue(this.playerHand);
        this.shadowRoot.querySelector('#player-sum').textContent = playerSum;

        let dealerSumText = '';
        if (revealDealer) {
            dealerSumText = this.handValue(this.dealerHand).toString();
        } else if (this.dealerHand.length > 1) {
            // Show only the value of the visible (second) card
            const visibleCardValue = this.handValue([this.dealerHand[1]]);
            dealerSumText = `${visibleCardValue} + ?`;
        } else if (this.dealerHand.length === 1) {
             // Shouldn't happen in standard deal, but handle anyway
            dealerSumText = '?';
        } else {
            dealerSumText = '0';
        }
        this.shadowRoot.querySelector('#dealer-sum').textContent = dealerSumText;
    }

    async initGame() {
        if (this.money <= 0) {
            this.showGameOverPopup();
            return;
        }

        this.state.resetDeck();
        this.playerHand = [];
        this.dealerHand = [];

        // Enable game controls but keep betting controls disabled
        this.shadowRoot.querySelector('#hit').disabled = false;
        this.shadowRoot.querySelector('#stand').disabled = false;
        const betAmounts = [1, 10, 100, 500];
        betAmounts.forEach(amount => {
            this.shadowRoot.querySelector(`#bet-up-${amount}`).disabled = true;
            this.shadowRoot.querySelector(`#bet-down-${amount}`).disabled = true;
        });
        this.shadowRoot.querySelector('#place-bet').disabled = true;

        // Clear previous result and hands
        const resultEl = this.shadowRoot.querySelector('#result');
        resultEl.textContent = '';
        resultEl.classList.remove('show'); // Remove animation class on reset
        resultEl.className = ''; // Remove win/lose/draw classes
        const $player = this.shadowRoot.querySelector('#player');
        const $dealer = this.shadowRoot.querySelector('#dealer');
        $player.innerHTML = '';
        $dealer.innerHTML = '';

        // Reset sums
        this.updateSums();

        const dealDelay = 250; // ms between card deals

        // Deal cards in sequence
        for (let i = 0; i < 2; i++) {
            // Deal to player
            const playerCardData = this.state.drawCard(1)[0];
            this.playerHand.push(playerCardData);
            const playerCardElement = this.makeCard(playerCardData, false); // Start face down
            await this.dealCardAnimation($player, playerCardElement, i * dealDelay);
            // Flip player card after dealing animation + slight delay
            // setTimeout(() => playerCardElement.flip(true), 50); // Flip almost immediately after adding
            playerCardElement.flip(true); // Flip immediately after animation completes

            // Deal to dealer
            const dealerCardData = this.state.drawCard(1)[0];
            this.dealerHand.push(dealerCardData);
             // Only first dealer card stays face down *initially*
            const dealerCardElement = this.makeCard(dealerCardData, i === 0);
            await this.dealCardAnimation($dealer, dealerCardElement, i * dealDelay + 100);
            // Flip dealer's second card
            if (i === 1) {
                 // setTimeout(() => dealerCardElement.flip(true), 50);
                 dealerCardElement.flip(true); // Flip immediately after animation completes
            }
             // Update sums incrementally after each card is visible
             this.updateSums();
             this.updateDeckCount();
             await new Promise(res => setTimeout(res, 50)); // Small pause for visual pacing
        }


        this.updateBetDisplay();

        // Check for player blackjack *after* dealing finishes
        const playerValue = this.handValue(this.playerHand);
        if (playerValue === 21) {
            // If player has blackjack, reveal dealer's hand after a short delay
            setTimeout(async () => {
                const hiddenCardElement = $dealer.querySelector('playing-card[suit="back"]'); // Find the face-down card
                if (hiddenCardElement) {
                     hiddenCardElement.flip(true); // Flip it
                     await new Promise(res => setTimeout(res, 650)); // Wait for flip animation
                }
                this.updateSums(true); // Update sums showing full dealer value
                const dealerValue = this.handValue(this.dealerHand);
                if (dealerValue === 21) {
                    this.endGame('draw'); // Both have blackjack
                } else {
                    this.endGame('blackjack'); // Only player has blackjack
                }
            }, 800); // Delay before revealing dealer card on player blackjack
        }
    }

    async hit() {
        this.shadowRoot.querySelector('#hit').disabled = true; // Prevent double clicks
        const $player = this.shadowRoot.querySelector('#player');

        const newCardData = this.state.drawCard(1)[0];
        this.playerHand.push(newCardData);
        const cardElement = this.makeCard(newCardData, false); // Start face down

        await this.dealCardAnimation($player, cardElement, 0); // Deal immediately
        // setTimeout(() => cardElement.flip(true), 50); // Flip quickly
        cardElement.flip(true); // Flip immediately after animation

        this.updateDeckCount();
        this.updateSums();

        // Wait for flip animation to roughly finish before checking bust
        // await new Promise(res => setTimeout(res, 650)); // No longer needed as deal waits for anim

        const total = this.handValue(this.playerHand);
        if (total > 21) {
            this.endGame('lose');
        } else {
             this.shadowRoot.querySelector('#hit').disabled = false; // Re-enable hit
        }
    }

    async stand() {
         // Disable controls during dealer's turn
        this.shadowRoot.querySelector('#hit').disabled = true;
        this.shadowRoot.querySelector('#stand').disabled = true;
        const betAmounts = [1, 10, 100, 500];
        betAmounts.forEach(amount => {
            this.shadowRoot.querySelector(`#bet-up-${amount}`).disabled = true;
            this.shadowRoot.querySelector(`#bet-down-${amount}`).disabled = true;
        });
        this.shadowRoot.querySelector('#place-bet').disabled = true;

        const $dealer = this.shadowRoot.querySelector('#dealer');
        const hiddenCardElement = $dealer.querySelector('playing-card[suit="back"]'); // Find face-down card

        // Flip dealer's hidden card if it exists
        if (hiddenCardElement) {
            hiddenCardElement.flip(true);
            // Wait for flip animation before drawing more cards
            await new Promise(resolve => setTimeout(resolve, 650)); // Match flip duration
        }
        this.updateSums(true); // Show full dealer sum

        // Delay before dealer starts hitting (visual pacing)
        await new Promise(resolve => setTimeout(resolve, 400));

        // Dealer hits until 17 or more
        while (this.handValue(this.dealerHand) < 17) {
            const newCardData = this.state.drawCard(1)[0];
            this.dealerHand.push(newCardData);
            const cardElement = this.makeCard(newCardData, false); // Start face down

            await this.dealCardAnimation($dealer, cardElement, 0); // Deal immediately
            // setTimeout(() => cardElement.flip(true), 50); // Flip quickly
            cardElement.flip(true); // Flip immediately after animation

            this.updateDeckCount();
            this.updateSums(true); // Update sum after each hit

            // Wait for flip and a pause before next potential hit
            // await new Promise(resolve => setTimeout(resolve, 700)); // No longer needed? Flip is faster now
            await new Promise(resolve => setTimeout(resolve, 200)); // Shorter pause is likely fine
        }

        // Determine winner after dealer finishes
        const playerTotal = this.handValue(this.playerHand);
        const dealerTotal = this.handValue(this.dealerHand);

        if (dealerTotal > 21) {
            this.endGame('win');
        } else if (playerTotal > dealerTotal) {
            this.endGame('win');
        } else if (dealerTotal > playerTotal) {
            this.endGame('lose');
        } else {
            this.endGame('draw');
        }
    }

    makeCard(cardData, startFaceDown = true) {
        const card = document.createElement('playing-card');

        // Use data attributes to store the actual card identity
        card.setAttribute('data-actual-suit', cardData.suit);
        card.setAttribute('data-actual-value', cardData.value);

        // Set initial visual state via attributes (card.js reads these in connectedCallback)
        if (startFaceDown) {
            card.setAttribute('suit', 'back'); // Indicates it should start flipped
            card.setAttribute('value', 'dark'); // Generic value for back
            card.setAttribute('back', 'dark');
        } else {
             // If starting face up, set attributes directly (flip will happen in connectedCallback)
            card.setAttribute('suit', cardData.suit);
            card.setAttribute('value', cardData.value);
            card.setAttribute('back', 'light'); // Or keep dark if preferred
        }

        return card;
    }


    handValue(hand) {
        let value = 0;
        let aces = 0;
        for (const card of hand) { // Iterate over the card objects in the hand array
             // Ensure card and card.value exist
            if (!card || !card.value) continue;

            const val = card.value; // Get value from the card object
            if (['J', 'Q', 'K'].includes(val)) {
                value += 10;
            } else if (val === 'A') {
                aces += 1;
                value += 11; // Add 11 for Ace initially
            } else {
                // Ensure val is a number before parsing
                 const numVal = parseInt(val);
                 if (!isNaN(numVal)) {
                    value += numVal;
                 }
            }
        }
        // Adjust for Aces if value is over 21
        while (value > 21 && aces > 0) {
            value -= 10; // Change Ace from 11 to 1
            aces -= 1;
        }
        return value;
    }


    endGame(result) {
        // Ensure controls are disabled
        this.shadowRoot.querySelector('#hit').disabled = true;
        this.shadowRoot.querySelector('#stand').disabled = true;
        const betAmounts = [1, 10, 100, 500];
        betAmounts.forEach(amount => {
            this.shadowRoot.querySelector(`#bet-up-${amount}`).disabled = true;
            this.shadowRoot.querySelector(`#bet-down-${amount}`).disabled = true;
        });
        this.shadowRoot.querySelector('#place-bet').disabled = true;

        const resultText = this.shadowRoot.querySelector('#result');
        let outcomeClass = ''; // For potential styling

        // Clear previous classes and hide before setting new text
        resultText.classList.remove('show');
        resultText.className = '';

        // Use requestAnimationFrame to ensure the class removal is processed before adding it back
        requestAnimationFrame(() => {
            if (result === 'win') {
                const winAmount = this.currentBet;
                resultText.textContent = `You Win $${winAmount}!`;
                this.money += winAmount;
                outcomeClass = 'win';
            } else if (result === 'lose') {
                resultText.textContent = 'Dealer Wins!';
                this.money -= this.currentBet;
                outcomeClass = 'lose';
            } else if (result === 'blackjack') {
                const blackjackAmount = Math.floor(this.currentBet * 1.5);
                resultText.textContent = `Blackjack! You Win $${blackjackAmount}!`;
                // Standard Blackjack pays 3:2
                this.money += blackjackAmount;
                outcomeClass = 'win blackjack';
            } else { // Draw
                resultText.textContent = 'It\'s a draw.';
                outcomeClass = 'draw';
            }

            // Add outcome class (win/lose/draw) and the animation trigger class
            resultText.className = outcomeClass; // Add base class first
            resultText.classList.add('show'); // Add animation trigger class

            localStorage.setItem('money', this.money);
            this.shadowRoot.querySelector('#money').textContent = `Money: $${this.money}`;

            // Enable reset button for next game
            this.shadowRoot.querySelector('#reset').disabled = false;
        });
    }

    render() {
        this.shadowRoot.innerHTML = renderBlackjack();
        // Initial display updates after render
        this.updateBetDisplay();
        this.shadowRoot.querySelector('#money').textContent = `Money: $${this.money}`;
    }
}

customElements.define('black-jack', BlackjackGame);