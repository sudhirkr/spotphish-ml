// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Transfer Learning Feature Extractor Classification with ml5
// https://youtu.be/eeO-rWYFuG0

let mobilenet;
let classifier;
let video;
let loss;
let label = 'test';
let img;
let flowerTyp;
let data = {};
let dataFlower = [];
let canvas;
let width = 300;
let height = 300;

function preload() {
  data = loadJSON('json_ml5data.json', jsonReady);
  console.log("Json data loaded");
}

// Change the status when the model loads.
function modelReady(){
  console.log("Model ready");
}

// Change the status when the model loads.
function jsonReady(){
  console.log("Json data loaded");
}

function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
//    classifier.classify(gotResults);
  } else {
    console.log(loss);
  }
}

function setup() {
  var c = createCanvas(300, 300);
  background(100);
  c.drop(gotFile);
  //const options = {version: 1, epochs: 50, numLabels: 5 };
  const options = {version: 1, epochs: 1, numLabels: 5, batchSize:0.2 };
  mobilenet = ml5.featureExtractor('MobileNet', options, modelReady);
  classifier = mobilenet.classification();
  for (let n = 0; n < 5; n++){
    for (let i = 0; i < 20; i++){
    	// Load the image
	    imgPfad = data.children[n].children[i].path;
	    flowerTyp = data.children[n].children[i].type;
	    img = createImg(imgPfad).hide();
	    classifier.addImage(img, flowerTyp);
	    console.log(imgPfad + " hinzugefügt als " + flowerTyp);
	  }
  }

  trainButton = createButton('train');
  trainButton.mousePressed(function() {
    classifier.train(whileTraining);
  });

  saveButton = createButton('save');
  saveButton.mousePressed(function() {
    classifier.save();
    console.log('Custom Model saved!!');
  });

  loadButton = createButton('load');
  loadButton.mousePressed(function() {
    classifier.load('model.json');
    console.log('Custom Model loaded');
  });

  testButton = createButton('test');
  testButton.mousePressed(function() {
    img = createImg('../img/Hohler_Lerchensporn/8.jpg', testModel);
  });
}

function testModel() {
  // Get a prediction for that image
  classifier.classify(img, function(err, result) {
	console.log(result);
	select('#result').html(result);
  });
  
}

function gotFile(file) {
  // If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it
    img = createImg(file.data, testModel).hide();
    // Draw the image onto the canvas
    image(img, 0, 0, width, height);
  } else {
    console.log('Not an image file!');
  }
}

function draw() {
  fill(255);
  noStroke();
  textSize(12);
  textAlign(CENTER);
  text('Drag an image after loading Custom Model.', width/2, height/2);
  noLoop();
}
