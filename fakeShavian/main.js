import { convert } from "./convert.js";

function main() {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  
  function modifyText() {
    const convertedResult = convert(inputText.value);
    outputText.innerText = convertedResult;
  }
  
  inputText.addEventListener("input", modifyText);
}

if (document.readyState === "loading") { 
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}