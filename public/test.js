
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

function setup() {
  //var c = createCanvas(400, 400);
  //background(0, 0, 255);
  //c.drop(gotFile);

  const options = {version: 1, epochs: 20, numLabels: 5, batchSize: 0.2 };
  mobilenet = ml5.featureExtractor('MobileNet', options, modelReady);
  classifier = mobilenet.classification(classifierReady);
  classifier.load('model.json', customclassifier);

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

  for (var i=0; i < 5; i++) {
    select("#prediction-list").html(`<li> ${result[i].label}: ${round(result[i].confidence * 100) + '%'} </li>`);
    //select("#prediction-list").html(`<li> ${result[1].label}: ${round(result[0].confidence * 100) + '%'} </li>`);
    //select("#prediction-list").html(`<li> ${result[2].label}: ${round(result[0].confidence * 100) + '%'} </li>`);
    //select("#prediction-list").html(`<li> ${result[3].label}: ${round(result[0].confidence * 100) + '%'} </li>`);
    //select("#prediction-list").html(`<li> ${result[5].label}: ${round(result[0].confidence * 100) + '%'} </li>`);
  }

	//select('#res1').html(result[0].label);
  //select('#conf1').html(round(result[0].confidence * 100) + '%');
  createElement('li', result[0].label + " " + round(result[0].confidence * 100) + '%');

	//select('#res2').html(result[1].label);
  //select('#conf2').html(round(result[1].confidence *100) + '%');
  createElement('li', result[1].label + " " + round(result[1].confidence * 100) + '%');

	//select('#res3').html(result[2].label);
  //select('#conf3').html(round(result[2].confidence * 100) + '%');
  createElement('li', result[2].label + " " + round(result[2].confidence * 100) + '%');

	//select('#res4').html(result[3].label);
  //select('#conf4').html(round(result[3].confidence * 100) + '%');
  createElement('li', result[3].label + " " + round(result[3].confidence * 100) + '%');

	//select('#res5').html(result[4].label);
	//select('#conf5').html(round(result[4].confidence * 100) + '%');
  createElement('li', result[4].label + " " + round(result[4].confidence * 100) + '%');
  createP(" ");
  createP(" ");
  });
}

function gotFile(file) {
  createP(file.name + " " + file.size);
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