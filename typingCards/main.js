import { cardRequester, packNames } from "./cards.js";

var nextCardsAmount = 5;
var nextCardsText = [];
var nextCardsElement = [];
var currentPrimary = null;
var currentSecondary = null;
var currentPack = null;
var visitedCards = [];
var cardsFinished = 0;
var mistakes = 0;
var jsonPack = null;
var visitedCardsSum = 0;
const displaySettings = {
  "mainVisible": true,
  "secondaryVisible": true,
}

function main() {
  const cardPackSelection = document.getElementById("cardPackSelection");
  const startButton = document.getElementById("startButton");
  const mainPrimary = document.getElementById("mainPrimary");
  const mainSecondary = document.getElementById("mainSecondary");
  const mainTextInput = document.getElementById("mainTextInput");
  const cardContainer = document.getElementById("cardContainer");
  const cardMenu = document.getElementById("cardMenu");
  const finishedCounter = document.getElementById("finishedCounter");
  const skipCardButton = document.getElementById("skipCardButton");
  const JSONPackButton = document.getElementById("JSONPackButton");
  const cutoffInput = document.getElementById("cutoffInput");
  const primaryVisible = document.getElementById("primaryVisible");
  const secondaryVisible = document.getElementById("secondaryVisible");
  
  // make next cards
  for (let i=0; i<nextCardsAmount; i++) {
    const card = document.createElement("div"); // make card
    card.classList.add("card");
    
    const secondary = document.createElement("p"); // make secondary text (latin)
    secondary.classList.add("centeredText", "cardSecondary");
    
    const primary = document.createElement("p"); // make primary text (shavian)
    primary.classList.add("centeredText", "cardPrimary");
    
    secondary.innerText = "secondary";
    primary.innerText = "primary";
    
    card.appendChild(secondary); // append both to card
    card.appendChild(primary);
    
    nextCardsElement.push({"card": card, "primary": primary, "secondary": secondary}); // push card to list and document
    cardContainer.appendChild(card);
  }
  
  // make card pack names
  for (let i in packNames) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = packNames[i];
    cardPackSelection.appendChild(option);
  }
  
  function generateCard() {
    // adjust values to length of card pack
    const variance = 0.1 * visitedCards.length * (1 + 0.01 * visitedCardsSum);
    const zeroprioritance = visitedCards.length * (1 + 0.1 * visitedCardsSum);
    
    const probabilities = [];
    var sum = 0;
    for (let i=0; i<visitedCards.length; i++) {
      // calculate weight for card
      const prob = Math.exp(-i/variance)/(zeroprioritance * visitedCards[i] + 1);
      sum += prob;
      probabilities.push(sum);
    }
    
    // generate random number which will be used for card
    const r = Math.random() * probabilities[probabilities.length-1];
    // you can use binary search but you're lazy and the previous function is O(n) anyways
    var index = 0;
    while (probabilities[index] < r) {
      index++;
    }
    
    visitedCards[index]++;
    visitedCardsSum++;
    nextCardsText.push(currentPack[index]);
  }
  
  function displayCards() {
    mainPrimary.innerText = currentPrimary;
    mainSecondary.innerText = currentSecondary;
    
    nextCardsElement.forEach((element, index) => {
      element.primary.innerText = nextCardsText[index][0];
      element.secondary.innerText = nextCardsText[index][1];
    });
  }
  
  function moveCard() {
    // load values
    currentPrimary = nextCardsText[0][0];
    currentSecondary = nextCardsText[0][1];
    // delete first item
    nextCardsText.splice(0, 1);
  }
  
  async function start() {
    if (cardPackSelection.value === "json") { // access current pack
      currentPack = jsonPack;
    } else {
      currentPack = await cardRequester(cardPackSelection.value);
    }
    currentPack = structuredClone(currentPack); // so cutoff doesnt mess up the original
    
    if (Number(cutoffInput.value) > 0) { // if there is a cutoff
      currentPack.splice(0, Math.floor(currentPack.length * Number(cutoffInput.value) / 100));
    }
    
    visitedCards.length = currentPack.length; // set lengths equal
    nextCardsText = []; // reset next cards
    cardsFinished = 0; // reset number of finished cards
    finishedCounter.innerText = "0";
    mistakes = 0; // reset mistake counter
    mistakeCounter.innerText = "0";
    
    visitedCards.fill(0); // fill visited cards with 0 because none of them have been seen yet
    visitedCardsSum = 0;
    
    // generate cards to fill current and next cards
    for (let i=0; i<nextCardsAmount+1; i++) {
      generateCard();
    }
    // console.log(nextCardsText);
    moveCard();
    displayCards();
    
    cardMenu.style.display = "block";
  }
  
  function handleInput() {
    const v = mainTextInput.value;
    if (v[v.length-1] === " ") {
      if (v === currentPrimary + " ") {
        moveCard();
        generateCard();
        displayCards();
        mainTextInput.value = "";
        cardsFinished++;
        finishedCounter.innerText = String(cardsFinished);
      } else {
        mainTextInput.value = "";
        if (v === " ") return;
        mistakes++;
        mistakeCounter.innerText = String(mistakes);
      }
    }
  }
  
  function skipCard() {
    moveCard();
    generateCard();
    displayCards();
    mainTextInput.value = "";
  }
  
  function importJSONPack() {
    jsonPack = prompt("Input JSON");
    try {
      jsonPack = JSON.parse(jsonPack);
    } catch (e) {
      jsonPack = null;
      alert("Invalid JSON!");
    }
  }
  
  function updateCardStyle() {
    const cardPrimaryClass = document.getElementsByClassName("cardPrimary");
    const cardSecondaryClass = document.getElementsByClassName("cardSecondary");
    
    for (let element of cardPrimaryClass) {
      if (primaryVisible.checked) {
        element.classList.remove("primaryHidden");
      } else {
        element.classList.add("primaryHidden");
      }
    }
    
    for (let element of cardSecondaryClass) {
      if (secondaryVisible.checked) {
        element.classList.remove("secondaryHidden");
      } else {
        element.classList.add("secondaryHidden");
      }
    }
  }
  
  startButton.addEventListener("click", start);
  JSONPackButton.addEventListener("click", importJSONPack);
  mainTextInput.addEventListener("input", handleInput);
  skipCardButton.addEventListener("click", skipCard);
  primaryVisible.addEventListener("change", updateCardStyle);
  secondaryVisible.addEventListener("change", updateCardStyle);
  cutoffInput.addEventListener("change", () => {
    if (Number(cutoffInput.value) > 99) {
      cutoffInput.value = "99";
      return;
    }
    if (Number(cutoffInput.value) < 0) {
      cutoffInput.value = "0";
      return;
    }
  });
  
}

document.addEventListener("DOMContentLoaded", main);