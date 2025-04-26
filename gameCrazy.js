"use strict";

var playerTurn = true;
var playPile;
let gameText = $("#gameText");
var currentCpu = 1;
let gameOver = false;

$(document).ready( () => {
    let deck = new Deck();
    let player = new Entity("#playerZone", true);
    player.updateCardDisplay();
    let cpu1 = new Entity("#cpuZone1", false);
    cpu1.updateCardDisplay();
    let cpu2 = new Entity("#cpuZone2", false);
    cpu2.updateCardDisplay();
    let cpu3 = new Entity("#cpuZone3",false);
    cpu3.updateCardDisplay();

    playPile = new Pile("#playPile");
    playPile.updatePileDisplay();

    gameText = $("#gameText");

    // Game setup
    // deal out cards
    for (let i = 0; i < 5; i++) {
        player.recieveCard(deck.drawCard());
        cpu1.recieveCard(deck.drawCard());
        cpu2.recieveCard(deck.drawCard());
        cpu3.recieveCard(deck.drawCard());
    }
    // draw first card into pile
    playPile.addToPile(deck.drawCard());

    $("#continue").click( () => {
        if (!playerTurn) {
            switch (currentCpu) {
                case 1:
                    if (!cpuTurn(cpu1, currentCpu)) { 
                        // draw if no card to play
                        drawFromDeck(cpu1, deck, playPile);
                        gameText.text("CPU " + 1 + " drew a card.");
                    };
                    cpu1.updateCardDisplay();
                    playPile.updatePileDisplay();
                    currentCpu++;

                    if (cpu1.hand.length < 1) { // CPU won the game
                        gameText.text("CPU " + currentCpu + " wins!");
                        // lock all actions
                        currentCpu = 0;
                        playerTurn = false;
                        gameOver = true;
                    }
                    break;
                case 2:
                    if (!cpuTurn(cpu2, currentCpu)) {
                        // draw if no card to play
                        drawFromDeck(cpu2, deck, playPile);
                        gameText.text("CPU " + 2 + " drew a card.");
                    };
                    cpu2.updateCardDisplay();
                    playPile.updatePileDisplay();
                    currentCpu++;

                    if (cpu2.hand.length < 1) { // CPU won the game
                        gameText.text("CPU " + currentCpu + " wins!");
                        // lock all actions
                        currentCpu = 0;
                        playerTurn = false;
                        gameOver = true;
                    }
                    break;
                case 3:
                    if (!cpuTurn(cpu3, currentCpu)) {
                        // draw if no card to play
                        drawFromDeck(cpu3, deck, playPile);
                        gameText.text("CPU " + 3 + " drew a card.");
                    };
                    cpu3.updateCardDisplay();
                    playPile.updatePileDisplay();
                    currentCpu++;

                    if (cpu3.hand.length < 1) { // CPU won the game
                        gameText.text("CPU " + currentCpu + " wins!");
                        // lock all actions
                        currentCpu = 0;
                        playerTurn = false;
                        gameOver = true;
                    }
                    break;
                case 4:
                    currentCpu = 1;
                    playerTurn = true;
                    gameText.text("It's your turn.");
                    break;
                default:
                    break;
            }
        } else { // clicked continue during player turn
            let valid = false;
            player.hand.forEach(card => {
                if ((card.getSuit() == playPile.peekTopCard().getSuit()) || 
                (card.getRank() == playPile.peekTopCard().getRank()) ||
                (card.getRank() == 8)) {
                    valid = true;
                }
            });

            if (valid) {
                gameText.text("There is a card you may play.");
            } else {
                gameText.text("There is no cards to play. You drew a card.");
                drawFromDeck(player, deck, playPile);
                playerTurn = false;
            }
        }
    });
}); // end ready()


const cardClicked = (player, cardIndex) => {
    if (playerTurn) {
        const card = player.hand[cardIndex];
        if ((card.getSuit() == playPile.peekTopCard().getSuit()) || 
            (card.getRank() == playPile.peekTopCard().getRank()) ||
            (card.getRank() == 8)) {
            // valid card clicked
            playerTurn = false;
            playPile.addToPile(player.playCard(cardIndex));
            player.updateCardDisplay();
            gameText.text("You played a " + card.getRank() + ".\nPress 'Continue'");

            if (player.hand.length < 1) { // CPU won the game
                gameText.text("You win!");
                // lock all actions
                currentCpu = 0;
                playerTurn = false;
                gameOver = true;
            }
        } else {
            // invalid card
            gameText.text("Card must match color or number of the middle card.");
        }
    } else {
        if (!gameOver) {
            gameText.text("It is not your turn! Press 'Continue'.");
        }
    }
} 

const cpuTurn = (cpu, num) => {
    const topCard = playPile.peekTopCard();
    let j = 0;
    let found = false;
    cpu.hand.forEach(card => { // find and play first playable card
        if (!found) {
            if (card.getSuit() == topCard.getSuit() || 
            card.getRank() == topCard.getRank() ||
            card.getRank() == 8) {
            //found valid card
            playPile.addToPile(cpu.playCard(j));
            gameText.text("CPU " + num + " played a " + card.getRank() + ".");
            found = true;
            }
        }
        j++;
    });
    return found;
}

