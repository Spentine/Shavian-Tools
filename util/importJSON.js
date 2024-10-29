// ????
/*
  function getHost() {
    const re = /^.*\/\/[^\/]*\//gm;
    return location.href.match(re)[0];
  }

  const host = getHost();
*/

async function importJSON(loc) { // location
  const response = await fetch(loc);
  if (!response.ok) throw new Error("Unable to fetch.");
  
  const data = await response.json(); // wait to parse the json
  return data; // return the now downloaded pack
}

export { importJSON };