const express = require('express')
const app = express()
var bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5000
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const config = require( "./firebase_config.js").config;

firebase.initializeApp(config);
const db = firebase.firestore();

const jsonParser = bodyParser.json();

app.use(cors({ credentials: true, origin: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get("/siteContent", (req, res) => {
  db.collection("contentData").get().catch( error => {
    res.send({
      "error": "Error reading from database. Please try again."
    })
  }).then( (snapshot) => {
    if (snapshot) {
      let data = {}
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
      res.send(data);
    }
  })
});

app.post("/siteContent", jsonParser, (req, res) => {
  console.log(req.body);
  res.send({"hello": "world"})
})

app.post('/login', (req, res) => {
  let loginData = Buffer.from(
    req.headers.authorization.split(" ")[1],
    "base64"
  ).toString();

  loginData = loginData.split(":");

  let email = loginData[0];
  let password = loginData[1];

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode, errorMessage)
    res.send({
      "error": "Unable to sign in with these credentials, please try again."
    });
  }).then(data => {
    if (data) {
      console.log("successfully logged in!");
      res.send({
        "email": data.user.email,
        "uid": data.user.uid
      });
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
