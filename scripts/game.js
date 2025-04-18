// Game state
const gameState = {
    playerHand: [],
    dealerHand: [],
    deck: [],
    playerScore: 0,
    dealerScore: 0,
    gameActive: false,
    playerTurn: false,
    suits: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
    values: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
};

// DOM elements
const dealButton = document.getElementById('deal-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const messageEl = document.getElementById('message');

// Initialize game
function initGame() {
    // Set up event listeners
    dealButton.addEventListener('click', startNewGame);
    hitButton.addEventListener('click', playerHit);
    standButton.addEventListener('click', playerStand);
    
    // Set initial message
    setMessage('Click Deal to start the game!');
}

// Create a new shuffled deck
function createDeck() {
    const newDeck = [];
    
    gameState.suits.forEach(suit => {
        gameState.values.forEach(value => {
            newDeck.push({suit, value});
        });
    });
    
    return shuffleDeck(newDeck);
}

// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck(deck) {
    const shuffled = [...deck];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

// Draw a card from the deck
function drawCard(faceDown = false) {
    if (gameState.deck.length === 0) {
        gameState.deck = createDeck();
    }
    
    const card = gameState.deck.pop();
    return new CardComponent(card.suit, card.value, faceDown);
}

// Calculate the score of a hand
function calculateHandScore(hand) {
    let score = 0;
    let aces = 0;
    
    hand.forEach(cardComponent => {
        const value = cardComponent.value;
        
        if (value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(value)) {
            score += 10;
        } else {
            score += parseInt(value);
        }
    });
    
    // Adjust aces if needed
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    
    return score;
}

// Update the UI to show the player's score
function updatePlayerScore() {
    gameState.playerScore = calculateHandScore(gameState.playerHand);
    playerScoreEl.textContent = gameState.playerScore;
}

// Update the UI to show the dealer's score
function updateDealerScore(showAll = false) {
    if (showAll) {
        // Show the dealer's hidden card
        gameState.dealerHand.forEach(card => {
            if (card.faceDown) {
                card.flip();
            }
        });
    }
    
    gameState.dealerScore = calculateHandScore(gameState.dealerHand);
    dealerScoreEl.textContent = showAll ? gameState.dealerScore : '?';
}

// Set the message in the message area
function setMessage(message) {
    messageEl.textContent = message;
}

// Start a new game
function startNewGame() {
    // Clear previous game state
    gameState.playerHand = [];
    gameState.dealerHand = [];
    gameState.playerScore = 0;
    gameState.dealerScore = 0;
    gameState.playerTurn = true;
    gameState.gameActive = true;
    
    // Clear the card display areas
    playerCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    
    // Create a new deck if needed
    if (gameState.deck.length < 10) {
        gameState.deck = createDeck();
    }
    
    // Deal initial cards
    const playerCard1 = drawCard();
    const dealerCard1 = drawCard();
    const playerCard2 = drawCard();
    const dealerCard2 = drawCard(true); // Dealer's second card is face down
    
    gameState.playerHand.push(playerCard1, playerCard2);
    gameState.dealerHand.push(dealerCard1, dealerCard2);
    
    // Display cards
    playerCardsEl.appendChild(playerCard1.getElement());
    playerCardsEl.appendChild(playerCard2.getElement());
    dealerCardsEl.appendChild(dealerCard1.getElement());
    dealerCardsEl.appendChild(dealerCard2.getElement());
    
    // Update scores
    updatePlayerScore();
    updateDealerScore();
    
    // Update buttons
    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;
    
    // Check for blackjack
    if (gameState.playerScore === 21) {
        if (calculateHandScore([dealerCard1]) === 10 || calculateHandScore([dealerCard1]) === 11) {
            // Peek for dealer blackjack
            const dealerScore = calculateHandScore(gameState.dealerHand);
            if (dealerScore === 21) {
                endGame('push');
            } else {
                endGame('blackjack');
            }
        } else {
            endGame('blackjack');
        }
    }
    
    setMessage('Your turn! Choose to Hit or Stand');
}

// Player chooses to hit
function playerHit() {
    if (!gameState.playerTurn || !gameState.gameActive) return;
    
    const card = drawCard();
    gameState.playerHand.push(card);
    playerCardsEl.appendChild(card.getElement());
    
    updatePlayerScore();
    
    // Check if player busts
    if (gameState.playerScore > 21) {
        endGame('bust');
    }
}

// Player chooses to stand
function playerStand() {
    if (!gameState.playerTurn || !gameState.gameActive) return;
    
    gameState.playerTurn = false;
    dealerPlay();
}

// Dealer's turn
function dealerPlay() {
    // Reveal dealer's hidden card
    updateDealerScore(true);
    
    // Dealer draws until 17 or higher
    setTimeout(() => {
        const dealerDraw = () => {
            if (gameState.dealerScore < 17) {
                const card = drawCard();
                gameState.dealerHand.push(card);
                dealerCardsEl.appendChild(card.getElement());
                
                updateDealerScore(true);
                
                // Continue drawing with a delay
                setTimeout(dealerDraw, 500);
            } else {
                // Determine winner
                determineWinner();
            }
        };
        
        dealerDraw();
    }, 1000);
}

// Determine the winner
function determineWinner() {
    if (gameState.dealerScore > 21) {
        endGame('dealer-bust');
    } else if (gameState.dealerScore > gameState.playerScore) {
        endGame('dealer-win');
    } else if (gameState.dealerScore < gameState.playerScore) {
        endGame('player-win');
    } else {
        endGame('push');
    }
}

// End the game
function endGame(result) {
    gameState.gameActive = false;
    gameState.playerTurn = false;
    
    // Reveal dealer's hidden card if not already revealed
    updateDealerScore(true);
    
    // Disable game buttons
    hitButton.disabled = true;
    standButton.disabled = true;
    dealButton.disabled = false;
    
    // Handle different game outcomes
    switch (result) {
        case 'blackjack':
            setMessage('Blackjack! You win!');
            break;
        case 'bust':
            setMessage('Bust! You went over 21. Dealer wins.');
            break;
        case 'dealer-bust':
            setMessage('Dealer busts! You win!');
            break;
        case 'dealer-win':
            setMessage('Dealer wins with ' + gameState.dealerScore + '.');
            break;
        case 'player-win':
            setMessage('You win with ' + gameState.playerScore + '!');
            break;
        case 'push':
            setMessage('Push! It\'s a tie.');
            break;
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    gameState.deck = createDeck();
    initGame();
});