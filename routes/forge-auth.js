const express = require("express");
const { getPublicToken } = require("../services/aps.js");

let router = express.Router();

router.get("/token", async function (req, res, next) {
  try {
    res.json(await getPublicToken());
  } catch (err) {
    next(err);
  }
});

module.exports = router;

/**
 * Here we implement a new Express Router that will handle requests coming to our server, with the URL ending with /token, by generating a public access token and sending it back to the client as a JSON response.
 */
