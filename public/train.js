var mobilenet;
var classifier;
let loss;
let img;
let img1;
let data = {};
let canvas;
var selectedFile;
// const googleImages = 108;
// const amazonImages = 103;
// const paypalImages = 153;
// const facebookImages = 211;
// const dropboxImages = 133;
// const barodaImages = 136;
// const canaraImages = 373;
// const hdfcImages = 246;
// const iciciImages = 274;
// const idbiImages = 157;
// const sbiImages = 308;
var totalImages;
const width = 400;
const height = 400;
var drozone;
var count = 0;
var imagesCompleted = 0;
var className;

var ver = 1;
var ep = 50;
var nlabel;
var bs = 1;

function preload() {
    data = loadJSON('./tree_data.json', jsonReady);
}

function load_imgs(className, imagePath) {
    return new Promise((resolve) => {
        const image = createImg(imagePath, () => {
            try {
                classifier.addImage(image, className, () => {
                    imagesCompleted += 1;
                    // console.log("Image width " + image.width + " Image height " + image.height);
                    console.log("[ INFO ] : " + imagesCompleted + " of " + totalImages + " : " + ((imagesCompleted / totalImages) * 100).toFixed(2) + "%");
                    console.log(imagePath);
                    image.remove()
                    resolve()
                })
            } catch (error) {
                console.log(error, "AT IMAGE", image);
            }
        })
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
    totalImages = parseInt(data[1]["files"]);
    nlabel = parseInt(data[1]["directories"]);
    data = data[0].contents
    console.log("Total images in JSON :", totalImages);
    console.log("Total classes in JSON :", nlabel);
}

function whileTraining(loss) {
    if (loss == null) {
        console.log('Training Complete');
        //classifier.classify(gotResults);
    } else {
        console.log(loss);
    }
}


// ? Function doesn't help in reducing memory or time so avoid using this
function loadClass(className, imagesObj) {
    return new Promise((resolve) => {
        var promises = []
        for (obj in imagesObj) {
            const imagePath = imagesObj[obj]["name"]
            promises.push(load_imgs(className, imagePath))
            Promise.all(promises).then(() => {
                resolve()
            })
        }

    })
}

async function load_data() {
    console.log(classifier);

    try {
        for (i in data) {
            className = data[i].name
            className = (className.split("/"))[1];
            console.log(data[i]);
            var imagesObj = data[i]["contents"];
            for (obj in imagesObj) {
                const imagePath = imagesObj[obj]["name"]
                await load_imgs(className, imagePath)
            }
        }
    } catch (error) {
        console.log(error);
    }
    console.log("All images added to classifier : ", classifier);

}

async function load_dependencies() {
    const options = { version: ver, epochs: ep, numLabels: nlabel, batchSize: bs };
    mobilenet = ml5.featureExtractor('MobileNet', options, modelReady)

    classifier = mobilenet.classification()
        // console.log(classifier);
}

function setup() {
    noCanvas();

    (async() => {
        await load_dependencies();
        console.log("All dependencies loaded");
    })();

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
        reader.onload = (function() {
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
                    //listtag.append(`<li> ${res[i].className}: ${round(res[i].confidence * 100) + '%'} </li>`);
                    listtag.append(`${res[i].className}: ${round(res[i].confidence * 100) + '%'}  `);
                    //var li = createElement('li', res[i].className + "   " + round(res[i].confidence * 100) + '%');
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