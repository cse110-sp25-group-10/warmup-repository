export class PlayingCard extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this._isFlipped = true; // Start flipped (showing back) by default convention
        this._isAnimating = false;
        this._actualSuit = '';
        this._actualValue = '';
        this._backStyle = 'dark';
    }

    static get observedAttributes() {
        // Observe actual card data and back style, but not for flipping
        return ['data-actual-suit', 'data-actual-value', 'back', 'size']; // Add size attribute if needed later
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'data-actual-suit':
                this._actualSuit = newValue;
                this._updateImage('front');
                break;
            case 'data-actual-value':
                this._actualValue = newValue;
                this._updateImage('front');
                break;
            case 'back':
                this._backStyle = newValue || 'dark';
                this._updateImage('back');
                break;
             // Example: If you wanted dynamic sizing via attribute
             // case 'size':
             //    this._updateSize(newValue);
             //    break;
        }
    }

    connectedCallback() {
        // Store initial attributes
        this._actualSuit = this.getAttribute('data-actual-suit') || this.getAttribute('suit'); // Fallback for initial setting
        this._actualValue = this.getAttribute('data-actual-value') || this.getAttribute('value'); // Fallback
        this._backStyle = this.getAttribute('back') || 'dark';

        this._render();
        this._attachEventListeners();

        // Set initial visual state based on whether suit is 'back'
        if (this.getAttribute('suit') !== 'back') {
             this.flip(true, false); // Flip immediately to front if not 'back' initially, no animation
        }
    }

    _render() {
        const frontImgSrc = `../assets/cards/${this._actualSuit}_${this._actualValue}.png`;
        const backImgSrc = `../assets/cards/back_${this._backStyle}.png`;

        this.shadow.innerHTML = `
            <style>
                /* Updated base card size */
                .playing-card {
                    width: 90px; /* Increased from 70px */
                    height: 126px; /* Increased from 98px */
                    perspective: 1000px;
                    background-color: transparent;
                    cursor: default;
                    user-select: none;
                    transition: transform 0.3s ease-out;
                    flex-shrink: 0; /* Prevent card from shrinking in flex layouts */
                }

                /* Adjust size for smaller screens if needed within the component,
                   or rely on parent container scaling/layout changes.
                   Example:
                   @media (max-width: 768px) {
                        .playing-card {
                             width: 80px; // Slightly smaller for mobile
                             height: 112px;
                        }
                   }
                */

                .card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
                    transform-style: preserve-3d;
                    border-radius: 6px; /* Slightly increased radius */
                    box-shadow: 0 3px 7px rgba(0,0,0,0.25); /* Slightly increased shadow */
                }

                .card-inner.is-flipped {
                    transform: rotateY(180deg);
                }

                .card-face {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 6px; /* Match inner radius */
                    overflow: hidden;
                }

                .card-face img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    pointer-events: none;
                }

                .card-front {
                    background-color: white;
                    transform: rotateY(0deg);
                }

                .card-back {
                    background-color: #eee;
                    transform: rotateY(180deg);
                }

                :host(.dealt) .card-inner {
                   /* Potential entry animation */
                }

            </style>
            <div class="playing-card">
              <div class="card-inner ${this._isFlipped ? 'is-flipped' : ''}">
                <div class="card-face card-front">
                  <img src="${frontImgSrc}" alt="${this._actualSuit} ${this._actualValue}" draggable="false" />
                </div>
                <div class="card-face card-back">
                  <img src="${backImgSrc}" alt="Card Back" draggable="false" />
                </div>
              </div>
            </div>
          `;

        this.cardInner = this.shadow.querySelector('.card-inner');
        this.cardElement = this.shadow.querySelector('.playing-card');
    }

    // Rest of the methods (_attachEventListeners, _updateImage, flip, disconnectedCallback) remain the same
    // ... (keep the existing methods from the previous version) ...
     _attachEventListeners() {
        this.cardInner.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform') {
                this._isAnimating = false;
                if (!this.cardElement.matches(':hover')) {
                    this.cardInner.style.transform = this.cardInner.classList.contains('is-flipped') ? 'rotateY(180deg)' : '';
                }
            }
        });

        this.cardElement.addEventListener('mousemove', (e) => {
            if (this._isAnimating) return;
            const rect = this.cardElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((y / rect.height) - 0.5) * -10;
            const baseRotate = this.cardInner.classList.contains('is-flipped') ? 'rotateY(180deg)' : '';
            this.cardInner.style.transform = `perspective(1000px) ${baseRotate} rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });

        this.cardElement.addEventListener('mouseleave', () => {
            if (!this._isAnimating) {
                this.cardInner.style.transform = this.cardInner.classList.contains('is-flipped') ? 'rotateY(180deg)' : '';
            }
        });
    }

    _updateImage(face) {
        if (!this.shadowRoot) return;

        if (face === 'front' && this._actualSuit && this._actualValue) {
            const frontImgEl = this.shadow.querySelector('.card-front img');
            if (frontImgEl) {
                frontImgEl.src = `../assets/cards/${this._actualSuit}_${this._actualValue}.png`;
                frontImgEl.alt = `${this._actualSuit} ${this._actualValue}`;
            }
        } else if (face === 'back') {
            const backImgEl = this.shadow.querySelector('.card-back img');
            if (backImgEl) {
                backImgEl.src = `../assets/cards/back_${this._backStyle}.png`;
            }
        }
    }

    flip(showFront = true, animate = true) {
        if (this._isAnimating || showFront === !this._isFlipped) {
             return;
        }

        if(animate) {
            this._isAnimating = true;
             this.cardInner.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
        } else {
             this.cardInner.style.transition = 'none';
        }

        this._isFlipped = !showFront;
        this.cardInner.classList.toggle('is-flipped', this._isFlipped);

        if (showFront) {
            this.setAttribute('suit', this._actualSuit);
            this.setAttribute('value', this._actualValue);
        } else {
            this.setAttribute('suit', 'back');
            this.setAttribute('value', this._backStyle);
        }

        this.dispatchEvent(new CustomEvent('cardFlip', {
            detail: { isFlipped: this._isFlipped },
            bubbles: true,
            composed: true
        }));

        if (!animate) {
             requestAnimationFrame(() => {
                 requestAnimationFrame(() => {
                     this.cardInner.style.transition = '';
                 });
             });
        }
    }

    disconnectedCallback() {
      // Clean up if necessary
    }
}

customElements.define('playing-card', PlayingCard);