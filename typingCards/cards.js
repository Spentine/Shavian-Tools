import cards from './cards.json' with {type: 'json'};

const downloaded = {};

const locations = cards.locations;
const packFiles = cards.packFiles;
const packNames = cards.packNames;

async function cardRequester(cardPack) {
  const pack = packFiles[cardPack]; // get name of larger pack
  if (downloaded[pack]) return downloaded[pack][cardPack]; // if downloaded then return it
  
  const response = await fetch(locations[pack]); // try to download it
  if (!response.ok) return [["ERROR", "ERROR"]]; // if it's not ok then return errors
  
  downloaded[pack] = await response.json(); // wait to parse the json
  return downloaded[pack][cardPack]; // return the now downloaded pack
}

export { cardRequester, packNames };