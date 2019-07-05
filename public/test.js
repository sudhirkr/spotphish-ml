
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
var finalResults = {};

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
  var predictionContainer = [];
  var imageContainer = [];  
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
      reader.onload = function(index,e) {
        console.log('index',index);
        console.log('e->',e.target.result);
        img_selector = select('#selected-image');
        img = createImg(e.target.result, testModel.bind(null,index));
        img.size(224, 224);                
        // let imageElem = document.createElement('div');
        // imageElem.id = 'imageContainer'+i;
        // let predictionElem = document.createElement('div');
        // predictionElem.id = 'predictionContainer'+i;
        // $('#imageContainer'+i).append(imgTag);
        // imageContainer.push(imageElem);
        // predictionContainer.push(predictionElem);        
      }.bind(null,i);
      reader.readAsDataURL(f);
    }
  });
}

function testModel(index) {
  // Get a prediction for that image
  console.log('index from testmodel',index);
  console.log('image->',img);
  // console.log('classifier',classifier);
  classifier.classify(img, function(err, result) {
      console.log('result->',result);
      if (result){        
        // create results hash
        finalResults['img'+index] = result;
        // create image tag for this image
        let imgTag = document.createElement('img');
        imgTag.id = 'img'+index;
        imgTag.src = e.target.result;
        $('#imageContainer').append(imgTag);
        // create prediction list for this image
        let listTag = document.createElement('ol');
        listTag.id = 'prediction-list'+index;                
        $('#prediction-container').append(listTag);
        for (var i=0; i < 5; i++){
          listTag.append(`<li> ${result[i].label}: ${round(result[i].confidence * 100) + '%'} </li>`);
        }        
      }
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
    // image(img, 0, 0, width, height);
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