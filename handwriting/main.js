import { shavianNN, nnLoad, nnPredict } from "./neuralNetwork.js";
import { chars, toIndex } from "./characters.js";
import { processImage } from "./util.js";
import { database, saveImageToDatabase, popImageFromDatabase, downloadDatabase } from "./database.js";

function main() {
  // nnMain();
  
  var changed = {
    "value": false,
    "reason": null,
  };
  
  const importFile = document.getElementById("importFile");
  
  const predictionMenu = document.getElementById("predictionMenu");
  const predictionMenuBottom = document.getElementById("predictionMenuBottom");
  const trainingMenu = document.getElementById("trainingMenu");
  const trainingMenuBottom = document.getElementById("trainingMenuBottom");
  const promptText = document.getElementById("promptText");
  const predictionElement = document.getElementById("predictionElement");
  const outputBox = document.getElementById("outputBox");
  
  const selectModel = document.getElementById("selectModel");
  const changeModel = document.getElementById("changeModel");
  
  const resetCanvasButton = document.getElementById("resetCanvasButton");
  const autoReset = document.getElementById("autoReset");
  const databaseCollection = document.getElementById("databaseCollection");
  const predictionModeDatabase = document.getElementById("predictionModeDatabase");
  const autoFirst = document.getElementById("autoFirst");
  var autoChar = null;
  
  const saveCharacterButton = document.getElementById("saveCharacterButton");
  const undoCharacterButton = document.getElementById("undoCharacterButton");
  const nextCharacterButton = document.getElementById("nextCharacterButton");
  const previousCharacterButton = document.getElementById("previousCharacterButton");
  const exportDatabaseButton = document.getElementById("exportDatabaseButton");
  
  const databaseEntryCount = document.getElementById("databaseEntryCount");
  
  // const urlParams = new URLSearchParams(document.location.search);
  
  const optionCount = document.getElementById("optionCount");
  var optionDisplay = 10;
  
  var mode = "prediction";
  updateModes();
  
  const inputCanvas = document.getElementById("inputCanvas");
  inputCanvas.width = 512;
  inputCanvas.height = 512;
  const ctx = inputCanvas.getContext("2d");
  
  // the one it will actually be drawn to to isolate current stroke
  const internalCanvas = document.createElement("canvas");
  internalCanvas.width = 192;
  internalCanvas.height = 192;
  const internalCtx = internalCanvas.getContext("2d");
  
  var mouseActive = false;
  const dataCollection = {
    "current": null,
    "index": 0,
  };
  
  clearCanvas();
  
  async function fetchModel() {
    await nnLoad(selectModel.value);
    predict(false);
    autoChar = null;
    changed.reason = "fetchModel";
  }
  
  function updateDatabaseEntryCount() {
    databaseEntryCount.innerText = database.length;
  }
  
  if (mode === "prediction") {
    fetchModel();
  }
  
  function updateModes() {
    if (mode === "training") {
      trainingMenu.style.display = "block";
      trainingMenuBottom.style.display = "block";
      predictionMenu.style.display = "none";
      predictionMenuBottom.style.display = "none";
    } else if (mode === "prediction") {
      predictionMenu.style.display = "block";
      predictionMenuBottom.style.display = "block";
      trainingMenu.style.display = "none";
      trainingMenuBottom.style.display = "none";
    }
    while (predictionElement.firstChild) {
      predictionElement.removeChild(predictionElement.lastChild);
    }
  }
  
  function importedFile() {
    const file = importFile.files[0];
    const reader = new FileReader();
    
    reader.addEventListener("load", () => {
      try {
        const data = JSON.parse(reader.result);
        database.length = 0;
        for (let i of data) {
          if (i.character in toIndex) {
            database.push(i);
          }
        }
        console.log(database);
        updateDatabaseEntryCount();
      } catch {
        console.log("Failed to import database!");
      }
    });
    
    if (file) {
      reader.readAsText(file);
    }
  }
  
  function clearCanvas() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, inputCanvas.width, inputCanvas.height);
    
    internalCtx.clearRect(0, 0, internalCanvas.width, internalCanvas.height);
    
    changed.value = true;
    changed.reason = "clearCanvas";
  }
  
  function render() {
    if (changed.value && mode === "prediction") {
      predict(changed.reason === "input");
    }
    changed.value = false;
    changed.reason = null;
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);
  
  const prevMousePos = [null, null];
  
  function mouseMove(e) {
    // e.offsetX, e.offsetY
    const mousePos = [
      e.offsetX / inputCanvas.width,
      e.offsetY / inputCanvas.height
    ];
    
    if (mouseActive) {
      changed.value = true;
      changed.reason = "input";
      if (prevMousePos[0] == null) {
        prevMousePos[0] = mousePos[0];
        prevMousePos[1] = mousePos[1];
      }
      modifyCanvas(inputCanvas, ctx, mousePos, prevMousePos);
      modifyCanvas(internalCanvas, internalCtx, mousePos, prevMousePos);
      prevMousePos[0] = mousePos[0];
      prevMousePos[1] = mousePos[1];
    }
  }
  
  function touchMove(e) {
    e.preventDefault(); // stop scrolling
    const boundsRect = inputCanvas.getBoundingClientRect();
    const mousePos = [
      (e.changedTouches[0].clientX - boundsRect.left) / inputCanvas.width,
      (e.changedTouches[0].clientY - boundsRect.top) / inputCanvas.height
    ];
    
    if (mouseActive) {
      changed.value = true;
      changed.reason = "input";
      if (prevMousePos[0] == null) {
        prevMousePos[0] = mousePos[0];
        prevMousePos[1] = mousePos[1];
      }
      modifyCanvas(inputCanvas, ctx, mousePos, prevMousePos);
      modifyCanvas(internalCanvas, internalCtx, mousePos, prevMousePos);
      prevMousePos[0] = mousePos[0];
      prevMousePos[1] = mousePos[1];
    }
  }
  
  function modifyCanvas(canvas, ctx, pos, prev) {
    const radius = Math.min(canvas.width, canvas.height) / 36;
    ctx.strokeStyle = `#ffffff`;
    ctx.lineWidth = radius;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(prev[0] * canvas.width, prev[1] * canvas.height);
    ctx.lineTo(pos[0] * canvas.width, pos[1] * canvas.height);
    ctx.stroke();
  }
  
  function saveImage() {
    // document.body.appendChild(internalCanvas);
    const dataUrl = internalCanvas.toDataURL();
    console.log(dataUrl);
    saveImageToDatabase(dataUrl, dataCollection.current);
    characterCollection(1);
    updateDatabaseEntryCount();
  }
  
  async function predict(autoCharModify) {
    if (shavianNN === undefined) return;
    const modelInputs = processImage(internalCanvas);
    const results = await nnPredict(modelInputs);
    
    for (let i=0; i<results.length; i++) {
      results[i] = [results[i], chars[i]];
    }
    
    results.sort((a, b) => (b[0] - a[0]));
    // console.log(results);
    displayPrediction(results);
    if (autoCharModify) autoChar = results[0][1];
  }
  
  function mouseDown() {
    mouseActive = true;
    prevMousePos[0] = null;
  }
  
  
  function autoCharConsume() {
    console.log(autoChar);
    if (autoChar === null) return;
    if (autoFirst.checked) {
      outputBox.value += autoChar;
    }
    autoChar = null;
  }
  
  function mouseDownCanvas() {
    if (autoReset.checked) {
      autoCharConsume();
      clearCanvas();
    }
  }
  
  function touchDown(e) {
    e.preventDefault();
    mouseActive = true;
    prevMousePos[0] = null;
  }
  
  function touchDownCanvas(e) {
    e.preventDefault();
    
    if (autoReset.checked) {
      autoCharConsume();
      clearCanvas();
    }
  }
  
  function mouseUp() {
    mouseActive = false;
  }
  
  function characterCollection(n) {
    dataCollection.index = (dataCollection.index + n + chars.length) % chars.length;
    dataCollection.current = chars[dataCollection.index];
    promptText.innerText = `Draw ${dataCollection.current}`;
    clearCanvas();
  }
  
  function popCharacter() {
    popImageFromDatabase();
    characterCollection(-1);
    updateDatabaseEntryCount();
  }
  
  function displayPrediction(results) {
    while (predictionElement.firstChild) {
      predictionElement.removeChild(predictionElement.lastChild);
    }
    
    for (let i=0; i<optionDisplay; i++) {
      const probability = results[i][0];
      const character = results[i][1];
      
      const choiceContainer = document.createElement("div");
      choiceContainer.classList.add("choice");
      
      const choiceBar = document.createElement("div");
      choiceBar.classList.add("choiceBar");
      choiceBar.style.width = (results[i][0] * 100) + "%";
      choiceBar.style.height = "30px"
      
      const characterChoice = document.createElement("p");
      characterChoice.innerText = `${character} ${(probability * 100).toFixed(3)}%`;
      characterChoice.classList.add("characterChoice");
      
      choiceContainer.appendChild(choiceBar);
      choiceContainer.appendChild(characterChoice);
      predictionElement.appendChild(choiceContainer);
      
      choiceContainer.addEventListener("click", () => {
        if (predictionModeDatabase.checked) {
          const dataUrl = internalCanvas.toDataURL();
          console.log(dataUrl);
          saveImageToDatabase(dataUrl, character);
          updateDatabaseEntryCount();
        }
        outputBox.value += character;
        autoChar = null;
      });
    }
  }
  
  characterCollection(0);
  
  inputCanvas.addEventListener("mousemove", mouseMove);
  inputCanvas.addEventListener("mousedown", mouseDownCanvas);
  document.addEventListener("mouseup", mouseUp);
  document.addEventListener("mousedown", mouseDown);
  
  inputCanvas.addEventListener("touchmove", touchMove);
  inputCanvas.addEventListener("touchstart", touchDownCanvas);
  document.addEventListener("touchend", mouseUp);
  inputCanvas.addEventListener("touchstart", touchDown);
  
  resetCanvasButton.addEventListener("click", () => {
    autoChar = null;
    clearCanvas();
  });
  
  saveCharacterButton.addEventListener("click", () => {
    saveImage();
  });
  undoCharacterButton.addEventListener("click", () => {
    popCharacter();
  });
  previousCharacterButton.addEventListener("click", () => {
    characterCollection(-1);
  });
  nextCharacterButton.addEventListener("click", () => {
    characterCollection(1);
  });
  exportDatabaseButton.addEventListener("click", () => {
    downloadDatabase();
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (mode === "training") {
      switch (e.key) {
        case "f":
          saveImage();
          break;
        case "r":
          clearCanvas();
          break;
        case "z":
          popCharacter();
          break;
        case "s":
          downloadDatabase();
          break;
        case "a":
          characterCollection(-1);
          break;
        case "d":
          characterCollection(1);
          break;
      } 
    } else if (mode === "prediction") {
      switch (e.key) {
        /*
        case "f":
          predict();
          break;
        */
        case "r":
          clearCanvas();
          break;
      }
    }
  });
  
  importFile.addEventListener("input", importedFile);
  databaseCollection.addEventListener("change", () => {
    if (databaseCollection.checked) {
      mode = "training";
    } else {
      mode = "prediction";
    }
    console.log(`mode: ${mode}`);
    updateModes();
  });
  
  const charButtons = {
    "spaceButton": " ",
    "periodButton": ".",
    "exclamButton": "!",
    "questionButton": "?",
    "apostropheButton": "'",
    "leftQuoteButton": "«",
    "rightQuoteButton": "»",
    "namerButton": "·",
    "acroButton": "⸰",
  };
  
  for (let button in charButtons) {
    const character = charButtons[button];
    document.getElementById(button)
      .addEventListener("click", () => {
        autoCharConsume();
        outputBox.value += character;
      });
  }
  
  document.getElementById("bkspButton").addEventListener("click", () => {
    clearCanvas();
    autoChar = null;
    if ((outputBox.value.substring(outputBox.value.length - 2)) in toIndex) {
      outputBox.value = outputBox.value.substring(0, outputBox.value.length - 2);
    } else {
      outputBox.value = outputBox.value.substring(0, outputBox.value.length - 1);
    }
  });
  
  optionCount.addEventListener("change", () => {
    optionDisplay = optionCount.value;
  });
  
  changeModel.addEventListener("click", fetchModel);
  
  updateDatabaseEntryCount();
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}