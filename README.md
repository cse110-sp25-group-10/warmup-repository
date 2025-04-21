# Documentation
Our website can be found at [https://cse110-sp25-group-10.github.io/warmup-repository/](https://cse110-sp25-group-10.github.io/warmup-repository/)

## Nav
[HTML Structure](#html-structure)

[Card Component Usage](#card-component-usage)

[JavaScript Functions](#javascript-functions)

## HTML Structure
`<content-container>`: Where the main game is contained 

`<dealer-container>`: Where the dealer's hand is contained

`<player-container>`: Where the player's hand is contained

`<ui-container>`: Where the UI is contained


## Card Component Usage
SUIT: The suit of the card ("clubs", "diamonds", "spades", "hearts").

Value: The numeric value of the card (1-13).
### Creating a Card Component in HTML:
```
<card-component data-suit="SUIT" data-value="VALUE"></card-component>
```

### Creating a Card Component in JavaScript:
```
const card = document.createElement("card-component");
card.setAttribute("data-suit", "SUIT");
card.setAttribute("data-suit", "VALUE");
target.appendChild(card); // target is the element you want to append the card to
```

## JavaScript Functions
`createCard(suit, value)`: Returns a detatched Card Component HTMLElement.
