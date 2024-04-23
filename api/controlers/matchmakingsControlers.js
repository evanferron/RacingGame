const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const playerControlers = require("./playerControlers.js");
const ranksControlers = require("./rankControlers.js");
const gameControlers = require("./gameControlers.js");

const addMatchmaking = async (req, res) => {
  const player = req.body;
  const date = new Date.now().getTime() / 1000;

  try {
    const playerdata = await Database.Read(
      DB_PATH,
      "SELECT playerId,requestDate FROM matchmaking WHERE playerId = ?;",
      player.playerId
    );
    if (playerdata.length > 0) {
      const err = await Database.Write(
        DB_PATH,
        "DELETE FROM matchmaking WHERE playerId = ?;",
        playerdata.playerId
      );
      if (err != null) {
        console.log(err);
        res
          .status(500)
          .send(
            "The player is already in the matchmaking and it can't be deleted"
          );
        return;
      }
    }
    const err = await Database.Write(
      DB_PATH,
      "INSERT INTO matchmaking(playerId,requestDate,gamemodeId) VALUES(?,?,?);",
      playerdata.playerId,
      date,
      playerdata.gamemodeId
    );
    if (err != null) {
      console.log(err);
      res.status(500).send("Cannot add the player to the matchmaking");
      return;
    }
    res.status(201).send("User successfuly add to the matchmaking");
  } catch (error) {
    res.status(500).send("Error adding player to the matchmaking");
    console.error(error);
  }
};

// this function is called every 5 seconds by every players who are in the matchmaking
const manageMatchmaking = async (req, res) => {
  const player = req.body;
  const range = playerControlers.getPlayerMatchRange(
    player.playerId,
    player.gamemodeId
  );
  if (range == null) {
    res.status(500).send("cannot get the range");
  }
  const possibleOpponents = await Database.Read(
    DB_PATH,
    "SELECT playerId FROM matchmaking LEFT JOIN playersRank ON matchmakings.playerId = playersRank.playerId WHERE (playersRank.points BETWEEN ? AND ?) AND playersRanks.gamemodeId = ?;",
    range.minRange,
    range.maxRange,
    player.gamemodeId
  );
  if (possibleOpponents.length > 0) {
    // TO DO : create party
    const playerData = await playerControlers.getPlayerSingleRankInfo(
      player.playerId,
      player.gamemodeId
    );
    const gamemode = gameControlers.getGamemodeById(player.gamemodeId);
    const rank = ranksControlers.getRankById(playerData.rankId);
    res.json({
      roomId: player.playerId + "-" + possibleOpponents[0].playerId,
      rank: rank.name,
      gamemode: gamemode.name,
      userId: player.playerId,
    });
  } else {
    res.status(201).send("still searching an opponent");
  }
};

module.exports = {
  addMatchmaking,
  manageMatchmaking,
};
