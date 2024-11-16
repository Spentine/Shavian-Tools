import { nnLoad, nnPredict } from "./neuralNetwork.js";
import { chars, toIndex } from "./characters.js";
import { processImage } from "./util.js";
import { database, saveImageToDatabase, popImageFromDatabase, downloadDatabase } from "./database.js";

function main() {
  // nnMain();
  
  const importFile = document.getElementById("importFile");
  
  const predictionMenu = document.getElementById("predictionMenu");
  const trainingMenu = document.getElementById("trainingMenu");
  const promptText = document.getElementById("promptText");
  const predictionElement = document.getElementById("predictionElement");
  
  const mode = "prediction";
  
  if (mode === "training") {
    trainingMenu.style.display = "block";
  } else if (mode === "prediction") {
    predictionMenu.style.display = "block";
  }
  
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
    await nnLoad();
    predict();
  }
  
  if (mode === "prediction") {
    fetchModel();
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
    
    changed = true;
  }
  
  var changed = false;
  
  function render() {
    if (mode === "prediction") {
      predict();
      window.requestAnimationFrame(render);
    }
  }
  window.requestAnimationFrame(render);
  
  const prevMousePos = [null, null];
  
  function mouseMove(e) {
    // e.offsetX, e.offsetY
    const mousePos = [
      Math.max(0, e.offsetX / inputCanvas.width),
      Math.min(1, e.offsetY / inputCanvas.height)
    ];
    
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
    
    if (mouseActive) {
      changed = true;
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
  
  function saveImage() {
    // document.body.appendChild(internalCanvas);
    const dataUrl = internalCanvas.toDataURL();
    console.log(dataUrl);
    saveImageToDatabase(dataUrl, dataCollection.current);
    characterCollection(1);
  }
  
  async function predict() {
    const modelInputs = processImage(internalCanvas);
    const results = await nnPredict(modelInputs);
    
    for (let i=0; i<results.length; i++) {
      results[i] = [results[i], chars[i]];
    }
    
    results.sort((a, b) => (b[0] - a[0]));
    // console.log(results);
    displayPrediction(results);
  }
  
  function mouseDown() {
    mouseActive = true;
    prevMousePos[0] = null;
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
  }
  
  function displayPrediction(results) {
    while (predictionElement.firstChild) {
      predictionElement.removeChild(predictionElement.lastChild);
    }
    
    for (let i=0; i<10; i++) {
      const choiceContainer = document.createElement("div");
      choiceContainer.classList.add("choice");
      
      const choiceBar = document.createElement("div");
      choiceBar.classList.add("choiceBar");
      choiceBar.style.width = (results[i][0] * 100) + "%";
      choiceBar.style.height = "30px"
      
      const characterChoice = document.createElement("p");
      characterChoice.innerText = results[i][1] + " " + results[i][0];
      characterChoice.classList.add("characterChoice");
      
      choiceContainer.appendChild(choiceBar);
      choiceContainer.appendChild(characterChoice);
      predictionElement.appendChild(choiceContainer);
    }
  }
  
  characterCollection(0);
  
  inputCanvas.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
  document.addEventListener("mousedown", mouseDown);
  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (mode === "training") {
      switch (e.key) {
        case " ":
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
        case " ":
          predict();
          break;
        case "r":
          clearCanvas();
          break;
      }
    }
  });
  
  importFile.addEventListener("input", importedFile);
}

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}