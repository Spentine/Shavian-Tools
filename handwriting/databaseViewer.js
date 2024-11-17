import { processImage } from "./util.js";
import { nnMain, nnTrain } from "./neuralNetwork.js";

function downloadDatabase(db) {
  const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
  const a = document.createElement("a");
  a.href = data;
  a.download = "database.json";
  a.click();
}

function main() {
  const importFile = document.getElementById("importFile");
  const databaseElement = document.getElementById("databaseElement");
  const clearDatabaseButton = document.getElementById("clearDatabaseButton");
  const exportDatabaseButton = document.getElementById("exportDatabaseButton");
  const trainNN = document.getElementById("trainNN");
  var database;
  var operationalDatabase;
  
  function importedFile() {
    const file = importFile.files[0];
    const reader = new FileReader();
    
    reader.addEventListener("load", () => {
      try {
        const fileData = JSON.parse(reader.result);
        database.push(...fileData);
        console.log(fileData);
        viewContents(fileData);
        makeOperationalDb(fileData);
      } catch {
        console.log("Failed to import database!");
      }
    });
    
    if (file) {
      reader.readAsText(file);
    }
  }
  
  function clearDatabase() {
    database = [];
    operationalDatabase = [];
    while (databaseElement.firstChild) {
      databaseElement.removeChild(databaseElement.lastChild);
    }
  }
  
  function viewContents(db) {
    // delete all contents
    
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
    const readyLength = operationalDatabase.length + db.length;
    
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
      if (operationalDatabase.length !== readyLength) return;
      console.log("Databases fully loaded!");
    }
  }
  
  function train() {
    if (operationalDatabase.length !== database.length) return;
    console.log(operationalDatabase);
    nnTrain(operationalDatabase);
  }
  
  function exportDatabase() {
    downloadDatabase(database);
  }
  
  nnMain();
  importFile.addEventListener("input", importedFile);
  trainNN.addEventListener("click", train);
  clearDatabaseButton.addEventListener("click", clearDatabase);
  exportDatabaseButton.addEventListener("click", exportDatabase);
  
  clearDatabase();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}