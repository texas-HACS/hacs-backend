// routes.js - Central module for all routes

const express = require("express");
const router = express.Router();
var request = require("request");
var bodyParser = require("body-parser");
const cheerio = require("cheerio");
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
const config = require("../firebase_config.js").config;

firebase.initializeApp(config);
const db = firebase.firestore();

const jsonParser = bodyParser.json();

router.get("/", (req, res) => {
  res.send("Welcome to the HACS backend!");
});

router.get("/siteContent", (req, res) => {
  db.collection("contentData")
    .get()
    .catch((error) => {
      res.send({
        error: "Error reading from database. Please try again.",
      });
    })
    .then((snapshot) => {
      if (snapshot) {
        let data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        res.send(data);
      }
    });
});

router.post("/siteContent", jsonParser, (req, res) => {
  console.log(req.body);
  let props = Object.getOwnPropertyNames(req.body);
  props.forEach((docName) => {
    console.log(docName);
    db.collection("contentData")
      .doc(docName)
      .set(req.body[docName], { merge: true })
      .catch((error) => {
        res.send({ error: "Error writing to database, please try again" });
      });
  });
  res.sendStatus(200);
});

router.post("/login", (req, res) => {
  let loginData = Buffer.from(
    req.headers.authorization.split(" ")[1],
    "base64"
  ).toString();

  loginData = loginData.split(":");

  let email = loginData[0];
  let password = loginData[1];

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
      res.send({
        error: "Unable to sign in with these credentials, please try again.",
      });
    })
    .then((data) => {
      if (data) {
        console.log("successfully logged in!");
        res.send({
          email: data.user.email,
          uid: data.user.uid,
        });
      }
    });
});

const styles = `<style type="text/css">
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto+Slab:wght@100;400;700&display=swap');

  #calendarTitle, #td-print-image-id, #td-print-text-id {
    display: none !important;
  }

  html, body {
    background: none !important;
  }

  .te-s, .te-t, .title, event-summary, .day, .ui-rtsr {
    color: #27246A !important;
    font-family: Roboto slab, serif !important;
  }

  .date-top {
    font-family: Roboto slab, serif !important;
  }

  .date-label, .event {
    padding: .1em 1em !important;
  }

  .detail-content {
    font-family: Open Sans, sans-serif !important;;
  }
</style>`;

router.get("/calendar", (req, res) => {
  const iframeUrl =
    "https://calendar.google.com/calendar/embed?&src=texashacs%40gmail.com&ctz=America%2FChicago";
  const iframeMobileUrl =
    "https://calendar.google.com/calendar/embed?mode=AGENDA&src=texashacs%40gmail.com&ctz=America%2FChicago";
  console.log(req.query.agenda ? iframeMobileUrl : iframeUrl);
  request(
    req.query.agenda ? iframeMobileUrl : iframeUrl,
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body);
        $("head").append(styles);

        res.send($.html());
      } else {
        res.send({ Error: "Could not get calendar content" });
      }
    }
  );
});

// handle google calendar routing
router.get("/calendar/*", (req, res) => {
  res.redirect(301, "https://calendar.google.com" + req.path);
});

module.exports = router;
