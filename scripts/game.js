/* Create images from the filenames! */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* !!! moved cardComponent into here cause its simpler !!! */

/* Need DOM (document object model/interface) to help js interact with structure of html doc */
document.addEventListener("DOMContentLoaded", function() {

    const suits = ["hearts", "spades", "clubs", "diamonds"];
    const numbers_and_other = ["J", "Q", "K", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    /* This will store the card files */
    const card_files = []

    suits.forEach(suit => {
        numbers_and_other.forEach(n_o => {
            const file = suit + "_" + n_o + ".png";
            card_files.push(file);
        })
    })

    /* !!! should dealer/player space be const if cards change?? */
    const start_button = document.getElementById("game-button");
    const dealer_space = document.getElementById("dealer-container");
    const player_space = document.getElementById("player-container");

    /* This is for getting a random card from the deck. */
    /* Math.random returns float, multiply by len of card deck and use Math.floor to round down */
    function get_card() {
        const index_float = Math.random() * card_files.length;
        const index = Math.floor(index_float);
        return "assets/cards/" + card_files[index];
    }

    /* function of start button */
    start_button.addEventListener("click", () => {

        /* Players random cards */
        for (let i = 0; i < 2; i++) {
            const player_card = document.createElement("img");
            const c_src = get_card();
            player_card.src = c_src
            player_space.appendChild(player_card);
        }

        /* Dealers random cards */
        for (let i = 0; i < 2; i++) {
            const dealer_card = document.createElement("img");
            const c_src = get_card();
            dealer_card.src = c_src
            dealer_space.appendChild(dealer_card);
        }
    });
});