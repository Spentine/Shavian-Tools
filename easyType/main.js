const letterMap = {
  // consonants
  "p": "𐑐",
  "t": "𐑑",
  "k": "𐑒",
  "f": "𐑓",
  "th": "𐑔",
  "s": "𐑕",
  "sh": "𐑖",
  "ch": "𐑗",
  "y": "𐑘",
  "ng": "𐑙",
  "b": "𐑚",
  "d": "𐑛",
  "g": "𐑜",
  "v": "𐑝",
  "dh": "𐑞",
  "z": "𐑟",
  "zh": "𐑠",
  "j": "𐑡",
  "w": "𐑢",
  "h": "𐑣",
  "l": "𐑤",
  "m": "𐑥",
  "r": "𐑮",
  "n": "𐑯",
  
  // vowels
  "i": "𐑦",
  "e": "𐑧",
  "a": "𐑨",
  "uh": "𐑩",
  "aw": "𐑪",
  "o": "𐑫",
  "ow": "𐑬",
  "ol": "𐑷",
  "E": "𐑰",
  "A": "𐑱",
  "I": "𐑲",
  "Uh": "𐑳",
  "O": "𐑴",
  "u": "𐑵",
  "oi": "𐑸",
  "ae": "𐑶",
  
  // compounds
  "R": "𐑸",
  "Ar": "𐑺",
  "ar": "𐑼",
  "Er": "𐑽",
  "Ei": "𐑾",
  "or": "𐑹",
  "er": "𐑻",
  "U": "𐑿",
  
  // misc
  ";;": "·",
  "::": "⸰",
  "<<": "«",
  ">>": "»",
}
const delimiter = "x";

function createProcessOrder(map, delimiter) {
  const pOrder = [];
  
  const monogram = Object.keys(map).filter(key => key.length === 1);
  const digram = Object.keys(map).filter(key => key.length === 2);
  
  /*
   * given digram (ab -> c)
   * and monograms (a -> d, b -> e)
   * the order of processing should be:
   * 
   * 1. axb -> de (trigram delimiter)
   * 2. dx -> ax (bigram delimiter)
   * 3. ab -> c (generic digram)
   * 
   * monograms are added separately afterwards
   */
  
  // handle trigram delimiter processing
  const triD = {};
  for (const key of digram) {
    const a = key[0];
    const b = key[1];
    triD[a + delimiter + b] = map[key];
  }
  for (const key in triD) {
    pOrder.push({
      find: key,
      replace: triD[key]
    });
  }
  
  // handle bigram delimiter processing
  const biD = {};
  for (const key of monogram) {
    biD[key + delimiter] = map[key];
  }
  for (const key in biD) {
    pOrder.push({
      find: key,
      replace: biD[key]
    });
  }
  
  // handle generic digram processing
  for (const key of digram) {
    pOrder.push({
      find: key,
      replace: map[key]
    });
  }
  
  // handle monogram processing
  for (const key of monogram) {
    pOrder.push({
      find: key,
      replace: map[key]
    });
  }
  
  return pOrder;
}

function main() {
  const inputText  = document.getElementById("inputText");
  const processOrder = createProcessOrder(letterMap, delimiter);
  
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}