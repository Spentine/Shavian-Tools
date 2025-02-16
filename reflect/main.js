import { readlexToArray } from "../util/readlexFormatter.js";

const readlex = readlexToArray();

const reflections = {
  "180": {
    "𐑐": "𐑚",
    "𐑑": "𐑛",
    "𐑒": "𐑜",
    "𐑓": "𐑝",
    "𐑔": "𐑞",
    "𐑕": "𐑕",
    "𐑟": "𐑟",
    "𐑖": "𐑠",
    "𐑗": "𐑡",
    "𐑘": "𐑢",
    "𐑙": "𐑣",
    "𐑣": "𐑙",
    "𐑤": "𐑮",
    "𐑥": "𐑥",
    "𐑯": "𐑯",
    "𐑦": "𐑦",
    "𐑧": "𐑪",
    "𐑨": "𐑩",
    "𐑫": "𐑵",
    "𐑴": "𐑴",
    "𐑰": "𐑰",
  },
};

function addPair(reflection) {
  const keys = Object.keys(reflection);
  for (let key of keys) {
    reflection[reflection[key]] = key;
  }
  return reflection;
}

addPair(reflections["180"]);

function upsideDown(text) {
  const reflection = reflections["180"];
  var str = "";
  for (let char of text) {
    if (reflection[char]) {
      str = reflection[char] + str;
    } else {
      str += "x" + str;
    }
  }
  return str;
}

function main() {
  const outputData = document.getElementById("outputData");
  console.log(readlex);
  const r180 = [];
  for (let pair of readlex) {
    const [shavian, latin] = pair;
    const upsideDownShavian = upsideDown(shavian);
    
    if (upsideDownShavian === shavian) {
      r180.push([upsideDownShavian, latin]);
    }
    
    // if there is another word in the dictionary that is the same upside down, add it to the list
    // const index = readlex.findIndex((pair) => {
    //   return pair[0] === upsideDownShavian;
    // });
    
    // if (index !== -1) {
    //   r180.push([upsideDownShavian, latin, readlex[index][1]]);
    // }
  }
  // sort by length of shavian word
  r180.sort((a, b) => {
    return a[0].length - b[0].length;
  });
  console.log(r180);
  
  // print it out also human readable
  const output = r180.map((pair) => {
    return `${pair[0]}: ${pair[1]}`;
  });
  var text = output.join("\n");
  console.log(text);
  
  outputData.innerHTML = output.join("<br>");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}