import { createCardElement } from '../modules/CardComponent.js';

const suits = ['♠', '♥', '♣', '♦'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const values = {
    '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

let deck, playerHand, dealerHand, playerStands, gameOver;

const dealerEl = document.getElementById('dealer-cards');
const playerEl = document.getElementById('player-cards');
const dealerScoreEl = document.getElementById('dealer-score');
const playerScoreEl = document.getElementById('player-score');
const statusEl = document.getElementById('status');

document.getElementById('hit').onclick = hit;
document.getElementById('stand').onclick = stand;
document.getElementById('restart').onclick = startGame;

function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

function dealCard(hand) {
    const card = deck.pop();
    hand.push(card);
    return card;
}

function getHandValue(hand) {
    let value = 0, aces = 0;
    for (const card of hand) {
        value += values[card.rank];
        if (card.rank === 'A') aces++;
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    return value;
}

function renderHands() {
    playerEl.innerHTML = '';
    dealerEl.innerHTML = '';

    for (const card of playerHand) {
        playerEl.appendChild(createCardElement(card));
    }

    dealerHand.forEach((card, i) => {
        const isHidden = i === 0 && !gameOver;
        dealerEl.appendChild(createCardElement(isHidden ? { rank: '?', suit: '' } : card));
    });

    playerScoreEl.textContent = `Score: ${getHandValue(playerHand)}`;
    dealerScoreEl.textContent = `Score: ${gameOver ? getHandValue(dealerHand) : '?'}`;
}

function checkGameEnd() {
    const playerVal = getHandValue(playerHand);
    const dealerVal = getHandValue(dealerHand);

    if (playerVal > 21) {
        statusEl.textContent = 'You busted!';
        gameOver = true;
    } else if (playerStands) {
        while (getHandValue(dealerHand) < 17) {
            dealCard(dealerHand);
        }
        const dealerVal = getHandValue(dealerHand);
        const outcome = dealerVal > 21 ? 'Dealer busted! You win!' :
                        dealerVal > playerVal ? 'Dealer wins.' :
                        dealerVal < playerVal ? 'You win!' : 'Push (tie).';

        statusEl.textContent = outcome;
        gameOver = true;
    }

    renderHands();
}

function hit() {
    if (gameOver || playerStands) return;
    dealCard(playerHand);
    checkGameEnd();
}

function stand() {
    if (gameOver) return;
    playerStands = true;
    checkGameEnd();
}

function startGame() {
    deck = createDeck();
    playerHand = [dealCard([]), dealCard([])];
    dealerHand = [dealCard([]), dealCard([])];
    playerStands = false;
    gameOver = false;
    statusEl.textContent = 'Game in progress...';
    renderHands();
}

startGame();
