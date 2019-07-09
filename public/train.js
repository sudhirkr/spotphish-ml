
var mobilenet;
var classifier;
let loss;
let img;
let img1;
let data = {};
let canvas;
var selectedFile;
const googleImages = 108;                                                         
const amazonImages = 103;                                                         
const paypalImages = 153;                                                         
const facebookImages = 211;                                                       
const dropboxImages = 133;           
const width = 400;
const height = 400;
var drozone;
var count = 0;

function preload() {
  data = loadJSON('json_ml5data.json', jsonReady);
}

function load_imgs(label, nimgs) {
  for (let i = 0; i < nimgs; i++) {
    imgpath = data.children[label].children[i].path;
    type = data.children[label].children[i].type;
    img = createImg(imgpath).hide();
    console.log(imgpath + " loading " + type);
    classifier.addImage(img, type);
  }
}

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

// Change the status when the model loads.
function jsonReady() {
  console.log('json loaded');
}

function whileTraining(loss) {
  if (loss == null) {
    console.log('Training Complete');
    //classifier.classify(gotResults);
  } else {
    console.log(loss);
  }
}

function load_data() {
  load_imgs(0, googleImages);
  load_imgs(1, amazonImages);
  load_imgs(2, paypalImages);
  load_imgs(3, facebookImages);
  load_imgs(4, dropboxImages);
}

function train() {
  const options = {version: 1, epochs: 20, numLabels: 5, batchSize: 0.2 };
  mobilenet = ml5.featureExtractor('MobileNet', options, modelReady)
  classifier = mobilenet.classification(classifierReady)
		.then(() => load_data())
		.catch(function (err) {
			console.log(err);
		});
}

function setup() {
  noCanvas();
  train();

  trainButton = select('#train'); 
  trainButton.mousePressed(function() {
    classifier.train(whileTraining);
  });

  saveButton = select('#save'); 
  saveButton.mousePressed(function() {
    classifier.save();
    console.log('Custom Model saved!!');
  });

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
        if ((count % 2) == 0) {
          $('#imageContainer').append(imgtag);
        } else {
          $('#imageContainer2').append(imgtag);
        }
        //let listtag = document.createElement('ol');
        let listtag = document.createElement('p');
        //await img.parent(img_cont);
        for (var i=0; i < 5; i++) {
          //listtag.append(`<li> ${res[i].label}: ${round(res[i].confidence * 100) + '%'} </li>`);
          listtag.append(`${res[i].label}: ${round(res[i].confidence * 100) + '%'}  `);
          //var li = createElement('li', res[i].label + "   " + round(res[i].confidence * 100) + '%');
          //li.parent(pred_cont);
        }
        
        if ((count % 2) == 0) {
          $('#imageContainer').append(listtag);
        } else {
          $('#imageContainer2').append(listtag);
        }
        
        count = count+1;
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

function draw() {
  fill(255);
  noStroke();
  textSize(25);
  textAlign(CENTER);
  text('Drag an image for prediction', 200, 200);
  noLoop();
}
