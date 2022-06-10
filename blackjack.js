const fullDeck = {  
  spade_ace: 1, 
  spade_two: 2,
  spade_three: 3,
  spade_four: 4,
  spade_five: 5,
  spade_six: 6,
  spade_seven: 7,
  spade_eight: 8,
  spade_nine: 9,
  spade_ten: 10,
  spade_jack: 10,
  spade_queen: 10,
  spade_king: 10, 
  heart_ace: 1, 
  heart_two: 2,
  heart_three: 3,
  heart_four: 4,
  heart_five: 5,
  heart_six: 6,
  heart_seven: 7,
  heart_eight: 8,
  heart_nine: 9,
  heart_ten: 10,
  heart_jack: 10,
  heart_queen: 10,
  heart_king: 10, 
  club_ace: 1, 
  club_two: 2,
  club_three: 3,
  club_four: 4,
  club_five: 5,
  club_six: 6,
  club_seven: 7,
  club_eight: 8,
  club_nine: 9,
  club_ten: 10,
  club_jack: 10,
  club_queen: 10,
  club_king: 10,
  diamond_ace: 1, 
  diamond_two: 2,
  diamond_three: 3,
  diamond_four: 4,
  diamond_five: 5,
  diamond_six: 6,
  diamond_seven: 7,
  diamond_eight: 8,
  diamond_nine: 9,
  diamond_ten: 10,
  diamond_jack: 10,
  diamond_queen: 10,
  diamond_king: 10 
}

function duplicateInArray(obj, n) { // Creates multiple decks in an array
	const copies = [];
	for (let i = 0; i < n; i++) {
		copies.push(JSON.parse(JSON.stringify(obj))); 
		//taken from https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
	}
	return copies;	
}

const duplicatedDecks = duplicateInArray(fullDeck, 6); 
let decks = duplicatedDecks
let player = {}; //player hand
let dealer = {}; //dealer hand

const startGameBox = document.getElementById("startGameBox");
const messageText = document.getElementById("messageText");
const hitButton = document.getElementById("hitButton"); 
const standButton = document.getElementById("standButton");	

//Player buttons
hitButton.addEventListener("click", hit);
function hit () { 
	dealCard(player);
	if (scoreHand(player) > 21) {
	  playerTurn(false);
		gameOver();
	}
}
standButton.addEventListener("click", stand);
function stand() { 
    displayHoleCard();
    playerTurn(false); 
    dealerTurn(); 	//activates dealer's turn
}
function playerTurn(active=true) { // Enables/disables player buttons.
	if (active) {
		hitButton.disabled = false;
		standButton.disabled = false;
	} else {
		hitButton.disabled = true;
		standButton.disabled = true;
	}
}
playerTurn(false); // ensures player buttons are disabled when web app first loads.

startGameBox.addEventListener("click", gameStart);
function gameStart() {
	startGameBox.style.display = "none"; 
	clearTable();

	messageText.innerHTML = "Dealing cards...";
	dealCard(player, 2);
	dealCard(dealer, 2);
	if (scoreHand(dealer) == 21 || scoreHand(player) == 21) {
		gameOver(blackjack = true);
	} else {
		messageText.innerHTML = "Your turn... hit or stand?";
		playerTurn();
	}
}

function clearTable() { // Resets game for consecutive games
  let allCards = document.querySelectorAll(".card");
  let i = 0;
  while (i < allCards.length) {
    allCards[i].remove();
    i++;
  }
  player = {};
  dealer = {};
  decks = [...duplicatedDecks];
  displayScore(player);
  displayScore(dealer);
}

function dealCard(hand, n = 1) { 
  function getRandomInt(max) { 
    return Math.floor((Math.random() * max));
  }// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  
  for (let i = 0; i < n; i++) {
    let drawnDeck = decks[getRandomInt(decks.length)];
		let drawnCard = Object.keys(drawnDeck)[getRandomInt(Object.keys(drawnDeck).length)];
		hand[drawnCard] = drawnDeck[drawnCard];
		delete drawnDeck[drawnCard];
		if (Object.keys(hand).length == 2 && hand == dealer) {
   		displayCard(hand, holeCard = true);
    } else {
   		displayCard(hand);
 			displayScore(hand);
 		}
  } 
}

function scoreHand(hand) {  // Calculates score (including ace value).
  function pointCount(hand){ 
    let points = 0;
    for (let i=0; i < Object.keys(hand).length; i++) {
      points += hand[Object.keys(hand)[i]];
    }
    return points;
  }
  function aceChecker(hand) {  // returns true if ace in hand.
    const aces = ["spade_ace", "heart_ace", "club_ace", "diamond_ace"];
    for (let i = 0; i < aces.length; i++) {
      if (aces[i] in hand) {
        return true;
      } 
    }
  }    
  let score = 0
  if (aceChecker(hand) && (pointCount(hand)+10 <= 21)) { 
    score = pointCount(hand) + 10; // make ace 11 points if total <= 21 
  } else {
    score = pointCount(hand);
  } 
  return score;
}

function displayCard(hand, holeCard = false) {	// Display cards on screen.
  handString = hand == dealer ? "#dealerRow" : "#playerRow";
  let location = document.querySelector(handString);
  cardString = holeCard == false ? Object.keys(hand)[Object.keys(hand).length - 1] : "back";  
  location.insertAdjacentHTML('beforeend', `<div class="card" id="${cardString}"> <img src="./deck/${cardString}.png" /></div>`); // 
}

function displayHoleCard() {  // Reveal hole card on screen. 
	const showCard = Object.keys(dealer)[1];
	const backCard = document.getElementById('back');
	if (backCard != null) {
		backCard.innerHTML =  `<img src="./deck/${showCard}.png" />`
		backCard.id = `${showCard}`;
		displayScore(dealer);
	}
}

function displayScore(hand) {
 	let location = hand == dealer ? "dealerScore": "playerScore";
 	document.getElementById(location).innerHTML = `${scoreHand(hand)}`; // Update score on screen. // Display score on screen.
}
	
function dealerTurn() { 
	messageText.innerHTML = "Dealer's turn...";
	while (scoreHand(dealer) < 17) {
		dealCard(dealer);
	}
	gameOver();
}

function gameOver(blackjack = false) {
	displayHoleCard();
	messageText.innerHTML = blackjack ? "BLACKJACK! " : "";
	let pScore = scoreHand(player);
	let dScore = scoreHand(dealer);
	if (pScore > 21) {
		messageText.textContent += "Bust! You loose.";
	} else if (dScore > 21) {
		messageText.textContent += "Dealer bust! You win!";
	} else if (pScore > dScore) {
		messageText.textContent += "You win!";
	} else if (dScore > pScore) {
		messageText.textContent += "You loose.";
	} else {
		messageText.textContent += "Draw!";
	}
	messageText.textContent += " Click anywhere to play again..."

	startGameBox.style.display = "block";		
}
