
//const dbConnection = require('./firebaseConnection.js'); //js file that connects to database
const functions = require('firebase-functions');

const express = require('express');
const app = express();

//------------
app.get('/addImgToDb', function(req, res) {
  res.json('dd');
});

exports.app = functions.https.onRequest(app);
