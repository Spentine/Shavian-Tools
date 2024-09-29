// This program serves to provide helper functions.

var readlex = null;
const fileLocation = "../data.txt";

function sortedArrayize(d) {
  const arr = [];
  for (let item in d) {
    arr.push([item, d[item]]);
  }
  arr.sort((a, b) => b[1] - a[1]);
  return arr;
}

function toUnicodeArray(str) {
  // utf-16 to actual usable array
  const word = [];
  for (let i of str) {
    word.push(i);
  }
  return word;
}

function tabSplit(arr, limit=-1) {
  var result = "";
  for (let pair of arr) {
    result += pair[0] + "\t" + pair[1] + "\n";
    
    limit--;
    if (limit === 0) return result;
  }
  return result;
}

function tabSplitTrio(arr, dict1, limit=-1) {
  var result = "";
  for (let trio of arr) {
    result += trio[0] + "\t" + trio[1] + "\t" + dict1[trio[0]] + "\n";
    
    limit--;
    if (limit === 0) return result;
  }
  return result;
}

async function getReadLex() {
  if (readlex !== null) return readlex;
  const response = await fetch(fileLocation);
  const text = await response.text();
  readlex = text.split(" ");
  return readlex;
}

// getReadLex();

export { toUnicodeArray, sortedArrayize, tabSplit, tabSplitTrio, getReadLex };