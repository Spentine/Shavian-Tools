import { readlexToArray } from "../util/readlexFormatter.js";

const readlex = readlexToArray();
var filtered = null;
var showOutputMenu = false;
var showInformationMenu = false;

function main() {
  const information = document.getElementById("information");
  
  const allowedCharactersInput = document.getElementById("allowedCharactersInput");
  const mustContainInput = document.getElementById("mustContainInput");
  const startsWithInput = document.getElementById("startsWithInput");
  const endsWithInput = document.getElementById("endsWithInput");
  const notStartWithInput = document.getElementById("notStartWithInput");
  const notEndWithInput = document.getElementById("notEndWithInput");
  const regexInput = document.getElementById("regexInput");
  
  const filterButton = document.getElementById("filterButton");
  
  const outputMenu = document.getElementById("outputMenu");
  
  const ShavianSort = document.getElementById("ShavianSort");
  const LatinSort = document.getElementById("LatinSort");
  const ShavianLengthSort = document.getElementById("ShavianLengthSort");
  const LatinLengthSort = document.getElementById("LatinLengthSort");
  
  const jsonOutput = document.getElementById("jsonOutput");
  const csvOutput = document.getElementById("csvOutput");
  const textSLOutput = document.getElementById("textSLOutput");
  const textSOutput = document.getElementById("textSOutput");
  
  const outputElement = document.getElementById("outputElement");
  
  filterButton.addEventListener("click", () => {
    
    var regex;
    try {
      regex = new RegExp(regexInput.value);
    } catch {
      regex = null;
    }
    
    filtered = readlex.filter((pair) => {
      if (!pair[0].includes(mustContainInput.value)) return false;
      if (!(pair[0].substring(0, startsWithInput.value.length) === startsWithInput.value)) return false;
      if (!(pair[0].substring(pair[0].length - endsWithInput.value.length) === endsWithInput.value)) return false;
      if (notStartWithInput.value && (pair[0].substring(0, notStartWithInput.value.length) === notStartWithInput.value)) return false;
      if (notEndWithInput.value && (pair[0].substring(pair[0].length - notEndWithInput.value.length) === notEndWithInput.value)) return false;
      if (regex && !regex.test(pair[0])) return false;
      for (let i of pair[0]) {
        if (!(allowedCharactersInput.value.includes(i))) return false;
      }
      return true;
    });
    
    if (filtered.length === 0) {
      filtered = null;
      showOutputMenu = false;
    } else {
      showOutputMenu = true;
    }
    
    if (showOutputMenu) {
      outputMenu.style.display = "block";
    } else {
      outputMenu.style.display = "none";
    }
    
  });
  
  ShavianSort.addEventListener("click", () => {
    filtered.sort((a, b) => a[0].localeCompare(b[0]));
  });
  
  LatinSort.addEventListener("click", () => {
    filtered.sort((a, b) => a[1].localeCompare(b[1]));
  });
  
  ShavianLengthSort.addEventListener("click", () => {
    filtered.sort((a, b) => a[0].length - b[0].length);
  });
  
  LatinLengthSort.addEventListener("click", () => {
    filtered.sort((a, b) => a[1].length - b[1].length);
  });
  
  jsonOutput.addEventListener("click", () => {
    displayResult(JSON.stringify(filtered));
  });
  
  csvOutput.addEventListener("click", () => {
    displayResult(filtered.map((pair) => pair[0] + "," + pair[1]).join("\n"));
  });
  
  textSLOutput.addEventListener("click", () => {
    displayResult(filtered.map((pair) => pair[0] + "\t" + pair[1]).join("\n"));
  });
  
  textSOutput.addEventListener("click", () => {
    displayResult(filtered.map((pair) => pair[0]).join(" "));
  });
  
  function displayResult(s) {
    if (s.length > 1e5) {
      if (confirm("The text output is larger than 100,000 characters long. Would you rather download a file?")) {
        const l = document.createElement("a");
        l.download = "output.txt";
        l.href = "data:text/plain;base64," + btoa(unescape(encodeURIComponent(s)));
        l.click();
        return;
      }
    }
    outputElement.innerText = s;
  }
  
  // information about page
  information.addEventListener("click", () => {
    showInformationMenu = !showInformationMenu;
    
    informationMenu.style.display = showInformationMenu ? "block" : "none";
    information.innerText = showInformationMenu ? "Hide Information" : "Show More Information";
  });
}

if (document.readyState === "loading") { 
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}