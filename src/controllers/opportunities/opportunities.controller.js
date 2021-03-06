// opportunities.controller.js - Opportunities logic module

// const model = require("../models/opportunities.model");
const { makeError } = require("../../config/errors");
const { isEmpty } = require("../../util/util");

module.exports = {
  read,
  insert,
};

async function read(path, firebaseAdmin) {
  let data = firebaseAdmin.adminDB
    .ref(`opportunities${path}`)
    .once("value", (snapshot) => {
      return snapshot.val();
    })
    .catch((err) => {
      console.info(err);
    });

  if (isEmpty(data)) {
    throw makeError("Bad Request: The server returned no data.", 400);
  }

  return data;
}

// Set new data for db collection "siteContent"
async function insert(path, body, firebaseAdmin) {
  firebaseAdmin.adminDB
    .ref(`opportunities`)
    .child(path)
    .set(body)
    .catch((err) => {
      console.info(err);
    });
}
