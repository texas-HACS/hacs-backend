// index.js - Central logic for the HACS Node app

// Import config before any other module
const config = require("./config/config");

const app = require("./config/express");
// require("./config/firebase");

app.listen(config.port, () => {
  console.info(
    `Starting our virtual familia home on port ${config.port} (${config.env})`
  );
});

module.exports = app;

const express = require("express");
const routes = require("./routes/index.js");
const app = express();
var request = require("request");
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: true }));

app.use("/", routes);

// we make a request to our own server every 5 minutes to prevent heroku from putting the app to sleep
setInterval(() => {
  request("https://enigmatic-shore-29691.herokuapp.com/");
}, 600000);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
