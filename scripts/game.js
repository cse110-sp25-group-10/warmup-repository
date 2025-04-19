window.addEventListener("DOMContentLoaded", () => {
    // Game variables
    const SUITS = ["clubs", "spades", "hearts", "diamonds"];
    const deck = [];
    let playerAceCount = 0;
    let playerScore = 0;
    let dealerScore = 0;
    let dealerAceCount = 0;
    let playerAction = false;
    let gameActive = false;

    // Main references
    const playerContainer = document.querySelector("player-container");
    const playerCount = document.querySelector("#playerCount");
    const dealerContainer = document.querySelector("dealer-container");
    const dealerCount = document.querySelector("#dealerCount");

    // Button References
    const hitBtn = document.querySelector("#hitBtn");
    const standBtn = document.querySelector("#standBtn");
    const dialogCloseBtn = document.querySelector("dialog > nav > button");
    const dealBtn = document.querySelector("#dealBtn");

    // Menu References
    const menuDialog = document.querySelector("dialog");
    const gameResultText = document.querySelector("#gameResult");

    // Add functionality to buttons
    hitBtn.addEventListener("click", playerHit);
    standBtn.addEventListener("click", playerStand);
    dealBtn.addEventListener("click", initGame);

    // Dialog functionality
    dialogCloseBtn.addEventListener("click", closeDialog);

    /** || Card Functions */

    // Returns a card component
    function createCard(suit, value) {
        const card = document.createElement("card-component");
        card.setAttribute("data-suit", suit);
        card.setAttribute("data-value", value);
        card.setAttribute("class", "unflipped");
        return card;
    }

    // prevent player from hitting when they can't
    function playerHit() {
        if (playerAction) {
            hitCard();
        }
    }

    // Hit a card (players)
    async function hitCard() {
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
            playerAction = false;
            await delay(800);
            const hiddenCard = dealerContainer.lastChild;
            hiddenCard.setAttribute("class", "revealed");
            await delay(800);
            gameResult("lose");
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
    async function initGame() {
        if (!gameActive) {
            gameActive = true;
            // reset variables
            deck.length = 0;
            playerScore = 0;
            playerAceCount = 0;
            dealerScore = 0;
            dealerAceCount = 0;

            // reset scores
            playerCount.textContent = `${playerScore}`;
            dealerCount.textContent = `${dealerScore}`;  

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
            // removes all previous cards
            playerContainer.replaceChildren();
            dealerContainer.replaceChildren();

            // add 1 visible and non-visible card to the dealer and 2 for the player
            for (let cards = 0; cards < 2; cards++) {
                let cardJS = deck.pop();
                let cardValue = cardJS['value'];
                const card = createCard(cardJS['suit'], cardValue);

                if (cardValue > 10) {
                    dealerScore += 10;
                } else if (cardValue === 1) {
                    cardValue += 11;
                    dealerAceCount++;
                } else {
                    dealerScore += cardValue;
                }

                if (cards === 0) {
                    card.setAttribute("class", "flippedDealer");   
                    dealerCount.textContent = `${dealerScore}`;           
                } else {
                    card.setAttribute("class", "hidden");
                }
                dealerContainer.appendChild(card);
                await delay(500);
            }

            hitCard();
            await delay(500);
            hitCard();
            playerAction = true;
        }
    }


    function playerStand() {
        if (playerAction) {
            dealerTurn();
        }
    }

    // Runs when the player hits stand, deals cards until score is higher than the player and less than 17
    async function dealerTurn() {
        playerAction = false;
        const hiddenCard = dealerContainer.lastChild;
        hiddenCard.setAttribute("class", "revealed");
        dealerCount.textContent = `${dealerScore}`;
        await delay(800);
        if (dealerScore < playerScore) {
            while (dealerScore < 17 && dealerScore < playerScore) {
                let cardJS = deck.pop();
                let cardValue = cardJS['value'];
                const card = createCard(cardJS['suit'], cardValue);
                if (cardValue > 10) {
                    dealerScore += 10;
                } else if (cardValue === 1) {
                    cardValue += 11;
                    dealerAceCount++;
                } else {
                    dealerScore += cardValue;
                }
                card.setAttribute("class", "flippedDealer");   
                dealerCount.textContent = `${dealerScore}`;           
                dealerContainer.appendChild(card);
                await delay(800);
            }
            if (dealerScore < playerScore) {
                gameResult("win");
            } else if (dealerScore > 21) {
                gameResult("win");
            } else if (dealerScore === playerScore) {
                gameResult("draw");
            } else {
                gameResult("lose");
            }
        } else if (playerScore === dealerScore) {
            gameResult("draw");
        } else {
            gameResult("lose")
        }
    }


    /** || Menu Functions */
    // Displays the appropriate result in the menu
    function gameResult(result) {
        gameActive = false;
        if (result === "win") {
            gameResultText.textContent = "You Win!";
        } else if (result === "lose") {
            gameResultText.textContent = "You Lose!";
        } else {
            gameResultText.textContent = "Draw!";
        }
        menuDialog.showModal();
    }

    function closeDialog() {
        menuDialog.close();
    }

    /** || Animation Functions */
    function delay(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, time)
        });
    }

});