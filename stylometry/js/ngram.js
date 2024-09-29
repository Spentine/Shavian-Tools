import { toUnicodeArray, getReadLex } from "./util.js";

async function ngram(n) {
  n = Number(n);
  const readlex = await getReadLex();
  const ngrams = {};
  readlex.forEach(w => {
    const word = toUnicodeArray(w);
    
    // calculate ngrams
    const l = word.length + 1 - n;
    for (let i=0; i < l; i++) {
      const ngram = word.slice(i, i+n).join("");
      if (ngram in ngrams) {
        ngrams[ngram] += 1;
      } else {
        ngrams[ngram] = 1;
      }
    }
  });
  return ngrams;
}

export { ngram };