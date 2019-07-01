// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Transfer Learning Feature Extractor Classification with ml5
// https://youtu.be/eeO-rWYFuG0

var mobilenet;
var classifier;
let video;
let loss;
let label = 'test';
let img;
let flowerTyp;
let data = {};
let dataFlower = [];
let canvas;
var selectedFile;
const googleImages = 108;                                                         
const amazonImages = 103;                                                         
const paypalImages = 159;                                                         
const facebookImages = 211;                                                       
const dropboxImages = 133;           
const width = 800;
const height = 800;


function preload() {
  data = loadJSON('json_ml5data.json', jsonReady);
}

// function load_imgs() {
//   for (let n = 0; n < 5; n++){
//     for (let i = 0; i < 20; i++){
//       imgpath = data.children[n].children[i].path;
//       type = data.children[n].children[i].type;
//       img = createImg(imgpath).hide();
//       console.log(imgpath + " loading " + type);
//       classifier.addImage(img, type);
//     }
//  	}
// }

function load_imgs(label, nimgs) {
  for (let i = 0; i < nimgs; i++){
    imgpath = data.children[label].children[i].path;
    type = data.children[label].children[i].type;
    img = createImg(imgpath).hide();
    console.log(imgpath + " loading " + type);
    classifier.addImage(img, type);
  }
}

// Change the status when the model loads.
function jsonReady(){
  console.log('json loaded');
}

// Change the status when the model loads.
function modelReady() {
  select('#modelStatus').html('MobileNet Loaded!')
  console.log('Model loaded');

  load_imgs(0, googleImages);
  load_imgs(1, amazonImages);
  load_imgs(2, paypalImages);
  load_imgs(3, facebookImages);
  load_imgs(4, dropboxImages);

  // load_imgs(0, 10);
  // load_imgs(1, 10);
  // load_imgs(2, 10);
  // load_imgs(3, 10);
  // load_imgs(4, 10);
}


function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
    //classifier.classify(gotResults);
  } else {
    console.log(loss);
  }
}

function classifierReady () {
  console.log("classifier is loaded");
}

function setup() {
  var c = createCanvas(400, 400);
  background(100);
  c.drop(gotFile);

  const options = {version: 1, epochs: 20, numLabels: 5, batchSize: 0.2 };
  mobilenet = ml5.featureExtractor('MobileNet', options, modelReady);
  classifier = mobilenet.classification(classifierReady);

  // imgButton = createButton('load imgs');
  // imgButton.mousePressed(function() {
  //   console.log('load images now');
  //   load_imgs();
  //   console.log('Image loading done');
  // });

  //trainButton = createButton('train');
  trainButton = select('#train'); 
  trainButton.mousePressed(function() {
    classifier.train(whileTraining);
  });

  saveButton = select('#save'); 
  saveButton.mousePressed(function() {
    classifier.save();
    console.log('Custom Model saved!!');
  });

  loadButton = createButton('load');
  loadButton.mousePressed(function() {
    //classifier.load('model.json');
    //console.log('Custom Model loaded');
  });
  
  input = select('#input');
  input.mousePressed(function() {
    selectedFile = document.getElementById('input').files[0];
    console.log(selectedFile);
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
  console.log(result[0]);
  console.log(result[0].label);
	select('#res1').html(result[0].label);
  select('#conf1').html(round(result[0].confidence * 100) + '%');

	select('#res2').html(result[1].label);
  select('#conf2').html(round(result[1].confidence *100) + '%');

	select('#res3').html(result[2].label);
  select('#conf3').html(round(result[2].confidence * 100) + '%');

	select('#res4').html(result[3].label);
  select('#conf4').html(round(result[3].confidence * 100) + '%');

	select('#res5').html(result[4].label);
	select('#conf5').html(round(result[4].confidence * 100) + '%');
  });
}

function gotFile(file) {
  console.log(file);
  // If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it
    img = createImg(file.data, testModel);
    // Draw the image onto the canvas
    // image(img, 0, 0, width, height);
    image(img, 0, 0);
  } else {
    console.log('Not an image file!');
  }
}

function draw() {
  fill(255);
  noStroke();
  textSize(12);
  textAlign(CENTER);
  text('Drag an image after loading Custom Model.', 200, 200);
  noLoop();
}
