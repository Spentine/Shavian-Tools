import { chars, toIndex } from "./characters.js";
import { sideLength } from "./util.js";

var shavianNN;

async function nnMain() {
  /*
  shavianNN = tf.sequential({
    layers: [
      tf.layers.dense({inputShape: [578], units: 256, activation: 'relu'}),
      tf.layers.dense({units: 128, activation: 'relu'}),
      tf.layers.dense({units: 96, activation: 'relu'}),
      tf.layers.dense({units: chars.length, activation: 'relu'}),
    ]
  });
  */
  shavianNN = tf.sequential({
    layers: [
      
      tf.layers.conv2d({
        inputShape: [sideLength, sideLength, 1],
        filters: 32,
        kernelSize: 3,
        strides: 2,
        padding: "same",
        activation: 'relu',
      }),
      
      tf.layers.maxPooling2d({
        poolSize: 2,
        strides: 1,
      }),
      
      tf.layers.conv2d({
        filters: 48,
        kernelSize: 3,
        strides: 1,
        padding: "same",
        activation: 'relu',
      }),
      
      tf.layers.flatten(),
      
      tf.layers.dense({units: 48, activation: 'relu'}),
      tf.layers.dense({units: chars.length, activation: 'softmax'}),
      
    ]
  });
}

async function nnSave() {
  await shavianNN.save('downloads://my-model');
}

async function nnLoad() {
  shavianNN = await tf.loadLayersModel('http://localhost:8000/GitHub/Shavian-Tools/handwriting/models/v0.18/my-model.json');
}

async function nnData(data) {
  // load data
  const INPUTS = [];
  const OUTPUTS = [];
  for (let i of data) {
    INPUTS.push([
      // i.scaleX,
      // i.scaleY,
      ...i.imageData,
    ]);
    OUTPUTS.push(
      toIndex[i.character],
    );
  }
  
  // shuffle data
  tf.util.shuffleCombo(INPUTS, OUTPUTS);
  
  const INPUTS_TENSOR = tf.tensor2d(INPUTS).reshape([INPUTS.length, sideLength, sideLength, 1]);
  const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), chars.length);
  
  return {
    "INPUTS_TENSOR": INPUTS_TENSOR,
    "OUTPUTS_TENSOR": OUTPUTS_TENSOR,
  }
}

function logProgress(epoch, logs) {
  console.log(`epoch: ${epoch}; error: ${Math.sqrt(logs.loss)}; val error: ${Math.sqrt(logs.val_loss)}`);
}

async function nnTrain(data) {
  const tensors = await nnData(data);
  
  const INPUTS_TENSOR = tensors.INPUTS_TENSOR;
  const OUTPUTS_TENSOR = tensors.OUTPUTS_TENSOR;
  
  /*
  console.log(await INPUTS_TENSOR.slice([0, 0], [1, 578]).array());
  console.log(await OUTPUTS_TENSOR.slice([0, 0], [1, 77]).array());
  */
  
  shavianNN.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });
  
  let results = await shavianNN.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
    shuffle: true,
    validationSplit: 0.1,
    batchSize: 55 * 24,
    epochs: 48,
    callbacks: {onEpochEnd: logProgress}
  });
  
  OUTPUTS_TENSOR.dispose();
  INPUTS_TENSOR.dispose();
  
  console.log(`error loss: ${Math.sqrt(results.history.loss[results.history.loss.length-1])}`);
  console.log(`validation error loss: ${Math.sqrt(results.history.val_loss[results.history.val_loss.length-1])}`);
  
  nnSave();
}

async function nnPredict(data) {
  const INPUT = tf.tensor2d([[
    // data.scaleX,
    // data.scaleY,
    ...data.imageData,
  ]]);
  
  const answer = tf.tidy(function() {
    const OUTPUT = shavianNN.predict(INPUT.reshape([1, sideLength, sideLength, 1]));
    OUTPUT.print();
    return OUTPUT.squeeze();
  });
  
  INPUT.dispose();
  
  const arrayResult = await answer.array();
  
  /*
  answer.array().then(function(index) {
    console.log(chars[index]);
  });
  */
 
  return normalizeArray(arrayResult); 
}

function normalizeArray(array) {
  var sum = 0;
  for (let i of array) {
    sum += i;
  }
  for (let i in array) {
    array[i] /= sum;
  }
  return array;
}

export { nnMain, nnTrain, nnLoad, nnPredict };