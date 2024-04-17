const express = require("express");

const router = express.Router();
const authControlers = require("./controlers/authControlers");
const gameControlers = require("./controlers/gameControlers");
const playerControlers = require("./controlers/playerControlers");
const rankControlers = require("./controlers/rankControlers");

module.exports = router;
