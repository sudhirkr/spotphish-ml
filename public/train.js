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
const barodaImages = 136;
const canaraImages = 373;
const hdfcImages = 246;
const iciciImages = 274;
const idbiImages = 157;
const sbiImages = 308;
const width = 400;
const height = 400;
var drozone;
var count = 0;
var imagesCompleted = 0;
var totalImages = googleImages + amazonImages + paypalImages + facebookImages + dropboxImages + barodaImages + canaraImages + hdfcImages + iciciImages + idbiImages + sbiImages;

function preload() {
    data = loadJSON('json_ml5data.json', jsonReady);
}

function load_imgs(label, nimgs, imagesCallback) {
    new Promise((resolve, reject) => {
        for (let i = 0; i < nimgs; i++) {
            const imageData = data.children[label].children[i]
            const image = document.createElement("img")
            image.src = "/all_data/" + imageData.path
            image.onload = () => {
                const type = imageData.type;
                classifier.addImage(image, type, (res) => {
                    console.log(image)
                    imagesCompleted += 1;
                    console.log("[ INFO ] : " + imagesCompleted + " of " + totalImages + " : " + ((imagesCompleted / totalImages) * 100).toFixed(2) + "%");
                    if (i == (nimgs - 1)) {
                        resolve()
                    }
                })
            }
            image.remove()
        }
    }).then(() => {
        imagesCallback(data.children[label].datei)
    })


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

function classifierReady() {
    console.log("classifier is loaded");
    //If you want to load a pre-trained model at the start
}

// Change the status when the model loads.
function jsonReady() {
    console.log('json loaded');
    console.log(data);
}

function whileTraining(loss) {
    if (loss == null) {
        console.log('Training Complete');
        //classifier.classify(gotResults);
    } else {
        console.log(loss);
    }
}

function imagesCallback(className) {
    console.log("[ INFO ] : All " + className + " images loaded");

}

function load_data() {
    try {
        load_imgs(0, amazonImages, imagesCallback);
        load_imgs(1, barodaImages, imagesCallback);
        load_imgs(2, canaraImages, imagesCallback);
        load_imgs(3, dropboxImages, imagesCallback);
        load_imgs(4, facebookImages, imagesCallback);
        load_imgs(5, googleImages, imagesCallback);
        load_imgs(6, hdfcImages, imagesCallback);
        load_imgs(7, iciciImages, imagesCallback);
        load_imgs(8, idbiImages, imagesCallback);
        load_imgs(9, paypalImages, imagesCallback);
        load_imgs(10, sbiImages, imagesCallback);
    } catch (error) {
        console.log(error);
    }
}

function load_dependencies() {
    (async() => {
        const options = await { version: 1, epochs: 20, numLabels: 5, batchSize: 0.2 };
        mobilenet = await ml5.featureExtractor('MobileNet', options, modelReady)
        classifier = await mobilenet.classification(classifierReady)
    })();
}

function setup() {
    noCanvas();
    load_dependencies();

    trainButton = select('#train');
    trainButton.mousePressed(function() {
        classifier.train(whileTraining);

    });

    saveButton = select('#save');
    saveButton.mousePressed(function() {
        classifier.save();
        console.log('Custom Model saved!!');
    });

    document.getElementById("load").addEventListener("click", load_data)

    document.getElementById("filepicker").addEventListener("change", dirread, false);
    document.getElementById("files").addEventListener("change", dirread, false);
}

function dirread(event) {
    console.log("inside dirread");
    let output = document.getElementById("listing");
    let files = event.target.files;

    for (let i = 0; i < files.length; i++) {
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
                for (var i = 0; i < 5; i++) {
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

                count = count + 1;
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