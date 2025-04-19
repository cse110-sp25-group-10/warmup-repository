export function renderBlackjack() {
    return `
    <style>
        :host {
            /* ... existing styles ... */
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: white;
            display: flex;
            flex-direction: column;
            max-width: 920px; /* Slightly wider */
            width: 100%;
            margin: 18px auto; /* Slightly increased margin */
            padding: 12px; /* Slightly increased padding */
            padding-top: 25px; /* Slightly increased top padding */
            border-radius: 18px; /* Slightly larger radius */
            box-shadow: 0 11px 35px rgba(0, 0, 0, 0.38); /* Adjusted shadow */
            background: linear-gradient(145deg, #1b4d2e, #0f2b1a);
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(9px); /* Slightly more blur */
            box-sizing: border-box;
            /* min-height: 500px; Removed fixed min-height, let content dictate */
            max-height: 95vh; /* Limit height to viewport height */
            overflow: hidden; /* Prevent internal scroll */
        }

        .game-title {
            /* ... existing styles ... */
            text-align: center;
            font-size: 2.7rem; /* Increased title size */
            font-weight: 800;
            margin-top: 15px; /* Increased margin */
            margin-bottom: 20px; /* Increased margin */
            text-shadow: 2px 2px 7px rgba(0, 0, 0, 0.5);
            letter-spacing: 2.5px; /* Increased spacing */
            color: #ffffff;
            flex-shrink: 0;
        }

        .status-bar {
            /* ... existing styles ... */
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 18px; /* Increased gap */
            margin-bottom: 10px; /* Increased margin */
            padding: 7px 14px; /* Increased padding */
            background: rgba(255, 255, 255, 0.09);
            border-radius: 11px; /* Larger radius */
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(4.5px);
            flex-shrink: 0;
        }

        .game-area {
            /* ... existing styles ... */
            display: grid;
            grid-template-columns: 135px 1fr; /* Slightly wider deck column */
            gap: 12px; /* Increased gap */
            background: rgba(0, 0, 0, 0.18);
            padding: 12px; /* Increased padding */
            border-radius: 14px; /* Larger radius */
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: inset 0 1px 8px rgba(0, 0, 0, 0.18);
            flex-grow: 1; /* Allow game area to take remaining space */
            box-sizing: border-box;
            overflow-y: auto; /* Allow internal scroll ONLY if absolutely necessary */
            min-height: 0; /* Allow shrinking */
        }

        .deck-area {
            /* ... existing styles ... */
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center; /* Align to center vertically */
            background: rgba(255, 255, 255, 0.045);
            border-radius: 11px;
            padding: 10px; /* Increased padding */
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
            /* min-height: 180px; Removed fixed min-height */
            box-sizing: border-box;
            flex-shrink: 0; /* Don't shrink deck area */
        }

        /* Update deck placeholder size */
        .deck {
            width: 85px;  /* Larger card width */
            height: 119px; /* Larger card height */
            background: url('../assets/cards/back_dark.png') no-repeat center center; /* Use actual back image */
            background-size: cover; /* Ensure image covers the area */
            border-radius: 5.5px; /* Larger radius */
            box-shadow: 0 2.5px 6px rgba(0,0,0,0.22); /* Adjusted shadow */
            position: relative;
            perspective: 1000px;
            margin-bottom: 12px; /* Increased margin */
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            filter: drop-shadow(0 3.5px 7px rgba(0, 0, 0, 0.28));
            flex-shrink: 0;
        }

        .deck.shuffling {
            animation: shuffle-deck 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes shuffle-deck {
            0% {
                transform: rotate(0deg);
            }
            25% {
                transform: rotate(-15deg) translateX(-20px);
            }
            75% {
                transform: rotate(15deg) translateX(20px);
            }
            100% {
                transform: rotate(0deg);
            }
        }

        .deck:hover {
            /* ... existing styles ... */
            transform: translateY(-7px) scale(1.02); /* Adjusted hover effect */
            filter: drop-shadow(0 7px 14px rgba(0, 0, 0, 0.38));
        }

        .deck-count {
             /* ... existing styles ... */
            font-size: 0.95rem; /* Larger font */
            color: #ffffff;
            text-shadow: 1px 1px 2.5px rgba(0, 0, 0, 0.45);
            text-align: center;
            margin-top: 10px; /* Increased margin */
            padding: 7px 11px; /* Increased padding */
            background: rgba(255, 255, 255, 0.09);
            border-radius: 9px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(3.5px);
            flex-shrink: 0;
        }

        .main-area {
             /* ... existing styles ... */
            display: flex;
            flex-direction: column;
            gap: 10px; /* Increased gap */
            min-height: 0; /* Allow shrinking */
            flex-grow: 1; /* Allow main area to take space */
            overflow: hidden; /* Hide overflow within main area */
        }

        .hand-container {
             /* ... existing styles ... */
            position: relative;
            background: rgba(255, 255, 255, 0.045);
            padding: 12px; /* Increased padding */
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(3.5px);
            /* min-height: 150px; Removed fixed min-height */
            flex-shrink: 1; /* Allow shrinking if needed */
            flex-grow: 1; /* Allow growing slightly */
            box-sizing: border-box;
            display: flex; /* Use flex to manage internal elements */
            flex-direction: column; /* Stack hand and sum */
            min-height: 119px; /* Minimum height based on card */
        }

        .hand {
             /* ... existing styles ... */
            display: flex;
            gap: 40px; /* Reduced overlap */
            margin: 0;
            flex-wrap: nowrap; /* Prevent wrapping initially */
            overflow-x: auto; /* Allow scrolling if hand gets too long */
            padding-bottom: 9px; /* Space for scrollbar if needed */
            justify-content: flex-start;
            min-height: 119px; /* Match larger card height */
            align-items: flex-start;
            position: relative;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            flex-grow: 1; /* Allow hand to take space */
        }

         /* Style individual cards within the hand for overlap/positioning */
         .hand > playing-card {
             transition: transform 0.25s ease-out; /* Slightly slower transition */
             margin-left: -20px; /* Reduced overlap to match gap */
             width: 85px; /* Explicitly set width */
             height: 119px; /* Explicitly set height */
             flex-shrink: 0; /* Prevent cards from shrinking */
         }
         .hand > playing-card:first-child {
             margin-left: 0; /* No overlap for the first card */
         }


        /* ... rest of the styles (hand-sum, money, result, buttons, h3, keyframes) ... */
        .hand-sum {
            position: absolute;
            right: 15px; /* Adjust position */
            top: 15px;   /* Adjust position */
            background: rgba(0, 0, 0, 0.48);
            color: white;
            padding: 6px 12px; /* Increased padding */
            border-radius: 9px;
            font-weight: bold;
            font-size: 1.05rem; /* Larger font */
            text-shadow: 1px 1px 2.5px rgba(0, 0, 0, 0.55);
            border: 1px solid rgba(255, 255, 255, 0.22);
            backdrop-filter: blur(4.5px);
            box-shadow: 0 1.5px 7px rgba(0, 0, 0, 0.28);
            z-index: 10;
            flex-shrink: 0; /* Don't shrink sum display */
        }

        #money, #current-bet {
            font-size: 1.1rem; /* Larger font */
            font-weight: bold;
            color: #ffffff;
            text-shadow: 1px 1px 2.5px rgba(0, 0, 0, 0.45);
            opacity: 0;
            animation: pop-in 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            padding: 7px 14px; /* Increased padding */
            background: rgba(255, 255, 255, 0.09);
            border-radius: 9px;
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        #result {
            font-size: 1.6rem; /* Larger font */
            font-weight: 750; /* Slightly bolder */
            text-align: center;
            color: #ffffff;
            text-shadow: 1.5px 1.5px 5px rgba(0, 0, 0, 0.45);
            opacity: 0; /* Start hidden */
            transform: scale(0.8); /* Start slightly smaller */
            padding: 10px; /* Increased padding */
            background: rgba(255, 255, 255, 0.09);
            border-radius: 11px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(3.5px);
            box-shadow: 0 3.5px 12px rgba(0, 0, 0, 0.18);
            flex-shrink: 0; /* Don't shrink */
            /* min-height: 50px; Removed fixed min-height */
            box-sizing: border-box;
            margin-top: 8px; /* Increased margin */
            /* visibility: hidden; Initially hide until animated */
        }

        /* Add class to trigger animation */
        #result.show {
            opacity: 1;
            transform: scale(1);
            /* visibility: visible; */
            animation: pop-in-result 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .button-bar {
            display: flex;
            justify-content: center;
            gap: 11px; /* Increased gap */
            opacity: 0;
            animation: slide-in 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.45s;
            flex-shrink: 0;
            flex-wrap: wrap;
            margin-top: 8px; /* Increased margin */
        }

        .bet-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin: 7px 0 12px 0;
            opacity: 0;
            animation: slide-in 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.25s;
            flex-shrink: 0;
            flex-wrap: wrap;
        }

        .bet-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .bet-button {
            padding: 8px 12px;
            min-width: 70px;
            font-size: 0.9rem;
        }

        .deal-button {
            padding: 11px 35px;
            font-size: 1.1rem;
            background: linear-gradient(145deg, #5c6bc0, #3f51b5);
        }

        .deal-button:hover {
            background: linear-gradient(145deg, #7986cb, #5c6bc0);
        }

        .deal-button:active {
            background: linear-gradient(145deg, #3f51b5, #303f9f);
        }

        button {
            padding: 11px 22px; /* Slightly larger padding */
            font-size: 0.95rem; /* Slightly larger font */
            font-weight: bold;
            color: #ffffff;
            background: linear-gradient(145deg, #4caf50, #388e3c);
            border: none;
            border-radius: 7px; /* Larger radius */
            cursor: pointer;
            transition: all 0.18s ease-in-out;
            box-shadow: 0 3.5px 7px rgba(0, 0, 0, 0.19);
            text-shadow: 1px 1px 1.5px rgba(0, 0, 0, 0.28);
            letter-spacing: 0.4px; /* Increased spacing */
        }

        button:hover {
            background: linear-gradient(145deg, #66bb6a, #43a047);
            transform: translateY(-1.5px); /* Adjusted lift */
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.28);
        }

        button:active {
            transform: translateY(0.5px); /* Slight push down */
            box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.18);
            background: linear-gradient(145deg, #388e3c, #2e7d32);
        }

        button:disabled {
            background: linear-gradient(145deg, #757575, #616161);
            color: #bdbdbd;
            cursor: not-allowed;
            transform: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12); /* Adjusted shadow */
            text-shadow: none;
        }


        h3 {
            font-size: 1.2rem; /* Larger heading */
            margin: 0 0 0.5rem 0; /* Increased margin */
            font-weight: 650; /* Slightly bolder */
            color: #ffffff;
            text-shadow: 1.5px 1.5px 3.5px rgba(0, 0, 0, 0.45);
            opacity: 0;
            animation: fade-in 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            letter-spacing: 0.7px; /* Increased spacing */
            flex-shrink: 0;
        }

        /* --- Keyframes (unchanged) --- */
        @keyframes fade-in { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } } /* Adjusted animation */
        @keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } } /* Adjusted animation */
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.88); } 70% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } } /* Adjusted animation */
        @keyframes pop-in-result { 
            0% { opacity: 0; transform: scale(0.75); } 
            70% { transform: scale(1.1); } 
            100% { opacity: 1; transform: scale(1); } 
        }

        /* New animation for dealing cards */
        @keyframes dealCard {
            from {
                opacity: 0;
                /* Start from slightly above and to the left (relative to final position in hand) */
                transform: translate(-150px, -80px) rotate(-15deg) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
        }

        .deal-animation {
            /* Apply the dealCard animation */
            animation: dealCard 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; /* Speed up animation */
            /* Start invisible until animation begins */
            opacity: 0;
            /* Ensure it animates on top */
            z-index: 100;
        }


        /* --- Responsive Adjustments --- */
        @media (max-width: 768px) {
            :host {
                /* Adjusted mobile :host styles */
                padding: 8px; /* Increased */
                padding-top: 15px; /* Increased */
                margin: 0;
                border-radius: 0;
                min-height: 100vh; /* Keep full height for mobile */
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                max-height: none; /* Remove max-height limit on mobile */
            }

            .game-title {
                 font-size: 2.2rem; /* Larger mobile title */
                 margin-top: 8px;
                 margin-bottom: 12px;
                 letter-spacing: 1.5px;
            }

            .status-bar {
                gap: 12px;
                padding: 6px 12px;
                margin-bottom: 8px;
            }

            .game-area {
                grid-template-columns: 1fr;
                gap: 10px; /* Increased gap */
                padding: 10px; /* Increased padding */
                flex-grow: 1;
                overflow-y: auto; /* Keep scroll for mobile if needed */
            }

            .deck-area {
                 /* Keep horizontal layout, adjust size */
                flex-direction: row;
                justify-content: center; /* Already centered horizontally */
                align-items: center; /* Already centered vertically */
                gap: 12px; /* Increased gap */
                padding: 7px; /* Increased padding */
                min-height: auto;
                height: 110px; /* Larger mobile deck area */
            }

            /* Update mobile deck placeholder size */
            .deck {
                width: 70px;   /* Larger mobile card width */
                height: 98px; /* Larger mobile card height */
                margin-bottom: 0;
                border-radius: 4.5px;
                 /* background properties inherited */
            }

            .deck-count {
                font-size: 0.85rem;
                padding: 5px 9px;
                margin-top: 0; /* No top margin when horizontal */
            }

            .main-area {
                gap: 10px; /* Adjust gap */
            }

            .hand-container {
                padding: 10px; /* Adjust padding */
                /* min-height: 135px; Removed fixed min-height */
                min-height: 98px; /* Match larger mobile card height */
                border-radius: 12px;
            }

            .hand {
                min-height: 98px; /* Match new mobile card height */
                gap: -15px; /* Reduced mobile overlap */
                padding-bottom: 7px;
                /* overflow-x, nowrap inherited */
            }
             .hand > playing-card {
                 margin-left: -15px; /* Reduced mobile overlap */
                 width: 70px; /* Match mobile deck card size */
                 height: 98px; /* Match mobile deck card size */
             }
             .hand > playing-card:first-child {
                 margin-left: 0;
             }

            .button-bar, .bet-controls {
                 gap: 10px;
                 margin-top: 8px;
            }
            button {
                padding: 9px 18px; /* Larger mobile buttons */
                font-size: 0.9rem;
            }
            h3 {
                font-size: 1.1rem; /* Larger mobile headings */
                margin-bottom: 0.4rem;
            }
            .hand-sum {
                font-size: 0.95rem; /* Larger mobile sum */
                padding: 5px 9px;
                right: 12px;
                top: 12px;
            }
            #money, #current-bet {
                 font-size: 1rem; /* Larger mobile status */
                 padding: 6px 12px;
            }
            #result {
                font-size: 1.4rem; /* Larger mobile result */
                padding: 8px;
                margin-top: 7px;
            }
        }

        /* Game Over Popup Styles */
        .popup-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(5px);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }

        .popup-overlay.show {
            display: flex;
            opacity: 1;
            animation: fade-in 0.3s ease-in-out forwards;
        }

        .popup-content {
            background: linear-gradient(145deg, #2a623d, #1a472a);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            position: relative;
            margin: auto;
            width: 90%;
            max-width: 400px;
            transform: scale(0.8);
            opacity: 0;
            transition: all 0.3s ease-in-out;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }

        .popup-overlay.show .popup-content {
            transform: scale(1);
            opacity: 1;
        }

        .popup-title {
            font-size: 2rem;
            color: #ffffff;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .popup-message {
            font-size: 1.2rem;
            color: #ffffff;
            margin-bottom: 25px;
            line-height: 1.4;
        }

        .popup-button {
            background: linear-gradient(145deg, #4caf50, #388e3c);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .popup-button:hover {
            background: linear-gradient(145deg, #66bb6a, #43a047);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .popup-button:active {
            transform: translateY(1px);
        }

        @media (max-width: 768px) {
            .popup-content {
                width: 85%;
                padding: 20px;
            }

            .popup-title {
                font-size: 1.8rem;
            }

            .popup-message {
                font-size: 1.1rem;
            }

            .popup-button {
                padding: 10px 20px;
                font-size: 1rem;
            }
        }
    </style>

    <!-- HTML Structure remains the same -->

    <div class="status-bar">
        <div id="money">Money: $2500</div>
        <div id="current-bet">Current Bet: $10</div>
    </div>

    <div class="bet-controls">
        <div class="bet-group">
            <button id="bet-down-500" class="bet-button">-$500</button>
            <button id="bet-down-100" class="bet-button">-$100</button>
            <button id="bet-down-10" class="bet-button">-$10</button>
            <button id="bet-down-1" class="bet-button">-$1</button>
        </div>
        <button id="place-bet" class="deal-button">Deal</button>
        <div class="bet-group">
            <button id="bet-up-1" class="bet-button">+$1</button>
            <button id="bet-up-10" class="bet-button">+$10</button>
            <button id="bet-up-100" class="bet-button">+$100</button>
            <button id="bet-up-500" class="bet-button">+$500</button>
        </div>
    </div>

    <div class="game-area">
        <div class="deck-area">
            <div class="deck"></div>
            <div class="deck-count">52 cards</div>
        </div>

        <div class="main-area">
            <h3>Dealer's Hand</h3>
            <div class="hand-container">
                <div class="hand" id="dealer"></div>
                <div class="hand-sum" id="dealer-sum">0</div>
            </div>

            <h3>Your Hand</h3>
            <div class="hand-container">
                <div class="hand" id="player"></div>
                <div class="hand-sum" id="player-sum">0</div>
            </div>

            <div class="button-bar">
                <button id="hit" disabled>Hit</button>
                <button id="stand" disabled>Stand</button>
                <button id="reset">New Game</button>
            </div>

            <div id="result"></div>
        </div>
    </div>

    <div class="popup-overlay" id="gameOverPopup">
        <div class="popup-content">
            <div class="popup-title">Game Over!</div>
            <div class="popup-message">You're out of credits. <br>Starting fresh with $2,500.</div>
            <button class="popup-button" id="continueButton">New Game!</button>
        </div>
    </div>
    `;
}