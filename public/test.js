
var mobilenet;
var classifier;
let loss;
let img;
let img1;
let data = {};
let canvas;
var selectedFile;
const width = 400;
const height = 400;
var drozone;


// Change the status when the model loads.
function modelReady() {
  //select('#modelStatus').html('MobileNet Loaded!')
  console.log('Model loaded');
  select('.progress-bar').hide();
}

function customclassifier() {
  console.log("custom classifier is loaded");
}

function classifierReady () {
  console.log("classifier is loaded");
  //If you want to load a pre-trained model at the start
}

function highlight() {
  dropzone.style('background-color', '#AAA');
}

function unhighlight() {
  dropzone.style('background-color', '#fff');
}

function setup() {
  noCanvas();

  const options = {version: 1, epochs: 20, numLabels: 5, batchSize: 0.2 };
  mobilenet = ml5.featureExtractor('MobileNet', options, modelReady);
  classifier = mobilenet.classification(classifierReady);
  classifier.load('model.json', customclassifier);

  dropzone = select('#dropzone');
  dropzone.dragOver(highlight);
  dropzone.dragLeave(unhighlight);
  dropzone.drop(gotFile, unhighlight);

  input = select('#files');
  input.changed(function(evt) {
    var files = evt.target.files;
    console.log("files");
    console.log(files);

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        //console.log(e.target.result);
        img_selector = select('#selected-image');
        img = createImg(e.target.result, testModel);
        img.size(224, 224);
        img.parent('#selected-image');
      }
      reader.readAsDataURL(f);
    }
  });
}

function testModel() {
  // Get a prediction for that image
  console.log(img);
  console.log(classifier);
  classifier.classify(img, function(err, result) {
  console.log(result);
  console.log(result[0]);
  console.log(result[0].label);

  var plist = select("#prediction-list");
  for (var i=0; i < 5; i++) {
    li = createElement('li', result[i].label + "   " + round(result[i].confidence * 100) + '%');
    li.parent(plist);
    createElement('li', result[i].label + "   " + round(result[i].confidence * 100) + '%');
  }

  createP(" ");
  createP(" ");
  });
}

function gotFile(file) {
  createP(file.name);
  console.log("Came here")
  console.log(file);
  // If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it
    img = createImg(file.data, testModel);
    img.size(244, 244);
    // Draw the image onto the canvas
    image(img, 0, 0, width, height);
  } else {
    console.log('Not an image file!');
  }
}

function draw() {
  fill(255);
  noStroke();
  textSize(25);
  textAlign(CENTER);
  text('Drag an image for prediction', 200, 200);
  noLoop();
}