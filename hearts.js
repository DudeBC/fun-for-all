"use strict";

let currentCardToPlay = null; // Initialize currentCardToPlay

// Define constants for suits and ranks
const SUITS = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

// Define Player class
class Player {
    constructor(id, isHuman = false) {
        this.id = id;
        this.hand = [];
        this.isHuman = isHuman;
    }

    playCard(card) {
        // Remove card from player's hand
        const index = this.hand.findIndex(c => c === card);
        if (index !== -1) {
            const playedCard = this.hand.splice(index, 1)[0];
            return playedCard;
        }
        return null;
    }

    pass() {
        return null; // Placeholder for now
    }
}

// Define global variables for game state
let deck;
let players = [];
let currentPlayerIndex = 0;
let currentTrick = [];
let scores = [0, 0, 0, 0]; // Scores for each player
const targetScore = 100; // Target score to end the game

// Function to initialize players
function initializePlayers() {
    for (let i = 0; i < 4; i++) {
        const isHuman = (i === 0); // First player is human, rest are computer players
        players.push(new Player(i, isHuman));
    }
}

// Function to initialize the game
function initializeGame() {
    deck = new Deck();
    deck.shuffle();

    // Clear the player's hand before dealing new cards
    $('#playerHand').empty();

    // Deal cards according to the number of players
    const numPlayers = players.length;
    let cardsPerPlayer = 0;
    switch (numPlayers) {
        case 3:
            cardsPerPlayer = 17;
            break;
        case 4:
            cardsPerPlayer = 13;
            break;
        case 5:
            cardsPerPlayer = 10;
            break;
        default:
            throw new Error("Unsupported number of players");
    }

    for (let i = 0; i < numPlayers; i++) {
        players[i].hand = [];
        for (let j = 0; j < cardsPerPlayer; j++) {
            const card = deck.drawCard();
            players[i].hand.push(card);
            if (players[i].isHuman) {
                // If it's the human player, display the card
                displayCard(card, '#playerHand');
            } else {
                // For computer players, display placeholder
                displayPlaceholderCard(i, '#computer' + i);
            }
        }
    }

    // Determine starting player
    currentPlayerIndex = players.findIndex(player => player.hand.some(card => card.rank === '2' && card.suit === 'Clubs'));
    if (currentPlayerIndex === -1) {
        // 2 of Clubs not found, start with player 0
        currentPlayerIndex = 0;
    }
}

// Function to display a card in the player's hand
function displayCard(card, container) {
    const cardElement = $('<div></div>');
    cardElement.addClass('card');
    cardElement.text(card.rank + ' of ' + card.suit);
    cardElement.data('card', card); // Set data attribute 'card' with the card object
    $(container).append(cardElement);
}

// Function to display a placeholder card for computer players
function displayPlaceholderCard(playerIndex, container) {
    const cardElement = $('<div></div>');
    cardElement.addClass('card');
    cardElement.text('Computer ' + playerIndex);
    $(container).append(cardElement);
}

// Event listener for the "Play Card" button
$('#playCardButton').click(() => {
    // Get the selected card from the human player's hand
    const selectedCard = $('#playerHand .card.selected').data('card');
    if (selectedCard) {
        // Call the playCard() function with the selected card to play
        playCard(selectedCard);
    } else {
        console.log("Please select a card to play.");
    }
});

// Event listener for selecting a card from the human player's hand
$('#playerHand').on('click', '.card', function() {
    // Toggle the 'selected' class to indicate the selected card
    $('.card').removeClass('selected');
    $(this).addClass('selected');

    // Set the current card to play as the selected card
    currentCardToPlay = $(this).data('card');
});

// Event listener for the "Pass" button
$('#passButton').click(() => {
    // Call the pass() function when the button is clicked
    pass();
});

// Event listener for the "New Game" button
$('#newGameButton').click(() => {
    // Reset game state
    resetGame();

    // Initialize the new game
    initializeGame();
});

// Function to play a card from the player's hand
function playCard(card) {
    // Placeholder implementation for now
    console.log("Card played: " + card.rank + ' of ' + card.suit);

    // Log player's hand before removing the card
    console.log("Player's hand before:", players[0].hand);

    // Remove the played card from the player's hand
    const index = players[0].hand.findIndex(c => c === card);
    if (index !== -1) {
        players[0].hand.splice(index, 1);
    }

    // Log player's hand after removing the card
    console.log("Player's hand after:", players[0].hand);

    // Remove the played card from the DOM
    $('#playerHand .card.selected').remove();

    // Call function to proceed to the next player's turn or end the trick
    proceedToNextTurn();
}
// Function to proceed to the next player's turn or end the trick
function proceedToNextTurn() {
    
    console.log("Proceed to next turn");
}

// Function to calculate the score for a trick
function calculateTrickScore(trick) {
    let score = 0;
    for (const card of trick) {
        if (card.suit === 'Hearts') {
            score++;
        } else if (card.suit === 'Spades' && card.rank === 'Queen') {
            score += 13; // Queen of Spades
        }
    }
    return score;
}
// Function to reset the game state
function resetGame() {
    // Clear player scores
    scores = [0, 0, 0, 0];

    // Clear current trick
    currentTrick = [];
}
// Define the Deck class
class Deck {
    constructor() {
        this.cards = [];
        for (let suit of SUITS) {
            for (let rank of RANKS) {
                this.cards.push({ suit, rank });
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        if (this.cards.length === 0) {
            console.error("No more cards in the deck");
            return null;
        }
        return this.cards.pop();
    }
}

$(document).ready(() => {
    // Initialize players
    initializePlayers();

    // Initialize the game
    initializeGame();
});
