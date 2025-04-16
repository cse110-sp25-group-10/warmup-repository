const SUITS = ["clubs", "spades", "hearts", "diamonds"];
const deck = [];

window.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.querySelector("card-container");
    const handContainer = document.querySelector("hand-container");
    const shuffleBtn = document.querySelector("#shuffleBtn");
    const drawBtn = document.querySelector("#drawBtn");
    const resetBtn = document.querySelector("#resetBtn");

    initGame();

    shuffleBtn.addEventListener("click", shuffleDeck);
    drawBtn.addEventListener("click", drawCard);
    resetBtn.addEventListener("click", initGame);

    // returns a card component
    function createCard(suit, value) {
        const card = document.createElement("card-component");
        card.setAttribute("data-suit", suit);
        card.setAttribute("data-value", value);
        return card;
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Displays all the cards in the deck
    function displayDeck() {
        cardContainer.replaceChildren();
        for (let card of deck) {
            cardContainer.append(createCard(card["suit"], card["value"]));
        }
    }


    // Shuffles the deck
    function shuffleDeck() {
        shuffleArray(deck);
        displayDeck();
    }

    // draw a card
    function drawCard() {
        let card = deck.pop();
        handContainer.appendChild(createCard(card["suit"], card["value"]));
        displayDeck();
    }

    function initGame() {
        deck.length = 0;
        // initialize deck
        for (let suit of SUITS) {
            for (let i = 1; i < 14; i++) {
                let card = {
                    "suit": suit,
                    "value": i
                };
                deck.push(card);
            }
        }
        displayDeck();
        handContainer.replaceChildren();
    }

});