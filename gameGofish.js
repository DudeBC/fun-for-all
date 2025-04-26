"use strict";

var playerTurn = true;
let gameText = $("#gameText");
let playerSets = $("#playerSets");
let cpuSets1 = $("#cpuSets1");
let cpuSets2 = $("#cpuSets2");
let cpuSets3 = $("#cpuSets3");
var currentCpu = 1;
let gameOver = false;

var player;
var cpu1;
var cpu2;
var cpu3;
var deck;

$(document).ready( () => {
    deck = new Deck();
    player = new Entity("#playerZone", true, "You", playerSets);
    player.updateCardDisplay();
    cpu1 = new Entity("#cpuZone1", false, "CPU 1", cpuSets1);
    cpu1.updateCardDisplay();
    cpu2 = new Entity("#cpuZone2", false, "CPU 2", cpuSets2);
    cpu2.updateCardDisplay();
    cpu3 = new Entity("#cpuZone3",false, "CPU 3", cpuSets3);
    cpu3.updateCardDisplay();

    gameText = $("#gameText");
    playerSets = $("#playerSets");
    cpuSets1 = $("#cpuSets1");
    cpuSets2 = $("#cpuSets2");
    cpuSets3 = $("#cpuSets3");

    // Game setup
    // deal out cards
    for (let i = 0; i < 7; i++) {
        player.recieveCard(deck.drawCard());
        cpu1.recieveCard(deck.drawCard());
        cpu2.recieveCard(deck.drawCard());
        cpu3.recieveCard(deck.drawCard());
    }
    // draw first card into pile

    $("#continue").click( () => {
        if (!playerTurn) {
            switch (currentCpu) {
                case 1:
                    cpuTurn(cpu1, currentCpu);
                    cpu1.updateCardDisplay();
                    currentCpu++;
                    checkForEnd(cpu1);
                    break;
                case 2:
                    cpuTurn(cpu2, currentCpu);
                    cpu2.updateCardDisplay();
                    currentCpu++;
                    checkForEnd(cpu2);
                    break;
                case 3:
                    cpuTurn(cpu3, currentCpu);
                    cpu3.updateCardDisplay();
                    currentCpu++;
                    checkForEnd(cpu3);
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
            gameText.text("Pick a card to play.");
        }
    });
}); // end ready()

const checkForEnd = (entity) => {
    if (entity.sets >= 3) {
        gameText.text(entity.name + " wins!");
        playerTurn = false;
        currentCpu = 0;
        gameOver = true;
    }
}


const cardClicked = (player, cardIndex) => {
    // during the player turn, player picks card they have to ask for
    if (playerTurn) {
        // search all cpu players for that card and take it
        // remove and increase set counter if any
        const prePlayerHandCount = player.hand.length;
        const cardNum = player.hand[cardIndex].getRank();
        const foundCards = searchForCard(cardNum, player);
        
        foundCards.forEach(card => {
            player.recieveCard(card);
        });
        //player.sortHand();

        const newCards = player.hand.length - prePlayerHandCount;
        if (newCards == 0) {
            // no new cards found, draw card
            gameText.text("No cards found. You drew a card.");
            player.recieveCard(deck.drawCard());
        } else {
            gameText.text("You got " + newCards + " new cards.");
        }
        const setValue = checkForSet(player); // check for full set
        if (setValue > 0) { // full set found
            gameText.text("You found a set of " + setValue + "\'s");
            removeSet(setValue, player);
            player.sets = player.sets + 1;
            player.setDisplay.text("Sets: " + player.sets);
        }
        playerTurn = false;
        checkForEnd(player);
    } else {
        if (!gameOver) {
            gameText.text("It is not your turn! Press 'Continue'.");
        }
    }
} 

const cpuTurn = (cpu, num) => {
        // search all cpu and players for that card and take it
        // remove and increase set counter if any
        const preHandCount = cpu.hand.length;
        let cardNum = -1;

        // get random card pick
        var rand = Math.random();
        rand = Math.floor(rand * cpu.hand.length);

        if (cpu.hand.length > 0) {
            cardNum = cpu.hand[rand].getRank();
        }

        // collect cards matching num
        const foundCards = searchForCard(cardNum, cpu);
        
        foundCards.forEach(card => {
            cpu.recieveCard(card);
        });

        let displayString = "";
        if (cardNum != -1) {
            displayString = cpu.name + " asked for " + cardNum + "\'s. ";
        }

        const newCards = cpu.hand.length - preHandCount;
        if (newCards == 0) {
            // no new cards found, draw card
            gameText.text(displayString + "No cards were found. They drew a card.");
            cpu.recieveCard(deck.drawCard());
        } else {
            gameText.text( displayString + "They got " + newCards + " new cards.");
        }
        const setValue = checkForSet(cpu); // check for full set
        if (setValue > 0) { // full set found
            gameText.text(cpu.name + " found a set of " + setValue + "\'s");
            removeSet(setValue, cpu);
            cpu.sets = cpu.sets + 1;
            cpu.setDisplay.text("Sets: " + cpu.sets);
        }
}

const removeSet = (rank, entity) => {
    entity.hand = entity.hand.filter(card => (card.getRank() !== rank));
    entity.updateCardDisplay();
    gameText.text(entity.name + " made a set of " + rank + "'s!");
}

const checkForSet = (entity) => {
    let foundSet = -1;
    const cardRankCounts = {};

    entity.hand.forEach(card => {
        const rank = card.getRank();
        if (cardRankCounts[rank] != null) {
            cardRankCounts[rank]++;
        } else {
            cardRankCounts[rank] = 1;
        }

        if (cardRankCounts[rank] === 4) {
            foundSet = rank;
        }
    });
    return foundSet;
}

const searchForCard = (rank, receivingEntity) => {
    const foundCards = [];

    player.hand.forEach((card, index) => {
        if (card.getRank() == rank) {
            foundCards.push(player.playCard(player.hand.indexOf(card)));
            index--;
        }
    });

    cpu1.hand.forEach((card, index) => {
        if (card.getRank() == rank) {
            foundCards.push(cpu1.playCard(cpu1.hand.indexOf(card)));
            index--;
        }
    });

    cpu2.hand.forEach((card, index) => {
        if (card.getRank() == rank) {
            foundCards.push(cpu2.playCard(cpu2.hand.indexOf(card)));
            index--;
        }
    });

    cpu3.hand.forEach((card, index) => {
        if (card.getRank() == rank) {
            foundCards.push(cpu3.playCard(cpu3.hand.indexOf(card)));
            index--;
        }
    });
    return foundCards;
}

/************************
******** CLASSES ********
*************************/

class Entity { // Class for computer and human players
    constructor(displayZoneID, isPlayer, name, setDisplay) {
        this.hand = [];
        this.count = 0;
        this.sets = 0;
        this.zone = displayZoneID;
        this.isPlayer = isPlayer;
        this.name = name;
        this.setDisplay = setDisplay;
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

    sortHand() {
        this.hand.sort((a, b) => a.getRank() - b.getRank());
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
        rand = Math.floor(rand * this.cardList.length);

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