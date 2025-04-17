# Documentation
## Nav
[Card Component Usage](#card-component-usage)

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
target.appendChild(card);
