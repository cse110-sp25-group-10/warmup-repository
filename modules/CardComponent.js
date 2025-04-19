/* IGNORE FILE: Moved contents of this file into game.js */
/********************************************/


/* Need DOM (document object model/interface) to help js interact with structure of html doc */
document.addEventListener("DOMContentLoaded", function() {
    /* in case of errors: console.log("JS is running!"); */
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

    /* make cards accessible through all files */
    window.card_files = card_files;

    /* This is all just to print the cards onto the page
    Create img for each file. document is an object that represents the entire HTML document (webpage)
    const div = document.getElementById("card-div");

    for (let i = 0; i < card_files.length; i++) {
        const file = card_files[i];
        const img = document.createElement("img");
        src is the source which would be in the assets folder
        img.src = "assets/cards/" + file;
         alt is important for when image can't be loaded 
        img.alt = file;
        div.appendChild(img);
    }*/

});