window.addEventListener("DOMContentLoaded", () => {
    // Game variables
    const SUITS = ["clubs", "spades", "hearts", "diamonds"];
    const deck = [];
    let playerAceCount = 0;
    let playerScore = 0;


    // Main references
    const playerContainer = document.querySelector("player-container");
    const playerCount = document.querySelector("#playerCount");
    const hitBtn = document.querySelector("#hitBtn");

    // Initialize the game
    initGame();

    // Add functionality to buttons
    hitBtn.addEventListener("click", hitCard);


    /** || Card Functions */

    // Returns a card component
    function createCard(suit, value) {
        const card = document.createElement("card-component");
        card.setAttribute("data-suit", suit);
        card.setAttribute("data-value", value);
        card.setAttribute("class", "unflipped");
        return card;
    }

    // Hit a card
    function hitCard() {
        let cardJS = deck.pop();
        let cardValue = cardJS['value'];
        const card = createCard(cardJS['suit'], cardValue);

        if (cardValue > 10) {
            playerScore += 10;
        } else if (cardValue === 1) {
            playerScore += 11;
            playerAceCount++;
        } else {
            playerScore += cardValue;
        }
        
        if (playerScore > 21 && playerAceCount > 0) {
            playerAceCount--;
            playerScore -= 10; 
        }

        playerCount.textContent = `${playerScore}`;
        card.setAttribute("class", "flipped");
        playerContainer.appendChild(card);

        if (playerScore > 21) {
            initGame();
        }
    }


    /** || Deck Functions */

    // Randomize array in-place using Durstenfeld shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    /** || Game Functions */

    // initialize the game with an empty hand and a shuffled deck.
    function initGame() {
        deck.length = 0;
        playerScore = 0;
        playerAceCount = 0;
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
        shuffleArray(deck);
        playerContainer.replaceChildren();
    }

});