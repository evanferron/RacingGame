const Database = require("../Database.js");
const DB_PATH = "./racingGame.db";
const playerControlers = require("./playerControlers.js");
const ranksControlers = require("./rankControlers.js");
const rangeFunc = require("../utils/rank.js");
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
        player.playerId
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
    if (currentStatus[0].opponentId != null) {
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
      const opponentData = await playerControlers.getPlayerSingleRankInfo(
        currentStatus[0].opponentId,
        player.gamemodeId
      );
      const opponentName = await playerControlers.getNameById(
        currentStatus[0].opponentId
      );
      const gamemode = await gameControlers.getGamemodeById(player.gamemodeId);
      const rank = await ranksControlers.getRankById(playerData.rankId);
      const opponentRank = await ranksControlers.getRankById(
        opponentData.rankId
      );
      res.json({
        roomId: currentStatus[0].opponentId + "-" + player.playerId,
        rank: rank.name,
        gamemode: gamemode.name,
        userId: player.playerId,
        opponentRank: opponentRank.name,
        opponentName: opponentName.nickname,
      });
      return;
    }

    const range = await rangeFunc.getPlayerMatchRange(
      player.playerId,
      player.gamemodeId
    );
    if (!range) {
      throw new Error("Cannot get the player's match range");
    }

    const possibleOpponents = await Database.Read(
      DB_PATH,
      "SELECT matchmaking.playerId AS playerId FROM matchmaking LEFT JOIN playersRank ON matchmaking.playerId = playersRank.playerId WHERE (playersRank.points BETWEEN ? AND ?) AND playersRank.gamemodeId = ? AND matchmaking.playerId != ?;",
      range.minRange,
      range.maxRange,
      player.gamemodeId,
      player.playerId
    );
    if (possibleOpponents.length > 0) {
      // DELETE player that found an opponent and join a room
      await Database.Write(
        DB_PATH,
        "DELETE FROM matchmaking WHERE playerId = ?;",
        player.playerId
      );
      await Database.Write(
        DB_PATH,
        "UPDATE matchmaking SET opponentId = ?",
        player.playerId
      );

      const playerData = await playerControlers.getPlayerSingleRankInfo(
        player.playerId,
        player.gamemodeId
      );
      const opponentData = await playerControlers.getPlayerSingleRankInfo(
        possibleOpponents[0].playerId,
        player.gamemodeId
      );
      const opponentName = await playerControlers.getNameById(
        possibleOpponents[0].playerId
      );
      const gamemode = await gameControlers.getGamemodeById(player.gamemodeId);
      const rank = await ranksControlers.getRankById(playerData.rankId);
      const opponentRank = await ranksControlers.getRankById(
        opponentData.rankId
      );
      res.json({
        roomId: player.playerId + "-" + possibleOpponents[0].playerId,
        rank: rank.name,
        gamemode: gamemode,
        userId: player.playerId,
        opponentRank: opponentRank.name,
        opponentName: opponentName.nickname,
      });
    } else {
      res.status(201).send("still searching an opponent");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const deleteById = async (req, res) => {
  try {
    await Database.Write(
      DB_PATH,
      "DELETE FROM matchmaking WHERE playerId = ?;",
      res.body.playerId
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Cannot delete from matchmaking where id = " + res.body.playerId);
  }
};

module.exports = {
  addMatchmaking,
  manageMatchmaking,
  deleteById,
  getMatchmakingByPlayerId,
};
