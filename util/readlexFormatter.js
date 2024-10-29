// only compatible with v8 js
// import readlex from './readlex_converter.json' with {type: 'json'};

import { importJSON } from "../util/importJSON.js";

const readlex = await importJSON("../util/readlex_converter.json");

function readlexToArray() {
  const lex = []; // new list
  const keys = Object.keys(readlex); // english words
  keys.forEach((word) => { // for each english word
    readlex[word].forEach((shv) => { // and every associated shavian word
      lex.push([shv.Shaw, word]); // push it to the list of words
    });
  });
  return lex;
}

export { readlexToArray };