const drawFromDeck = (entity, deck, playPile) => { 
    // this is for a deck with a discard pile
    if (deck.cardList.length < 1) { // shuffle discard pile into deck
        // move each card except the first
        const cardToKeep = playPile.takeFromTop();
        playPile.cardList.forEach(card => {
            deck.addCard(card.getRank(), card.getSuit());
        });
        playPile.cardList = [];
        playPile.addToPile(cardToKeep);
        playPile.updatePileDisplay();
    }
    // draw normally
    entity.recieveCard(deck.drawCard());
    entity.updateCardDisplay();
}

/************************
******** CLASSES ********
*************************/

class Entity { // Class for computer and human players
    constructor(displayZoneID, isPlayer) {
        this.hand = [];
        this.count = 0;
        this.zone = displayZoneID;
        this.isPlayer = isPlayer;
    }

    recieveCard(card) {
        if (card != null) {
            this.hand.push(card);
            this.count += 1;
            this.updateCardDisplay();
        }
    }

    updateCardDisplay() {
        // clear previous display
        $(this.zone).empty();
        var i = 0;
        if (this.isPlayer) {
            this.hand.forEach(card => {
                // create card element for rendering
                const newCardElement = $('<button type="button" id="cardBtn' + i + '"></button>');
                // add card rank and suit classes to element for styles
                newCardElement.addClass("card");
                newCardElement.addClass(card.getSuit());
                newCardElement.text(card.getRank());

                // store card data in element
                newCardElement.data('cardIndex', i);
                newCardElement.click(() => { // onclick event for each card button
                    const cardData = $(newCardElement).data('cardIndex');
                    cardClicked(this, cardData);
                });
                $(this.zone).append(newCardElement);
                i++;
           });
        } else { // make stack of cards with just the number of cards
            $(this.zone).empty();
            // create card element for rendering
            const cardBackElement = $('<div></div>');
            // add card rank and suit classes to element for styles
            cardBackElement.addClass("card");
            cardBackElement.text(this.hand.length);
            $(this.zone).append(cardBackElement);
        }
    }

    playCard(cardIndex) {
        let card = this.hand[cardIndex];
        this.hand.splice(cardIndex, 1);
        this.count -= 1;
        this.updateCardDisplay();
        return card;
    }
}

class Deck { // Class for holding a list of card objects
    constructor(customCardString) {
        this.cardList = [];
        this.count = 0;
        if (customCardString == null) {
            // Make default deck of cards
            for (let i = 1; i <= 13; i++) {
                /*Aces are 1, Jacks are 11
                Queens are 12, Kings are 13
                H: Hearts, D: Diamonds, S: Spades, C: Clubs*/
                this.addCard(i, "H");
                this.addCard(i, "D");
                this.addCard(i, "S");
                this.addCard(i, "C");
                this.count += 4;
            }
            
        }
    }

    drawCard() {
        if (this.cardList.length <= 0) {
            return null;
        }
        var rand = Math.random();
        //alert("PRErand: " + rand + " length: " + this.cardList.length);
        rand = Math.floor(rand * this.cardList.length);
        //rand = rand - 1.0;
        //alert("PostRAnd: " + rand);

        let card = this.cardList[rand];
        this.cardList.splice(rand, 1);
        this.count -= 1;
        return card;
    }

    addCard(rank, suit) { // add card to the deck
        let addCard = new Card(rank, suit);
        this.cardList.push(addCard);
    }

    getCards() { // For testing
        var cardString = "";
        this.cardList.forEach(element => {
            cardString += element.getData();
        });
        return cardString;
    }
}

class Pile { // Like a deck, but tracks the top card.
    // Use for discard piles or anything else with face up card on top
    constructor(pileZoneID) {
        this.cardList = [];
        this.zone = pileZoneID;
    }

    addToPile(card) {
        if (card != null) {
            this.cardList.unshift(card);
            this.updatePileDisplay();
        }
    }

    takeFromTop() {
        if (this.cardList.length >= 1) {
            const removedCard = this.cardList.shift();
            this.updatePileDisplay();
            return removedCard;
        }
    }

    peekTopCard() {
        return this.cardList[0];
    }

    updatePileDisplay() {
        if (this.cardList.length >= 1) {
            $(this.zone).empty();
            const topCard = this.cardList[0];
            // create card element for rendering
            const newCardElement = $('<div></div>');
            // add card rank and suit classes to element for styles
            newCardElement.addClass("card");
            newCardElement.addClass(topCard.getSuit());
            newCardElement.text(topCard.getRank());
            $(this.zone).append(newCardElement);

            const countElement = $('<div></div>');
            countElement.addClass('count');
            countElement.text(this.cardList.length);
            $(this.zone).append(countElement);
        } else {
            $(this.zone).empty(); // create blank card
            const blankCard = $('<div></div>');
            blankCard.addClass("card");
            $(this.zone).append(blankCard);
            const countElement = $('<div></div>');
            countElement.addClass('count');
            countElement.text(this.cardList.length);
            $(this.zone).append(countElement);
        }
    }
}

class Card { // Class for each individual card
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    getSuit() {
        return this.suit;
    }

    getRank() {
        return this.rank;
    }

    getData() {
        return this.rank + this.suit;
    }

    getDisplayData() {
        return this.rank + this.suit
    }
}