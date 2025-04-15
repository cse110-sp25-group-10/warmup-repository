window.addEventListener("DOMContentLoaded", ()=> {
    const body = document.querySelector("body");
    const SUITS = ["clubs", "diamonds", "hearts", "spades"];
    for (let suit of SUITS) {
        for (let i = 1; i < 14; i++) {
            const card = document.createElement("card-component");
            if (i == 1) {
                card.setAttribute("data-image-url", `assets/cards/${suit}_A.png`);
            } else if (i <= 10) {
                card.setAttribute("data-image-url", `assets/cards/${suit}_${i}.png`);
            } else if (i == 11) {
                card.setAttribute("data-image-url", `assets/cards/${suit}_J.png`);
            } else if (i == 12) {
                card.setAttribute("data-image-url", `assets/cards/${suit}_Q.png`);
            } else {
                card.setAttribute("data-image-url", `assets/cards/${suit}_K.png`);
            } 
        body.appendChild(card); 
        }
    }
});