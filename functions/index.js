const Clarifai = require('clarifai');
const dbConnection = require('./firebaseConnection.js'); //js file that connects to database
const functions = require('firebase-functions'); //Functions
const admin = require("firebase-admin");
const express = require('express');
const app = express();
var db = admin.database();
var refLinks = db.ref('/links');
var refTags = db.ref('/tags');
const clarifaiApp = new Clarifai.App({
  apiKey: 'b71dea8696994f2f896b4cfa9f667b7d'
});


//Gets
//------------ Function used for predicting the image sent by the front end to firebase
app.get('/predict', function(req, res) {
  var toPredict = req.query.link; //https://samples.clarifai.com/metro-north.jpg
  clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, toPredict).then(
    function(response) {
      res.json(response.rawData.outputs);

      //TODO: take 3 tags with higher percentage of coincidense and also to filtering by: things that say no mus be taken out, like : no human or no pet
    },
    function(err) {
      // there was an error
      res.send("Error");
    }
  );
});

//------------ Function used for retreiving all image links in the format link -> tag 1, 2 and 3
app.get('/getAllLinks', function(req, res) {
  // arreglo donde guardo los links temporalmente para enviarlos
  var arreglo_links = [];
  refLinks.once("value", function(data) {
    data.forEach(function(cadaLinkSnapshot) {
      var snapTemp = cadaLinkSnapshot.val();
      arreglo_links.push(snapTemp);
    });
  }).then(function(data) {
    res.json(arreglo_links);
  });
});

//------------ Function used for retreiving all image links from All tags in the format tag -> link 1, 2 ... n
app.get('/getAllTags', function(req, res) {
  // arreglo donde guardo los links temporalmente para enviarlos
  var arreglo_tags = [];
  refTags.once("value", function(data) {
    data.forEach(function(cadaTagSnapshot) {
      var snapTemp = cadaTagSnapshot.val();
      arreglo_tags.push(snapTemp);
    });
  }).then(function(data) {
    res.json(arreglo_tags);
  });
});

//------------ Function used for retreiving all image links from one specific tag in the format tag -> link 1, 2 ... n
app.get('/getSpecificTag', function(req, res) {
  // arreglo donde guardo los links temporalmente para enviarlos
  var arreglo_imagenesPorTag = [];
  //get the tag needed
  var tagSearch = req.query.tagSearch;
  // query for calling all images onspecific tag
  const query = refTags.orderByChild('tag').equalTo(tagSearch);
    query.once("value", function(data) {
    data.forEach(function(cadaImgSnapshot) {
      var snapTemp = cadaImgSnapshot.val();
      arreglo_imagenesPorTag.push(snapTemp);
    });
  }).then(function(data) {
    res.json(arreglo_imagenesPorTag);
  });
});

//Posts
//------------ Function used for adding the tags of the image to the tags on the database
app.post('/addTagsToDb', function(req, res) {

});


//------------ Function used for adding the link of the image to the links on the database
app.post('/addLinksToDb', function(req, res) {

});



exports.app = functions.https.onRequest(app);
