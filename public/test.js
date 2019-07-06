
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

  document.getElementById("filepicker").addEventListener("change", dirread, false);
  document.getElementById("files").addEventListener("change", dirread, false);
}

function dirread (event) {
  console.log("inside dirread");
  let output = document.getElementById("listing");
  let files = event.target.files;
  
  for (let i=0; i<files.length; i++) {
    f = files[i];
    // Only process image files.
    if (!f.type.match('image.*')) {
      console.log("these files did not match");
      continue;
    }

    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return async function(e) {
        img = await createImg(e.target.result).hide();
        await img.size(224, 224);
        let res = await testModel(img);
        console.log(res);
        let imgtag = document.createElement('img');
        imgtag.src = e.target.result;
        imgtag.setAttribute("width", "256");
        imgtag.setAttribute("height", "256");
        $('#imageContainer').append(imgtag);
        let listtag = document.createElement('ol');
        //await img.parent(img_cont);
        for (var i=0; i < 5; i++) {
          //listtag.append(`<li> ${res[i].label}: ${round(res[i].confidence * 100) + '%'} </li>`);
          listtag.append(`${res[i].label}: ${round(res[i].confidence * 100) + '%'}  `);
          //var li = createElement('li', res[i].label + "   " + round(res[i].confidence * 100) + '%');
          //li.parent(pred_cont);
        }
        $('#imageContainer').append(listtag);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

async function testModel(img) {
  // Get a prediction for that image
  let res = await classifier.classify(img, function(err, result) {
    console.log(result);
    return result;
  });

  return res;
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