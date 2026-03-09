function characterFrequency(text) {
  const characters = {};
  for (let char of text) {
    if (characters[char]) {
      characters[char]++;
    } else {
      characters[char] = 1;
    }
  }
  
  const sorted = [];
  for (let char in characters) {
    sorted.push({ char, count: characters[char] });
  }
  sorted.sort((a, b) => b.count - a.count);
  
  return sorted;
};

async function main() {
  const text = await Deno.readTextFile("stylometry/corpusData.txt");
  
  const frequency = characterFrequency(text);
  
  for (const { char, count } of frequency) {
    console.log(`${char}: ${count}`);
  }
}

main();