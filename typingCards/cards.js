/* import basic from './cards/basic.json' with {type: 'json'}; */

const downloaded = {};

const locations = {
  "basic": "./cards/basic/basic.json",
  "basic2": "./cards/basic/basic2.json",
  "basic3": "./cards/basic/basic3.json",
  "basic4": "./cards/basic/basic4.json",
  
  "ing": "./cards/suffix/ing.json",
  "tion": "./cards/suffix/tion.json",
}

const packFiles = {
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
  "c19": "basic2",
  "c20": "basic2",
  "c21": "basic2",
  "c22": "basic2",
  "c23": "basic2",
  "c24": "basic2",
  "c25": "basic2",
  "c26": "basic2",
  "c27": "basic2",
  "c28": "basic2",
  "c29": "basic3",
  "c30": "basic3",
  "c31": "basic3",
  "c32": "basic3",
  "c33": "basic3",
  "c34": "basic3",
  "c35": "basic3",
  "c36": "basic3",
  "c37": "basic3",
  "c38": "basic3",
  "c39": "basic3",
  "c40": "basic3",
  "c41": "basic4",
  "c42": "basic4",
  "c43": "basic4",
  "c44": "basic4",
  "c45": "basic4",
  "c46": "basic4",
  "c47": "basic4",
  "c48": "basic4",
  
  "ing": "ing",
  "tion": "tion",
}

const packNames = {
  "c4": "c4 (𐑦𐑑𐑩𐑕)",
  "c5": "c5 (𐑯)",
  "c6": "c6 (𐑤)",
  "c7": "c7 (𐑒)",
  "c8": "c8 (𐑛)",
  "c9": "c9 (𐑟)",
  "c10": "c10 (𐑮)",
  "c11": "c11 (𐑐)",
  "c12": "c12 (𐑥)",
  "c13": "c13 (𐑼)",
  "c14": "c14 (𐑨)",
  "c15": "c15 (𐑧)",
  "c16": "c16 (𐑚)",
  "c17": "c17 (𐑱)",
  "c18": "c18 (𐑙)",
  "c19": "c19 (𐑓)",
  "c20": "c20 (𐑲)",
  "c21": "c21 (𐑪)",
  "c22": "c22 (𐑴)",
  "c23": "c23 (𐑳)",
  "c24": "c24 (𐑰)",
  "c25": "c25 (𐑜)",
  "c26": "c26 (𐑖)",
  "c27": "c27 (𐑝)",
  "c28": "c28 (𐑢)",
  "c29": "c29 (𐑡)",
  "c30": "c30 (𐑣)",
  "c31": "c31 (𐑻)",
  "c32": "c32 (𐑹)",
  "c33": "c33 (𐑵)",
  "c34": "c34 (𐑗)",
  "c35": "c35 (𐑸)",
  "c36": "c36 (𐑬)",
  "c37": "c37 (𐑿)",
  "c38": "c38 (𐑫)",
  "c39": "c39 (𐑭)",
  "c40": "c40 (𐑷)",
  "c41": "c41 (𐑔)",
  "c42": "c42 (𐑾)",
  "c43": "c43 (𐑘)",
  "c44": "c44 (𐑺)",
  "c45": "c45 (𐑽)",
  "c46": "c46 (𐑶)",
  "c47": "c47 (𐑞)",
  "c48": "c48 (𐑠)",
  
  "ing": "ing (𐑦𐑙)",
  "tion": "tion (𐑖𐑩𐑯)",
};

async function cardRequester(cardPack) {
  const pack = packFiles[cardPack]; // get name of larger pack
  if (downloaded[pack]) return downloaded[pack][cardPack]; // if downloaded then return it
  
  const response = await fetch(locations[pack]); // try to download it
  if (!response.ok) return [["ERROR", "ERROR"]]; // if it's not ok then return errors
  
  downloaded[pack] = await response.json(); // wait to parse the json
  return downloaded[pack][cardPack]; // return the now downloaded pack
}

export { cardRequester, packNames };