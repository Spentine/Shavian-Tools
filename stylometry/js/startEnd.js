import { toUnicodeArray, getReadLex } from "./util.js";

async function startEnd() {
  const readlex = await getReadLex();
  
  const starts = {};
  const ends = {};
  
  readlex.forEach(w => {
    const word = toUnicodeArray(w);
    
    const startChar = word[0];
    const endChar = word[word.length - 1];
    
    if (startChar in starts) {
      starts[startChar]++;
    } else {
      starts[startChar] = 1;
    }
    
    if (endChar in ends) {
      ends[endChar]++;
    } else {
      ends[endChar] = 1;
    }
    
    if (!(endChar in starts)) {
      starts[endChar] = 0;
    }
    
    if (!(startChar in ends)) {
      ends[startChar] = 0;
    }
  });
  
  return {"starts": starts, "ends": ends};
}

export { startEnd };