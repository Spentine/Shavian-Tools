// CHATGPT CODE
function getCharacterBounds(imageData) {
  const width = imageData.width;  // Assuming 192
  const height = imageData.height;  // Assuming 192
  const data = imageData.data;  // Uint8ClampedArray containing pixel data

  let minX = width, maxX = 0, minY = height, maxY = 0;

  // Iterate over all pixels
  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;  // RGBA values
          const alpha = data[index + 3];  // Alpha channel

          if (alpha > 0) {  // Non-transparent pixel
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
          }
      }
  }

  // If no non-transparent pixels were found, return no bounds
  if (maxX === -1 || maxY === -1) {
      return null;
  }

  // Calculate bounds
  const sx = minX;
  const sy = minY;
  const sWidth = maxX - minX + 1;
  const sHeight = maxY - minY + 1;

  return [sx, sy, sWidth, sHeight];
}

const sideLength = 32;

function processImage(img, dp={}) {
  const boundCanvas = document.createElement("canvas");
  boundCanvas.width = 192;
  boundCanvas.height = 192;
  const boundCtx = boundCanvas.getContext("2d", { willReadFrequently: true });
  
  boundCtx.drawImage(img, 0, 0, 192, 192);
  const bounds = getCharacterBounds(boundCtx.getImageData(0, 0, 192, 192));
  
  const canvas = document.createElement("canvas");
  canvas.width = sideLength;
  canvas.height = sideLength;
  const ctx = canvas.getContext("2d");
  
  ctx.drawImage(img, ...bounds, 0, 0, sideLength, sideLength);
  const imageData = ctx.getImageData(0, 0, sideLength, sideLength).data;
  
  const outputData = [];
  
  for (let i=3; i<imageData.length; i+=4) {
    outputData.push(imageData[i] / 255);
  }
  
  // document.body.appendChild(canvas);
  return {
    "imageData": outputData,
    "character": dp.character,
    "scaleX": bounds[2] / 192,
    "scaleY": bounds[3] / 192,
  };
}

/*
function processImage(img, dp={}) {
  const canvas = document.createElement("canvas");
  canvas.width = sideLength;
  canvas.height = sideLength;
  const ctx = canvas.getContext("2d");
  
  ctx.drawImage(img, 0, 0, sideLength, sideLength);
  const imageData = ctx.getImageData(0, 0, sideLength, sideLength).data;
  
  const outputData = [];
  
  for (let i=3; i<imageData.length; i+=4) {
    outputData.push(imageData[i] / 255);
  }
  
  document.body.appendChild(canvas);
  return {
    "imageData": outputData,
    "character": dp.character,
  };
}
*/

export { processImage, sideLength };