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

    // Get player money count using local storage
    let playerMoney;
    let currentBet = 10;
    if (localStorage.getItem("playerMoney")) {
        playerMoney = localStorage.getItem("playerMoney")*1;
        
    } else {
        playerMoney = 2500;
        localStorage.setItem("playerMoney", "2500")
    }  

    // Main references
    const playerContainer = document.querySelector("player-container");
    const playerCount = document.querySelector("#playerCount");
    const dealerContainer = document.querySelector("dealer-container");
    const dealerCount = document.querySelector("#dealerCount");

    // Status bar references
    const playerMoneyText = document.querySelector("#playerMoneyTotal");
    const betInput = document.querySelector("#betAmount");
    const betNotification = document.querySelector("#betNotification");

    // Button References
    const hitBtn = document.querySelector("#hitBtn");
    const standBtn = document.querySelector("#standBtn");
    const dialogCloseBtn = document.querySelector("dialog > nav > button");
    const dealBtn = document.querySelector("#dealBtn");

    // Betting button references
    const betDownButtons = {
        500: document.querySelector("#bet-down-500"),
        100: document.querySelector("#bet-down-100"),
        10: document.querySelector("#bet-down-10"),
        1: document.querySelector("#bet-down-1")
    };
    const betUpButtons = {
        1: document.querySelector("#bet-up-1"),
        10: document.querySelector("#bet-up-10"),
        100: document.querySelector("#bet-up-100"),
        500: document.querySelector("#bet-up-500")
    };

    // Menu References
    const menuDialog = document.querySelector("dialog");
    const gameResultText = document.querySelector("#gameResult");

    // Update player money text and bet input
    playerMoneyText.textContent = `${playerMoney}`;
    betInput.value = currentBet;

    let notificationTimeout = null;

    // Function to show notification
    function showNotification(message, duration = 3000) {
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        betNotification.textContent = message;
        betNotification.classList.add("show");
        
        notificationTimeout = setTimeout(() => {
            betNotification.classList.remove("show");
        }, duration);
    }

    // Add functionality to buttons
    hitBtn.addEventListener("click", playerHit);
    standBtn.addEventListener("click", playerStand);
    dealBtn.addEventListener("click", () => validateBet());

    // Add betting button event listeners
    Object.entries(betDownButtons).forEach(([amount, button]) => {
        button.addEventListener("click", () => adjustBet(-parseInt(amount)));
    });
    Object.entries(betUpButtons).forEach(([amount, button]) => {
        button.addEventListener("click", () => adjustBet(parseInt(amount)));
    });

    // Add input event listener
    betInput.addEventListener("input", () => {
        if (!gameActive) {
            const inputValue = parseInt(betInput.value) || 0;
            if (inputValue > playerMoney) {
                showNotification(`Maximum bet is $${playerMoney}`);
                betInput.value = playerMoney;
                currentBet = playerMoney;
            } else if (inputValue < 1) {
                showNotification("Minimum bet is $1");
                betInput.value = 1;
                currentBet = 1;
            } else {
                currentBet = inputValue;
                betNotification.classList.remove("show");
            }
            updateBetButtons();
        }
    });

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

        let drawCardSFX = new Audio("assets/sounds/drawCard.mp3#t=0.3");
        drawCardSFX.volume = 0.2;
        drawCardSFX.play();

        playerCount.textContent = `${playerScore}`;
        card.setAttribute("class", "flipped");
        playerContainer.appendChild(card);

        if (playerScore > 21) {
            playerAction = false;

            // Change state of buttons once playerAction is false
            updateGameButtons();
            // Dealer doesn't show other card in casinos because card counting
            // await delay(800);
            // const hiddenCard = dealerContainer.lastChild;
            // hiddenCard.setAttribute("class", "revealed");
            // dealerCount.textContent = `${dealerScore}`;
            await delay(800);
            gameResult("lose");
        }
        drawCardSFX = null;
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

    // Function to adjust bet amount
    function adjustBet(amount) {
        if (!gameActive) {
            const newBet = currentBet + amount;
            if (newBet > playerMoney) {
                showNotification(`Maximum bet is $${playerMoney}`);
                betInput.value = playerMoney;
                currentBet = playerMoney;
            } else if (newBet < 1) {
                showNotification("Minimum bet is $1");
                betInput.value = 1;
                currentBet = 1;
            } else {
                currentBet = newBet;
                betInput.value = currentBet;
                betNotification.classList.remove("show");
            }
            updateBetButtons();
        }
    }

    // Function to update betting buttons state
    function updateBetButtons() {
        // Disable decrease buttons if bet would go below 1
        Object.entries(betDownButtons).forEach(([amount, button]) => {
            button.disabled = gameActive || (currentBet - parseInt(amount) < 1);
        });

        // Disable increase buttons if bet would exceed player's money
        Object.entries(betUpButtons).forEach(([amount, button]) => {
            button.disabled = gameActive || (currentBet + parseInt(amount) > playerMoney);
        });
    }

    // Function to update state of hit and stand buttons
    function updateGameButtons() {
        // Disable hit, stand, and deal buttons accordingly
        hitBtn.disabled = !playerAction;
        standBtn.disabled = !playerAction;
    }

    // Keep deal button updated, states are at different times from hit and stand
    function updateDealButton() {
        dealBtn.disabled = gameActive;
    }

    // validate the bet amount
    function validateBet() {
        const inputValue = parseInt(betInput.value) || 0;
        if (!gameActive) {
            if (inputValue > playerMoney) {
                showNotification(`Maximum bet is $${playerMoney}`);
                return;
            } else if (inputValue < 1) {
                showNotification("Minimum bet is $1");
                return;
            }
            currentBet = inputValue;
            betNotification.classList.remove("show");
            initGame();
            updateBetButtons();
        }
    }

    // initialize the game with an empty hand and a shuffled deck.
    async function initGame() {
        if (!gameActive) {
            gameActive = true;
            // Disable betting buttons and deal button during game
            updateDealButton();
            updateBetButtons();
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

                let drawCardSFX = new Audio("assets/sounds/drawCard.mp3#t=0.3");
                drawCardSFX.volume = 0.2;
                drawCardSFX.play();

                if (cardValue > 10) {
                    dealerScore += 10;
                } else if (cardValue === 1) {
                    dealerScore += 11;
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
                drawCardSFX = null;
            }

            hitCard();
            await delay(500);
            hitCard();
            playerAction = true;
            updateGameButtons();
        }
    }


    function playerStand() {
        if (playerAction) {
            // If standing, player cannot act anymore, and the buttons should be greyed out
            playerAction = false;
            updateGameButtons();

            dealerTurn();
        }
    }

    // Runs when the player hits stand, deals cards until score is higher than the player and less than 17
    async function dealerTurn() {
        playerAction = false;
        
        // Changes the state of the buttons since playerAction is false now
        updateGameButtons();

        // Reveal dealer's other card
        const hiddenCard = dealerContainer.lastChild;
        hiddenCard.setAttribute("class", "revealed");
        dealerCount.textContent = `${dealerScore}`;

        await delay(800);
        if (dealerScore >= 17) {
            if (dealerScore > 21 || (dealerScore < playerScore)) {
                gameResult("win");
                return;
            } else if ((dealerScore === playerScore)) {
                gameResult("draw");
                return;
            } else if (dealerScore > playerScore) {
                gameResult("lose");
                return;
            }
        }
        
        while (dealerScore < 17 && dealerScore <= playerScore) {
            let cardJS = deck.pop();
            let cardValue = cardJS['value'];
            const card = createCard(cardJS['suit'], cardValue);
            if (cardValue > 10) {
                dealerScore += 10;
            } else if (cardValue === 1) {
                dealerScore += 11;
                dealerAceCount++;
            } else {
                dealerScore += cardValue;
            }

            if (dealerScore > 21 && dealerAceCount > 0) {
                dealerAceCount--;
                dealerScore -= 10; 
            }

            let drawCardSFX = new Audio("assets/sounds/drawCard.mp3#t=0.3");
            drawCardSFX.volume = 0.2;
            drawCardSFX.play();

            card.setAttribute("class", "flippedDealer");   
            dealerCount.textContent = `${dealerScore}`;           
            dealerContainer.appendChild(card);

            await delay(800);
                drawCardSFX = null;

            if (dealerScore > 21 || (dealerScore >= 17 && dealerScore < playerScore)) {
                gameResult("win");
                return;
            } else if ((dealerScore === playerScore) && (dealerScore >= 17)) {
                gameResult("draw");
                return;
            } else if (dealerScore > playerScore) {
                gameResult("lose");
                return;
            }
        }
    }


    /** || Menu Functions */
    // Displays the appropriate result in the menu
    function gameResult(result) {
        gameActive = false;

        playerAction = false
        updateGameButtons();


        if (result === "win") {
            gameResultText.textContent = "You Win!";
            playerMoney += currentBet;
        } else if (result === "lose") {
            gameResultText.textContent = "You Lose!";
            playerMoney -= currentBet;
        } else {
            gameResultText.textContent = "Draw!";
        }
        if (playerMoney === 0) {
            gameResultText.textContent = "Game Over";
            playerMoney = 2500;
            localStorage.setItem("playerMoney", playerMoney);
             playerMoneyText.textContent = `${playerMoney}`;
        } else {
            localStorage.setItem("playerMoney", playerMoney);
            playerMoneyText.textContent = `${playerMoney}`;
        }
        menuDialog.showModal();
        updateBetButtons(); // Enable betting buttons after game ends
        updateDealButton(); // Enable dealing button again after game end
    }

    function closeDialog() {
        menuDialog.close();
        updateBetButtons(); // Enable betting buttons after game ends
    }

    /** || Animation Functions */
    function delay(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("resolved");
            }, time)
        });
    }

    // Initial button state updates
    updateBetButtons();
    updateGameButtons();
    updateDealButton();
});