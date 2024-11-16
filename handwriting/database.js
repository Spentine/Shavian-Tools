var database = [];

function saveImageToDatabase(image, character) {
  database.push({
    "image": image,
    "character": character,
  });
}

function popImageFromDatabase() {
  if (database.length === 0) {
    console.log("There's nothing in the database!");
    return;
  }
  
  database.pop();
}

function exportDatabase() {
  return JSON.stringify(database);
}

function downloadDatabase() {
  const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(database));
  const a = document.createElement("a");
  a.href = data;
  a.download = "database.json";
  a.click();
}

export { database, saveImageToDatabase, popImageFromDatabase, downloadDatabase };