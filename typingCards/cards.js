/* import basic from './cards/basic.json' with {type: 'json'}; */

const downloaded = {};

const locations = {
  "basic": "./cards/basic.json",
}

const packNames = {
  "c4": "basic",
  "c5": "basic",
  "c6": "basic",
  "c7": "basic",
  "c8": "basic",
  "c9": "basic",
  "c10": "basic",
  "c11": "basic",
  "c12": "basic",
  "c13": "basic",
  "c14": "basic",
  "c15": "basic",
  "c16": "basic",
  "c17": "basic",
  "c18": "basic",
  "c19": "basic",
  "c20": "basic",
  "c21": "basic",
}

async function cardRequester(cardPack) {
  const pack = packNames[cardPack]; // get name of larger pack
  if (downloaded[pack]) return downloaded[pack][cardPack]; // if downloaded then return it
  
  const response = await fetch(locations[pack]); // try to download it
  if (!response.ok) return [["ERROR", "ERROR"]]; // if it's not ok then return errors
  
  downloaded[pack] = await response.json(); // wait to parse the json
  return downloaded[pack][cardPack]; // return the now downloaded pack
}

export { cardRequester };