const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const playerControlers = require("./playerControlers.js");
const ranksControlers = require("./rankControlers.js");
const gameControlers = require("./gameControlers.js");

const getMatchmakingByPlayerId = async (id) => {
  try {
    const data = Database.Read(
      DB_PATH,
      "SELECT playerId,requestDate,gamemodeId,opponentId FROM matchmaking WHERE playerId = ?",
      id
    );
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const addMatchmaking = async (req, res) => {
  const player = req.body;
  const date = Math.floor(Date.now() / 1000);

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
          .send("Failed to delete existing matchmaking entry for the player");
        return;
      }
    }
    const err = await Database.Write(
      DB_PATH,
      "INSERT INTO matchmaking(playerId,requestDate,gamemodeId) VALUES(?,?,?);",
      player.playerId,
      date,
      player.gamemodeId
    );
    if (err != null) {
      console.log(err);
      res.status(500).send("Failed to the player to the matchmaking");
      return;
    }
    res.status(201).send("User successfuly add to the matchmaking");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding player to the matchmaking");
  }
};

// this function is called every 5 seconds by every players who are in the matchmaking
const manageMatchmaking = async (req, res) => {
  try {
    const player = req.body;
    const currentStatus = await getMatchmakingByPlayerId(player.playerId);

    if (currentStatus.opponentId != null) {
      // case where another player found him and already join the room
      await Database.Write(
        DB_PATH,
        "DELETE FROM matchmaking WHERE playerId = ?;",
        player.playerId
      );

      const playerData = await playerControlers.getPlayerSingleRankInfo(
        player.playerId,
        player.gamemodeId
      );
      const gamemode = await gameControlers.getGamemodeById(player.gamemodeId);
      const rank = await ranksControlers.getRankById(playerData.rankId);

      res.json({
        roomId: currentStatus.opponentId + "-" + player.playerId,
        rank: rank.name,
        gamemode: gamemode.name,
        userId: player.playerId,
      });
      return;
    }

    const range = playerControlers.getPlayerMatchRange(
      player.playerId,
      player.gamemodeId
    );
    if (!range) {
      throw new Error("Cannot get the player's match range");
    }

    const possibleOpponents = await Database.Read(
      DB_PATH,
      "SELECT playerId FROM matchmaking LEFT JOIN playersRank ON matchmakings.playerId = playersRank.playerId WHERE (playersRank.points BETWEEN ? AND ?) AND playersRanks.gamemodeId = ?;",
      range.minRange,
      range.maxRange,
      player.gamemodeId
    );

    if (possibleOpponents.length > 0) {
      // DELETE player that found an opponent and join a room
      await Database.Write(
        DB_PATH,
        "DELETE FROM matchmaking WHERE playerId = ?;",
        player.playerId
      );

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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  addMatchmaking,
  manageMatchmaking,
};
