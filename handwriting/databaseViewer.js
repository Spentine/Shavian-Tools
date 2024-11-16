import { processImage } from "./util.js";
import { nnMain, nnTrain } from "./neuralNetwork.js";

function main() {
  const importFile = document.getElementById("importFile");
  const databaseElement = document.getElementById("databaseElement");
  const trainNN = document.getElementById("trainNN");
  var database;
  var operationalDatabase;
  
  function importedFile() {
    const file = importFile.files[0];
    const reader = new FileReader();
    
    reader.addEventListener("load", () => {
      try {
        database = JSON.parse(reader.result);
        console.log(database);
        viewContents(database);
      } catch {
        console.log("Failed to import database!");
      }
      makeOperationalDb(database);
    });
    
    if (file) {
      reader.readAsText(file);
    }
  }
  
  function viewContents(db) {
    // delete all contents
    while (databaseElement.firstChild) {
      databaseElement.removeChild(databaseElement.lastChild);
    }
    
    for (let dataPoint of db) {
      const container = document.createElement("div");
      container.classList.add("dataPoint");
      
      const image = document.createElement("img");
      image.src = dataPoint.image;
      
      const value = document.createElement("p");
      value.innerText = dataPoint.character;
      value.classList.add("dataValue");
      
      container.appendChild(image);
      container.appendChild(value);
      
      databaseElement.appendChild(container);
    }
  }
  
  function makeOperationalDb(db) {
    operationalDatabase = [];
    
    for (let dataPoint of db) {
      const image = new Image();
      image.src = dataPoint.image;
      
      if (image.complete) {
        operationalDatabase.push(processImage(image, dataPoint));
        ready();
      } else {
        image.addEventListener("load", () => {
          operationalDatabase.push(processImage(image, dataPoint));
          ready();
        });
      }
    }
    
    function ready() {
      if (operationalDatabase.length !== db.length) return;
      console.log("Databases fully loaded!");
    }
  }
  
  function train() {
    if (operationalDatabase.length !== database.length) return;
    console.log(operationalDatabase);
    nnTrain(operationalDatabase);
  }
  
  nnMain();
  importFile.addEventListener("input", importedFile);
  trainNN.addEventListener("click", train);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}