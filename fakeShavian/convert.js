// import conversionMaps from "./conversionMaps.json" with {type: "json"};
// import { unicodeSplit } from "../util/stringHandler.js";

import { importJSON } from "../util/importJSON.js";

const conversionMaps = await importJSON("./conversionMaps.json");

function convert(text) {
  for (let i of conversionMaps.wordMap) {
    // if it's first word
    if (text.substring(0, i[0].length + 1) === `${i[0]} `) {
      text = `${i[1]} ` + text.substring(i[0].length + 1);
    }
    
    // if it's last word
    if (text.substring(text.length - i[0].length - 1) === ` ${i[0]}`) {
      text = text.substring(0, text.length - i[0].length - 1) + ` ${i[1]}`;
    };
    
    // replace other occurrences
    text = text.replaceAll(` ${i[0]} `, ` ${i[1]} `);
  }
  
  for (let i of conversionMaps.charMap) {
    text = text.replaceAll(i[0], i[1]);
  }
  
  return text;
}

export { convert };