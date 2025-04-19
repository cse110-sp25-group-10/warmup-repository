//method to create a simple blackjack game using suits and values instead of images
const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// First initialize the deck and hands
// The deck of cards
let deck = []; 
// The player's hand
let playerHand = [];
// The dealer's hand
let dealerHand = [];


// Create a deck of cards and shuffle it
// The deck is an array of objects, each object has a suit and a value
// The player and dealer hands are arrays of cards
// The deck is shuffled by sorting it randomly
// The player and dealer hands are initialized to empty arrays
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck.sort(() => Math.random() - 0.5);
}

// Get the value of a card
// The value of a card is 10 for J, Q, K, and 11 for A
// The value of a card is the integer value for 2-10
// The value of a card is returned as an integer
function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

// Calculate the total value of a hand
// The value of a hand is the sum of the values of the cards in the hand
// If the value of the hand is greater than 21 and there are Aces in the hand
// The value of the hand is reduced by 10 for each Ace until the value is less than or equal to 21
// The value of the hand is returned as an integer
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') aces++;
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

// function to draw a card from the deck
// The card is removed from the deck and returned using the pop() method
function drawCard() {
    return deck.pop();
}

// Render the player's and dealer's hands
// The hands are rendered by creating a div for each card in the hand
// The div is given a class of card and the text content is set to the value and suit of the card
function renderHand(hand, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    hand.forEach(card => {
        const div = document.createElement('div');
        div.className = 'card';
        div.textContent = `${card.value}${card.suit}`;
        container.appendChild(div);
    });
}

// Check the result of the game
// The result is checked by comparing the values of the player's and dealer's hands
// If the player's hand is greater than 21, the player busts and the dealer wins
// If the dealer's hand is greater than 21, the dealer busts and the player wins
// If the player's hand is greater than the dealer's hand, the player wins
function checkResult() {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);
    const result = document.getElementById('result');

    if (playerValue > 21) {
        result.textContent = 'You Bust! Dealer Wins!';
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        result.textContent = 'You Win!';
    } else if (playerValue < dealerValue) {
        result.textContent = 'Dealer Wins!';
    } else {
        result.textContent = 'Push (Draw)';
    }
}

// Event listeners for the buttons
// The buttons are given event listeners that call the hit() and stand() functions
function hit() {
    // If the player has already busted or reached 21, do nothing
    if (calculateHandValue(playerHand) >= 21) return;
    // Draw a card from the deck and add it to the player's hand
    playerHand.push(drawCard());
    renderHand(playerHand, 'player-cards');
    // Check the result of the game
    if (calculateHandValue(playerHand) > 21) {
        checkResult();
    }
}

// The stand() function is called when the stand button is clicked
// The dealer's hand is drawn until the value is 17 or greater
// The dealer's hand is rendered and the result is checked
// The dealer's hand is drawn by calling the drawCard() function
function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }
    renderHand(dealerHand, 'dealer-cards');
    checkResult();
}

// The resetGame() function is called when the reset button is clicked
function resetGame() {
    playerHand = [];
    dealerHand = [];
    document.getElementById('result').textContent = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    startGame();
}

// The startGame() function is called when the start button is clicked
// The deck is created and shuffled
// The player and dealer hands are initialized to empty arrays
// The player and dealer hands are drawn by calling the drawCard() function
function startGame() {
    createDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard()];
    renderHand(playerHand, 'player-cards');
    renderHand(dealerHand, 'dealer-cards');
    document.getElementById('result').textContent = '';
}

startGame();
