import jszip from "https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm";

/**
 * outputs a bunch of images
 * @param {function} callback the function to call when the guideline image is loaded
 * @param {number} width the width of the output images
 * @param {number} height the height of the output images
 */
function generate(callback, width, height) {
  const characters = [
    { name: "peep", char: "𐑐" },
    { name: "tot", char: "𐑑" },
    { name: "kick", char: "𐑒" },
    { name: "fee", char: "𐑓" },
    { name: "thigh", char: "𐑔" },
    { name: "so", char: "𐑕" },
    { name: "sure", char: "𐑖" },
    { name: "church", char: "𐑗" },
    { name: "yea", char: "𐑘" },
    { name: "hung", char: "𐑙" },
    { name: "bib", char: "𐑚" },
    { name: "dead", char: "𐑛" },
    { name: "gag", char: "𐑜" },
    { name: "vow", char: "𐑝" },
    { name: "they", char: "𐑞" },
    { name: "zoo", char: "𐑟" },
    { name: "measure", char: "𐑠" },
    { name: "judge", char: "𐑡" },
    { name: "woe", char: "𐑢" },
    { name: "ha-ha", char: "𐑣" },
    { name: "loll", char: "𐑤" },
    { name: "mime", char: "𐑥" },
    { name: "if", char: "𐑦" },
    { name: "egg", char: "𐑧" },
    { name: "ash", char: "𐑨" },
    { name: "ado", char: "𐑩" },
    { name: "on", char: "𐑪" },
    { name: "wool", char: "𐑫" },
    { name: "out", char: "𐑬" },
    { name: "ah", char: "𐑭" },
    { name: "roar", char: "𐑮" },
    { name: "nun", char: "𐑯" },
    { name: "eat", char: "𐑰" },
    { name: "age", char: "𐑱" },
    { name: "ice", char: "𐑲" },
    { name: "up", char: "𐑳" },
    { name: "oak", char: "𐑴" },
    { name: "ooze", char: "𐑵" },
    { name: "oil", char: "𐑶" },
    { name: "awe", char: "𐑷" },
    { name: "are", char: "𐑸" },
    { name: "or", char: "𐑹" },
    { name: "air", char: "𐑺" },
    { name: "err", char: "𐑻" },
    { name: "array", char: "𐑼" },
    { name: "ear", char: "𐑽" },
    { name: "Ian", char: "𐑾" },
    { name: "yew", char: "𐑿" },
    
    // extended shavian
    { name: "oeuvre", char: "𐑻\ufe00"},
    { name: "yeah", char: "𐑺\ufe00"},
    { name: "loch", char: "𐑒\ufe00"},
    { name: "argh", char: "𐑜\ufe00"},
    { name: "which", char: "𐑢\ufe00"},
    { name: "llan", char: "𐑤\ufe00"},
  ];
  
  const characterImages = {};
  
  /**
   * creates the general guideline under each character
   * @returns {Image} the guideline image
   */
  const createGuideline = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    ctx.strokeStyle = "#888888";
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // vertical line
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    
    ctx.stroke();
    ctx.strokeStyle = "#333333";
    
    const drawHorizontalLine = (y) => {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    
    const drawDottedHorizontalLine = (y) => {
      const dashLength = 10;
      let x = 0;
      while (x < canvas.width) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + dashLength, y);
        x += dashLength * 2;
      }
    }
    
    ctx.beginPath();
    
    drawDottedHorizontalLine(canvas.height * 0.9); // descender
    drawHorizontalLine(canvas.height * 0.75); // baseline
    drawDottedHorizontalLine(canvas.height * 0.3); // height
    drawHorizontalLine(canvas.height * 0.15); // cap height
    
    ctx.stroke();
    
    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
  };
  
  const guidelineImage = createGuideline();
  
  /**
   * renders a character to an image
   * @param {string} char the character to render
   * @returns {Image} the rendered image
   */
  const renderCharacter = (char) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(guidelineImage, 0, 0);
    
    ctx.fillStyle = "black";
    ctx.font = `normal ${height * 0.8}px 'Inter Alia'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    
    // convert canvas to image
    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
  };
  
  guidelineImage.onload = () => {
    for (const character of characters) {
      const image = renderCharacter(character.char);
      characterImages[character.name] = image;
    }
    callback(characterImages);
  };
}

function main() {
  const outputElement = document.getElementById("output");
  const downloadButton = document.getElementById("downloadButton");
  
  // wait until inter alia font loaded
  document.fonts.load("400px 'Inter Alia'").then(() => {
    generate((characterImages) => {
      addCharacterImages(characterImages);
      
      downloadButton.addEventListener("click", () => {
        downloadCharacterImages(characterImages);
      });
    }, 192, 256);
  });
  
  const addCharacterImages = (characterImages) => {
    console.log(characterImages);
    
    for (const [name, image] of Object.entries(characterImages)) {
      const container = document.createElement("div");
      container.classList.add("character-container");
      
      const imgElement = document.createElement("img");
      imgElement.src = image.src;
      
      const label = document.createElement("p");
      label.classList.add("character-label");
      label.textContent = name;
      
      container.appendChild(imgElement);
      container.appendChild(label);
      outputElement.appendChild(container);
    }
  };
  
  const downloadCharacterImages = (characterImages) => {
    const zip = new jszip();
    
    const folder = zip.folder("shavian_characters");
    for (const [name, image] of Object.entries(characterImages)) {
      const base64Data = image.src.split(",")[1];
      folder.file(`${name}.png`, base64Data, { base64: true });
    }
    
    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "shavian_characters.zip";
      link.click();
    });
  };
}

main();