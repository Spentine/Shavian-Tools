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
  "o": "𐑪",
  "ou": "𐑫",
  "ow": "𐑬",
  "aw": "𐑷",
  "E": "𐑰",
  "A": "𐑱",
  "I": "𐑲",
  "Uh": "𐑳",
  "O": "𐑴",
  "u": "𐑵",
  "oi": "𐑶",
  "ah": "𐑭",
  
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
  "\\<": "‹",
  "\\>": "›",
}
const delimiter = "x";

function createProcessOrder(map, delimiter) {
  const pOrder = [];
  
  const monogram = Object.keys(map).filter(key => key.length === 1);
  const bigram = Object.keys(map).filter(key => key.length === 2);
  
  /*
   * given bigram (ab -> c)
   * and monograms (a -> d, b -> e)
   * the order of processing should be:
   * 
   * 1. axb -> de (trigram delimiter)
   * 2. dx -> ax (bigram delimiter)
   * 3. ab -> c (generic bigram)
   * 4. db -> c (bigram)
   * 
   * monograms are added separately afterwards
   */
  
  // handle trigram delimiter processing
  const triD = {};
  for (const key of bigram) {
    const a = key[0];
    const b = key[1];
    triD[a + delimiter + b] = (map[a] ?? "") + (map[b] ?? "");
  }
  for (const key in triD) {
    pOrder.push({
      find: key,
      replace: triD[key] ?? ""
    });
  }
  
  // handle bigram delimiter processing
  const biD = {};
  for (const key of bigram) {
    const a = key[0];
    biD[map[a] + delimiter] = a + delimiter;
  }
  for (const key in biD) {
    pOrder.push({
      find: key,
      replace: biD[key] ?? ""
    });
  }
  
  // handle generic bigram processing
  for (const key of bigram) {
    pOrder.push({
      find: key,
      replace: map[key] ?? ""
    });
  }
  
  // handle bigram processing
  for (const key of bigram) {
    const a = key[0];
    const b = key[1];
    pOrder.push({
      find: map[a] + b,
      replace: map[key] ?? ""
    });
  }
  
  // handle monogram processing
  for (const key of monogram) {
    pOrder.push({
      find: key,
      replace: map[key] ?? ""
    });
  }
  
  return pOrder;
}

function parseEntireText(text, map, delimiter) {
  // go step by step through the text
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    // if the next character is a delimiter
    if (nextChar === delimiter) {
      // map the current character
      result += map[char] ?? char;
      
      // skip the delimiter
      i++;
      continue;
    }
    
    // if the current and next character form a bigram
    const bigram = char + nextChar;
    if (map[bigram]) {
      // map the bigram
      result += map[bigram];
      
      // skip the next character
      i++;
      continue;
    }
    
    // if the current character is a monogram
    result += map[char] ?? char;
  }
  return result;
}

function reverse(text, map, delimiter) {
  // create a reverse map
  const reverseMap = {};
  for (const key in map) {
    reverseMap[map[key]] = key;
  }
  
  // go step by step through the text
  let result = "";
  let i = 0;
  
  function isLeftSurrogate(charCode) {
    return charCode >= 0xD800 && charCode <= 0xDBFF;
  }
  
  // function to skip to the next character
  // shavian text contains surrogate pairs bc it is from U+10450 to U+1047F
  function skipToNextChar() {
    // check for left surrogate
    const charCode = text.charCodeAt(i);
    if (isLeftSurrogate(charCode)) {
      // if it's a left surrogate, skip the next character
      i += 2;
    } else {
      // otherwise, just skip the current character
      i++;
    }
  }
  
  while (i < text.length) {
    processing: {
      let next;
      let char;
      let nextChar;
      
      if (isLeftSurrogate(text.charCodeAt(i))) {
        char = text[i] + text[i + 1];
        next = i + 2;
      } else {
        char = text[i];
        next = i + 1;
      }
      
      if (isLeftSurrogate(text.charCodeAt(next))) {
        nextChar = text[next] + text[next + 1];
      } else {
        nextChar = text[next];
      }
      
      // if the current character isn't a valid character
      if (!reverseMap[char]) {
        result += char;
        break processing;
      }
      
      if (reverseMap[nextChar]) {
        // if the current and next character form a bigram
        const bigram = reverseMap[char] + reverseMap[nextChar];
        if (map[bigram]) {
          // map the bigram
          result += (
            reverseMap[char] +
            delimiter +
            reverseMap[nextChar]
          );
          
          // skip the next character
          skipToNextChar();
          break processing;
        }
      }
      
      // if the current character is a monogram
      if (reverseMap[char]) {
        // map the monogram
        result += reverseMap[char];
        break processing;
      }
      
      result += char; // if nothing matched, just add the character
    }
    skipToNextChar();
  } 
  return result;
}

function main() {
  const inputText = document.getElementById("inputText");
  const replaceAll = document.getElementById("replaceAll");
  const reverseBtn = document.getElementById("reverse");
  const processOrder = createProcessOrder(letterMap, delimiter);
  
  inputText.addEventListener("input", function() {
    // find where the cursor is
    const cursorPos = inputText.selectionStart;
    
    // get previous three characters
    const beginning = Math.max(0, cursorPos - 3);
    const prevThree = inputText.value.slice(beginning, cursorPos);
    
    // find first valid replacement
    let replacement;
    for (const item of processOrder) {
      if (prevThree.endsWith(item.find)) {
        replacement = item;
        break;
      }
    }
    
    // if no replacement found, return
    if (!replacement) return;
    
    // replace the text
    const end = cursorPos;
    const start = end - replacement.find.length;
    const newText = (
      inputText.value.slice(0, start) +
      replacement.replace +
      inputText.value.slice(end)
    );
    
    // move cursor to the end of the replacement
    inputText.value = newText;
    const newCursorPos = start + replacement.replace.length;
    inputText.setSelectionRange(newCursorPos, newCursorPos);
  });
  
  replaceAll.addEventListener("click", function() {
    // get the entire text
    const text = inputText.value;
    
    // parse the entire text
    const parsedText = parseEntireText(text, letterMap, delimiter);
    
    // set the new text
    inputText.value = parsedText;
  });
  
  reverseBtn.addEventListener("click", function() {
    // get the entire text
    const text = inputText.value;
    
    // reverse the text
    const reversedText = reverse(text, letterMap, delimiter);
    
    // set the new text
    inputText.value = reversedText;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}