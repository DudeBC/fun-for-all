"use strict";

$(document).ready( () => {
    let deck = new Deck();
    //let player = new Entity("#playerZone", true);
    let cpuPile = new Pile("#cpuPile");
    cpuPile.updatePileDisplay();
    let cpuRewards = new Pile("#cpuZone");
    cpuRewards.updatePileDisplay();
    let playerPile = new Pile("#playerPile");
    playerPile.updatePileDisplay();
    let playerRewards = new Pile("#playerZone");
    playerRewards.updatePileDisplay();
    var played = false;

    let gameText = $("#gameText");

    $("#drawCard").click( () => {
        if (deck.cardList.length < 2 && played == false) { // game over
            const playerCount = playerRewards.cardList.length;
            const cpuCount = cpuRewards.cardList.length;
            if (playerCount == cpuCount) {
                gameText.text("Game Over! It's a tie!");
            } else if (playerCount > cpuCount) {
                gameText.text("Game Over! You win with " + playerCount + " cards!");
            } else {
                gameText.text("Game Over! CPU 1 wins with " + cpuCount + " cards!");
            }
            
        } else {
            if (played == false) {
                playerPile.addToPile(deck.drawCard());
                cpuPile.addToPile(deck.drawCard());
                played = true;
                gameText.text("Players placed down new cards!")
            } else {
                const playerCardRank = playerPile.peekTopCard().getRank();
                const cpuCardRank = cpuPile.peekTopCard().getRank();
                var winner;

                if (playerCardRank == cpuCardRank) {
                    gameText.text("It's a tie!");
                    played = false;
                } else if (playerCardRank > cpuCardRank) {
                    gameText.text("You took the cards!");
                    winner = playerRewards;
                } else {
                    gameText.text("CPU 1 took the cards!");
                    winner = cpuRewards;
                }

                if (winner != null) {
                    while (playerPile.peekTopCard() != null) {
                        winner.addToPile(playerPile.takeFromTop());
                        winner.addToPile(cpuPile.takeFromTop());
                    }
                    played = false;
                }
            }
        }

        /*player.recieveCard(deck.drawCard());
        discardPile.addToPile(deck.drawCard());
        discardPile.addToPile(deck.drawCard());

        discardPile.takeFromTop().getRank();*/
    });
}); // end ready()


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

        if (this.isPlayer) {
            this.hand.forEach(card => {
                // create card element for rendering
               const newCardElement = $('<div></div>');
               // add card rank and suit classes to element for styles
               newCardElement.addClass("card");
               newCardElement.addClass(card.getSuit());
               newCardElement.text(card.getRank());
               $(this.zone).append(newCardElement);
           });
        } else { // make stack of cards with just the number of cards
            $(this.zone).empty();
            // create card element for rendering
            const cardBackElement = $('<div></div>');
            // add card rank and suit classes to element for styles
            cardBackElement.addClass("card");
            cardBackElement.text(hand.length);
            $(this.zone).append(cardBackElement);
        }
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