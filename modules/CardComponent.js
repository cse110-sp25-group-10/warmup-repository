export function createCardElement(card) {
    const div = document.createElement('div');
    div.className = 'card';
    div.textContent = card.rank === '?' ? '?' : `${card.rank}${card.suit}`;
    return div;
}
