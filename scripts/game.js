const suits = ["hearts", "diamonds", "spades", "clubs"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

let deck = [];
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;
let playerChips = 1000;
let gameInProgress = false;
let betAmount = 100;

const cardBackImage = './assets/cards/back_dark.png';

function createDeck()
{
    const newDeck = []
    for(let suit of suits)
    {
        for(let rank of ranks)
        {
            newDeck.push({suit, rank});
        }
    }
    return shuffleDeck(newDeck);
}

function shuffleDeck(deck)
{
    for(let i = 0; i < deck.length; i++)
    {
        let shuffle = Math.floor(Math.random() * (deck.length));
        [deck[i], deck[shuffle]] = [deck[shuffle], deck[i]];
    }
    return deck;
}

function dealCard()
{
    return deck.pop();
}

function calculateScore(cards) {
    let score = 0;
    let aces = 0;
    
    for (let card of cards) {
        if (card.rank === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.rank)) {
            score += 10;
        } else {
            score += parseInt(card.rank);
        }
    }
    
    // Adjust ace values if needed
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    
    return score;
}

// Modfy showHand and UI function to make flip work
function showHand(hand, elementId, hideSecondCard = false) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    hand.forEach((card, index) => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'flip-card';

        const cardInner = document.createElement('div');
        cardInner.className = 'flip-card-inner';

        const front = document.createElement('div');
        front.className = 'flip-card-front';

        const back = document.createElement('div');
        back.className = 'flip-card-back';

        // Front shows the back of the card (hidden face)
        const frontImg = document.createElement('img');
        frontImg.src = cardBackImage;
        frontImg.alt = 'Card Back';
        frontImg.style.width = '100%';
        frontImg.style.height = '100%';

        // Back shows the actual card
        const backImg = document.createElement('img');
        const fileName = `${card.suit}_${card.rank}.png`;
        backImg.src = `./assets/cards/${fileName}`;
        backImg.alt = `${card.rank} of ${card.suit}`;
        backImg.style.width = '100%';
        backImg.style.height = '100%';

        front.appendChild(frontImg);
        back.appendChild(backImg);

        cardInner.appendChild(front);
        cardInner.appendChild(back);
        cardWrapper.appendChild(cardInner);

        // Optionally hide dealer’s second card
        if (hideSecondCard && index === 1) {
            backImg.src = cardBackImage;
            frontImg.src = cardBackImage;
        } else {
            // Flip the card to show front (face)
            cardInner.classList.add('flipped');
        }


        container.appendChild(cardWrapper);
    });
}

function updateUI() {
    // Update cards
    showHand(playerCards, 'player-cards');
    showHand(dealerCards, 'dealer-cards', gameInProgress);
    
    // Update scores
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = gameInProgress ? '?' : dealerScore;
    
    // Update chips
    document.getElementById('chips').textContent = playerChips;
}

// Start a new game
function startGame() {
    // Check if player has enough chips
    if (playerChips < betAmount) {
        messageElement.textContent = "Not enough chips to play!";
        return;
    }
    
    // Reset game state
    gameInProgress = true;
    deck = createDeck();
    playerCards = [];
    dealerCards = [];
    
    // Deal initial cards
    playerCards.push(dealCard(), dealCard());
    dealerCards.push(dealCard(), dealCard());
    
    // Calculate scores
    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore(dealerCards);
    
    // Place bet
    playerChips -= betAmount;
    
    // Update UI
    updateUI();
    
    // Enable/disable buttons
    document.getElementById('deal-button').disabled = true;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('hit-button').disabled = false;
    
    // Check for blackjack
    if (playerScore == 21) {
        endGame(true);
    } else {
        messageElement.textContent = "Will you hit or stand?";
    }
}

// Player hits
function playerHit() {
    playerCards.push(dealCard());
    playerScore = calculateScore(playerCards);
    updateUI();
    
    if (playerScore > 21) {
        endGame(false);
    } else if (playerScore == 21) {
        playerStand();
    }
}

function playerStand() {
    gameInProgress = false;

    // Reveal dealer's hidden card
    updateUI();

    // 🔁 Flip the second dealer card (if it exists)
    document.querySelectorAll('#dealer-cards .flip-card-inner')[1]?.classList.add('flipped');

    // Dealer's turn
    while (dealerScore < 17) {
        dealerCards.push(dealCard());
        dealerScore = calculateScore(dealerCards);
    }

    updateUI();

    // Determine winner
    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame(true);
    } else if (playerScore < dealerScore) {
        endGame(false);
    } else {
        endGame('push');
    }
}


// End the game
function endGame(result) {
    gameInProgress = false;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('deal-button').disabled = false;
    
    if (result == true) {
        // Player wins
        if (playerScore == 21 && playerCards.length == 2) {
            // Blackjack pays 3:2
            playerChips += betAmount * 2.5;
            messageElement.textContent = "21! You win!";
        } else {
            playerChips += betAmount * 2;
            messageElement.textContent = "You win!";
        }
    } else if (result == 'push') {
        // Push - return bet
        playerChips += betAmount;
        messageElement.textContent = "Tie game";
    } else {
        // Player loses
        messageElement.textContent = "Dealer wins!";
    }
    
    updateUI();
}

// Set up event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('deal-button').addEventListener('click', startGame);
    document.getElementById('hit-button').addEventListener('click', playerHit);
    document.getElementById('stand-button').addEventListener('click', playerStand);
    
    // Initialize the UI
    updateUI();
});