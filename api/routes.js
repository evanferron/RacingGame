const express = require("express");

const router = express.Router();
const authControlers = require("./controlers/authControlers");
const gameControlers = require("./controlers/gameControlers");
const playerControlers = require("./controlers/playerControlers");
const rankControlers = require("./controlers/rankControlers");

router.post("/auth/login",authControlers.login)
router.post("/auth/register",authControlers.register)


module.exports = router;
