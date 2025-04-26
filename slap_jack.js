document.addEventListener('DOMContentLoaded', function() {
    // Define variables
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    let deck = [];
    let playerHand = [];
    let computerHand = [];
    let playerScore = 0;
    let computerScore = 0;

    // Function to create a card element
    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = `${card.value} of ${card.suit}`;
        return cardElement;
    }

    // Function to reset the game
    function resetGame() {
        playerHand = [];
        computerHand = [];
        const playerHandElement = document.getElementById('player-hand');
        const computerHandElement = document.getElementById('computer-hand');
        if (playerHandElement && computerHandElement) {
            playerHandElement.innerHTML = '';
            computerHandElement.innerHTML = '';
            showMessage('');
        }
        deck = [];
        // Initialize the deck with all cards
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        // Shuffle the deck
        deck.sort(() => Math.random() - 0.5);
        // Update scores display
        updateScores();
    }

    // Function to draw a card for the player
    function drawCardForPlayer() {
        // Check if there are cards left in the deck
        if (deck.length > 0) {
            const card = deck.pop();
            playerHand.push(card);
            const cardElement = createCardElement(card);
            const playerHandElement = document.getElementById('player-hand');
            if (playerHandElement) {
                playerHandElement.appendChild(cardElement);
                // Update scores after drawing
                updateScores();
                // Check for slap after drawing, but only if the drawn card is not a Jack
                if (!isSlapJack(card)) {
                    checkSlap();
                }
                // After player draws a card, simulate computer's actions
                drawCardForComputer();
            } else {
                showMessage('Player hand element not found!');
            }
        } else {
            showMessage('No more cards in the deck!');
        }
    }

    // Function to draw a card for the computer
    function drawCardForComputer() {
        // Check if there are cards left in the deck
        if (deck.length > 0) {
            const card = deck.pop();
            computerHand.push(card);
            const cardElement = createCardElement(card);
            const computerHandElement = document.getElementById('computer-hand');
            if (computerHandElement) {
                computerHandElement.appendChild(cardElement);
                // Always check for slap after drawing
                computerSlap();
            } else {
                showMessage('Computer hand element not found!');
            }
        } else {
            showMessage('No more cards in the deck!');
        }
    }

    // Function to calculate the score for a given hand
    function calculateScore(hand) {
        return hand.filter(card => card.value === 'Jack').length;
    }

    // Function to update the score display for both the player and the computer
    function updateScores() {
        const playerScoreElement = document.getElementById('player-score');
        const computerScoreElement = document.getElementById('computer-score');
        if (playerScoreElement && computerScoreElement) {
            playerScore = calculateScore(playerHand);
            computerScore = calculateScore(computerHand);
            playerScoreElement.textContent = `Your Score: ${playerScore}`;
            computerScoreElement.textContent = `Computer's Score: ${computerScore}`;
        } else {
            showMessage('Score elements not found!');
        }
    }

    // Function to simulate computer slap action
    function computerSlap() {
        if (shouldComputerSlap()) {
            showMessage('Computer slapped!');
            computerScore++;
            updateScores();
        }
    }

    // Function to check if the computer should slap
    function shouldComputerSlap() {
        // Check if any card in the computer's hand is a Jack
        return computerHand.some(card => isSlapJack(card));
    }

    // Function to check if the top card is a Jack and trigger slap action
    function checkSlap() {
        const topCard = playerHand[playerHand.length - 1];
        if (isSlapJack(topCard)) {
            slapAction();
        }
    }

    // Function to handle the slap action
function slapAction() {
    const topCard = playerHand[playerHand.length - 1];
    if (isSlapJack(topCard)) {
        showMessage('You won!');
        playerScore++;
    } else {
        if (shouldComputerSlap()) {
            showMessage('Computer slapped!');
            computerScore++;
        }
    }
    updateScores();
    
}

    // Function to display message
    function showMessage(message) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
        } else {
            console.error(message);
        }
    }

    // Function to check if the card is a Jack
    function isSlapJack(card) {
        return card.value === 'Jack';
    }

    // Draw card button action
    const drawCardButton = document.getElementById('draw-card');
    if (drawCardButton) {
        drawCardButton.addEventListener('click', drawCardForPlayer);
    } else {
        console.error('Draw card button not found!');
    }

    // Reset game button action
    const resetButton = document.getElementById('reset');
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    } else {
        console.error('Reset button not found!');
    }

    // Initialize the game
    resetGame();

    // Slap button action
    const slapButton = document.getElementById('slap');
    if (slapButton) {
        slapButton.addEventListener('click', slapAction);
    } else {
        console.error('Slap button not found!');
    }
});
