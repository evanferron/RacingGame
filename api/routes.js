const express = require("express");

const router = express.Router();
const authControlers = require("./controlers/authControlers");
const gameControlers = require("./controlers/gameControlers");
const playerControlers = require("./controlers/playerControlers");
const rankControlers = require("./controlers/rankControlers");
const matchmakingsControlers = require("./controlers/matchmakingsControlers");

router.post("/auth/login", authControlers.login);
router.post("/auth/register", authControlers.register);

// add the player to the matchmakings
router.post("/play", matchmakingsControlers.addMatchmaking);
router.post("/play/waiting", matchmakingsControlers.manageMatchmaking);

// need playerId in req.body
// return points,gamemodeId,rankId,gamemode name,rank name of every gamemode of the player
router.post("/gamemode/getall", playerControlers.getPlayerData);

module.exports = router;
