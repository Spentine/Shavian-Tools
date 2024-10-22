import { sortedArrayize, tabSplit, tabSplitTrio } from "../js/util.js";
import { ngram } from "../js/ngram.js";
import { startEnd } from "../js/startEnd.js";

function main() {
  const toolSelection = document.getElementById("toolSelection");
  
  const menus = {
    "ngramMenu": document.getElementById("ngramMenu"),
    "startEndMenu": document.getElementById("startEndMenu"),
  };
  
  const ngramValue = document.getElementById("ngramValue");
  const ngramButton = document.getElementById("ngramButton");
  
  const startEndButton = document.getElementById("startEndButton");
  
  const freqPairLimit = document.getElementById("freqPairLimit");
  
  const outputElement = document.getElementById("outputElement");
  
  function output(value, type) {
    switch (type) {
      case "freqPair":
        const output = tabSplit(value, Number(freqPairLimit.value));
        outputElement.innerText = output;
        break;
      case "freqTrio":
        outputElement.innerText = tabSplitTrio(sortedArrayize(value.ends), value.starts, Number(freqPairLimit.value));
        break;
    }
  }
  
  ngramButton.addEventListener("click", () => {
    ngram(ngramValue.value).then(ngrams => {;
      const ngramArray = sortedArrayize(ngrams);
      output(ngramArray, "freqPair");
    });
  });
  
  startEndButton.addEventListener("click", () => {
    startEnd().then(data => {
      output(data, "freqTrio");
    });
  });
  
  toolSelection.addEventListener("change", () => {
    const keys = Object.keys(menus);
    for (let i=0; i<keys.length; i++) {
      const menu = menus[keys[i]];
      menu.style.display = "none";
    }
    
    menus[toolSelection.value].style.display = "block";
  });
}

if (document.readyState === "loading") { 
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}